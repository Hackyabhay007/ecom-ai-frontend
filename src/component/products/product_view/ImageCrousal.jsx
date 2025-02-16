import React, { useState } from 'react';
import Image from 'next/image';

const ImageCarousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square max-h-[600px] bg-gray-200 flex items-center justify-center">
        <p>No images available</p>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full">
      {/* Main Image Container */}
      <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-h-[600px] bg-gray-50">
        <div className="absolute inset-0">
          <Image
            src={images[currentImageIndex].url}
            alt={images[currentImageIndex].alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            priority
            className="object-contain"
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Thumbnails Container */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border-2 transition-all ${
              currentImageIndex === index
                ? 'border-black opacity-100'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="96px"
              className="object-cover rounded"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
