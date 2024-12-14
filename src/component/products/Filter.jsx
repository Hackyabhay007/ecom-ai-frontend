// components/products/Filter.jsx
import React, { useState } from "react";

const Filter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    category: "",
    price: [0, 1000],
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          className="w-full p-2 border rounded-md"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="furniture">Furniture</option>
        </select>
      </div>

      {/* Price Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.price[1]}
          className="w-full"
          onChange={(e) =>
            handleFilterChange("price", [0, Number(e.target.value)])
          }
        />
        <p className="text-sm text-gray-600 mt-2">
          ${filters.price[0]} - ${filters.price[1]}
        </p>
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
