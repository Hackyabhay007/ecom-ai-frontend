import React from "react";
import Link from "next/link";
const SearchSuggestion = ({ suggestions, onSuggestionClick }) => {
  if (suggestions.length === 0) return null; // Do not render if no suggestions

  return (
    <ul className="mt-2">
      {suggestions.map((product) => (
        <li
          key={product.id}
          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          onClick={() => onSuggestionClick(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-10 h-10 rounded"
          />
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-500">
              ${product.price}{" "}
              {product.prevPrice && <del>${product.prevPrice}</del>}
            </p>
          </div>
        </li>
      ))}
<Link href="/shop">
  <p className="text-sub-color cursor-pointer border-b  hover:border-sub-color w-fit">see all..</p>
</Link>

    </ul>
  );
};

export default SearchSuggestion;
