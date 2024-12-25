import React from "react";
import Image from "next/image";
import Link from "next/link";

const RelatedProducts = ({ currentProduct, allProducts }) => {
  // Filter products by matching categories (excluding the current product)
  const relatedProducts = allProducts.filter(
    (product) =>
      product.id !== currentProduct.id && // Exclude the current product
      product.categories.some((category) =>
        currentProduct.categories.includes(category) // Match categories
      )
  );

  // Limit the number of related products to 4
  const limitedRelatedProducts = relatedProducts.slice(0, 4);

  return (
    <div className="md:mx-5 mx-4 py-5 ">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {limitedRelatedProducts.length > 0 ? (
          limitedRelatedProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg text-center relative text-cream cursor-pointer"
              // Navigate to product page on click
              onClick={() => window.location.href = `/shop/${product.id}`}
            >
              {/* Image */}
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
               
              </div>

              {/* Product Information */}
              <div className="mt-4 px-2">
                <h3 className="mb-1 text-sm md:text-md text-cream text-left">{product.name}</h3>
                <div className="flex mb-5 gap-3 items-center justify-start">
                  <span className="text-sm">₹{product.price}</span>
                  <span className="text-xs text-sub-color line-through">₹{product.prevPrice}</span>
                  <span className="bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs text-black">
                    -{product.discount}% off
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
