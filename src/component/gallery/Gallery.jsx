import React from "react";
import Image from "next/image";

function Gallery() {
  return (
    <div
      className="relative bg-cover md:bg-center min-h-96 h-[500px] flex"
      style={{ backgroundImage: "url('/images/gallery/gallery1.png')" }}
    >
      {/* Right Side Grid with Scrolling Animation */}
      <div className="ml-auto w-full md:w-1/3 h-full overflow-hidden flex justify-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Grid Column 1 - Scroll Up */}
          <div className="space-y-4 animate-scroll-up">
            {[...Array(4)].map((_, i) => (
              <div
                key={`up-${i}`}
                className="bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg"
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

          {/* Grid Column 2 - Scroll Down (Hidden on Small Screens) */}
          <div className="space-y-4 animate-scroll-down hidden md:block">
            {[...Array(4)].map((_, i) => (
              <div
                key={`down-${i}`}
                className="bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg"
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
    </div>
  );
}

export default Gallery;
