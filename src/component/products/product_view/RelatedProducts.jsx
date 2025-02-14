import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const RelatedProducts = ({ currentProduct, allProducts }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Debug logs for incoming props
  useEffect(() => {
    console.log('RelatedProducts - Current Product:', {
      id: currentProduct?.id,
      name: currentProduct?.name,
      categories: currentProduct?.categories
    });
    
    console.log('RelatedProducts - All Products:', {
      totalProducts: allProducts?.length,
      productsList: allProducts?.map(p => ({
        id: p.id,
        name: p.name,
        categories: p.categories
      }))
    });
  }, [currentProduct, allProducts]);

  // Filter products by matching categories (excluding the current product)
  const relatedProducts = React.useMemo(() => {
    if (!currentProduct?.categories || !allProducts?.length) {
      console.log('RelatedProducts - Missing data for filtering:', {
        hasCurrentProduct: !!currentProduct,
        hasCategories: !!currentProduct?.categories,
        hasAllProducts: !!allProducts?.length
      });
      return [];
    }

    const filtered = allProducts.filter(product => {
      if (product.id === currentProduct.id) return false;
      
      const hasMatchingCategory = product.categories?.some(cat =>
        currentProduct.categories.includes(cat)
      );

      // Debug log for category matching
      console.log('Category matching for product:', {
        productId: product.id,
        productCategories: product.categories,
        currentProductCategories: currentProduct.categories,
        isMatching: hasMatchingCategory
      });

      return hasMatchingCategory;
    });

    console.log('RelatedProducts - Filtered results:', {
      totalFiltered: filtered.length,
      filteredProducts: filtered.map(p => ({
        id: p.id,
        name: p.name
      }))
    });

    return filtered;
  }, [currentProduct, allProducts]);

  // Scroll function for left and right buttons
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -sliderRef.current.clientWidth / 2 : sliderRef.current.clientWidth / 2;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Update button state when scrolling
  const checkScrollButtons = () => {
    if (sliderRef.current) {
      setCanScrollLeft(sliderRef.current.scrollLeft > 0);
      setCanScrollRight(
        sliderRef.current.scrollLeft < sliderRef.current.scrollWidth - sliderRef.current.clientWidth
      );
    }
  };

  // Handle scroll events to update button states
  useEffect(() => {
    checkScrollButtons();
    const handleScrollEvent = () => checkScrollButtons();
    if (sliderRef.current) {
      sliderRef.current.addEventListener("scroll", handleScrollEvent);
    }
    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener("scroll", handleScrollEvent);
      }
    };
  }, [relatedProducts]);

  return (
    <div className="md:mx-6 mx-4 py-5">
      <div className="flex items-center justify-between md:justify-start md:gap-5 mb-4">
        <h2 className="md:text-xl text-lg font-bold capitalize">Products You may like</h2>
        <div className="flex gap-4 bg-light-BG rounded-lg px-3 py-2">
          <button
            onClick={() => handleScroll("left")}
            className={`text-2xl ${canScrollLeft ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
            disabled={!canScrollLeft}
          >
            <i className="ri-arrow-left-s-line "></i>
          </button>
          <p className="border-r border-gray-400"></p>
          <button
            onClick={() => handleScroll("right")}
            className={`text-2xl ${canScrollRight ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
            disabled={!canScrollRight}
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-4 md:gap-4 snap-x no-scrollbar px-2"
      >
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-1/2 sm:w-1/3 md:w-1/4 text-center relative text-cream cursor-pointer snap-start"
              // Navigate to product page on click
              onClick={() => window.location.href = `/shop/${product.id}`}
            >
              {/* Image */}
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                  
                />
              </div>

              {/* Product Information */}
              <div className="mt-4 px-2">
                <h3 className="mb-1 text-sm md:text-md text-cream text-left">{product.name}</h3>
                <div className="flex flex-wrap mb-5 gap-3 items-center justify-start">
                  <span className="text-sm">₹{product.price}</span>
                  <span className="text-xs text-sub-color line-through">₹{product.prevPrice}</span>
                  <span className="bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs text-black">
                    -{product.discount}% off
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
