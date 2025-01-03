import React from "react";
import Image from "next/image";

const galleryData = [
  {
    type: "image",
    src: "/images/gallery/galleryA1.png",
    alt: "Gallery A1",
    title: "Trending Products",
    buttonText: "View All",
  },
  {
    type: "video",
    src: "/images/gallery/video.mp4",
    alt: "Gallery Video",
    title: "Gen Z winter collection",
    buttonText: "View All",
  },
];

function Gallery2() {
  // Select the item you want to display based on the condition
  const selectedItem = galleryData.find((item) => item.type === "video"); // Change to "image" for the image.

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[80%] md:h-96">
      {/* Image 1 */}
      {selectedItem && (
        <div className="relative w-full h-[40%] md:h-full md:w-1/2 group">
          {selectedItem.type === "image" ? (
            <Image
              src={selectedItem.src}
              alt={selectedItem.alt}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={selectedItem.src}
              muted
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-500">
            <h2 className="text-white text-4xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {selectedItem.title}
            </h2>
            <button className="text-black bg-white rounded-lg text-lg shadow-lg py-2 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {selectedItem.buttonText}
            </button>
          </div>
        </div>
      )}

      {/* Black Strip with Scrolling Text */}
      <div className="bg-black h-8 pt-1 text-white text-sm flex overflow-hidden md:flex-col md:h-full gap-11 w-full md:w-10 items-center justify-center md:writing-mode-vertical px-2">
        <div className="gap-4 md:gap-0 flex flex-row md:flex-col h-fit animate-scroll-left-gallery md:animate-scroll-up-gallery md:space-y-10">
          {Array.from({ length: 20 }, (_, i) => (
            <p
              key={`original-${i}`}
              className="md:mb-0 rotate-0 md:rotate-90 whitespace-nowrap"
            >
              NEW
            </p>
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <p
              key={`duplicate-${i}`}
              className="md:mb-0 rotate-0 md:rotate-90 whitespace-nowrap"
            >
              NEW
            </p>
          ))}
        </div>
      </div>

      {/* Image 2 */}
      <div className="relative w-full h-[40%] md:h-full md:w-1/2 group">
        <Image
          src="/images/gallery/galleryA2.png"
          alt="Gallery A2"
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-500">
          <h2 className="text-white text-4xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Oversize T-Shirt
          </h2>
          <button className="bg-white text-black text-lg rounded-lg shadow-lg py-2 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gallery2;
