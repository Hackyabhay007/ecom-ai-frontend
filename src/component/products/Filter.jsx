import React, { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/router";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange, setFilters, fetchProductsBySearch } from "../../../redux/slices/shopSlice";
import FilterSkeleton from './FilterSkeleton';

const Filter = memo(({ onApplyFilters, currentFilters }) => {
  const dispatch = useDispatch();
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const { filters, appliedFilters, loading: storeLoading, error: storeError } = useSelector((state) => state.shop);
  const Route = useRouter();

  // Get dynamic values from Redux store
  const availableSizes = filters.sizes || [];
  const availableColors = filters.colors || [];
  const availableCategories = filters.categories || [];
  const availableCollections = filters.collections || [];

  // Price range states
  const [sliderValues, setSliderValues] = useState([
    filters.priceRange?.min || 0,
    filters.priceRange?.max || 10000
  ]);

  const [inputValues, setInputValues] = useState({
    min: filters.priceRange?.min || 0,
    max: filters.priceRange?.max || 10000
  });

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Price handlers
  const handleSliderChange = useCallback((value) => {
    setSliderValues(value);
  }, []);

  const debouncedPriceUpdate = useCallback(
    debounce((values) => {
      dispatch(setPriceRange({ min: values[0], max: values[1] }));
      updateQueryParams({ min_price: values[0], max_price: values[1] });
    }, 500),
    [dispatch]
  );

  const handleSliderAfterChange = useCallback((value) => {
    debouncedPriceUpdate(value);
  }, [debouncedPriceUpdate]);

  const handleInputChange = useCallback((type, value) => {
    const numValue = parseInt(value) || 0;
    const newValues = [...sliderValues];
    
    if (type === 'min') {
      newValues[0] = Math.min(numValue, sliderValues[1]);
    } else {
      newValues[1] = Math.max(numValue, sliderValues[0]);
    }
    
    setSliderValues(newValues);
    setInputValues(prev => ({ ...prev, [type]: numValue }));
    debouncedPriceUpdate(newValues);
  }, [sliderValues, debouncedPriceUpdate]);

  // Sale toggle handler
  const handleSaleToggle = useCallback(() => {
    const newSaleValue = !showSaleOnly;
    setShowSaleOnly(newSaleValue);
    updateQueryParams({ onSale: newSaleValue || null });
  }, [showSaleOnly]);

  // Update query params
  const updateQueryParams = useCallback((newParams) => {
    const currentQuery = { ...Route.query };
    const updatedQuery = { ...currentQuery, ...newParams };
    
    // If this is a category selection, add the category name
    if (newParams.cat_id) {
      const selectedCategory = availableCategories.find(cat => cat.id.toString() === newParams.cat_id.toString());
      if (selectedCategory) {
        updatedQuery.cat_name = selectedCategory.name;
      }
    }

    // Clean up undefined values
    Object.keys(updatedQuery).forEach(key => 
      updatedQuery[key] == null && delete updatedQuery[key]
    );

    const searchFilters = {
      ...appliedFilters,
      categoryId: updatedQuery.cat_id,
      sizes: updatedQuery.size,
      colors: updatedQuery.color,
      minPrice: updatedQuery.min_price,
      maxPrice: updatedQuery.max_price
    };

    // Store category in session storage
    if (searchFilters.categoryId) {
      sessionStorage.setItem('selectedCategoryId', searchFilters.categoryId);
      sessionStorage.setItem('selectedCategoryName', updatedQuery.cat_name);
    }

    // Update Redux store first
    dispatch(setFilters(searchFilters));
    
    // Then update URL
    Route.push({
      pathname: "/shop",
      query: updatedQuery
    }, undefined, { shallow: true });

    // Finally, fetch products
    dispatch(fetchProductsBySearch({ filters: searchFilters }));
  }, [appliedFilters, Route, dispatch, availableCategories]);

  // Effects
  useEffect(() => {
    if (filters.priceRange) {
      setSliderValues([filters.priceRange.min, filters.priceRange.max]);
      setInputValues({
        min: filters.priceRange.min,
        max: filters.priceRange.max
      });
    }
  }, [filters.priceRange]);

  useEffect(() => {
    const onSale = Route.query.onSale === 'true';
    setShowSaleOnly(onSale);
  }, [Route.query.onSale]);

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

  const debouncedUpdateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
    
    // Use a single dispatch for search
    dispatch(fetchProductsBySearch({
      filters: {
        ...appliedFilters,
        ...newFilters
      }
    }));
  }, [dispatch, appliedFilters]);

  // Optimize filter handlers
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...appliedFilters, [key]: value };
    debouncedUpdateFilters(newFilters);
  }, [appliedFilters, debouncedUpdateFilters]);

  // Add new handler for size filter
  const handleSizeFilter = useCallback((size) => {
    updateQueryParams({ size });
  }, [updateQueryParams]);

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

  const renderCategories = () => (
    <ul>
      {availableCategories.map((item) => (
        <li
          key={item.id}
          className={`flex py-1 text-sm cursor-pointer transition-all duration-300 relative
            ${
              item.id.toString() === cat_id || 
              item.name === cat_name
                ? "text-theme-blue font-medium translate-x-2"
                : "text-black hover:text-theme-blue hover:translate-x-1"
            }
            before:content-[''] before:absolute before:left-0 before:bottom-0 
            before:h-[1px] before:bg-theme-blue before:transition-all before:duration-300
            before:w-0 hover:before:w-full
          `}
          onClick={() => {
            updateQueryParams({ 
              cat_id: item.id.toString(),
              cat_name: item.name 
            });
          }}
        >
          <span className="capitalize">{item.name}</span>
        </li>
      ))}
    </ul>
  );

  if (storeLoading) {
    return <FilterSkeleton />;
  }

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

          {/* Product Type Filter - Updated without count */}
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
              renderCategories()
            )}
            <hr className="my-4" />
          </div>

          {/* Size Filter - Updated */}
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
                  onClick={() => handleSizeFilter(size)}
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
          <div className="mb-6">
            <h3 className="text-md font-semibold text-black mb-4">Price Range</h3>
            
            {/* Price inputs */}
            <div className="flex items-center gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  min="0"
                  value={inputValues.min}
                  onChange={(e) => handleInputChange('min', e.target.value)}
                  className="w-24 p-2 border rounded-md focus:ring-1 focus:ring-theme-blue"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  min="0"
                  value={inputValues.max}
                  onChange={(e) => handleInputChange('max', e.target.value)}
                  className="w-24 p-2 border rounded-md focus:ring-1 focus:ring-theme-blue"
                />
              </div>
            </div>

            {/* Slider */}
            <div className="px-2 py-4">
              <Slider
                range
                min={0}
                max={10000}
                step={100}
                value={sliderValues}
                onChange={handleSliderChange}
                onAfterChange={handleSliderAfterChange}
                trackStyle={[{ backgroundColor: '#153A63' }]}
                handleStyle={[
                  { borderColor: '#153A63', backgroundColor: 'white' },
                  { borderColor: '#153A63', backgroundColor: 'white' }
                ]}
                railStyle={{ backgroundColor: '#E5E7EB' }}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>₹{sliderValues[0]}</span>
                <span>₹{sliderValues[1]}</span>
              </div>
            </div>
          </div>

          {/* Sale toggle with state sync */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSaleOnly}
                onChange={handleSaleToggle}
                className="form-checkbox h-4 w-4 text-theme-blue rounded border-gray-300"
              />
              <span className="text-sm font-medium">Sale Items Only</span>
            </label>
          </div>

          {/* Colors Filter Section */}
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

        </div>
      </div>
    </div>
  );
});

export default Filter;
