import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBySearch } from "../../../redux/slices/shopSlice";

const GridLayout = ({
  currentLayout,
  onLayoutChange,
  showSaleOnly,
  onSaleToggle,
  onSortChange,
  currentSort
}) => {
  const dispatch = useDispatch();
  // const { appliedFilters } = useSelector(state => state.shop);

  // const handleSaleToggle = (e) => {

  // };

  return (
    <div className="flex justify-between flex-wrap gap-4 items-center mb-4">
      {/* Left Controls: Sale Checkbox and Layout Switch */}
      <div className="flex items-center gap-4">
        {/* Layout Toggle */}
        <div className="flex gap-2"> 
          <button
            onClick={() => onLayoutChange("grid")}
            className={`px-2 rotate-90 border py-1 text-lg rounded-sm ${
              currentLayout === "grid" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            <i className="ri-menu-fill  "></i>
          </button>
          <button
            onClick={() => onLayoutChange("list")}
            className={`px-2 py-1 border text-lg rounded-sm ${
              currentLayout === "list" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            <i className="ri-menu-fill font-semibold"></i>
          </button>
        </div>

        {/* Sale Product Filter */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showSaleOnly}
            onChange={onSaleToggle}
            className="w-5 h-5 accent-white rounded-none"
          />
          <span className="text-black text-sm ">Sale Product </span>
        </label>
      </div>

      {/* Right Controls: Sort Dropdown */}
      <div>
        <select
          onChange={(e) => onSortChange(e.target.value)}
          value={currentSort}
          className="pr-8 px-4 border rounded-none"
        >
          <option value="default">Sort By: Best Selling</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Best Discount</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
      
    </div>
  );
};

export default GridLayout;
