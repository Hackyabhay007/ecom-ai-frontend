import React from 'react';
import Image from 'next/image';

function Gallery2() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-96">
      {/* Image 1 */}
      <Image
        src="/images/gallery/galleryA1.png"
        alt="Gallery A1"
        width={500}
        height={500}
        className="w-full h-1/2 md:h-full md:w-1/2 object-cover"
      />

      {/* Black Strip with Text */}
      <div className="bg-black text-white text-sm flex md:flex-col md:h-full gap-11 w-full md:w-10 items-center justify-center md:writing-mode-vertical px-2">
        {Array.from({ length: 5 }, (_, i) => (
          <p key={i} className="mb-2 md:mb-0 md:rotate-90">NEW</p>
        ))}
      </div>

      {/* Image 2 */}
      <Image
        src="/images/gallery/galleryA2.png"
        alt="Gallery A2"
        width={500}
        height={500}
        className="w-full h-1/2 md:h-full md:w-1/2 object-cover"
      />
    </div>
  );
}

export default Gallery2;
