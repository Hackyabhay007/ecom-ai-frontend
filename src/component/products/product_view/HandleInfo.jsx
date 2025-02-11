import React, { useState, useEffect } from "react";
import ProductDetailsInfo from "./ProductDetailsInfo";
import ProductDetails from "./ProductDetails";
import CustomerReview from "./CustomerReview";

const HandleInfo = ({ categories, product, reviews }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [visibilityInfo, setVisibilityInfo] = useState("visible");
  const [visibilityDetails, setVisibilityDetails] = useState("visible");
  const [visibilityReview, setVisibilityReview] = useState("visible");

  // Disable scrolling on the background when a modal is open
  useEffect(() => {
    if (isInfoOpen || isDetailsOpen || isReviewOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling on body
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Clean up when the component is unmounted
    };
  }, [isInfoOpen, isDetailsOpen, isReviewOpen]);

  // Toggle each section and handle closing of others
  const handleInfoClick = () => {
    setIsInfoOpen((prev) => !prev);
    if (isInfoOpen) {
      setTimeout(() => setVisibilityInfo("hidden"), 500); // Delay visibility change for closing
    } else {
      setVisibilityInfo("visible"); // Show immediately when opening
    }
    setIsDetailsOpen(false);
    setIsReviewOpen(false);
  };

  const handleDetailsClick = () => {
    setIsDetailsOpen((prev) => !prev);
    if (isDetailsOpen) {
      setTimeout(() => setVisibilityDetails("hidden"), 500);
    } else {
      setVisibilityDetails("visible");
    }
    setIsInfoOpen(false);
    setIsReviewOpen(false);
  };

  const handleReviewClick = () => {
    setIsReviewOpen((prev) => !prev);
    if (isReviewOpen) {
      setTimeout(() => setVisibilityReview("hidden"), 500);
    } else {
      setVisibilityReview("visible");
    }
    setIsInfoOpen(false);
    setIsDetailsOpen(false);
  };

  return (
    <div className="py-5 ">
      {/* Buttons to open modals */}
      <button
        className="group relative w-full px-6 py-4 text-sm text-black border-t border-b border-gray-300 hover:bg-white flex items-center justify-between"
        onClick={handleDetailsClick}
      >
        <span className="group-hover:translate-x-1 transition-transform uppercase text-xs">
          <i className="ri-price-tag-3-line pr-2"></i> Product details
        </span>
        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
          → {/* Arrow icon */}
        </span>
      </button>

      <button
        className="group relative w-full px-6 py-4 text-sm text-black  border-t border-b border-gray-300 hover:bg-white flex items-center justify-between"
        onClick={handleInfoClick}
      >
        <span className="group-hover:translate-x-1 transition-transform uppercase text-xs">
          <i className="ri-information-line pr-2"></i> Delivery Info
        </span>
        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
          → {/* Arrow icon */}
        </span>
      </button>

      <button
        className="group relative w-full px-6 py-4 text-sm text-black border-t border-b border-gray-300 hover:bg-white flex items-center justify-between"
        onClick={handleReviewClick}
      >
        <span className="group-hover:translate-x-1 transition-transform uppercase text-xs">
          <i className="ri-verified-badge-line pr-2"></i> Review
        </span>
        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
          → {/* Arrow icon */}
        </span>
      </button>

      {/* Background shadow effect */}
      {(isInfoOpen || isDetailsOpen || isReviewOpen) && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40" />
      )}

      {/* Product Info Sliding Component */}
      <div
        className={`fixed top-0 right-0 w-full md:w-1/2 h-full bg-white z-50 transition-transform duration-500 ease-in-out ${
          isInfoOpen
            ? "opacity-100 visible md:animate-handleInfoSlideInRight animate-handleInfoSlideInBottom"
            : "opacity-0 invisible md:animate-handleInfoSlideOutLeft animate-handleInfoSlideOutTop"
        }`}
        style={{
          transition: "opacity 0.5s ease-in-out",
          visibility: visibilityInfo,
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black text-2xl z-50"
          onClick={handleInfoClick}
        >
          <i class="ri-close-line bg-white p-2 rounded-full "></i>
        </button>

        <div className="p-6 overflow-auto custom-scrollbar">
          {/* Product Info */}
          <ProductDetailsInfo categories={categories} />
        </div>
      </div>

      {/* Product Details Sliding Component */}
      <div
        className={`fixed top-0 right-0 w-full md:w-1/2 h-full bg-white z-50 transition-transform duration-500 ease-in-out ${
          isDetailsOpen
            ? "opacity-100 visible md:animate-handleInfoSlideInRight animate-handleInfoSlideInBottom"
            : "opacity-0 invisible md:animate-handleInfoSlideOutLeft animate-handleInfoSlideOutTop"
        }`}
        style={{
          transition: "opacity 0.5s ease-in-out",
          visibility: visibilityDetails,
        }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black text-2xl z-50"
          onClick={handleDetailsClick}
        >
          <i class="ri-close-line bg-white p-2 rounded-full "></i>
        </button>

        <div className="p-6 overflow-auto custom-scrollbar">
          {/* Product Details */}
          <ProductDetails product={product} />
        </div>
      </div>

      {/* Customer Review Sliding Component */}
      <div
        className={`fixed top-0 right-0 w-full md:w-1/2 h-full bg-white z-50 transition-transform duration-500 ease-in-out ${
          isReviewOpen
            ? "opacity-100 visible md:animate-handleInfoSlideInRight animate-handleInfoSlideInBottom"
            : "opacity-0 invisible md:animate-handleInfoSlideOutLeft animate-handleInfoSlideOutTop"
        }`}
        style={{
          transition: "opacity 0.5s ease-in-out",
          visibility: visibilityReview,
        }}
      >
        <button
          className="absolute top-5 right-4 text-black    text-2xl z-50"
          onClick={handleReviewClick}
        >
          <i class="ri-close-line bg-white p-2 rounded-full "></i>
        </button>

        <div className="p-2 pb-10 max-h-full overflow-y-auto custom-scrollbar">
          <CustomerReview reviews={reviews} productImage={product?.thumbnail} productId={product?.id} />
        </div>
      </div>
    </div>
  );
};

export default HandleInfo;
