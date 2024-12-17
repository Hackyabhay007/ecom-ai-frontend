import React from "react";

const Breadcrumb = ({ heading, subCategory, onCategorySelect, categories = [] }) => {
  return (
    <div className="mb-5 py-5 bg-light-BG">
      {/* Dynamic Heading */}
      <h1 className="text-5xl   text-center text-[#1F1F1F] mb-4">
        {heading}
      </h1>

      {/* Breadcrumb Navigation */}
      <div className="py-1 mb-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-sub-color flex justify-center gap-0">
            <span className="text-[#1F1F1F]">HomePage</span>
            {subCategory &&<span><i class="ri-arrow-right-s-line"></i>{subCategory}</span>}
          </nav>
        </div>
      </div>

      {/* Product Types */}
      <div className="py-2">
        <div className="flex flex-wrap justify-center gap-4 text-sm  text-[#1F1F1F] uppercase">
          {categories.map((type) => (
            <span
              key={type}
              className="cursor-pointer hover:text-gray-600"
              onClick={() => onCategorySelect(type.toLowerCase())}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Breadcrumb;
