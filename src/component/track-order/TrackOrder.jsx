// src/component/track-order/TrackOrder.jsx

import React from "react";
import TrackOrderBreadCrumb from "./TrackOrderBreadCrumb";
import OrderTimeline from "./OrderTimeline";

const TrackOrder = () => (
  <div>
    {/* Breadcrumb */}
    <TrackOrderBreadCrumb />

    {/* Main Content */}
    <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      {/* Left Column: Track Form */}
      <div className="lg:w-2/3 space-y-6">
        <h3 className="text-3xl font-bold">Track Your Order</h3>
        <p className="text-sm text-sub-color leading-relaxed">
          To track your order, please enter your order ID in the box below and press the "Track Order" button.
          This was given to you on your receipt and in the confirmation email you should have received.
        </p>
        <input
          type="email"
          placeholder="Email Address*"
          className="w-full py-3 px-4 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Order ID*"
          className="w-full py-3 px-4 border rounded-lg"
        />
        <button className="w-full py-3 bg-theme-blue text-white rounded-md uppercase text-sm hover:text-black hover:font-bold hover:bg-discount-color transition-all">
          Track Order
        </button>
      </div>

      {/* Right Column: Order Timeline */}
      <div className="lg:w-1/3">
        <OrderTimeline />
      </div>
    </div>
  </div>
);

export default TrackOrder;
