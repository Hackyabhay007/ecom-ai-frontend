import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  addToWishlist,
  toggleWishlistSidebar,
} from "../../../redux/slices/wishSlice";
import { addToCart } from "../../../redux/slices/cartSlice";
import QuickView from "./product_view/QuickView";

const ProductCard = ({ product, layout }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isWishlistAdded, setIsWishlistAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartAdded, setIsCartAdded] = useState(false);

  const {
    id,
    name,
    price,
    prevPrice,
    discount,
    image,
    tags = [],
    description,
    color = [],
    size = [],
  } = product;

  const handleAddToWishlist = (event) => {
    event.stopPropagation(); // Prevent card click navigation
    dispatch(addToWishlist(product));
    dispatch(toggleWishlistSidebar());
    setIsWishlistAdded(true); // Mark as added to wishlist
  };

  const handleAddToCart = (event) => {
    event.stopPropagation(); // Prevent card click navigation

    const defaultColor = color[0] || null;
    const defaultSize = size[0] || null;

    dispatch(
      addToCart({
        id,
        name,
        price,
        quantity: 1,
        image,
        color: defaultColor,
        size: defaultSize,
      })
    );

    setIsCartAdded(true); // Show added to cart notification
    setTimeout(() => setIsCartAdded(false), 3000); // Remove notification after 3 seconds
  };

  const getTagColor = (tag) => {
    if (tag === "SALE") return "bg-[#DB4444] text-white font-bold";
    if (tag === "NEW") return "bg-[#D2EF9A] font-bold";
    return "bg-gray-300";
  };

  return (
    <>
      <div
        className={`relative rounded-lg text-center cursor-pointer text-cream ${
          layout === "list" ? "flex" : ""
        }`}
        onClick={() => router.push(`/shop/${id}`)}
      >
        {/* Image Section */}
        <div
          className={`relative ${
            layout === "list" ? "lg:w-1/4 w-1/2" : "w-full"
          } h-64 md:h-96 group`}
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
              )} text-black text-xs px-3 py-1 absolute top-2 left-2 rounded-full`}
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

          {/* Shopping Bag Icon */}
          <div
            className="absolute bottom-4 right-[10%] md:right-[20%] flex items-center justify-center w-10 h-9 md:w-20 md:h-9 bg-white text-black hover:bg-black hover:text-white  rounded-full transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            onClick={handleAddToCart}
          >
            <i className="ri-shopping-bag-2-line text-sm md:text-lg"></i>
          </div>

          {/* Quick View Button (For Non-List Layout - Image Hover) */}
          {layout !== "list" && (
            <div
              className="absolute bottom-4 left-[30%] md:left-1/4 transform -translate-x-1/2  translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click navigation
                setIsQuickViewOpen(true);
              }}
            >
              <button className="md:px-4 px-2 py-2 bg-white text-black rounded-full text-xs md:text-sm hover:bg-black hover:text-white transition-all duration-150 ease-in-out">
                Quick View
              </button>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div
          className={`mt-4 ${
            layout === "list"
              ? "md:w-3/4 w-1/2 pl-10 flex flex-col justify-center items-start"
              : ""
          }`}
        >
          <h3 className="mb-2 text-wrap font-medium text-sm md:text-md text-cream text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </h3>

          <div className="flex flex-wrap mb-5 gap-2 md:gap-3 items-center">
            <span className="text-sm md:text-md">₹{price}</span>
            <span className="md:text-sm text-xs text-sub-color line-through">
              ₹{prevPrice}
            </span>
            <span className="text-black bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs">
              - {discount}% off
            </span>
          </div>
          {layout === "list" && (
            <>
              <p className="md:text-sm text-xs text-sub-color mb-2">
                {description}
              </p>
              {/* Quick View Button (For List Layout - Below Description) */}
              <div className="mt-2">
                <button
                  className="px-4 py-2 bg-white text-black rounded-full border border-black text-sm hover:bg-black hover:text-white transition-all duration-150 ease-in-out"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click navigation
                    setIsQuickViewOpen(true);
                  }}
                >
                  Quick View
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickView
          product={{
            ...product,
            size,
            color,
          }}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}

      {/* Added to Cart Notification */}
      {isCartAdded && (
        <div className="fixed top-20 right-9 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Added to Cart
        </div>
      )}
    </>
  );
};

export default ProductCard;
