import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const ProductCard = ({ product, layout }) => {
  const router = useRouter();

  const {
    id,
    name,
    price,
    prevPrice,
    discount,
    image,
    tags,
    description,
  } = product;

  const getTagColor = (tag) => {
    if (tag === "SALE") return "bg-[#DB4444] text-white font-bold";
    if (tag === "NEW") return "bg-[#D2EF9A]";
    return "bg-gray-300";
  };

  return (
    <div
      className={`rounded-lg text-center relative text-cream ${
        layout === "list" ? "flex" : ""
      }`}
      onClick={() => router.push(`/shop/${id}`)} // Navigate to product page
    >
      {/* Image */}
      <div
        className={`relative ${
          layout === "list" ? "md:w-1/4 w-1/2" : "w-full"
        } h-96`}
      >
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${getTagColor(
              tag
            )} text-black text-xs px-2 py-1 absolute top-2 left-2 rounded-full`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Product Information */}
      <div
        className={`mt-4  ${
          layout === "list"
            ? "md:w-3/4 w-1/2 pl-10 flex flex-col justify-center items-start"
            : ""
        }`}
      >
        <h3 className="mb-2 font-medium text-xl text-cream text-left">{name}</h3>
        <div className="flex mb-5 gap-3 items-center">
          <span className="text-lg">₹{price}</span>
          <span className="text-sm text-sub-color line-through">₹{prevPrice}</span>
          <span className="text-cream bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs">
            - {discount}% off
          </span>
        </div>
        {layout === "list" && <p className="text-sm text-sub-color mb-2">{description}</p>}
        {layout === "list" && (
          <button className="mt-4 bg-white border border-cream rounded-full text-black py-1 px-4 hover:bg-cream hover:text-white transition-all ease-in-out">
            Quick Shop
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
