import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  updateLineItem,
  updateCart,
  appendToCart,
} from "@lib/data/cart";
import products from "../products/data/product_data";
import Image from "next/image";
import { selectInterestedProducts } from "@/redux/slices/intrestedSlice";
import { useRegion } from "@/contexts/RegionContext";

const CartRelatedProducts = (cart) => {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState();
  const region = useRegion();

  // Function to shuffle and pick random products
  const getRandomProducts = (products, number) => {
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    return shuffledProducts.slice(0, number);
  };

  const interestedProducts = useSelector((state) => state.interestedProducts);

  console.log(interestedProducts, "interestedProducts");

  // Get 5 random products
  const randomProducts = getRandomProducts(products, 5);

  const handleAddToCart = async (id) => {
    process.env.NEXT_PUBLIC_REVALIDATE_SECRET;

    await addToCart(
      {
        variantId: id,
        quantity: 1,
        region: region,
        Updater: updateCart,
      },
      process.env.NEXT_PUBLIC_REVALIDATE_SECRET
    );

    // await addToCart({
    //   variantId: selectedVariant.id,
    //   quantity: 1,
    //   region: region,
    //   Updater: updateCart,

    // } , process.env.NEXT_PUBLIC_REVALIDATE_SECRET );

    // setIsAdding(false)
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-1 md:px-8">
      {interestedProducts &&
        interestedProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-lg text-center relative cursor-pointer bg-white shadow-md overflow-hidden transition-transform transform h-fit"
            onClick={() => (window.location.href = `/shop/${product.id}`)}
          >
            {/* Image */}
            <div className="relative w-full h-48">
              <Image
                src={product.thumbnail}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg object-top h-fit"
              />
            </div>

            {/* Product Information */}
            <div className="p-2 md:p-4">
              <h3 className="font-medium text-sm md:text-md text-black text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {product.title}
              </h3>

              <div className="flex flex-wrap mb-3 gap-2 items-center justify-center">
                <span className="text-black md:text-sm text-xs">
                  ₹
                  {isNaN(product.discountedamount)
                    ? product.price
                    : product.discountedamount}
                </span>
                {product.discount && (
                  <span className="text-xs text-sub-color line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>

              <button
                className="mt-2 w-full text-black border hover:text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product.selectedVariant);
                }}
              >
                <i className="ri-shopping-cart-line text-center"></i>
                <span className="md:block hidden">Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CartRelatedProducts;
