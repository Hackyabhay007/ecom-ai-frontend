import React, { useState, useEffect } from "react";
import Image from "next/image";

const heroData = [
  {
    image: "/images/hero/hero1.png",
    heading: "Fashion",
    tagline: "Innovation and Excellence Await",
    button1: "Learn More",
    button2: "Get Started",
  },
  {
    image: "/images/hero/hero2.jpeg",
    heading: "Unleash Potential",
    tagline: "Empowering Your Vision",
    button1: "Join Us",
    button2: "Explore",
  },
  {
    image: "/images/hero/hero3.jpg",
    heading: "Elevate Your Experience",
    tagline: "Redefining Possibilities",
    button1: "Sign Up",
    button2: "Learn More",
  },
];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateHeading, setAnimateHeading] = useState(false);
  const [animateTagline, setAnimateTagline] = useState(false);
  const [animateButtons, setAnimateButtons] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = isPaused
      ? null
      : setInterval(() => {
          handleNext();
        }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    resetAnimations();
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroData.length);
      triggerAnimations();
    }, 500);
  };

  const handlePrev = () => {
    resetAnimations();
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + heroData.length) % heroData.length);
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

  useEffect(() => {
    triggerAnimations();
  }, [currentIndex]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const currentHero = heroData[currentIndex];

  return (
    <div
      className="relative  w-full min-h-[80%] h-[700px] md:h-screen overflow-hidden"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handlePause}
      onTouchEnd={handleResume}
    >
      {/* Background Image */}
      <Image
        src={currentHero.image}
        alt={currentHero.heading}
        fill
        className="absolute inset-0 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center md:m-auto mt-36 md:items-start justify-center h-full md:p-20 text-white">
        <h1
          className={`text-5xl text-wrap md:text-9xl font-bold mb-4 text-center md:text-left transition-all duration-500 transform ${
            animateHeading ? "translate-x-0 opacity-100" : "translate-x-[-100%] opacity-0"
          }`}
        >
          {currentHero.heading}
        </h1>
        <p
          className={`text-sm md:text-xl mb-6 text-center md:text-left transition-all duration-500 transform ${
            animateTagline ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
        >
          {currentHero.tagline}
        </p>
        <div
          className={`flex space-x-4 transition-all duration-500 transform ${
            animateButtons ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <button className="flex items-center space-x-2 px-6 py-1 border border-white text-white rounded hover:bg-white hover:text-black transition">
            <span>{currentHero.button1}</span>
            <span>&#8594;</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-1 border border-white text-white rounded hover:bg-white hover:text-black transition">
            <span>{currentHero.button2}</span>
            <span>&#8594;</span>
          </button>
        </div>
      </div>

      {/* Carousel Controls */}
      {/* <div className="absolute -bottom-6 left-[30%] md:left-[40%] transform -translate-y-1/2 z-20">
        <button
          onClick={handlePrev}
          className="text-white text-2xl p-2 rounded-full focus:outline-none cursor-pointer"
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>
      </div> */}
      {/* <div className="absolute -bottom-6 right-[30%] md:right-[40%] transform -translate-y-1/2 z-20">
        <button
          onClick={handleNext}
          className="text-white text-2xl p-2 rounded-full focus:outline-none cursor-pointer"
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div> */}

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroData.map((_, index) => (
          <div
            key={index}
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
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? "bg-white" : "bg-gray-500"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
