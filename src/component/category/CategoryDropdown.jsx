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

  // Disable scrolling when dropdown is open
  const disableScrolling = () => {
    if (isCategoryOpen) {
      document.body.style.overflow = "hidden"; // Disable body scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable body scroll
    }
  };

  // Add event listener to detect clicks outside of the dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Call disableScrolling on every render to ensure body scroll behavior is updated
  useEffect(() => {
    disableScrolling();
  }, [isCategoryOpen]);

  return (
    <div className="relative">
      {/* Category Text with Click Event */}
      <div
        ref={categoryRef} // Reference to the Category text
        className="cursor-pointer hover:text-theme-blue flex items-center space-x-2"
        onClick={toggleCategoryDropdown} // Toggle dropdown visibility on click
      >
        <span>Category</span>
        {/* Show the icon (arrow up/down) based on dropdown open/close */}
        <i
          className={`text-lg ${
            isCategoryOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
          }`}
        ></i>
      </div>

      {/* Dropdown container */}
      <div
        ref={dropdownRef} // Reference to the Dropdown container
        className={`fixed inset-x-0 ${
          isCategoryOpen ? "bottom-[10%]" : "top-[10%]"
        } bg-white shadow-lg z-50 p-6 transition-all duration-300 ease-out transform ${
          isCategoryOpen
            ? "opacity-100 md:translate-y-0 translate-y-5"
            : "opacity-0 md:-translate-y-5 translate-y-10"
        } sm:translate-y-0 sm:top-[10%] sm:max-w-screen h-fit mx-auto`}
      >
        {/* Category Items */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 max-w-screen ">
          {CategoryData.map((category, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
              style={{ minWidth: "100px" }}
            >
              <i className={`${category.icon} text-3xl`}></i>
              <span className="font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;
