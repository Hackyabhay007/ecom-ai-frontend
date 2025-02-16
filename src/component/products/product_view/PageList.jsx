import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../ProductCard";
import { fetchProductsBySearch, setPage } from "../../../../redux/slices/shopSlice"; // Add setPage import

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
  const dispatch = useDispatch();
  const { 
    products, 
    loading, 
    searchLoading,  
    appliedFilters,
    meta,
    isFiltered
  } = useSelector(state => state.shop);

  // Add request cancellation reference
  const abortControllerRef = useRef(null);

  // Update fetchProducts to handle pagination properly
  const fetchProducts = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch(fetchProductsBySearch({
      filters: {
        ...appliedFilters,
        page: meta.page,
        limit: meta.limit,
        sort: currentSort
      },
      signal: controller.signal
    }));

    return () => {
      controller.abort();
    };
  }, [meta.page, currentSort, appliedFilters]);

  // Optimize effects
  useEffect(() => {
    if (meta.page !== 1) {
      dispatch(setPage(1));
    }
  }, [appliedFilters]);

  useEffect(() => {
    const cleanup = fetchProducts();
    return () => cleanup();
  }, [fetchProducts]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Updated Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(meta.totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Show current page, first, last, and nearby pages
            if (
              pageNumber === 1 ||
              pageNumber === meta.totalPages ||
              Math.abs(pageNumber - meta.page) <= 2
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 rounded-md ${
                    meta.page === pageNumber
                      ? 'bg-theme-blue text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === 2 ||
              pageNumber === meta.totalPages - 1
            ) {
              return <span key={pageNumber}>...</span>;
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
