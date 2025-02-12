import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard";

const ShimmerProductCard = () => (
  <div className="animate-pulse">
    <div className="relative h-56 md:h-96 bg-gray-200 rounded-lg"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const ProductList = ({ layout }) => {
  const { products, loading } = useSelector(state => state.shop);
  const [productsPerPage, setProductsPerPage] = useState(9); // Default to 9 for desktop
  const [currentPage, setCurrentPage] = useState(1);

  // Adjust products per page based on screen width (Mobile: 8, Desktop: 9)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setProductsPerPage(8); // Mobile
      } else {
        setProductsPerPage(9); // Desktop 
      }
    };

    // Call handleResize on initial load and whenever the window resizes
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate the index range for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to go to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate page numbers to show (max 4 pages)
  const totalPages = Math.ceil(products.length / productsPerPage);
  const pageNumbers = [];

  // Show pages 1 to 4, based on the current page
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pageNumbers.push(i);
  }

  if (loading && !products.length) {
    return (
      <div className={`grid ${
        layout === "grid"
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid-cols-1 gap-6"
      }`}>
        {[...Array(6)].map((_, index) => (
          <ShimmerProductCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen h-fit">
      <div
        className={`grid h-fit ${
          layout === "grid"
            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid-cols-1 gap-6"
        }`}
      >
        {loading ? (
          [...Array(6)].map((_, index) => (
            <ShimmerProductCard key={index} />
          ))
        ) : currentProducts.length ? (
          currentProducts.map((product) => (
            <div className="transition-opacity duration-300 animate-fadeIn" key={product.id}>
              <ProductCard 
                product={{
                  ...product,
                  thumbnail: product.variants?.[0]?.images?.[0]?.url || '',
                  images: product.variants?.flatMap(v => v.images || []) || []
                }}
                layout={layout} 
              />
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {currentProducts.length > 0 && (
        <div className="text-sm md:text-base flex justify-center mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="md:px-4 py-2  px-3 border md:rounded-sm rounded-none"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center mx-2">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`md:px-4 py-2  px-3 border md:rounded-sm rounded-none mx-1 ${
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
            disabled={currentPage >= totalPages}
            className="md:px-4 py-2  px-3 border md:rounded-sm rounded-none"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
