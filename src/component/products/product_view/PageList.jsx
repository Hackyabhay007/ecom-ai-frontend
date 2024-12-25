import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard";

const ProductList = ({ products, layout }) => {
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

  return (
    <div>
      {/* Display Paginated Products */}
      <div
        className={`grid ${
          layout === "grid"
            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid-cols-1 gap-6"
        }`}
      >
        {currentProducts.length ? (
          currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} layout={layout} />
          ))
        ) : (
          <p className="text-center col-span-full">No products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-lg"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center mx-2">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 mx-1 border rounded-lg ${
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
          className="px-4 py-2 border rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
