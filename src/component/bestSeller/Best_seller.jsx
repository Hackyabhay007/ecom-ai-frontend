// src/components/BestSeller.js
import React, { useEffect, useRef, useState } from 'react';
import BestSellerCard from './BestSellerCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBestSeller_Section } from '../../../redux/slices/homePageSlice';
import Link from "next/link";

function BestSeller() {
  const dispatch = useDispatch();
  const { bestSellerSection, loading, error } = useSelector((state) => state?.homePage);
  const [productsArray, setProductsArray] = useState([]);
  const scrollContainerRef = useRef(null);

  // Initialize default state
  const [bestSellerInfo, setBestSellerInfo] = useState({
    title: "Best Seller Products",
    description: "Fashion Fads May come and go, but my style is eternal. Your Fashion always reflects who you really are.",
    buttonText: "Shop Now",
    buttonLink: "/"
  });

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchBestSeller_Section());
  }, [dispatch]);

  // Update state when data arrives
  useEffect(() => {
    if (bestSellerSection?.section_data) {
      setBestSellerInfo({
        title: bestSellerSection.section_data.title || bestSellerInfo.title,
        description: bestSellerSection.section_data.description || bestSellerInfo.description,
        buttonText: bestSellerSection.section_data.cta_button?.text || bestSellerInfo.buttonText,
        buttonLink: bestSellerSection.section_data.cta_button?.link || bestSellerInfo.buttonLink
      });

      const products = bestSellerSection.section_data.products || [];
      setProductsArray(products);

      console.log("Best Seller Section Data:", bestSellerSection);
      console.log("Products Array:", products);
    }
  }, [bestSellerSection]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="h-fit p-8 animate-pulse">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-4">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="md:w-2/3 flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-none w-full md:w-2/3 lg:w-1/2 md:px-4">
                <div className="bg-gray-200 h-96 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-fit p-8 text-center">
        <div className="text-red-500 text-xl">Failed to load best seller products.</div>
      </div>
    );
  }

  return (
    <div className="h-fit p-8 bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="md:w-1/3 p-4 flex gap-5 flex-col justify-center">
          <h1 className="text-theme-blue text-center md:text-start font-bold text-3xl md:text-5xl lg:text-7xl mb-4">
            {bestSellerInfo.title}
          </h1>
          <p className="text-sm text-sub-color mb-4">
            {bestSellerInfo.description}
          </p>
          <Link
            href={bestSellerInfo.buttonLink}
            className="text-center bg-white border border-black w-40 rounded-lg p-2 hover:bg-theme-blue hover:text-white transition duration-200 ease-in-out"
          >
            {bestSellerInfo.buttonText}
          </Link>
        </div>

        {/* Right Section - Carousel */}
        <div className="md:w-2/3 relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-theme-blue hover:text-white transition-all duration-300"
            aria-label="Previous product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-scroll space-x-4 scrollbar-hide scroll-smooth"
            style={{ scrollSnapType: "x mandatory" }}
          >
            <div className="flex space-x-4 w-full" style={{ minWidth: "100%" }}>
              {productsArray.map((product) => (
                <div
                  key={product.id}
                  className="flex-none w-full h-full md:w-2/3 lg:w-1/2 md:px-4"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <BestSellerCard id={product.product_id} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-theme-blue hover:text-white transition-all duration-300 focus:outline-none"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BestSeller;
