import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBySearch } from "../../../../redux/slices/shopSlice";
import Image from "next/image";
import { formatPriceToINR } from "utils/currencyUtils";

const RelatedProducts = ({ currentProduct }) => {
  const dispatch = useDispatch();
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Get products from Redux state
  const relatedProducts = useSelector(state => state.shop.products) || [];
  const isLoading = useSelector(state => state.shop.loading);

  // Fetch related products on mount
  useEffect(() => {
    if (currentProduct?.categoryId) {
      dispatch(fetchProductsBySearch({
        filters: {
          categories: currentProduct.categoryId,
          limit: 10
        }
      }));
    }
  }, [dispatch, currentProduct?.categoryId]);

  // Scroll handlers
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" 
        ? -sliderRef.current.clientWidth / 2 
        : sliderRef.current.clientWidth / 2;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      setCanScrollLeft(sliderRef.current.scrollLeft > 0);
      setCanScrollRight(
        sliderRef.current.scrollLeft < 
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleScrollEvent = () => checkScrollButtons();
    const currentRef = sliderRef.current;

    if (currentRef) {
      currentRef.addEventListener("scroll", handleScrollEvent);
      return () => currentRef.removeEventListener("scroll", handleScrollEvent);
    }
  }, [relatedProducts]);

  if (isLoading) {
    return (
      <div className="md:mx-6 mx-4 py-5">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="flex gap-4 overflow-x-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1/4 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:mx-6 mx-4 py-5">
      <div className="flex items-center justify-between md:justify-start md:gap-5 mb-4">
        <h2 className="md:text-xl text-lg font-bold capitalize">
          Products You may like
        </h2>
        <div className="flex gap-4 bg-light-BG rounded-lg px-3 py-2">
          <button
            onClick={() => handleScroll("left")}
            className={`text-2xl ${canScrollLeft ? "text-gray-800" : "text-gray-400 cursor-not-allowed"}`}
            disabled={!canScrollLeft}
          >
            <i className="ri-arrow-left-s-line"></i>
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
              onClick={() => window.location.href = `/shop/product/${product.id}`}
            >
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                <Image
                  src={product.variants[0]?.images[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>

              {console.log("price of the Related Product", product)}
              <div className="mt-4 px-2">
                <h3 className="mb-1 text-sm md:text-md text-cream text-left">
                  {product.name}
                </h3>
                <div className="flex flex-wrap mb-5 gap-3 items-center justify-start">
 
                  <span className="text-sm">
                    {formatPriceToINR(product.variants[0]?.price)}
                  </span>
                  {product.variants[0]?.isOnSale && (
                    <>
                      <span className="text-xs text-sub-color line-through">
                        {formatPriceToINR(product.variants[0]?.salePrice)}
                      </span>
                      <span className="bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs text-black">
                        -{Math.round(((product.variants[0]?.price - product.variants[0]?.salePrice) / product.variants[0]?.price) * 100)}% off
                      </span>
                    </>
                  )}
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
