import React from "react";

const DashboardContent = () => {
  const cards = [
    { label: "Total Orders", value: 120, icon: "ri-shopping-cart-line" },
    { label: "Completed Orders", value: 100, icon: "ri-check-line" },
    { label: "Awaiting Orders", value: 20, icon: "ri-time-line" },
  ];

  const recentOrders = [
    {
      order: "#001",
      products: [
        { name: "Product A", image: "/images/collection/collection1.png", tags: ["Women", "Clothing"] },
        { name: "Product B", image: "/images/collection/collection2.png", tags: ["Men", "Accessories"] },
      ],
      pricing: "$100",
      status: "Delivered",
    },
    {
      order: "#002",
      products: [
        { name: "Product C", image: "/images/collection/collection1.png", tags: ["Unisex", "Footwear"] },
      ],
      pricing: "$50",
      status: "Pending",
    },
  ];

  const statusColors = {
    Pending: "bg-yellow-200 text-yellow-800",
    Delivered: "bg-sky-200 text-sky-800",
    Completed: "bg-green-200 text-green-800",
  };

  return (
    <div className="px-4 flex-1">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-4 py-6 border shadow-md rounded-lg flex items-center justify-between bg-white"
          >
            <div>
              <h3 className="text-sub-color">{card.label}</h3>
              <p className="text-black text-2xl font-bold">{card.value}</p>
            </div>
            <i className={`${card.icon} text-3xl `}></i>
          </div>
        ))}
      </div>

      {/* Recent Order History */}
      <div className="border  rounded-lg bg-white p-4">
        <h3 className="text-xl font-bold mb-4 uppercase">Recent Order History</h3>
        <table className="table-auto w-full">
          <thead>
            <tr className="text-left border-b-2 uppercase">
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Products</th>
              <th className="px-4 py-2">Pricing</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-4">{order.order}</td>
                <td className="px-4 py-4">
                  {order.products.map((product, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <div className="text-xs text-sub-color">
                          {product.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="mr-2"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="px-4 py-4">{order.pricing}</td>
                <td className="px-4 py-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      statusColors[order.status] || "bg-gray-200 text-gray-800"
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
    </div>
  );
};

export default DashboardContent;