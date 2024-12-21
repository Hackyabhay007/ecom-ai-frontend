// src/component/track-order/TrackOrderBreadCrumb.jsx

import React from "react";
import Link from "next/link";

const TrackOrderBreadCrumb = () => (
  <div className="bg-light-BG py-10 text-center">
    <h2 className="text-4xl font-bold">Track Your Order</h2>
    <p className="text-sm text-sub-color">
      <Link href="/">Home</Link>
      <span className="mx-2"><i class="ri-arrow-right-s-line"></i></span>
      Track Order
    </p>
  </div>
);

export default TrackOrderBreadCrumb;
