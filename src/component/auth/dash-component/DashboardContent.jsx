import React, { useEffect, useState } from "react";
import LoyaltyPointsPopup from "./LoyaltyPointsPopup";
import Image from "next/image";
import { retrieveCustomer } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByCustomerId } from "@/redux/slices/orderSlice";
import { fetchPointsByOwnerId  } from "@/redux/slices/pointSlice";
import { useRouter } from "next/router";

const DashboardContent = () => {
  const [isLoyaltyPopupOpen, setIsLoyaltyPopupOpen] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(40);
  const router = useRouter();

  const { currentCustomer: user } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { orders, status, error , count } = useSelector((state) => state.orders);
  const { points } = useSelector((state) => state.points);
  const [hoveredIndex , setHoveredIndex] = useState(null);
  const [anyalsis, setAnalysis] = useState([
    {
      label: "Total Orders",
      value: 0,
      icon: "ri-shopping-cart-line",
    },
    {
      label: "Completed Orders",
      value: 0,
      icon: "ri-check-line",
    },
    {
      label: "Your Loyalty Points",
      value: 0,
      icon: "ri-coin-line",
      onClick: () => setIsLoyaltyPopupOpen(true),
    },
  ]);



  // console.log(user);

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersByCustomerId(user.id));
      dispatch(fetchPointsByOwnerId({ ownerId: user.id }));
    } else {
      // console.log("no user id");
    }
  }, [user]);

  useEffect(() => {
    if (points) {
      setLoyaltyPoints(points);
      setAnalysis((prevAnalysis) =>
        prevAnalysis.map((item, index) =>
          index === 2 ? { ...item, value: points } : item
        )
      );
    }
  }, [points]);

  const cards = [
    { label: "Total Orders", value: 12, icon: "ri-shopping-cart-line" },
    { label: "Completed Orders", value: 23, icon: "ri-check-line" },
    {
      label: "Your Loyalty Points",
      value: loyaltyPoints,
      icon: "ri-coin-line",
      onClick: () => setIsLoyaltyPopupOpen(true),
    },
  ];

  const recentOrders = [
    {
      order: "#001",
      products: [
        {
          name: "Product A",
          image: "/images/collection/collection1.png",
          tags: ["Women", "Clothing"],
        },
        {
          name: "Product B",
          image: "/images/collection/collection2.png",
          tags: ["Men", "Accessories"],
        },
      ],
      pricing: "$100",
      status: "Delivered",
    },
    {
      order: "#002",
      products: [
        {
          name: "Product C",
          image: "/images/collection/collection1.png",
          tags: ["Unisex", "Footwear"],
        },
      ],
      pricing: "$50",
      status: "Pending",
    },
  ];

  useEffect(() => {
    if (orders) {
      const completedOrders = orders.filter(
        (order) => order.status === "Completed"
      ).length;

      setAnalysis((prevAnalysis) =>
        prevAnalysis.map((item, index) => {
          if (index === 0) {
            return { ...item, value: count };
          } else if (index === 1) {
            return { ...item, value: completedOrders };
          } else {
            return item;
          }
        })
      );
    }
  }, [orders]);

  const statusColors = {
    Pending: "bg-yellow-200 text-yellow-800",
    Delivered: "bg-sky-200 text-sky-800",
    Completed: "bg-green-200 text-green-800",
  };

  return (
    <div className="md:px-4 flex-1">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 md:mb-10">
        {anyalsis.map((card, index) => (
          <div
            key={index}
            className="p-4 py-6 border shadow-md rounded-lg flex items-center justify-between bg-white cursor-pointer"
            onClick={card.onClick}
          >
            <div>
              <h3 className="text-sub-color text-sm md:text-base">
                {card.label}
              </h3>
              <p className="text-black text-lg md:text-2xl font-bold">
                {card.value}
              </p>
            </div>
            <i className={`${card.icon} text-2xl md:text-3xl`}></i>
          </div>
        ))}
      </div>
      {error && <p>{error.message}</p>}

      {/* Recent Order History */}
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
                  {orders &&
                    [...orders].reverse().slice(orders.length-6,orders.length-1).map((order, index) => (
                      <tr 
                      key={order.id} 
                      onClick={() => router.push({ pathname: "/order-confirmation", query: { order_id: order.id } })} 
                      onMouseEnter={() => setHoveredIndex(index)} 
                      onMouseLeave={() => setHoveredIndex(null)} 
                      style={hoveredIndex === index ? { backgroundColor: "#f9f9f9" } : {}} 
                      className="border-b"
                    >
                      <td className="px-2 md:px-4 py-2">#{order.display_id}</td>
                      <td className="px-2 md:px-4 py-2">
                      {order?.items &&
                        order.items.map((product, i) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-2 mb-2"
                        >
                          <Image
                          src={product.thumbnail}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                          />
                          <span>{product.subtitle}</span>
                          <div>
                          {/* <p className="font-bold text-xs md:text-sm">
                            {product.title}
                          </p> */}
                            <div className="text-xs w-20 md:w-28 text-left overflow-hidden text-ellipsis whitespace-nowrap text-sub-color">
                              {product?.tags &&
                                product?.tags.map((tag) => (
                                  <span key={tag} className="mr-1 md:mr-2">
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </td>
                  <td className="px-6 md:px-4 py-2">{order.item_subtotal}</td>
                  <td className="px-2 md:px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                        statusColors[order.status] ||
                        "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isLoyaltyPopupOpen && (
        <LoyaltyPointsPopup
          points={loyaltyPoints}
          onClose={() => setIsLoyaltyPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardContent;
