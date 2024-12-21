// src/component/track-order/OrderTimeline.jsx

import React from "react";

const OrderTimeline = () => {
  const timelineData = [
    { city: "Warehouse", date: "Dec 18, 2024", status: "Dispatched" },
    { city: "Shipping Hub", date: "Dec 19, 2024", status: "In Transit" },
    { city: "Destination City", date: "Dec 20, 2024", status: "Out for Delivery" },
    { city: "Delivered", date: "Dec 21, 2024", status: "Delivered" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Order Timeline</h3>
      <ul className="space-y-4">
        {timelineData.map((event, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-theme-blue"></div>
            <div>
              <h4 className="text-sm font-medium">{event.city}</h4>
              <p className="text-xs text-sub-color">{event.date}</p>
              <p className="text-sm">{event.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTimeline;
