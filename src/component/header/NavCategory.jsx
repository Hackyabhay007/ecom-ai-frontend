import React, { useState, useEffect, useRef } from "react";
import Category from "../category/Category";
import Link from "next/link";
import { useRouter } from "next/router";

const NavCategory = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const categoryRefs = {
    woman: useRef(null),
    man: useRef(null),
    kids: useRef(null),
  };

  const route = useRouter()

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
    <div className="relative z-50">
      {/* Navigation Menu */}
      <div className="flex px-5 text-xl md:text-base  text-black md:px-0  bg-light-BG md:bg-white flex-col space-y-8  md:space-y-0 md:flex-row md:gap-10 md:items-center justify-around   pt-10 pb-5 md:py-0 s md:pb-0 md:border-none  z-50">
        {["men", "woman", "kids"].map((category) => (
          <div
            key={category}
            ref={categoryRefs[category]}
            className={`cursor-pointer md:uppercase md:text-sm hover:text-theme-blue  border-b-2 border-transparent hover:border-theme-blue transition-all ease-in-out ${
              activeCategory === category ? "text-theme-blue font-semibold border-b-2 border-theme-blue" : ""
            }`}
            onClick={() => {
              route.push({
                pathname: "/shop", // Keep the same page
                query:  { collection:  category}, // Apply remaining queries
              });
            }}
          >
        {category.charAt(0).toUpperCase() + category.slice(1)}<i class="ri-arrow-drop-right-line absolute right-5 md:hidden"></i>
          </div>
        ))}
      <p className="md:hidden"> <Link href="/">Home<i class="ri-arrow-drop-right-line absolute right-5 md:hidden"></i></Link></p> 
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
