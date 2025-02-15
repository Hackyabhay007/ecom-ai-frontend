"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroSection } from "@/redux/slices/homePageSlice";
import Link from "next/link";
// import { fetchHeroes } from "../../../redux/slices/herosectionSlice.js";

function Hero() {
  // 1. Move all hooks to the top
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateHeading, setAnimateHeading] = useState(false);
  const [animateTagline, setAnimateTagline] = useState(false);
  const [animateButtons, setAnimateButtons] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroData, setHeroData] = useState([]);

  const dispatch = useDispatch();
  const { heroSection, loading, error } = useSelector((state) => state?.homePage);

  // 2. Define all handler functions
  const handleNext = () => {
    resetAnimations();
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (heroData?.length || 1));
      triggerAnimations();
    }, 500);
  };

  const handlePrev = () => {
    resetAnimations();
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + (heroData?.length || 1)) % (heroData?.length || 1));
      triggerAnimations();
    }, 500);
  };

  const resetAnimations = () => {
    setAnimateHeading(false);
    setAnimateTagline(false);
    setAnimateButtons(false);
  };

  const triggerAnimations = () => {
    setTimeout(() => setAnimateHeading(true), 200);
    setTimeout(() => setAnimateTagline(true), 500);
    setTimeout(() => setAnimateButtons(true), 700);
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  // 3. All useEffects together
  useEffect(() => {
    dispatch(fetchHeroSection());
  }, [dispatch]);

  useEffect(() => {
    if (heroSection?.section_data?.slides) {
      try {
        const heroDataArray = heroSection.section_data.slides
          .map((slide) => {
            if (!slide?.background_image) {
              console.warn('Missing background image for slide:', slide);
              return null;
            }
            return {
              id: slide.id,
              background_image: slide.background_image,
              title: slide.title || '',
              subtitle: slide.subtitle || '',
              buttons: slide.buttons || [],
              button1: slide.buttons?.[0]?.text || '',
              button2: slide.buttons?.[1]?.text || '',
              button1Link: slide.buttons?.[0]?.link || '/',
              button2Link: slide.buttons?.[1]?.link || '/',
            };
          })
          .filter(Boolean);

        if (heroDataArray?.length > 0) {
          setHeroData(heroDataArray);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Error processing hero data:', error);
      }
    }
  }, [heroSection]);

  useEffect(() => {
    const interval = isPaused
      ? null
      : setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [isPaused, heroData?.length]);

  useEffect(() => {
    triggerAnimations();
  }, [currentIndex]);

  // 4. Prepare render data
  const currentHero = heroData[currentIndex];
  const shouldRender = heroData?.length > 0 && currentHero?.background_image;

  // 5. Handle loading and error states
  if (loading) {
    return (
      <div className="relative w-full min-h-[80%] h-[700px] md:h-screen overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
    );
  }

  if (error || !shouldRender) {
    return null;
  }

  // 6. Main render
  return (
    <div
      className="relative w-full min-h-[80%] h-[700px] md:h-screen overflow-hidden"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handlePause}
      onTouchEnd={handleResume}
    >
      {/* Background Image */}
      <Image
        src={currentHero?.background_image || "/fallback-image.jpg"}
        alt={currentHero?.title || "Default Title"}
        className="absolute inset-0 object-cover"
        fill
        priority // Add priority for first image
        onError={(e) => {
          console.error('Image failed to load:', e);
          e.target.src = "/fallback-image.jpg"; // Provide fallback
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center md:m-auto mt-36 md:items-start justify-center h-full md:p-20 text-white">
        <h1
          className={`text-5xl text-wrap md:text-9xl font-bold mb-4 text-center md:text-left transition-all duration-500 transform ${animateHeading ? "translate-x-0 opacity-100" : "translate-x-[-100%] opacity-0"
            }`}
        >
          {currentHero?.title}
        </h1>
        <p
          className={`text-sm md:text-xl mb-6 text-center md:text-left transition-all duration-500 transform ${animateTagline ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            }`}
        >
          {currentHero?.subtitle}
        </p>
        <div
          className={`flex space-x-4 transition-all duration-500 transform ${animateButtons ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          <button className="flex items-center space-x-2 px-6 py-1 border border-white text-white rounded hover:bg-white hover:text-black transition">
            <span><Link href={currentHero?.button1Link || '/'}>{currentHero?.button1}</Link></span>
            <span>&#8594;</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-1 border border-white text-white rounded hover:bg-white hover:text-black transition">
            <span><Link href={currentHero?.button2Link || '/'}>{currentHero?.button2}</Link></span>
            <span>&#8594;</span>
          </button>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute left-2  top-2/3 md:top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={handlePrev}
          className="backdrop-blur-sm  bg-white/40 hover:bg-white/50 text-2xl px-1 font-thin rounded-full focus:outline-none cursor-pointer"
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>
      </div>
      <div className="absolute top-2/3 md:top-1/2  right-2 transform -translate-y-1/2 z-20">
        <button
          onClick={handleNext}
          className="backdrop-blur-sm  bg-white/40 hover:bg-white/50 text-2xl px-1 rounded-full focus:outline-none cursor-pointer"
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroData?.map((currElem, index) => (
          <div
            key={currElem?.id}
            className="w-4 h-4 flex items-center justify-center border border-white rounded-full"
            onClick={() => {
              resetAnimations();
              setTimeout(() => {
                setCurrentIndex(index);
                triggerAnimations();
              }, 500);
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${currentIndex === index ? "bg-white" : "bg-gray-500"
                }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
