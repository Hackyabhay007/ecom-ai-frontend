import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery_Two } from '../../../redux/slices/homePageSlice'; // Import the fetchHeroSection action creator
import Link from "next/link";

// const images = [
//   "/images/gallery/gallery1.png",
//   "/images/gallery/gallery2.png",
//   "/images/gallery/gallery3.png",
//   "/images/gallery/gallery4.png",
//   "/images/gallery/gallery5.png",
// ];

const ImageStackSlider = ({catalogdata}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);


  const dispatch = useDispatch();
  const { galleryTwoSection, loading, error } = useSelector((state) => state?.homePage); // Correct selector

  useEffect(() => {
    dispatch(fetchGallery_Two());
  }, [dispatch]);

  // Log the hero section data from state
  useEffect(() => {
    if (galleryTwoSection?.section_data?.carousel.length > 0) {
      const carouselData = galleryTwoSection?.section_data?.carousel.map((item) => {
        return item.image;
        
        // {
        //   id: item.id,
        //   src: item.image,
        //   alt: item.alt,
        //   link: item.link,
        //   title: item.title,
        //   buttonText: item.buttonText,
        // };
      });
      setImages(carouselData);

      console.log("This is the Carousel Data of the Image Stack Slider Data", carouselData);
      // console.log("This is the Carousel Array Data of the  Image Stack Slider Data", images);
    }
  }, [galleryTwoSection]);

  

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setProgress(0); // Reset progress when next image is shown
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    setProgress(0); // Reset progress when previous image is shown
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev); // Toggle play/pause state
  };

  // Auto slide functionality
  useEffect(() => {
    if (isPlaying && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => prev + 0.33); // Progress 0.33 every 30ms to complete in 3 seconds
      }, 4); // Speed of progress bar update (100% in 3 seconds)
      return () => clearInterval(interval); // Cleanup on component unmount or play/pause change
    }
  }, [isPlaying, progress]);

  useEffect(() => {
    if (progress >= 100) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Change image after progress reaches 100
      setProgress(0); // Reset progress when image changes
    }
  }, [progress]);

  return (
    <div
      className="relative bg-gradient-to-br from-pink-200 via-gray-500 to-white w-full h-96 md:h-full md:w-full overflow-hidden"
      style={{
        backgroundImage: "url('/images/gallery/gallerybg.jpg')", // Set the background image
        backgroundSize: "cover", // Ensure the image covers the entire background
        backgroundPosition: "center", // Center the background image
      }}
    >
      {/* Stacked Images */}
      <div className="relative h-full flex items-center justify-center">
        {images?.map((data, index) => {
          // Calculate position for stacking
          const position = (index - currentIndex + images.length) % images.length;
          const zIndex = images.length - position;
          const transform =
            position === 0
              ? "translateY(0) scale(0.95)" // Scale the top image slightly
              : `translateY(${5 * position}%) translateX(${50 * position}px) scale(0.85)`;

          return (
            <a href={data.link}
              key={index}
              className={`absolute w-[90%] md:w-[70%] h-[90%] transition-all duration-500 ease-in-out ${position === 0 ? "shadow-xl" : "shadow-md"
                }`}
              style={{
                zIndex,
                transform,
                opacity: position === 0 ? 1 : 0.7,
              }}
            >
              <Image
                src={data}
                alt={`Gallery Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                
                className="object-top"
              />
            </a>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-[5%] md:left-[17%] flex items-center z-50">
        <button
          onClick={handlePrev}
          className="bg-white rounded-full shadow-lg text-black hover:shadow-xl transition-transform duration-200 hover:scale-110"
        >
          <i className="ri-arrow-left-s-line text-lg px-1"></i>
        </button>
      </div>
      <div className="absolute inset-y-0 right-[5%] md:right-[17%] flex items-center z-50">
        <button
          onClick={handleNext}
          className="bg-white rounded-full shadow-lg text-black hover:shadow-xl transition-transform duration-200 hover:scale-110"
        >
          <i className="ri-arrow-right-s-line text-lg px-1"></i>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-4 left-[5%] md:left-[17%] w-[90%] md:w-[65%] rounded-full h-[2px] bg-gray-500 z-10">
        <div
          className="h-[2px] rounded-full bg-white"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Play/Pause Button */}
      <div
        className="absolute top-[11%] right-[10%] md:right-[18%] font-thin px-1 text-gray-100 cursor-pointer z-50"
        onClick={togglePlayPause}
      >
        <i
          className={`ri-${isPlaying ? "pause-large-line" : "play-large-line"} text-xl  border-gray-100 font-thin border-2 p-1 rounded-full`}
        ></i>
      </div>
    </div>
  );
};

export default ImageStackSlider;
