import React from "react";

const DashboardContent = () => {
  const cards = [
    { label: "Total Orders", value: 120 },
    { label: "Completed Orders", value: 100 },
    { label: "Awaiting Orders", value: 20 },
  ];

  const recentOrders = [
    { order: "#001", products: "Product A, Product B", pricing: "$100", status: "Delivered" },
    { order: "#002", products: "Product C", pricing: "$50", status: "Pending" },
  ];

  return (
    <div className="p-4 flex-1">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md text-center"
          >
            <h3 className="text-lg font-bold">{card.label}</h3>
            <p className="text-2xl font-bold text-black">{card.value}</p>
          </div>
        ))}
      </div>
      <h3 className="text-xl font-bold mb-4">Recent Order History</h3>
      <table className="table-auto w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-2">Order</th>
            <th className="px-4 py-2">Products</th>
            <th className="px-4 py-2">Pricing</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{order.order}</td>
              <td className="px-4 py-2">{order.products}</td>
              <td className="px-4 py-2">{order.pricing}</td>
              <td className="px-4 py-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardContent;
