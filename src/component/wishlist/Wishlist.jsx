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
  selectWishlistError
} from "../../../redux/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Use all available selectors from wishlistSlice
  const wishlistItems = useSelector(selectWishlistItems);
  const isLoading = useSelector(selectWishlistLoading);
  const totalCount = useSelector(selectWishlistCount);
  const error = useSelector(selectWishlistError);

  console.log("Wishlist Items", wishlistItems);
  
  const [layout, setLayout] = useState(3);
  const [filters, setFilters] = useState({
    category: "all",
    sort: "best-selling",
  });

  // Fetch wishlist items on component mount
  useEffect(() => {
    dispatch(fetchAllWishlistItems());
  }, [dispatch]);

  // Handle layout and filter changes
  const handleLayoutChange = (newLayout) => setLayout(newLayout);
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Show error state if any
  if (error) {
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

  return (
    <div className="mb-10 pt-16 md:pt-0">
      <WishlistBreadCrumb />
      <WishlistGridLayout
        onLayoutChange={handleLayoutChange}
        onFilterChange={handleFilterChange}
      />
      
      {/* Show total count from Redux state */}
      <span className="text-sub-color font-medium text-lg px-5">
        {totalCount} Product{totalCount !== 1 && "s"} in Wishlist
      </span>
      
      <div
        className={`grid gap-4 p-4`}
        style={{
          gridTemplateColumns: `repeat(${layout}, minmax(0, 1fr))`,
        }}
      >
        {sortedWishlist.map((item) => (
          <div
            key={item?.id}
            className="rounded-lg text-center relative text-cream cursor-pointer"
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
            </div>

            <div className="mt-4 px-2">
              <h3 className="mb-1 font-medium text-xs md:text-md text-cream text-left overflow-hidden text-ellipsis whitespace-nowrap">
                {item.product.name}
              </h3>

              <div className="flex flex-wrap mb-5 gap-3 items-center justify-between pr-10">
                <span className="md:text-lg text-xs">
                  ₹{item.variant.price}
                </span>
                <button
                  onClick={() => dispatch(removeFromWishlist(item.product.id))}
                  className="bg-red-500 duration-200 text-white px-2 py-1 rounded-lg hover:bg-red-700"
                >
                  remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
