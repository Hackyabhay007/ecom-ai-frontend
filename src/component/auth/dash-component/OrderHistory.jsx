import React, { useState } from "react";

const OrderHistory = () => {
  const [filter, setFilter] = useState("all");
  const orders = [
    { order: "#001", products: "Product A", status: "Delivered" },
    { order: "#002", products: "Product B", status: "Pending" },
  ];

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status.toLowerCase() === filter
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      <div className="mb-4">
        {["all", "pending", "delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md mr-2 ${
              filter === status ? "bg-black text-white" : "bg-light-BG"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      <table className="table-auto w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-2">Order</th>
            <th className="px-4 py-2">Products</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{order.order}</td>
              <td className="px-4 py-2">{order.products}</td>
              <td className="px-4 py-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
