import React, { useState } from "react";

const WishlistGridLayout = ({ onLayoutChange, onFilterChange }) => {
  const [activeLayout, setActiveLayout] = useState(3);

  const handleFilterChange = (filterName, value) => {
    onFilterChange(filterName, value);
  };

  return (
    <div className="flex items-center justify-between mb-4 px-5">
      {/* Layout Selector */}
      <div className="flex gap-2">
        {[3, 4, 5].map((layout) => {
          const icons = {
            3: "ri-menu-fill rotate-90",
            4: "ri-align-justify rotate-90",
            5: "ri-play-list-add-line -rotate-90",
          };
          return (
            <button
              key={layout}
              onClick={() => {
                setActiveLayout(layout);
                onLayoutChange(layout);
              }}
              className={`px-4 py-2 rounded border flex items-center justify-center ${
                activeLayout === layout
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              <i className={`${icons[layout]} text-xl`}></i>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 font-thin text-sm text-cream">
        <select
          className="border font-thin text-sm text-cream rounded px-4 py-2"
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="all">All</option>
          <option value="t-shirt">T-Shirts</option>
          <option value="dress">Dresses</option>
          <option value="partywear">Partywear</option>
        </select>
        <select
          className="border rounded px-4 py-2"
          onChange={(e) => handleFilterChange("sort", e.target.value)}
        >
          <option value="best-selling">Best Selling</option>
          <option value="discount">Best Discount</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default WishlistGridLayout;
