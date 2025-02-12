import React, { useEffect, useState, useCallback } from "react";
import LoyaltyPointsPopup from "./LoyaltyPointsPopup";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const DashboardContent = ({ userInfo }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Use safe state access with default values
  const orderState = useSelector((state) => state.orders || {});
  const { orders = [], status, error, count = 0 } = orderState;
  
  const pointState = useSelector((state) => state.points || {});
  const { points = 0 } = pointState;

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isLoyaltyPopupOpen, setIsLoyaltyPopupOpen] = useState(false);

  // Memoize the analysis items to prevent unnecessary re-renders
  const getAnalysisItems = useCallback(() => {
    const completedOrders = orders?.filter(order => order?.status === "Completed")?.length || 0;
    
    return [
      { 
        label: "Total Orders", 
        value: count || 0, 
        icon: "ri-shopping-cart-line" 
      },
      { 
        label: "Completed Orders", 
        value: completedOrders, 
        icon: "ri-check-line" 
      },
      {
        label: "Your Loyalty Points",
        value: points,
        icon: "ri-coin-line",
        onClick: () => setIsLoyaltyPopupOpen(true)
      }
    ];
  }, [count, orders, points]);

  // Use the memoized analysis items directly
  const analysisItems = getAnalysisItems();

  if (!userInfo) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="md:px-4 flex-1">
      {/* Account Overview */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer"
                onClick={item.onClick}
              >
                <div>
                  <h3 className="text-sub-color text-sm md:text-base">{item.label}</h3>
                  <p className="text-black text-lg md:text-2xl font-bold">{item.value}</p>
                </div>
                <i className={`${item.icon} text-2xl md:text-3xl`}></i>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="border rounded-lg bg-white p-4 overflow-x-auto">
          <h3 className="text-md md:text-xl font-bold mb-4 uppercase">
            Recent Order History
          </h3>
          <table className="table-auto w-full text-xs md:text-base">
            <thead>
              <tr className="text-left border-b-2 uppercase">
                <th className="px-2 md:px-4 py-2">Order</th>
                <th className="px-2 md:px-4 py-2">Products</th>
                <th className="px-6 md:px-4 py-2">Pricing</th>
                <th className="px-6 md:px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                [...orders]
                  .reverse()
                  .slice(0, 5)
                  .map((order, index) => (
                    <tr
                      key={order.id}
                      onClick={() => router.push({
                        pathname: "/order-confirmation",
                        query: { order_id: order.id }
                      })}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`border-b cursor-pointer ${
                        hoveredIndex === index ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-2 md:px-4 py-2">#{order.display_id}</td>
                      <td className="px-2 md:px-4 py-2">
                        {order?.items?.map((product) => (
                          <div key={product.id} className="flex items-center gap-2 mb-2">
                            {product.thumbnail && (
                              <Image
                                src={product.thumbnail}
                                alt={product.title || 'Product'}
                                width={40}
                                height={40}
                                className="rounded-lg"
                              />
                            )}
                            <span className="text-sm">{product.title}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 md:px-4 py-2">{order.item_subtotal}</td>
                      <td className="px-2 md:px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                          statusColors[order.status] || "bg-gray-200 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loyalty Points Popup */}
      {isLoyaltyPopupOpen && (
        <LoyaltyPointsPopup
          points={points}
          onClose={() => setIsLoyaltyPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardContent;
