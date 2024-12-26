import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlistSidebar,
  removeFromWishlist,
} from "../../../redux/slices/wishSlice";
import Link from "next/link";

const WishlistSidebar = () => {
  const dispatch = useDispatch();
  const { isOpen, wishlist } = useSelector((state) => state.wishlist);

  return (
    <>
      {/* Backdrop for smooth transition */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch(toggleWishlistSidebar())} // Close on backdrop click
      ></div>

      {/* Wishlist Sidebar with sliding effect */}
      <div
        className={`fixed right-0 md:w-1/3 w-full my-10  md:my-0 h-[80%]  md:h-full bg-white p-5  shadow-2xl z-50 rounded-3xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-theme-blue">Wishlist</h2>
          <button
            className=" hover: px-2 rounded-full hover:bg-black bg-gray-700 text-white"
            onClick={() => dispatch(toggleWishlistSidebar())}
          >
            ✕
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="p-4 flex flex-col gap-4 overflow-y-scroll scrollbar-custom flex-1">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
                {/* Remove button for each item */}
                <button
                  onClick={() => dispatch(removeFromWishlist(item.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500 text-center">
                Your wishlist is empty!
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="p-4 border-t flex flex-col gap-2 mt-auto">
          <Link href="/wishlist">
            <button
              className="w-full bg-black text-white py-4 uppercase text-xs rounded-lg hover:bg-discount-color hover:text-black transition-all duration-150 hover:font-bold"
              onClick={() => dispatch(toggleWishlistSidebar())} // Close the sidebar when clicked
            >
              View all Wishlist
            </button>
          </Link>
          <Link href="/shop">
            <button
              className="w-full text-black py-2 relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-200 hover:after:w-full"
              onClick={() => dispatch(toggleWishlistSidebar())} // Close the sidebar when clicked
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
