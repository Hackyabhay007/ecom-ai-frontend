import React, { useEffect, useState } from "react";
import SearchSuggestion from "./SearchSuggestion";
import { useRegion } from "../../contexts/RegionContext.jsx";
import medusaClient from "../../lib/medusa-client";
import LineLoader from "../loader/LineLoader";

const Search = ({ onClose, isMobile }) => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { region } = useRegion();

  const convertToDecimal = (amount) => {
    return Math.floor(amount) / 100;
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: region.currency_code,
    }).format(convertToDecimal(amount));
  };

  const handleSearch = async (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);
    setIsTyping(true);

    if (searchQuery) {
      try {
        const { products } = await medusaClient.products.list({
          q: searchQuery,
          region_id: region.id
        });

        // Add formatted prices to products
        const productsWithPrices = products.map(product => ({
          ...product,
          formattedPrices: product.variants.map(variant => 
            formatPrice(variant.calculated_price_incl_tax)
          )
        }));

        setFilteredProducts(productsWithPrices || []);
      } catch (error) {
        console.error("Search error:", error);
        setFilteredProducts([]);
      }
    } else {
      setFilteredProducts([]);
    }

    setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  return (
    <div
      className={`${
        isMobile
          ? "w-full bg-white relative"
          : "fixed top-1/2 left-1/2 w-[90%] md:w-[70%] min-h-[32vh] -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-3xl shadow-2xl shadow-black z-50"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1"></div>
        <i
          className="ri-close-line text-xl cursor-pointer hover:bg-black hover:text-white transition-all rounded-full px-1"
          onClick={onClose}
        ></i>
      </div>
      
      <div className="flex flex-col relative">
        {isTyping && <LineLoader />}
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search..."
          className="border border-gray-300 rounded-lg md:rounded-2xl p-2 py-3 mb-2 pl-10 focus:border-black focus:ring-0 focus:ring-black outline-none transition-all duration-300"
          style={{ color: query ? "black" : "gray" }}
        />
        {!query && (
          <i className="ri-search-line absolute top-2 md:top-3 left-3 text-xl text-gray-400"></i>
        )}
        {query && (
          <p className="text-sm mt-2 transition-opacity duration-300">
            {isTyping ? "Searching..." : 
              filteredProducts.length > 0
                ? `${filteredProducts.length} products found`
                : "No products found"}
          </p>
        )}
      </div>

      <div className="max-h-[40vh] overflow-y-auto scrollbar-custom">
        <SearchSuggestion
          suggestions={filteredProducts}
          onSuggestionClick={(product) => {
            window.location.href = `/shop/${product.id}`;
          }}
        />
      </div>
    </div>
  );
};

export default Search;
