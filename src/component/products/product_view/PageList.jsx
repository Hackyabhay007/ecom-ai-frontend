import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../ProductCard";
import { fetchProductsBySearch, setPage, clearFilters } from "../../../../redux/slices/shopSlice"; // Add setPage importsetPage and clearFilters import

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

const NoProductsFound = ({ onClearAllFilters }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center mb-8">
      <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Products Found</h3>
      <p className="text-gray-600 mb-6">We couldn't find any products matching your current filters.</p>
      <button
        onClick={onClearAllFilters}
        className="inline-flex items-center px-6 py-3 bg-theme-blue text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        <i className="ri-filter-off-line mr-2"></i>
        Clear All Filters
      </button>
    </div>
  </div>
);

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

  // Add state to track if data is being loaded
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const loadingRef = useRef(loading);

  useEffect(() => {
    // Only update loading state if it's different from previous
    if (loading !== loadingRef.current) {
      loadingRef.current = loading;
      if (!loading) {
        setIsInitialLoad(false);
      }
    }
  }, [loading]);

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

  // Show shimmer only on initial load
  if ((loading || searchLoading) && isInitialLoad) {
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

  // If we have products, show them even during subsequent loading states
  if (products?.length > 0) {
    return (
      <div className="min-h-screen h-fit relative">
        {/* Optional loading overlay for subsequent loads */}
        {(loading || searchLoading) && !isInitialLoad && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-blue"></div>
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid h-fit ${
          layout === "grid"
            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid-cols-1 gap-6"
        }`}>
          {products.map((product) => (
            <MemoizedProductCard key={product.id} product={product} layout={layout} />
          ))}
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
  }

  // No products found state
  return <NoProductsFound onClearAllFilters={() => dispatch(clearFilters())} />;
};

export default ProductList;
