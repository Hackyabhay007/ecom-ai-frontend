import React from 'react';
import Image from 'next/image';

function Gallery() {
  return (
    <div 
      className="relative bg-cover md:bg-center min-h-96 h-[500px] flex" 
      style={{ backgroundImage: "url('/images/gallery/gallery1.png')" }}
    >
      {/* Right Side Grid with Scrolling Animation */}
      <div className="ml-auto w-1/2 md:w-1/3 h-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 animate-scroll-up">
          {[...Array(8)].map((_, i) => ( // Increased to 8 items for seamless looping
            <div 
              key={i} 
              className={`bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg ${
                i % 2 === 0 ? 'md:translate-y-0' : 'md:translate-y-10' // Shift first grid item up
              }`}
            >
              <Image
                src={`/images/gallery/gallery${(i % 4) + 2}.png`} // Loop images
                alt={`Gallery ${(i % 4) + 2}`}
                width={176}
                height={176}
                className="object-cover object-top h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
