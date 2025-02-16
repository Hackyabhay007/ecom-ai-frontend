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

  const router = useRouter();

  const categories = [
    { name: 'Men', path: '/shop?gender=men', key: 'men' },
    { name: 'Women', path: '/shop?gender=women', key: 'women' },
    { name: 'Kids', path: '/shop?gender=kids', key: 'kids' }
  ];

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
      y: -2,
      color: "#153A63",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const arrowVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 }
  };


  const toggleCategoryDropdown = (category) => {
    if (activeCategory === category) {
      handleCategoryClose();
    } else {
      // Smooth transition between categories
      if (activeCategory) {
        setIsAnimating(true);
        // Fade out current category
        setTimeout(() => {
          setActiveCategory(category);
          setIsAnimating(false);
        }, 200);
      } else {
        setActiveCategory(category);
      }
    }
  };

  const handleCategoryClose = () => {
    setIsAnimating(true);
    setActiveCategory(null);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
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

  const handleCategoryClick = (category, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCategoryDropdown(category.key);
  };

  return (
    <div className="relative z-50">
      <motion.div 
        initial="hidden"
        animate="visible"
        className="flex px-5 text-xl md:text-base text-black md:px-0 bg-light-BG md:bg-white flex-col space-y-8 md:space-y-0 md:flex-row md:gap-10 md:items-center justify-around pt-10 pb-5 md:py-0 md:pb-0 md:border-none z-50"
      >
        {categories.map((category) => (
          <div key={category.name} className="relative">
            <motion.div
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="cursor-pointer uppercase text-sm"
              onClick={(e) => handleCategoryClick(category, e)}
            >
              {category.name}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-theme-blue origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
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

      <AnimatePresence mode="wait">
        {activeCategory && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={handleCategoryClose}
            />

            {/* Dropdown content */}
            <motion.div
              ref={dropdownRef}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-x-0 top-20 z-50 bg-white shadow-lg overflow-hidden"
            >
              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCategoryClose}
              >
                <i className="ri-close-line text-2xl" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
              >
                <Collection 
                  activeCategory={activeCategory} 
                  setActiveCategory={setActiveCategory}
                  onNavigate={(path) => {
                    handleCategoryClose();
                    router.push(path);
                  }}
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavCategory;