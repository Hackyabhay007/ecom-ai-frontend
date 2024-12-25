import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const collectionData = [
  { image: '/images/collection/collection1.png', alt: 'Collection 1' },
  { image: '/images/collection/collection2.png', alt: 'Collection 2' },
  { image: '/images/collection/collection3.png', alt: 'Collection 3' },
  { image: '/images/collection/collection1.png', alt: 'Collection 4' },
  { image: '/images/collection/collection2.png', alt: 'Collection 5' },
];

function Collection() {
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    // Set the initial centered index
    setCurrentIndex(1); // Center the second image initially
  }, []);

  const handleScroll = (event) => {
    const container = event.currentTarget;
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;

    const index = Math.round(scrollLeft / (containerWidth / 3)); // 3 images visible
    setCurrentIndex(index);
  };

  return (
    <div className="bg-zinc-950 min-h-[80%] py-10">
      {/* Top Scrolling Text */}
      <div className="overflow-hidden border-y py-2 mb-6">
        <div className="flex gap-8 md:gap-24 animate-scroll-left whitespace-nowrap">
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="mx-4 text-white">Sustainable</span>
              <span className="mx-4 text-white">Affordable</span>
              <span className="mx-4 text-white">Luxurious</span>
              <span className="mx-4 text-white">Trendy</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-center text-white text-4xl md:text-6xl my-14 font-bold">New Collection</h2>

      {/* Horizontal Scrollable Images */}
      <div className="relative overflow-hidden px-6 md:px-14">
        <div
          className="flex gap-6 h-[210px] md:gap-20 md:h-[600px] overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth items-center"
          onScroll={handleScroll}
        >
          {collectionData.map((item, index) => (
            <div
              key={index}
              className={`snap-center flex-shrink-0 w-[calc(100%/3)] max-w-[calc(100%/3)] transition-transform duration-300 ease-in-out ${
                index === currentIndex+1 ? 'scale-125 md:scale-110 z-10' : 'scale-100 '
              }`}
              style={{
                transformOrigin: 'center center',
              }}
            >
              <div className="border border-white rounded-lg p-2 overflow-visible">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={500}
                  height={500}
                  className="h-[150px] md:h-[500px] rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-6">
        <button className="backdrop-blur-sm bg-white/10 text-white border px-10 py-1 rounded mt-10 transition hover:bg-white/20">
          View All
        </button>
      </div>
    </div>
  );
}

export default Collection;
