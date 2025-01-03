import React from "react";
import Link from "next/link";
import Image from "next/image";
const SearchSuggestion = ({ suggestions, onSuggestionClick }) => {
  if (suggestions.length === 0) return null; // Do not render if no suggestions

  return (
    <ul className="mt-2">
      {suggestions.map((product) => (
        <li
          key={product.id}
          className="p-2 hover:bg-gray-200 rounded-md cursor-pointer flex items-center gap-2"
          onClick={() => onSuggestionClick(product)}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={240}
            height={240}
            className="w-10 rounded"
          />
          <div className="pl-5">
            <p className="text-sm mb-2">{product.name}</p>
            <p className="text-sm  text-black">
              ${product.price}{" "}
            <span className="text-sub-color text-xs pl-2">{product.prevPrice && <del>${product.prevPrice}</del>}</span>
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
