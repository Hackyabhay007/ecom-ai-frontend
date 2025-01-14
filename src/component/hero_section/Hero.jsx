import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroes } from "../../../redux/slices/herosectionSlice.js";

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateHeading, setAnimateHeading] = useState(false);
  const [animateTagline, setAnimateTagline] = useState(false);
  const [animateButtons, setAnimateButtons] = useState(false);
  const dispatch = useDispatch();
  const {
    heroes: heroesObject,
    status,
    error,
  } = useSelector((state) => state.heroSection);
  const [heroes, setHeroes] = useState([]);

  useMemo(() => {
    dispatch(fetchHeroes());
  }, [currentIndex]);

  // Convert heroes object to array and ensure it is sorted by index
  useMemo(() => {
    const sortedHeroes = heroesObject
      ? Object.entries(heroesObject).map(([key, hero]) => ({
          ...hero,
          id: key,
        }))
      : [];
    setHeroes(sortedHeroes.sort((a, b) => a.index - b.index));
  }, [heroesObject]);

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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroes.length);
      triggerAnimations();
    }, 500);
  };

  const handlePrev = () => {
    resetAnimations();
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + heroes.length) % heroes.length
      );
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

  const currentHero = heroes[currentIndex] || {};

  return (
    Array.isArray(heroes) && (
      <div
        className="relative w-full min-h-[80%] h-[700px] md:h-screen overflow-hidden"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
      >
        {/* Background Image */}
        <Image
          src={currentHero?.image}
          alt={currentHero?.title}
          fill
          className="absolute inset-0 object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center md:m-auto mt-36 md:items-start justify-center h-full md:p-20 text-white">
          <h1
            className={`text-5xl text-wrap md:text-9xl font-bold mb-4 text-center md:text-left transition-all duration-500 transform ${
              animateHeading
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100%] opacity-0"
            }`}
          >
            {currentHero?.title}
          </h1>
          <p
            className={`text-sm md:text-xl mb-6 text-center md:text-left transition-all duration-500 transform ${
              animateTagline
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            {currentHero?.subtitle}
          </p>
          <div
            className={`flex space-x-4 transition-all duration-500 transform ${
              animateButtons
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <a
              href={"/" + currentHero?.firstbuttonroute}
              className="flex items-center space-x-2 px-6 py-1 border border-white text-white rounded hover:bg-white hover:text-black transition"
            >
              <span>{currentHero?.firsttext}</span>
              <span>&#8594;</span>
            </a>
            <a
              href={"/" + currentHero?.secoundbuttonroute}
              className="flex items-center space-x-2 px-6 py-1 border border-white text-white rounded hover:bg-white hover:text-black transition"
            >
              <span>{currentHero?.secondtext}</span>
              <span>&#8594;</span>
            </a>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute left-2 top-2/3 md:top-1/2 transform -translate-y-1/2 z-20">
          <button
            onClick={handlePrev}
            className="backdrop-blur-sm bg-white/40 hover:bg-white/50 text-2xl px-1 font-thin rounded-full focus:outline-none cursor-pointer"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
        </div>
        <div className="absolute top-2/3 md:top-1/2 right-2 transform -translate-y-1/2 z-20">
          <button
            onClick={handleNext}
            className="backdrop-blur-sm bg-white/40 hover:bg-white/50 text-2xl px-1 rounded-full focus:outline-none cursor-pointer"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroes.map((_, index) => (
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
    )
  );
}

export default Hero;
