import React from 'react';
import Image from 'next/image';

function Gallery() {
  return (
    <div 
      className="relative bg-cover md:bg-center h-96 flex" 
      style={{ backgroundImage: "url('/images/gallery/gallery1.png')" }}
    >
      {/* Right Side Grid */}
      <div className="ml-auto w-1/2 md:w-1/3 overflow-y-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div 
              key={i} 
              className="bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={`/images/gallery/gallery${i + 2}.png`}
                alt={`Gallery ${i + 2}`}
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
