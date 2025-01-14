import React from 'react';
import Image from 'next/image';

function BestSellerCard({ image, rating, price, prevPrice, discount ,title }) {
  return (
    <div className="bg-white border-2 border-theme-blue overflow-hidden rounded-lg shadow-lg my-5 flex flex-col">
      <Image
        src={image}
        alt="Best Seller"
        width={384} // Assuming a width of 384px for better control
        height={384} // Assuming a height of 384px for better control
        className="w-full h-96 object-cover mb-4"
      />
      <div className="flex flex-col p-4">
        <h2 className="font-bold">Clothing for men</h2>
        <span className="text-yellow-600 font-semibold mr-2">{rating} ★</span>
        <div className="flex flex-wrap gap-5 items-center">
          <span className="font-bold text-lg">₹{price}</span>
          <span className="text-sub-color line-through">₹{prevPrice}</span>
          <span className="text-white bg-theme-blue rounded-full px-2 text-sm">- {discount}% off</span>
        </div>
      </div>
    </div>
  );
}

export default BestSellerCard;
