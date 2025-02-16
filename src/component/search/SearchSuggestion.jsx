import React from "react";
import Image from "next/image";

const SearchSuggestion = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions.length) return null;

  console.log("This is the suggeestion value of the Search Suggestion.jsx compoentn", suggestions)

  const formatProductData = (product) => {
    const variant = product.variants[0] || {};
    const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: product.id,
      title: product.name,
      thumbnail: variant.images?.[0]?.url || '/placeholder-image.jpg',
      images: variant.images || [],
      originalPrice: variant.price,
      discountedPrice: variant.salePrice,
      discount: variant.discount,
      isNew: isNew
    };
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {suggestions.map((product) => {
        const formattedProduct = formatProductData(product);
        
        return (
          <div
            key={formattedProduct.id}
            onClick={() => onSuggestionClick(product)}
            className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 group"
          >
            <div className="aspect-square w-full relative mb-2 overflow-hidden rounded-lg">
              <Image
                src={formattedProduct.thumbnail}
                alt={formattedProduct.title}
                layout="fill"
                objectFit="cover"
                className="transform group-hover:scale-105 transition-transform duration-300"
              />
              {formattedProduct.images?.[1]?.url && (
                <Image
                  src={formattedProduct.images[1].url}
                  alt={formattedProduct.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              )}
              {(formattedProduct.discount > 0 || formattedProduct.isNew) && (
                <span className={`${
                  formattedProduct.discount > 0 && formattedProduct.isNew
                    ? "bg-[#FF5733]"
                    : formattedProduct.discount > 0
                    ? "bg-[#DB4444]"
                    : "bg-[#D2EF9A]"
                } text-${formattedProduct.isNew && !formattedProduct.discount ? "black" : "white"} font-bold text-xs px-3 py-1 absolute top-2 left-2 rounded-full`}
                >
                  {formattedProduct.discount > 0 && formattedProduct.isNew
                    ? "New & Best Price!"
                    : formattedProduct.discount > 0
                    ? "SALE"
                    : "NEW"}
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">
              {formattedProduct.title}
            </h3>
            <div className="flex flex-wrap gap-2 items-center mt-1">
              {formattedProduct.discountedPrice ? (
                <>
                  <span className="text-sm md:text-base font-medium">
                    {formattedProduct.discountedPrice}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 line-through">
                    {formattedProduct.originalPrice}
                  </span>
                  {formattedProduct.discount > 0 && (
                    <span className="text-xs bg-[#D2EF9A] px-2 py-1 rounded-full">
                      -{formattedProduct.discount}%
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm md:text-base font-medium">
                  {formattedProduct.originalPrice}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchSuggestion;
