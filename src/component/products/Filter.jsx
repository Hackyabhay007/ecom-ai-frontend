import React, { useState, useEffect } from "react";

const Filter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    category: "",
    price: [0, 1000],
    size: "",
    brand: [],
    color: "",
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onApplyFilters(updatedFilters); // Automatically apply filters on change
  };
  useEffect(() => {
    // Locking and unlocking scroll on body based on filter state
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  
    // Cleanup the effect to reset overflow when the component unmounts or filter closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFilterOpen]);
  
  return (
    <div>
      {/* Mobile Filter Toggle Button */}
      <button
        className="md:hidden w-1/6 text-theme-blue border border-theme-blue py-1 font-semibold rounded-md hover:bg-black hover:text-white hover:font-thin mb-4"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <i className="ri-sound-module-line"></i>
      </button>

      {/* Filter Sidebar */}
      <div
        className={`fixed inset-0 bg-white z-50 transform ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:static md:translate-x-0 md:block md:w-fit p-4`}
        style={{
          width: isMobileFilterOpen ? "80%" : "100%",
           boxShadow: isMobileFilterOpen ? "0px 0px 300px rgba(0, 0, 0, 1)" : "none", 
        }}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-black font-bold rounded-full p-[5px] px-[10px]"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          ✕
        </button>

        <h2 className=" text-md md:text-lg font-semibold  mb-4 text-black">Filter</h2>

        {/* Product Type */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-black mb-2">Product Type</h3>
          <ul>
            {[
              { name: "t-shirt", count: 11 },
              { name: "dress", count: 5 },
              { name: "gown", count: 2 },
              { name: "swimwear", count: 3 },
              { name: "partywear", count: 6 },
            ].map((item) => (
              <li
                key={item.name}
                className={`flex py-1 justify-between  cursor-pointer ${
                  filters.category === item.name ? "text-theme-blue" : "text-sub-color"
                }`}
                onClick={() => handleFilterChange("category", item.name)}
              >
                <span className=" capitalize">{item.name}</span>
                <span>({item.count})</span>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
        </div>

        {/* Size */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-black mb-2">Size</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={`p-[11px] px-[16px] border rounded-full ${
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
        <div className="mb-4">
          <h3 className="text-md font-semibold text-black mb-2">Price Range</h3>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.price[1]}
            className="w-full h-1 accent-black"
            onChange={(e) =>
              handleFilterChange("price", [0, Number(e.target.value)])
            }
          />
          <p className="text-sm text-sub-color mt-2">
            ₹{filters.price[0]} - ₹{filters.price[1]}
          </p>
          <hr className="my-4" />
        </div>

        {/* Colors */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-black mb-2">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {["blue", "red", "yellow", "green", "black"].map((color) => (
              <div
                key={color}
                className={`flex items-center  font-thin gap-2 border rounded-full py-1 px-1 pr-3 ${
                  filters.color === color ? "border-black" : "border-gray-300"
                }`}
                onClick={() => handleFilterChange("color", color)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="capitalize text-cream">{color}</span>
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
                  checked={filters.brand.includes(brand)}
                  onChange={(e) => {
                    const selectedBrands = filters.brand || [];
                    if (e.target.checked) {
                      handleFilterChange("brand", [...selectedBrands, brand]);
                    } else {
                      handleFilterChange(
                        "brand",
                        selectedBrands.filter((b) => b !== brand)
                      );
                    }
                  }}
                  className="form-checkbox text-theme-blue accent-black"
                />
                <span className="text-black">{brand}</span>
              </label>
            ))}
          </div>
          <hr className="my-4" />
        </div>
      </div>
    </div>
  );
};

export default Filter;
