// components/products/ProductCard.jsx
import React from "react";
import Image from "next/image";

const ProductCard = ({ product }) => {
  const { name, categories, price, prevPrice, discount, image, tags } = product;

  // Determine tag color based on the tag (sale, new, etc.)
  const getTagColor = (tag) => {
    if (tag === "SALE") return "bg-red-500";
    if (tag === "NEW") return "bg-[#D2EF9A]";
    return "bg-gray-300";
  };

  return (
    <div className=" rounded-lg  text-center relative ">
      {/* Image */}
      <div className="relative w-full h-64">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
        {/* Tags on Image */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${getTagColor(tag)} text-black text-xs px-2 py-1 absolute top-2 left-2 rounded-full`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Product Information Below Image */}
      <div className="mt-4 ">
        {/* Product Name */}
        <h3 className="text-sm text-sub-color  mb-2 text-left">{name}</h3>

        {/* Price, Previous Price and Discount */}
        <div className="flex gap-2 items-center">
          <span className=" font-bold">₹{price}</span>
          <span className="text-sm text-sub-color line-through">₹{prevPrice}</span>
          <span className="text-white bg-theme-blue rounded-full p-1 font-thin text-sm">
            -{discount}% off
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
