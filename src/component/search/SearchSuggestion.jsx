import React from "react";
import Image from "next/image";

const SearchSuggestion = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {suggestions.map((product) => (
        <div
          key={product.id}
          onClick={() => onSuggestionClick(product)}
          className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 group"
        >
          <div className="aspect-square w-full relative mb-2 overflow-hidden rounded-lg">
            <Image
              src={product.thumbnail}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="transform group-hover:scale-105 transition-transform duration-300"
            />
            {product.images?.[1]?.url && (
              <Image
                src={product.images[1].url}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            )}
            {(product.discount > 0 || product.isNew) && (
              <span
                className={`${
                  product.discount > 0 && product.isNew
                    ? "bg-[#FF5733]"
                    : product.discount > 0
                    ? "bg-[#DB4444]"
                    : "bg-[#D2EF9A]"
                } text-${product.isNew && !product.discount ? "black" : "white"} font-bold text-xs px-3 py-1 absolute top-2 left-2 rounded-full`}
              >
                {product.discount > 0 && product.isNew
                  ? "New & Best Price!"
                  : product.discount > 0
                  ? "SALE"
                  : "NEW"}
              </span>
            )}
          </div>
          <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">
            {product.title}
          </h3>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            {product.discountedPrice ? (
              <>
                <span className="text-sm md:text-base font-medium">
                  {product.discountedPrice}
                </span>
                <span className="text-xs md:text-sm text-gray-500 line-through">
                  {product.originalPrice}
                </span>
                {product.discount > 0 && (
                  <span className="text-xs bg-[#D2EF9A] px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm md:text-base font-medium">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestion;
