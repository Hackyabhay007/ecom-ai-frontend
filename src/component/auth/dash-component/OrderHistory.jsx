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
    <div className="p-4 border rounded-lg">
      {/* Heading */}
      <div className=" pb-2 mb-4">
        <h2 className="text-2xl font-bold border-black inline-block  px-2 py-1">
          Your Order
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-4  border-b flex justify-around">
        {["all", "pending", "delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-10 py-2   mr-2 ${
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
                <h3 className=" text-md">Order Number: <span className="font-bold">{order.orderId}</span></h3>
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
            <div className="space-y-4 ">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 "
                >
                  <div className="flex items-center gap-4">
                    
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <p className="text-lg capitalize">{product.name}</p>
                      <p className="text-xs text-sub-color">
                        {product.size} / {product.color}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="">
                      {product.quantity} x {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex text-sm   justify-start gap-4 mt-4">
              <button className="px-8 py-4 uppercase font-bold rounded-xl bg-black text-white hover:bg-discount-color hover:text-black transition-all  duration-200 ease-in-out">
                Order Details
              </button>
              <button className="px-6 py-2 uppercase font-bold  rounded-xl bg-light-BG border border-gray-300 hover:bg-discount-color hover:text-black transition-all  duration-200 ease-in-out">
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
