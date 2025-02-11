import React, { useEffect, useState } from "react";
import { retrieveCustomer } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByCustomerId } from "@/redux/slices/orderSlice";
import { useRouter } from "next/router";

const OrderHistory = () => {
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const {
    orders: current_orders,
    status,
    error,
  } = useSelector((state) => state.orders);

  const { currentCustomer: user } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersByCustomerId(user.id));
    }
  }, [user]);

  // Filter orders based on the selected status
  const filteredOrders = current_orders && current_orders.filter((order) =>
    filter === "all" ? true : order.status.toLowerCase() === filter
  );

  const statusColors = {
    Pending: "bg-light-BG text-yellow-800",
    Delivered: "bg-light-BG text-sky-800",
    Cancelled: "bg-light-BG text-red-800",
  };

  return (
    <div className="p-4 my-2 sm:p-6 md:p-8 border rounded-lg">
      {/* Heading */}
      <div className="pb-2 mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold border-black inline-block px-2 py-1">
          Your Order
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-4 border-b flex justify-around sm:justify-start sm:gap-6">
        {["all", "pending", "delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 sm:px-10 py-2 sm:py-3 mr-2 text-xs sm:text-sm md:text-base ${
              filter === status
                ? "border-b-4 font-bold border-black text-black"
                : "font-bold text-sub-color border-b-4 border-transparent"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-6">
        {filteredOrders && filteredOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 shadow-md mb-4">
            {/* Order ID and Status */}
            <div className="flex items-center justify-between">
              <p className="text-sm md:text-base font-semibold">
                Order #{order.id}
              </p>
              <span
                className={`text-xs md:text-sm px-2 py-1 rounded ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            {order.items?.slice(0, 1).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-2 mt-3"
              >
                {/* Product Name and Quantity */}
                <div>
                  <p className="text-sm md:text-base capitalize font-medium">
                    {product.product_title} (Qty: {product.quantity})
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 1 && (
              <div className="mt-2">
                <p className="text-xs md:text-sm text-blue-500 cursor-pointer">
                  See more...
                </p>
              </div>
            )}

            {/* Order Date and Total Amount */}
            <div className="mt-3">
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
              <p className="text-sm md:text-base font-semibold">
                Total Amount: ₹{order.item_subtotal}
              </p>
            </div>

            {/* View Order Button */}
            <button
              onClick={() => router.push(`/order-confirmation?order_id=${order.id}`)}
              className="mt-3 text-xs md:text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              View Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
