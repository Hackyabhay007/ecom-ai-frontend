import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import products from "../products/data/product_data";
import Image from "next/image";
const CartRelatedProducts = () => {
  const dispatch = useDispatch();

  // Function to shuffle and pick random products
  const getRandomProducts = (products, number) => {
    // Shuffle products using Fisher-Yates algorithm
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    return shuffledProducts.slice(0, number);
  };

  // Get 5 random products
  const randomProducts = getRandomProducts(products, 5);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product)); // Dispatch add to cart action
  };

  return (
    <div className="space-y-4 md:px-5">
      {randomProducts.map((product) => (
        <div key={product.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4 w-full">
            {/* Product Image */}
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className="w-16 h-16 rounded-lg object-cover"
            />

            {/* Product Details */}
            <div className="flex flex-col flex-1 space-y-1">
              <h4 className="md:text-md text-sm">{product.name}</h4>
              <div className="flex items-center gap-2">
              <p className="text-black md:text-md text-sm">₹{product.price}</p>
              <p className="text-sub-color line-through text-xs">₹{product.prevPrice}</p>
              </div> 
            </div>

            {/* Add to Cart Button */}
            <button
              className="border rounded border-black px-2 py-1 hover:bg-black hover:text-white transition-all duration-150 ease-in-out"
              onClick={() => handleAddToCart(product)}
            >
              <i class="ri-shopping-cart-line"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartRelatedProducts;
