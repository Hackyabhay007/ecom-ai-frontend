import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsBySearch } from "../../../redux/slices/shopSlice";
import SearchSuggestion from "./SearchSuggestion";
import { useRegion } from "../../contexts/RegionContext.jsx";
import medusaClient from "../../lib/medusa-client";
import LineLoader from "../loader/LineLoader";

const Search = ({ onClose, isMobile }) => {
  const dispatch = useDispatch();
  const { products, searchLoading } = useSelector(state => state.shop); // Add searchLoading
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { region } = useRegion();

  // Debounce search to prevent too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Handle search with debounce
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length >= 2) { // Only search if query is 2 or more characters
        try {
          await dispatch(fetchProductsBySearch({
            searchQuery,
            filters: { limit: 10, page: 1 }
          })).unwrap();
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setFilteredProducts([]);
      }
      setIsTyping(false);
    }, 500),
    [dispatch]
  );

  // Update filteredProducts when products change
  useEffect(() => {
    if (products?.length > 0) {
      console.log('Updating filtered products:', products);
      setFilteredProducts(products);
    }
  }, [products]);

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);
    setIsTyping(true);
    debouncedSearch(searchQuery);
  };

  return (
    <div
      className={`${isMobile
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
            {isTyping || searchLoading ? "Searching..." : 
             filteredProducts.length > 0 ? `${filteredProducts.length} products found` : 
             "No products found"}
          </p>
        )}
      </div>

      <div className="max-h-[40vh] overflow-y-auto scrollbar-custom">
        <SearchSuggestion
          suggestions={filteredProducts}
          onSuggestionClick={(product) => {
            window.location.href = `/shop/product/${product.id}`;
          }}
        />
      </div>
    </div>
  );
};

export default Search;
