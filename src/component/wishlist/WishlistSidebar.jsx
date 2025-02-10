import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  toggleWishlistSidebar,
  removeFromWishlist,
} from "../../../redux/slices/wishSlice";
import Link from "next/link";
import { retrieveCustomer, updateCustomer } from "@/redux/slices/authSlice";

const WishlistSidebar = () => {
  const dispatch = useDispatch();
  const { isOpen, wishlist } = useSelector((state) => state.wishlist);
  const { currentCustomer: user } = useSelector((state) => state.customer);

  // console.log(wishlist);

  const [itemId, setitemId] = useState("");

  useEffect(() => {
    if (user) {
      setitemId(user.id);
    }
  }, [user]);

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
        className={`fixed top-11 md:top-0 right-0 md:w-1/3 w-full my-10  md:my-0 h-[80%]  md:h-full bg-white p-5  shadow-2xl z-50 rounded-3xl transform ${
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
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                  width={500}
                  height={500}
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.variants[0].calculated_price.calculated_amount}
                  </p>
                </div>
                {/* Remove button for each item */}
                <button
                 onClick={() => {

                  if (!user) {
                    router.push("/auth/login"); // Redirect to login if no user is logged in
                    return;
                  }

                  const update = {
                    metadata: {
                      wishlist: user?.metadata?.wishlist.filter((wishlistItem) => wishlistItem.id !== item.id),
                    },
                  };
                
                  console.log(update, "update");
                
                  if (JSON.stringify(update.metadata.wishlist) === JSON.stringify(user?.metadata?.wishlist)) {
                    console.log("No change");
                    return;
                  }
                
                  dispatch(updateCustomer(update));
                
                  dispatch(
                    removeFromWishlist({
                      productId: item.id,
                      currentCustomer: user,
                    })
                  );
                
                  dispatch(retrieveCustomer());
                  console.log(user, "user");
                  console.log(item.id);
                }}
                
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col text-sub-color justify-center items-center py-10">
              <i class="ri-heart-add-fill text-6xl opacity-40"></i>
              <p className=" text-center">Your wishlist is empty!</p>
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
