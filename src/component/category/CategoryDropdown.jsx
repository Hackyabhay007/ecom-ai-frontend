import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/slices/categorySlice";

const CategoryDropdown = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories({
      searchParams: {
        isActive: true
      }
    }));
  }, [dispatch]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  return (
    <div className="relative">
      {/* Category Toggle Button */}
      <div
        ref={categoryRef}
        className="cursor-pointer flex"
        onClick={toggleCategoryDropdown}
      >
        <div className="flex flex-col justify-center items-center">
          <i className="md:hidden ri-list-unordered"></i>
          <span className="text-xs md:text-base">Category</span>
        </div>

        <i
          className={`hidden lg:block text-lg ${
            isCategoryOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
          }`}
        ></i>
      </div>

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`fixed inset-x-0 h-fit bottom-[11%] md:top-[12%] bg-white z-50 p-6 transition-all duration-300 ease-out transform ${
          isCategoryOpen
            ? "opacity-100 animate-dropdown translate-y-0"
            : "hidden -translate-y-5"
        }`}
      >
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-around gap-4 max-w-screen-xl mx-auto">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-1 md:space-x-3 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
                onClick={() => window.location.href = `/shop?cat_id=${category.id}&cat_name=${category.name}`}
              >
                {category.icon && (
                  <i className={`${category.icon} text-md md:text-3xl`}></i>
                )}
                <span className="font-medium text-xs md:text-sm">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
