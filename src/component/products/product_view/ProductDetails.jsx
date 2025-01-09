import React, { useState } from "react";

const ProductDetails = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description"); // Track active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full px-5 py-20">
      {/* Tab Headers */}
      <div className="flex justify-center gap-8">
        <button
          onClick={() => handleTabClick("description")}
          className="relative pb-2 group text-sm md:text-xl"
        >
          <span
            className={`${
              activeTab === "description" ? "text-black" : "text-sub-color"
            }`}
          >
            Description
          </span>
          <span
            className={`absolute bottom-0 left-0 h-1 rounded bg-[#1F1F1F] transition-all duration-500 ${
              activeTab === "description" ? "w-full" : "w-0"
            }`}
          ></span>
        </button>
        <button
          onClick={() => handleTabClick("specification")}
          className="relative pb-2 group text-sm md:text-xl"
        >
          <span
            className={`${
              activeTab === "specification" ? "text-black" : "text-sub-color"
            }`}
          >
            Specification
          </span>
          <span
            className={`absolute bottom-0 left-0 h-1 rounded bg-[#1F1F1F] transition-all duration-500 ${
              activeTab === "specification" ? "w-full" : "w-0"
            }`}
          ></span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4 text-sm md:text-base">
        {activeTab === "description" && <p>{product.description}</p>}
        {activeTab === "specification" && <p>{product.specifications}</p>}
      </div>
    </div>
  );
};

export default ProductDetails;
