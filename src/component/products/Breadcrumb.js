import React from "react";

const Breadcrumb = ({ heading, subCategory, onCategorySelect, categories = [] }) => {
  return (
    <div className="mb-5 py-10 bg-light-BG">
      {/* Dynamic Heading */}
      <h1 className="text-4xl text-center text-[#1F1F1F] font-bold my-4">
        {heading}
      </h1>

      {/* Breadcrumb Navigation */}
      <div className="py-1 mb-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-sub-color flex justify-center gap-0">
            <span className="text-[#1F1F1F]">Homepage</span>
            <span><i class="ri-arrow-right-s-line"></i>{heading}</span>
          </nav>
        </div>
      </div>

      {/* Product Types */}
      <div className="py-2">
      <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm font-semibold text-[#1F1F1F] uppercase">
  {categories.map((type) => (
    <span
      key={type}
      className="relative cursor-pointer group"
      onClick={() => onCategorySelect(type.toLowerCase())}
    >
      {type}
      <span
        className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1F1F1F] transition-all duration-500 group-hover:w-full"
      ></span>
    </span>
  ))}
</div>

      </div>
    </div>
  );
};


export default Breadcrumb;
