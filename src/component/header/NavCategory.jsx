import React, { useState, useEffect, useRef, useCallback } from "react";
import Category from "../category/Category";
import Link from "next/link";
import { useRouter } from "next/router";
import Collection from '../collection/index';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

const NavCategory = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const categoryRefs = {
    woman: useRef(null),
    man: useRef(null),
    kids: useRef(null),
  };

  const route = useRouter();

  const menuItemVariants = {
    hidden: { 
      opacity: 0,
      y: -5 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      color: "#2563eb", // theme-blue color
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const arrowVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 }
  };


  const toggleCategoryDropdown = (category) => {
    if (activeCategory === category) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveCategory(null);
        setIsAnimating(false);
      }, 300);
    } else {
      setActiveCategory(category);
    }
  };

  const handleCategoryClose = () => {
    if (activeCategory) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveCategory(null);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Enhanced click outside handler
  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !Object.values(categoryRefs).some((ref) =>
        ref.current?.contains(event.target)
      )
    ) {
      handleCategoryClose();
    }
  }, [activeCategory]);

  // Improved scroll handler
  const handleScroll = useCallback(() => {
    const scrollThreshold = window.innerHeight * 2;
    if (window.scrollY > scrollThreshold) {
      handleCategoryClose();
    }
  }, [activeCategory]);

  // Click outside effect
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Scroll effect with debouncing
  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 150);
    window.addEventListener("scroll", debouncedHandleScroll);
    
    return () => {
      debouncedHandleScroll.cancel(); // Clean up debounce
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [handleScroll]);


  return (
    <div className="relative z-50 ">
      <motion.div 
        initial="hidden"
        animate="visible"
        className="flex px-5 text-xl md:text-base text-black md:px-0 bg-light-BG md:bg-white flex-col space-y-8 md:space-y-0 md:flex-row md:gap-10 md:items-center justify-around pt-10 pb-5 md:py-0 md:pb-0 md:border-none z-50"
      >
        {["men", "woman", "kids"].map((category, index) => (
          <motion.div
            key={category}
            ref={categoryRefs[category]}
            variants={menuItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index}
            transition={{ delay: index * 0.1 }}
            className={`cursor-pointer md:uppercase md:text-sm relative group flex items-center justify-between ${
              activeCategory === category ? "text-theme-blue font-semibold" : ""
            }`}
            onClick={() => toggleCategoryDropdown(category)}
          >
            <span className="relative">
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-theme-blue origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeCategory === category ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </span>
            <motion.i
              className="ri-arrow-drop-right-line md:hidden"
              variants={arrowVariants}
              animate={activeCategory === category ? "open" : "closed"}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
        <motion.p 
          className="md:hidden"
          variants={menuItemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: 0.3 }}
        >
          <Link href="/" className="flex items-center justify-between">
            Home
            <motion.i 
              className="ri-arrow-drop-right-line absolute right-5"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            />
          </Link>
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {activeCategory && (
          <motion.div
            ref={dropdownRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 top-20 z-50"
          >
            <Collection activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavCategory;