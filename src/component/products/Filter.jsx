import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange, setFilters } from "../../../redux/slices/shopSlice";

const Filter = ({ onApplyFilters, currentFilters }) => {
  const dispatch = useDispatch();
  // Get all necessary states from Redux store
  const { 
    filters,
    appliedFilters,
    loading: storeLoading,  // Get loading state from store
    error: storeError      // Get error state from store
  } = useSelector((state) => state.shop);
  const Route = useRouter();

  // Get dynamic values from Redux store
  const availableSizes = filters.sizes || [];
  const availableColors = filters.colors || [];
  const availableCategories = filters.categories || [];
  
  // Initialize price range from filters
  const [Range, setRange] = useState({
    min: filters.priceRange.min || 0,
    max: filters.priceRange.max || 1000,
  });

  // Update range when filters change
  useEffect(() => {
    if (filters.priceRange) {
      setRange({
        min: filters.priceRange.min,
        max: filters.priceRange.max
      });
    }
  }, [filters.priceRange]);

  const handlePriceChange = (type, value) => {
    setRange(prev => ({ ...prev, [type]: value }));
  };

  const handleSliderChange = (value) => {
    dispatch(setPriceRange({ min: value[0], max: value[1] }));
  };

  const updateQueryParams = (newParams) => {
    const currentQuery = { ...Route.query };
    const updatedQuery = { ...currentQuery, ...newParams };
    
    // Remove undefined or null values
    Object.keys(updatedQuery).forEach(key => 
      updatedQuery[key] == null && delete updatedQuery[key]
    );

    Route.push({
      pathname: "/shop",
      query: updatedQuery
    }, undefined, { shallow: true });

    // Update filters in Redux store
    dispatch(setFilters(newParams));
  };

  const {
    cat_id,
    cat_name,
    size: selected_size,
    color: selected_color,
    min_price,
    max_price,
  } = Route.query;

  const { categories = [], priceRange = { min: 0, max: 1000 } } = currentFilters || {};

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onApplyFilters(updatedFilters);
  };

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFilterOpen]);

  return (
    <div>
      <button
        className={`md:hidden w-full py-2 px-10  z-40 text-end font-semibold rounded-md ${
          isMobileFilterOpen ? "top-5" : "top-60"
        }`}
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <p className="text-xl">
          <i className="ri-sound-module-line text-xl"></i> Filter
        </p>
      </button>

      <div
        className={`fixed inset-0 bg-white z-50 transform ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:static md:translate-x-0 md:block md:w-fit pb-10 md:pb-0`}
        style={{
          width: isMobileFilterOpen ? "80%" : "100%",
          height: "100%",
        }}
      >
        <div className="h-full overflow-y-auto p-4">
          <button
            className="md:hidden absolute top-4 bg-white right-4 text-black font-bold rounded-full p-[5px] px-[10px]"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            ✕
          </button>

          <h2 className="text-md md:text-lg font-semibold mb-4 text-black">
            Filter
          </h2>

          {/* Product Type Filter */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">
              Product Type
            </h3>
            {storeLoading ? (
              <p>Loading categories...</p>
            ) : storeError ? (
              <p>Error: {storeError}</p>
            ) : availableCategories.length === 0 ? (
              <p>No categories available</p>
            ) : (
              <ul>
                {availableCategories.map((item) => (
                  <li
                    key={item.id}
                    className={`flex py-1 justify-between text-sm cursor-pointer ${
                      cat_name === item.name ? "text-theme-blue" : "text-black"
                    }`}
                    onClick={() => {
                      updateQueryParams({ cat_id: item.id, cat_name: item.name });
                    }}
                  >
                    <span className="capitalize">{item.name}</span>
                    <span>({item.product_count || 0})</span>
                  </li>
                ))}
              </ul>
            )}
            <hr className="my-4" />
          </div>

          {/* Size Filter */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Size</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`p-[4px] px-[16px] text-xs border border-gray-900 rounded-sm ${
                    selected_size === size
                      ? "bg-theme-blue text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => {
                    updateQueryParams({ size });
                    handleFilterChange("size", size);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <hr className="my-4" />
          </div>

          {/* <div className="mb-4">
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
          </div> */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Price</h3>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-black">
                  Min Price
                </label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-24"
                  value={Range.min}
                  onChange={(e) =>
                    handlePriceChange("min", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Max Price
                </label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-24"
                  value={Range.max}
                  onChange={(e) =>
                    handlePriceChange("max", Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 px-2 w-full overflow-hidden">
              {/* Slider for Price */}
              <Slider
                range
                min={0}
                max={Range.max}
                className="px-2 mt-2"
                step={10}
                trackStyle={{ backgroundColor: "black" }} // Set the track color to black
                handleStyle={{
                  backgroundColor: "black", // Set the handle color to black
                  borderColor: "black", // Set the handle border color to black
                }}
                value={[priceRange.min, priceRange.max]}
                onChange={handleSliderChange}
                marks={{
                  0: `₹0`,
                  1000: `₹1000`,
                  5000: `₹5000`,
                  10000: `₹10000`,
                }}
              />

              <div className="flex justify-between text-sm">
                <span>₹{priceRange.min}</span>
                <span>₹{priceRange.max}</span>
              </div>
                <button onClick={()=>updateQueryParams({min_price : priceRange.min , max_price : priceRange.max })} className=" border-2 border-black bg-white text-black py-1 rounded-md hover:bg-black hover:text-white duration-150 ">
                  Apply
                </button>
            </div>
          </div>

          {/* Colors Filter */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <div
                  key={color}
                  className={`flex items-center font-thin gap-2 border rounded-3xl py-1 px-1 pr-3 ${
                    color === selected_color
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  onClick={() => updateQueryParams({ color })}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="w-4 h-4 rounded-2xl border-2"
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></div>
                  <span className="capitalize text-xs text-cream">
                    {color}
                  </span>
                </div>
              ))}
            </div>
            <hr className="my-4" />
          </div>

          {/* Brand Filter */}
          {/* <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Brand</h3>
            <div className="flex flex-col gap-2">
              {[
                "Adidas",
                "Gucci",
                "Hermes",
                "Zara",
                "Nike",
                "LV",
                "Puma",
                "HM",
              ].map((brand) => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => {
                      const newBrandFilter = filters.brand.includes(brand)
                        ? filters.brand.filter((b) => b !== brand)
                        : [...filters.brand, brand];
                      handleFilterChange("brand", newBrandFilter);
                    }}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Filter;
