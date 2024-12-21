import React from "react";
import Link from "next/link";

const WishlistBreadCrumb = () => (
  <div className="flex flex-col items-center gap-4  justify-center  bg-light-BG py-16 text-sm mb-4">
    <h2 className="text-4xl">Wishlist</h2>
    <p><span className="text-sub-color">Home</span><i class="ri-arrow-right-s-line"></i>wishlist</p>

    
  </div>
);

export default WishlistBreadCrumb;
