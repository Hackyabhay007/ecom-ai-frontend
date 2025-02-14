import React from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { addToCart } from "../../../redux/slices/cartSlice";
import { formatPriceToINR } from "../../../utils/currencyUtils";

const CartRelatedProducts = ({ items, totalAmount }) => {
  const dispatch = useDispatch();
  
  // Get unique products from cart items to avoid suggesting items already in cart
  const cartProductIds = items.map(item => item.productId);

  const handleAddToCart = async (product, variantId) => {
    try {
      await dispatch(addToCart({
        productId: product.id,
        variantId: variantId,
        quantity: 1
      })).unwrap();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  // Calculate suggested products - you might want to replace this with your actual related products logic
  const suggestedProducts = items
    .filter(item => item.product.variants?.length > 0) // Only products with variants
    .map(item => ({
      id: item.product.id,
      title: item.product.name,
      price: item.price,
      thumbnail: item.product.images?.[0]?.url || '/placeholder-image.jpg',
      selectedVariant: item.product.variants[0]?.id,
      variants: item.product.variants
    }))
    .slice(0, 5); // Limit to 5 suggestions

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-1 md:px-8">
      {suggestedProducts.map((product) => (
        <div
          key={product.id}
          className="rounded-lg text-center relative cursor-pointer bg-white shadow-md overflow-hidden transition-transform transform h-fit"
          onClick={() => window.location.href = `/shop/${product.id}`}
        >
          <div className="relative w-full h-48">
            <Image
              src={product.thumbnail}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg object-top h-fit"
            />
          </div>

          <div className="p-2 md:p-4">
            <h3 className="font-medium text-sm md:text-md text-black text-center overflow-hidden text-ellipsis whitespace-nowrap">
              {product.title}
            </h3>

            <div className="flex flex-wrap mb-3 gap-2 items-center justify-center">
              <span className="text-black md:text-sm text-xs">
                {formatPriceToINR(product.price)}
              </span>
            </div>

            <button
              className="mt-2 w-full text-black border hover:text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product, product.selectedVariant);
              }}
              disabled={cartProductIds.includes(product.id)}
            >
              <i className="ri-shopping-cart-line text-center"></i>
              <span className="md:block hidden">
                {cartProductIds.includes(product.id) ? 'In Cart' : 'Add to Cart'}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartRelatedProducts;
