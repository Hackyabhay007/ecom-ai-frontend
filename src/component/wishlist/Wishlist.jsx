import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import WishlistBreadCrumb from "./WishlistBreadCrumb";
import WishlistGridLayout from "./WishlistGridLayout";
import {
  fetchAllWishlistItems,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistCount,
  selectWishlistError,
  selectDeleteSuccess,
  clearDeleteSuccess,
  clearWishlistError, // Add this import
  selectWishlistMeta, // Add this import
} from "../../../redux/slices/wishlistSlice";
import { formatPriceToINR } from "utils/currencyUtils";

const Wishlist = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Use all available selectors from wishlistSlice
  const wishlistItems = useSelector(selectWishlistItems);
  const isLoading = useSelector(selectWishlistLoading);
  const totalCount = useSelector(selectWishlistCount);
  const error = useSelector(selectWishlistError);
  const deleteSuccess = useSelector(selectDeleteSuccess);
  const meta = useSelector(selectWishlistMeta);

  console.log("Wishlist Items", wishlistItems);

  const [layout, setLayout] = useState(3);
  const [filters, setFilters] = useState({
    category: "all",
    sort: "best-selling",
  });

  // Fetch wishlist items on component mount
  useEffect(() => {
    dispatch(fetchAllWishlistItems({
      page: currentPage,
      limit: ITEMS_PER_PAGE
    }));
  }, [dispatch, currentPage]);

  // Add effect to handle successful deletion and clear errors
  useEffect(() => {
    if (deleteSuccess) {
      console.log('Deletion successful, refreshing wishlist items...');
      dispatch(clearWishlistError()); // Clear any existing errors first
      dispatch(fetchAllWishlistItems({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      }))
        .unwrap()
        .then(() => {
          dispatch(clearDeleteSuccess());
        })
        .catch((error) => {
          console.error('Error refreshing wishlist:', error);
        });
    }
  }, [deleteSuccess, dispatch, currentPage]);

  // Handle layout and filter changes
  const handleLayoutChange = (newLayout) => setLayout(newLayout);
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    console.log('Starting removal process for wishlist item:', wishlistId);
    try {
      dispatch(clearWishlistError()); // Clear any previous errors
      await dispatch(removeFromWishlist(wishlistId)).unwrap();
    } catch (error) {
      console.error('Remove from wishlist failed:', {
        wishlistId,
        error: error
      });
    }
  };

  // Only show error state if it's not during deletion
  if (error && !deleteSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading wishlist items...
      </div>
    );
  }

  // Filter and sort wishlist items
  const filteredWishlist = wishlistItems?.filter(item => {
    if (filters.category === "all") return true;
    return item?.product?.category?.name?.toLowerCase() === filters.category;
  }) || [];

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    switch (filters.sort) {
      case "low-high":
        return (a?.variant?.price || 0) - (b?.variant?.price || 0);
      case "high-low":
        return (b?.variant?.price || 0) - (a?.variant?.price || 0);
      default:
        return 0;
    }
  });


  // Pagination handler

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
  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  //   // Scroll to top when page changes
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  return (
    <div className="wishlist_container mb-10 pt-16 md:pt-0">
      <WishlistBreadCrumb />
      <WishlistGridLayout
        onLayoutChange={handleLayoutChange}
        onFilterChange={handleFilterChange}
      />

      <div className="px-5 flex flex-col">
        {/* Count display */}
        <span className="text-sub-color font-medium text-lg mb-4">
          {totalCount} Product{totalCount !== 1 && "s"} in Wishlist
        </span>

        {/* Products grid */}
        <div
          className={`grid gap-4 mb-8`}
          style={{
            gridTemplateColumns: `repeat(${layout}, minmax(0, 1fr))`,
          }}
        >
          {sortedWishlist.map((item) => (
            <div
              key={item?.id}
              className="rounded-lg text-center relative text-cream cursor-pointer group"
            >
              <div
                onClick={() => router.push(`/shop/product/${item.product.id}`)}
                className="relative w-full h-32 md:h-96"
              >
                <Image
                  src={item.product.primaryImage.url}
                  alt={item.product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />

                {/* Updated Remove Button - Positioned absolutely */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(item.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-red-50 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                  title="Remove from wishlist"
                >
                  <i className="ri-close-line text-xl text-red-500"></i>
                </button>
              </div>

              <div className="mt-4 px-2">
                <h3 className="mb-1 font-medium text-xs md:text-md text-cream text-left overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="md:text-lg text-xs">
                    {formatPriceToINR(item.variant.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {sortedWishlist?.length > 0 && (
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
                  className={`md:px-4 py-2 px-3 border md:rounded-sm rounded-none mx-1 ${currentPage === page
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
    </div>
  );
};

export default Wishlist;
