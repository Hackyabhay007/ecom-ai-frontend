// src/components/BestSeller.js
import React from 'react';
import BestSellerCard from './BestSellerCard';

const dummyData = [
  {
    image: '/images/bestseller/best1.png',
    rating: '4.5',
    price: '19.99',
    prevPrice: '39.99',
    discount: '20'
  },
  {
    image: '/images/bestseller/best2.png',
    rating: '4.0',
    price: '24.99',
    prevPrice: '49.99',
    discount: '50'
  },
  {
    image: '/images/bestseller/best3.png',
    rating: '4.7',
    price: '29.99',
    prevPrice: '59.99',
    discount: '45'
  },
  {
    image: '/images/bestseller/best4.png',
    rating: '4.3',
    price: '21.99',
    prevPrice: '44.99',
    discount: '20'
  }
];

function BestSeller() {
  return (
    <div className="h-fit p-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 flex gap-5 flex-col justify-center">
          <h1 className="text-theme-blue text-center md:text-start font-bold text-3xl md:text-7xl mb-4">Best Seller Products</h1>
          <p className="text-sm text-sub-color mb-4">
            "Fashion Fads May come and go, but my style is eternal.
            Your Fashion always reflects who you really are.
            Fashion is always Right, and I am living proof."
          </p>
          <button className="bg-white border border-black w-40 rounded-lg p-2 hover:bg-theme-blue hover:text-white transition duration-200 ease-in-out">
            Shop Now
          </button>
        </div>
        <div className="md:w-2/3  flex overflow-x-scroll space-x-4 scrollbar-custom">
          <div className="flex space-x-4 w-full" style={{ minWidth: '100%' }}>
            {dummyData.map((item, index) => (
              <div key={index} className="flex-none w-full h-full md:w-1/2 md:px-4">
                <BestSellerCard
                  image={item.image}
                  rating={item.rating}
                  price={item.price}
                  prevPrice={item.prevPrice}
                  discount={item.discount}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestSeller;
