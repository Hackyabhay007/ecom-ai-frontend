import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ImageCarousel = ({ mainImage, additionalImages }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = imageContainerRef.current;
      if (container) {
        const imageWidth = container.offsetWidth; // Calculate the width of one image
        const index = Math.round(container.scrollLeft / imageWidth);
        setActiveIndex(index);
      }
    };

    const container = imageContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
   mainImage && additionalImages &&  <div className="flex flex-col md:flex-1 md:mr-4 relative">
   {/* Desktop View (Full viewport height, one image at a time) */}
    <div className="hidden md:block">
     {[mainImage, ...additionalImages].map((image, index) => (
       <div
         key={index}
         className="relative w-full overflow-hidden mb-2 md:mb-0"
         style={{ height: "100vh" }} // Full viewport height for each image
       >
         <Image
           src={image}
           alt={`Product Image ${index + 1}`}
           layout="fill"
           objectFit="cover" // Ensures the image covers the container
         />
       </div>
     ))}
   </div> 

      {/* Mobile View (Scrollable carousel with index and smaller images) */}
      <div
        className="md:hidden overflow-x-auto flex no-scrollbar snap-x snap-mandatory"
        ref={imageContainerRef}
      >
        <div className="flex w-full">
          {[mainImage, ...additionalImages].map((Image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full relative snap-center"
              style={{ height: "70vh" }} // Adjust to a smaller size, e.g., 50% of viewport height
            >
              <Image
                src={Image}
                alt={`Product Image ${index + 1}`}
                layout="fill"
                objectFit="cover" // Ensures the image covers the container
                className="bg-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Index Display */}
      <div
        className={`${
          isScrollingX ? "fixed top-2/3 left-5" : "absolute "
        } bg-white text-xs text-gray-800 py-1 px-3 rounded-full shadow-lg z-10 md:hidden`}
      >
        {`${activeIndex + 1} / ${[mainImage, ...additionalImages].length}`}
      </div>
    </div>
  );
};

export default ImageCarousel;
