import React, { useState } from "react";

const Filter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    category: "",
    price: [0, 1000],
    size: "",
    brand: "",
    color: "",
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    setIsMobileFilterOpen(false); // Close the filter on mobile after applying
  };

  return (
    <div>
      {/* Mobile Filter Toggle Button */}
      <button
        className="md:hidden w-full bg-theme-blue text-white py-2 rounded-md hover:bg-blue-600 mb-4"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        Open Filters
      </button>

      {/* Filter Sidebar */}
      <div
        className={`fixed inset-0 border shadow-lg bg-white z-50 transform ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:static md:translate-x-0 md:block md:w-fit  md:rounded-lg p-4`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-black">Filter</h2>

        {/* Product Type */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-black mb-2">Product Type</h3>
          <ul>
            {[
              { name: "T-Shirt", count: 11 },
              { name: "Dress", count: 5 },
              { name: "Gown", count: 2 },
              { name: "Swimwear", count: 3 },
              { name: "Partywear", count: 6 },
            ].map((item) => (
              <li key={item.name} className="flex py-1 justify-between text-sub-color">
                <span>{item.name}</span>
                <span>({item.count})</span>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
        </div>

        {/* Size */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-black mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={`p-1 px-2 border rounded-full ${
                  filters.size === size
                    ? "bg-theme-blue text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => handleFilterChange("size", size)}
              >
                {size}
              </button>
            ))}
          </div>
          <hr className="my-4" />
        </div>

        {/* Price Range */}
        {/* <div className="mb-4">
          <h3 className="text-md font-semibold text-black mb-2">Price Range</h3>
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
          <p className="text-sm text-sub-color mt-2">
            ₹{filters.price[0]} - ₹{filters.price[1]}
          </p>
          <hr className="my-4" />
        </div> */}

        {/* Colors */}
        <div className="mb-4">
  <h3 className="text-md font-semibold text-black mb-2">Colors</h3>
  <div className="flex flex-wrap gap-2">
    {["blue", "red", "yellow", "green", "black"].map((color) => (
      <div
        key={color}
        className={`flex items-center gap-2 border rounded-full py-1 p-2 ${
          filters.color === color ? "border-black" : "border-gray-300"
        }`}
        onClick={() => handleFilterChange("color", color)}
        style={{ cursor: "pointer" }}
      >
        {/* Color Dot */}
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        {/* Color Name */}
        <span className="capitalize text-black">{color}</span>
      </div>
    ))}
  </div>
  <hr className="my-4" />
</div>


        {/* Brand */}
        <div className="mb-4">
  <h3 className="text-md font-semibold text-black mb-2">Brand</h3>
  <div className="flex flex-col gap-2">
    {["Adidas", "Gucci", "Hermes", "Zara", "Nike", "LV"].map((brand) => (
      <label key={brand} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.brand?.includes(brand)}
          onChange={(e) => {
            const selectedBrands = filters.brand || [];
            if (e.target.checked) {
              // Add brand to the selection
              handleFilterChange("brand", [...selectedBrands, brand]);
            } else {
              // Remove brand from the selection
              handleFilterChange(
                "brand",
                selectedBrands.filter((b) => b !== brand)
              );
            }
          }}
          className="form-checkbox text-theme-blue"
        />
        <span className="text-black">{brand}</span>
      </label>
    ))}
  </div>
  <hr className="my-4" />
</div>


        {/* Apply Button */}
        <button
          className="w-full bg-theme-blue text-white py-2 rounded-md hover:bg-blue-600"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
