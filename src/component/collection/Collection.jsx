import React from 'react';
import Image from 'next/image';

const collectionData = [
  {
    image: '/images/collection/collection1.png',
    alt: 'Collection 1',
  },
  {
    image: '/images/collection/collection2.png',
    alt: 'Collection 2',
  },
  {
    image: '/images/collection/collection3.png',
    alt: 'Collection 3',
  },
];

function Collection() {
  return (
    <div className="bg-zinc-950 py-10">
      {/* Top Border */}

      {/* Top Data */}
      <div className="flex flex-wrap gap-4 md:gap-24 py-2 justify-center  mb-6 text-white border-y">
        <span>Sustainable</span>
        <span>Affordable</span>
        <span>Luxurious</span>
        <span>Sustainable</span>
        <span className='hidden md:block'>Affordable</span>
        <span className='hidden md:block'>Luxurious</span>
      </div>

      {/* Heading */}
      <h2 className="text-center text-white text-4xl md:text-6xl my-14 font-bold">New Collection</h2>

      {/* Image Cards */}
      <div className='px-4 md:px-14'>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-20 ">
          {collectionData.map((item, index) => (
            <div 
              key={index} 
              className="border border-white hover:scale-105 hover:shadow-white/40 rounded-lg p-1 md:p-2 overflow-hidden shadow-2xl h-full shadow-white/20 transition-transform duration-300 ease-in-out"
            >
              <Image 
                src={item.image} 
                alt={item.alt} 
                width={500} 
                height={500} 
                className="h-full rounded" 
              />
            </div>
          ))}
        </div>

        {/* Bottom Border */}

        {/* View All Button */}
        <div className="flex justify-center mt-6">
          <button className="backdrop-blur-sm bg-white/10 text-white border px-10 py-1 rounded mt-10 transition hover:bg-white/20">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

export default Collection;
