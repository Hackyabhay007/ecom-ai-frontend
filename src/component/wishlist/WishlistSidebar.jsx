import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import {
  toggleWishlistSidebar,
  selectWishlistSidebarOpen,
  selectWishlistItems,
  selectWishlistLoading,
  removeFromWishlist,
  fetchAllWishlistItems,
  selectDeleteSuccess,
  clearDeleteSuccess
} from "../../../redux/slices/wishlistSlice";
import { formatPriceToINR } from "utils/currencyUtils";
import { getCookie } from "../../../utils/cookieUtils";

const WishlistSidebar = () => {
  const dispatch = useDispatch();
  const deleteSuccess = useSelector(selectDeleteSuccess);
  const isOpen = useSelector(selectWishlistSidebarOpen);
  const authToken = getCookie('auth_token');

  // Get states from wishlistSlice
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const isLoading = useSelector(selectWishlistLoading);

  useEffect(() => {
    console.log("This is the delete Success value is called", deleteSuccess)
    // if (deleteSuccess) {
    //   console.log('Item successfully deleted, refreshing wishlist...');
    //   dispatch(fetchAllWishlistItems());
    //   dispatch(clearDeleteSuccess());
    // }
  }, [deleteSuccess]);

  // Fetch items when sidebar opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllWishlistItems());
    }
  }, [isOpen, dispatch]);

  // Add effect to handle successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      console.log('Item successfully deleted, refreshing wishlist...');
      dispatch(fetchAllWishlistItems());
      dispatch(clearDeleteSuccess());
    }
  }, [deleteSuccess, dispatch]);

  const handleClose = () => {
    dispatch(toggleWishlistSidebar());
  };

  const handleRemoveItem = async (wishlistId) => {
    try {
      console.log('Removing wishlist item:', wishlistId);
      await dispatch(removeFromWishlist(wishlistId)).unwrap();
      // Don't need to manually refresh here anymore,
      // the useEffect will handle it when deleteSuccess becomes true
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // Early return if no auth token
  if (!authToken) {
    return (
      <>
        {isOpen && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => dispatch(toggleWishlistSidebar())}>
          </div>
        )}
        <div className={`fixed top-11 md:top-0 right-0 md:w-1/3 w-full my-10 md:my-0 h-[80%] md:h-full bg-white p-5 shadow-2xl z-50 rounded-3xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}>
          <div className="flex justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-theme-blue">Wishlist</h2>
            <button
              className="hover:bg-black bg-gray-700 text-white px-2 rounded-full"
              onClick={() => dispatch(toggleWishlistSidebar())}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <i className="ri-user-lock-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 mb-4">Please login to view your wishlist</p>
            <Link href="/auth/login">
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => dispatch(toggleWishlistSidebar())}>
                Login
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-11 md:top-0 right-0 md:w-1/3 w-full my-10 md:my-0 h-[80%] md:h-full bg-white p-5 shadow-2xl z-50 rounded-3xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-theme-blue">
            Wishlist ({wishlistItems.length})
          </h2>
          <button
            className="hover:bg-black bg-gray-700 text-white px-2 rounded-full"
            onClick={() => {
              console.log('Closing wishlist sidebar');
              handleClose();
            }}
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="p-4 flex flex-col gap-4 overflow-y-scroll scrollbar-custom flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center">Loading...</div>
          ) : wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <Image
                  src={item.product?.primaryImage?.url || '/placeholder-image.jpg'}
                  alt={item.product?.name || 'Product'}
                  className="w-16 h-16 object-cover rounded"
                  width={500}
                  height={500}
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-medium">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatPriceToINR(item.variant?.price || 0)}
                  </p>
                </div>
                {/* {console.log("This is the item of the Wishlist SIde", item)} */}
                <button
                  onClick={() => handleRemoveItem(item?.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col text-sub-color justify-center items-center py-10">
              <i className="ri-heart-add-fill text-6xl opacity-40"></i>
              <p className="text-center">Your wishlist is empty!</p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t flex flex-col gap-2 mt-auto">
          <Link href="/wishlist">
            <button
              className="w-full bg-black text-white py-4 uppercase text-xs rounded-lg hover:bg-discount-color hover:text-black transition-all duration-150 hover:font-bold"
              onClick={handleClose}
            >
              View all Wishlist
            </button>
          </Link>
          <Link href="/shop">
            <button
              className="w-full text-black py-2 relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-200 hover:after:w-full"
              onClick={handleClose}
            >
              Go to Shopping
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;
