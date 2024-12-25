import React from "react";

const GridLayout = ({
  currentLayout,
  onLayoutChange,
  showSaleOnly,
  onSaleToggle,
  onSortChange,
}) => {
  return (
    <div className="flex justify-between flex-wrap gap-4 items-center mb-4">
      {/* Left Controls: Sale Checkbox and Layout Switch */}
      <div className="flex items-center gap-4">
        {/* Sale Checkbox */}
       
        {/* Layout Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => onLayoutChange("grid")}
            className={`px-2 rotate-90 border py-1 text-lg rounded-md ${
              currentLayout === "grid" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            <i className="ri-menu-fill font-semibold  "></i>
          </button>
          <button
            onClick={() => onLayoutChange("list")}
            className={`px-2 py-1 border text-lg rounded-md ${
              currentLayout === "list" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            <i className="ri-menu-fill font-semibold"></i>
          </button>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showSaleOnly}
            onChange={onSaleToggle}
            className="w-4 h-4 accent-white"
          />
          <span className="text-sub-color">Sale Product </span>
        </label>

      </div>

      {/* Right Controls: Sort Dropdown */}
      <div>
        <select
          onChange={onSortChange}
          className="p-2 border rounded"
          defaultValue="best-selling"
        >
          <option value="best-selling">Sort By: Best Selling</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="best-discount">Best Discount</option>
        </select>
      </div>
      
    </div>
  );
};

export default GridLayout;
