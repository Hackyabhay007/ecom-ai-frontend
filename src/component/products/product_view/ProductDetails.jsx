import React, { useState } from "react";

const ProductDetails = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description"); // Track active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full px-5  py-20">
      {/* Tab Headers */}
      <div className="flex justify-center gap-8">
        <button
          onClick={() => handleTabClick("description")}
          className={`text-2xl relative pb-2 ${
            activeTab === "description" ? "text-black" : "text-sub-color"
          }`}
        >
          Description
          {activeTab === "description" && (
            <span className="absolute left-0 bottom-0 w-full h-1 bg-black transition-all duration-300"></span>
          )}
        </button>
        <button
          onClick={() => handleTabClick("specification")}
          className={`text-2xl relative pb-2 ${
            activeTab === "specification" ? "text-black" : "text-sub-color"
          }`}
        >
          Specification
          {activeTab === "specification" && (
            <span className="absolute left-0 bottom-0 w-full h-1 bg-black transition-all duration-300"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "description" && <p>{product.description}</p>}
        {activeTab === "specification" && <p>{product.specifications}</p>}
      </div>
    </div>
  );
};

export default ProductDetails;
