import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import products from "../products/data/product_data";
import Image from "next/image";

const CartRelatedProducts = () => {
  const dispatch = useDispatch();

  // Function to shuffle and pick random products
  const getRandomProducts = (products, number) => {
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    return shuffledProducts.slice(0, number);
  };

  // Get 5 random products
  const randomProducts = getRandomProducts(products, 5);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-1 md:px-8">
      {randomProducts.map((product) => (
        <div
          key={product.id}
          className="rounded-lg  text-center relative cursor-pointer bg-white shadow-md overflow-hidden transition-transform transform  h-fit"
          onClick={() => (window.location.href = `/shop/${product.id}`)}
        >
          {/* Image */}
          <div className="relative w-full h-48">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg object-top h-fit"
            />
          </div>

          {/* Product Information */}
          <div className="p-2 md:p-4">
            <h3 className="font-medium text-sm md:text-md text-black text-center overflow-hidden text-ellipsis whitespace-nowrap">
              {product.name}
            </h3>

            <div className="flex flex-wrap mb-3 gap-2 items-center justify-center">
              <span className=" text-black md:text-sm text-xs">₹{product.price}</span>
              {product.prevPrice && (
                <span className="text-xs text-sub-color line-through">
                  ₹{product.prevPrice}
                </span>
              )}
             
            </div>

            <button
              className="mt-2 w-full text-black border hover:text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              <i className="ri-shopping-cart-line text-center"></i> <span className="md:block hidden">Add to Cart</span> 
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartRelatedProducts;
