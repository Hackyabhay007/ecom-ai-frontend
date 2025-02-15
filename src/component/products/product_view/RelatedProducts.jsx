import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,         // Changed from fetchProductsBySearch
} from "../../../../redux/slices/shopSlice";
import Image from "next/image";
import Link from "next/link";
import { formatPriceToINR } from "utils/currencyUtils";

const RelatedProducts = ({ currentProduct }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Update selectors to use the main products state
  const relatedProducts = useSelector(state => state.shop.products) || [];
  const meta = useSelector(state => state.shop.meta);
  const isLoading = useSelector(state => state.shop.loading);

  console.log("This is the relatedProducts of the RelatedProducts.jsx", relatedProducts);

  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch related products when component mounts or page changes
  useEffect(() => {
    if (currentProduct?.categoryId) {
      console.log('Fetching related products with params:', {
        categoryId: currentProduct.categoryId,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });

      dispatch(fetchProducts({
        page: currentPage,
        filters: {
          categoryId: currentProduct.categoryId,
          limit: ITEMS_PER_PAGE
        }
      }));
    }
  }, [dispatch, currentProduct?.categoryId, currentPage]);

  // Debug logging
  useEffect(() => {
    console.log('Related Products Data:', {
      currentProductCategory: currentProduct?.categoryId,
      fetchedProducts: relatedProducts,
      pagination: meta,
      loadingState: isLoading
    });
  }, [currentProduct?.categoryId, relatedProducts, meta, isLoading]);

  // Add pagination handlers
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < meta?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate page numbers for pagination
  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(meta?.totalPages || 0, currentPage + 2); i++) {
    pageNumbers.push(i);
  }

  if (isLoading) {
    return <div className="md:mx-6 mx-4 py-5">Loading related products...</div>;
  }

  return (
    <div className="relatedProductContainer md:mx-6 mx-4 py-5">
      <h2 className="md:text-xl text-lg font-bold capitalize mb-6">
        Products You May Like ({meta?.total || 0})
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {Array.isArray(relatedProducts) && relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <div
              key={product.id}
              className="relative text-cream cursor-pointer"
              onClick={() => window.location.href = `/shop/product/${product.id}`}
            >
              {/* Image */}
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                <Image
                  src={product.variants[0].images[0].url}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>

              {/* Product Information */}
              <div className="mt-4 px-2">
                <h3 className="mb-1 text-sm md:text-md text-cream text-left">{product?.name}</h3>
                <div className="flex flex-wrap mb-5 gap-3 items-center justify-start">
                  <span className="text-sm">{formatPriceToINR(product?.variants[0]?.price)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center">No related products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {meta?.totalPages > 1 && (
        <div className="text-sm md:text-base flex justify-center mt-8">
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
            disabled={currentPage >= (meta?.totalPages || 0)}
            className="md:px-4 py-2 px-3 border md:rounded-sm rounded-none"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
