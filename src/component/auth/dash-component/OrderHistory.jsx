import React, { useState } from "react";
import Image from "next/image";

const OrderHistory = () => {
  const [filter, setFilter] = useState("all");

  const orders = [
    {
      orderId: "#001",
      products: [
        {
          name: "Alex white trending shirt",
          image: "/images/collection/collection1.png",
          size: "XL",
          color: "Yellow",
          quantity: 2,
          price: "$50",
        },
      ],
      status: "Delivered",
    },
    {
      orderId: "#002",
      products: [
        {
          name: "New wool puma jacket",
          image: "/images/collection/collection2.png",
          size: "M",
          color: "Blue",
          quantity: 1,
          price: "$30",
        },
      ],
      status: "Pending",
    },
  ];

  const filteredOrders = orders.filter((order) =>
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

      {/* filters data */}
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
        {filteredOrders.map((order) => (
          <div
            key={order.orderId}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            {/* Order Header */}
            <div className="pb-4 mb-4 border-b">
              <div className="flex justify-between">
                <h3 className="text-sm sm:text-md md:text-lg">
                  Order Number:{" "}
                  <span className="font-bold">{order.orderId}</span>
                </h3>
                <p
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded"
                    />
                    <div>
                      <p className="text-xs sm:text-sm md:text-lg capitalize">{product.name}</p>
                      <p className="text-xs sm:text-sm text-sub-color">
                        {product.size} / {product.color}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm md:text-base">
                      {product.quantity} x {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex text-xs sm:text-sm md:text-base justify-around md:justify-start gap-4 mt-4">
              <button className="px-6 sm:px-8 py-2 sm:py-3 uppercase md:font-bold rounded-md md:rounded-xl bg-black text-white hover:bg-discount-color hover:text-black transition-all duration-200 ease-in-out">
                Order Details
              </button>
              <button className="px-4 sm:px-6 py-2 sm:py-3 uppercase md:font-bold rounded-md  md:rounded-xl bg-light-BG border border-gray-300 hover:bg-discount-color hover:text-black transition-all duration-200 ease-in-out">
                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
