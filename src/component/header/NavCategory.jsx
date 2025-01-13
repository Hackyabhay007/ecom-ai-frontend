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
    <div className="relative ">
      {/* Navigation Menu */}
      <div className="flex px-5 text-xl md:text-base  text-black md:px-0  bg-light-BG md:bg-white flex-col space-y-8  md:space-y-0 md:flex-row md:gap-10 md:items-center justify-around   pt-10 pb-5 md:py-0 s md:pb-0 md:border-none  z-50">
        {["men", "woman", "kids"].map((category) => (
          <div
            key={category}
            ref={categoryRefs[category]}
            className={`cursor-pointer hover:text-theme-blue  border-b-2 border-transparent hover:border-theme-blue transition-all ease-in-out ${
              activeCategory === category ? "text-theme-blue font-semibold border-b-2 border-theme-blue" : ""
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
        className={` fixed  inset-x-0 top-20 z-50 ${
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
