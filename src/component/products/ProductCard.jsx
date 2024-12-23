import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  addToWishlist,
  toggleWishlistSidebar,
} from "../../../redux/slices/wishSlice";

const ProductCard = ({ product, layout }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isWishlistAdded, setIsWishlistAdded] = useState(false);

  const { id, name, price, prevPrice, discount, image, tags, description } =
    product;

  const handleAddToWishlist = (event) => {
    event.stopPropagation(); // Prevent card click navigation
    dispatch(addToWishlist(product));
    dispatch(toggleWishlistSidebar());
    setIsWishlistAdded(true); // Mark as added to wishlist
  };

  const getTagColor = (tag) => {
    if (tag === "SALE") return "bg-[#DB4444] text-white font-bold";
    if (tag === "NEW") return "bg-[#D2EF9A]";
    return "bg-gray-300";
  };

  return (
    <div
      className={`relative rounded-lg text-center cursor-pointer text-cream ${
        layout === "list" ? "flex" : ""
      }`}
      onClick={() => router.push(`/shop/${id}`)} // Navigate to product page
    >
      {/* Image Section */}
      <div
        className={`relative ${
          layout === "list" ? "md:w-1/4 w-1/2" : "w-full"
        } h-96 group`}
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

        {/* Heart Icon */}
        <div
          className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-white rounded-full transform translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          onClick={handleAddToWishlist}
        >
          <i
            className={`text-xl ${
              isWishlistAdded
                ? "text-black ri-heart-fill"
                : "text-black ri-heart-line"
            }`}
          ></i>
        </div>
      </div>

      {/* Product Information */}
      <div
        className={`mt-4 ${
          layout === "list"
            ? "md:w-3/4 w-1/2 pl-10 flex flex-col justify-center items-start"
            : ""
        }`}
      >
        <h3 className="mb-2 font-medium text-xl text-cream text-left">
          {name}
        </h3>
        <div className="flex mb-5 gap-3 items-center">
          <span className="text-lg">₹{price}</span>
          <span className="text-sm text-sub-color line-through">
            ₹{prevPrice}
          </span>
          <span className="text-cream bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs">
            - {discount}% off
          </span>
        </div>
        {layout === "list" && (
          <p className="text-sm text-sub-color mb-2">{description}</p>
        )}
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
