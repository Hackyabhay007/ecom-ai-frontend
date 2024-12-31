import React, { useState, useEffect, useRef } from "react";
import CategoryData from "./CategoryData";

const CategoryDropdown = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown
  const categoryRef = useRef(null); // Reference to the category text

  // Toggle the dropdown when clicking the Category text
  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Close dropdown if clicked outside of it
  const handleClickOutside = (event) => {
    if (
      categoryRef.current && !categoryRef.current.contains(event.target) &&
      dropdownRef.current && !dropdownRef.current.contains(event.target)
    ) {
      setIsCategoryOpen(false);
    }
  };

  // Add event listener to detect clicks outside of the dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Category Text with Click Event */}
      <div
        ref={categoryRef} // Reference to the Category text
        className="cursor-pointer hover:text-theme-blue flex"
        onClick={toggleCategoryDropdown} // Toggle dropdown visibility on click
      >
        <span>Category</span>
        {/* Show the icon (arrow up/down) based on dropdown open/close */}
        <i
          className={`hidden md:block text-lg ${
            isCategoryOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
          }`}
        ></i>
      </div>

      {/* Dropdown container */}
      <div
        ref={dropdownRef} // Reference to the Dropdown container
        className={`fixed inset-x-0 h-fit bottom-[11%] md:top-[12%] bg-white z-50 p-6 transition-all duration-300 ease-out transform ${
          isCategoryOpen
            ? "opacity-100 animate-dropdown translate-y-0"
            : "hidden -translate-y-5"
        }`}
      >
        {/* Category Items */}
        <div className="flex flex-wrap justify-around gap-4 max-w-screen-xl mx-auto">
          {CategoryData.map((category, index) => (
            <div
              key={index}
              className="flex  items-center space-x-1 md:space-x-3 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
            //   style={{ width: "calc(15% - 1rem)", minWidth: "100px" }}
            >
              <i className={`${category.icon} text-md md:text-3xl`}></i>
              <span className="font-medium text-xs md:text-sm">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;
