import React, { useState, useEffect, useRef } from "react";
import Category from "../category/Category";

const NavCategory = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const categoryRefs = {
    woman: useRef(null),
    man: useRef(null),
    kids: useRef(null),
  };

  const toggleCategoryDropdown = (category) => {
    if (activeCategory === category) {
      // Close dropdown
      setIsAnimating(true);
      setTimeout(() => {
        setActiveCategory(null);
        setIsAnimating(false);
      }, 400); // Match animation duration
    } else {
      // Open dropdown
      setActiveCategory(category);
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !Object.values(categoryRefs).some((ref) =>
        ref.current?.contains(event.target)
      )
    ) {
      if (activeCategory) {
        setIsAnimating(true);
        setTimeout(() => {
          setActiveCategory(null);
          setIsAnimating(false);
        }, 300); // Match animation duration
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCategory]);

  return (
    <div className="relative">
      {/* Navigation Menu */}
      <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:gap-10 md:items-center justify-around border-b-2 border-gray-500 pb-3 md:pb-0 md:border-none bg-white z-50">
        {["woman", "man", "kids"].map((category) => (
          <div
            key={category}
            ref={categoryRefs[category]}
            className={`cursor-pointer hover:text-theme-blue ${
              activeCategory === category ? "text-theme-blue font-semibold" : ""
            }`}
            onClick={() => toggleCategoryDropdown(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={`fixed   inset-x-0 top-20 bg-white z-40 ${
          activeCategory
            ? "block animate-dropdown"
            : isAnimating
            ? "block animate-dropdown-out"
            : "hidden"
        }`}
      >
        {activeCategory && <Category activeCategory={activeCategory} />}
      </div>
    </div>
  );
};

export default NavCategory;
