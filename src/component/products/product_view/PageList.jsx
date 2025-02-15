import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../ProductCard";
import { fetchProductsBySearch } from "../../../../redux/slices/shopSlice";

// Memoize ShimmerProductCard component
const ShimmerProductCard = memo(() => (
  <div className="animate-pulse">
    <div className="relative h-56 md:h-96 bg-gray-200 rounded-lg"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
));

// Memoize ProductCard wrapper 
const MemoizedProductCard = memo(({ product, layout }) => (
  <div className="transition-opacity duration-300 animate-fadeIn">
    <ProductCard 
      product={{
        ...product,
        thumbnail: product.variants?.[0]?.images?.[0]?.url || '',
        images: product.variants?.flatMap(v => v.images || []) || []
      }}
      layout={layout} 
    />
  </div>
));

const ProductList = ({ layout, currentSort }) => {
  const [productsArray, setProductsArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const dispatch = useDispatch();
  const { 
    products, 
    loading, 
    searchLoading,  
    appliedFilters,
    meta,
    isFiltered
  } = useSelector(state => state.shop);

  useEffect(() => {
    setProductsArray(products);
    console.log("This is the Products of the PageList", products);
  }, [products]);

  
  // Add request cancellation reference
  const abortControllerRef = useRef(null);
 
  // Optimize fetch function
  const fetchProducts = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const debounceTimer = setTimeout(() => {
      dispatch(fetchProductsBySearch({
        filters: {
          ...appliedFilters,
          page: currentPage,
          limit: productsPerPage,
          sort: currentSort
        },
        signal: controller.signal
      }));
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [currentPage, currentSort, JSON.stringify(appliedFilters), productsPerPage]);

  // Optimize effects
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [appliedFilters]);

  useEffect(() => {
    const cleanup = fetchProducts();
    return () => cleanup();
  }, [fetchProducts]);

  // console.log("This is the Products of the PageList", products)

  // Handle pagination
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < meta.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(meta.totalPages, currentPage + 2); i++) {
    pageNumbers.push(i);
  }

  // Loading state with fixed height
  if ((loading || searchLoading) && !products.length) {
    return (
      <div className="min-h-[600px]">
        <div className={`grid ${
          layout === "grid"
            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid-cols-1 gap-6"
        }`}>
          {[...Array(6)].map((_, index) => (
            <ShimmerProductCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-fit">
      {/* Products Grid */}
      <div
        className={`grid h-fit ${
          layout === "grid"
            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid-cols-1 gap-6"
        }`}
      >
        {(loading || searchLoading) ? (
          [...Array(6)].map((_, index) => (
            <ShimmerProductCard key={index} />
          ))
        ) : products && products.length > 0 ? (  // Add null check
          products.map((product) => (
            <MemoizedProductCard key={product.id} product={product} layout={layout} />
          ))
        ) : (
          <p className="text-center col-span-full">No products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {products.length > 0 && (
        <div className="text-sm md:text-base flex justify-center mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="md:px-4 py-2 px-3 border md:rounded-sm rounded-none"
          >
            Previous
          </button>

          <div className="flex items-center mx-2">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`md:px-4 py-2 px-3 border md:rounded-sm rounded-none mx-1 ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= meta.totalPages}
            className="md:px-4 py-2 px-3 border md:rounded-sm rounded-none"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
