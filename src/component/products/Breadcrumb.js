import React, { useState } from "react";

const Breadcrumb = ({
  heading,
  subCategory,
  onCategorySelect,
  categories = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category.toLowerCase());
  };

  return (
    <div className="mb-0 py-5">
      {/* Breadcrumb Navigation */}
      <div className="py-1 mb-5">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-sub-color flex justify-start gap-0">
            <span className="text-[#1F1F1F]">Homepage / </span>
            <span> Shop </span>
            {selectedCategory && (
              <>
                <span> / {selectedCategory}</span>
              </>
            )}
            {heading && !selectedCategory && <span> / {heading}</span>}
          </nav>
          <p className="text-4xl font-bold pt-3">{heading}</p>
        </div>
      </div>

      {/* Product Types */}
      <div className="px-4 md:px-14">
        <div className="flex overflow-x-auto gap-4 text-xs md:text-sm font-semibold text-[#1F1F1F] uppercase no-scrollbar">
          {categories.map((type) => (
            <span
              key={type}
              className={`relative cursor-pointer group rounded-full border border-[#1F1F1F] px-4 py-2 flex items-center justify-center whitespace-nowrap ${
                selectedCategory === type
                  ? "bg-[#1F1F1F] text-white"
                  : "text-[#1F1F1F] group-hover:bg-[#1F1F1F] group-hover:text-white"
              }`}
              style={{
                minWidth: "100px", // Ensures consistent width
                height: "40px", // Consistent height
                lineHeight: "1.5", // Consistent vertical spacing
              }}
              onClick={() => handleCategorySelect(type)}
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
