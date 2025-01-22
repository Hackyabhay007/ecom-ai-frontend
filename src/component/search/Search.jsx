import React, { useState } from "react";
// import products from "../products/data/product_data";
import SearchSuggestion from "./SearchSuggestion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { useRegion } from "../../contexts/RegionContext.jsx";
import useProducts from "../../contexts/ProductContext";

// const dispatch = useDispatch();
// const { region } = useRegion();

// const { products, count, nextPage, status, error } = useSelector(
//   (state) => state.products
// );

// useEffect(()=>{
//   dispatch(fetchProducts({ pageParam: 1, queryParams: {}, region }));
// },[dispatch])

// // console.log(products)

const Search = ({ onClose, isMobile }) => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { products, count, status, loading, errorState } = useProducts();

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);
    setIsTyping(true);

    if (searchQuery) {
      const matches = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchQuery) ||
          product.categories.some((category) =>
            category.toLowerCase().includes(searchQuery)
          ) ||
          product.colors.some((color) =>
            color.toLowerCase().includes(searchQuery)
          ) ||
          product.sizes.some((size) => size.toLowerCase().includes(searchQuery))
        );
      });
      setFilteredProducts(matches);
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
          ? " w-full  bg-white"
          : "fixed top-1/2 left-1/2 w-[90%] md:w-[70%] min-h-[32vh] -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-3xl shadow-2xl shadow-black z-50"
      }`}
    >
      <div className="md:flex hidden justify-between items-center mb-4">
        <i
          className="ri-close-line text-xl cursor-pointer hover:bg-black hover:text-white transition-all rounded-full px-1"
          onClick={onClose}
        ></i>
      </div>
      <div className="flex flex-col relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search..."
          className="border border-gray-300 rounded-lg md:rounded-2xl p-2 py-3 mb-2 pl-10 focus:border-black focus:ring-0 focus:ring-black outline-none transition"
          style={{ color: query ? "black" : "gray" }}
        />
        {!query && (
          <i className="ri-search-line absolute top-2 md:top-3 left-3 text-xl text-gray-400"></i>
        )}
        {isTyping && query && (
          <p className="text-sm text-gray-500">Searching...</p>
        )}
        {!isTyping && query && (
          <p className="text-sm mt-2">
            {filteredProducts.length > 0
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
