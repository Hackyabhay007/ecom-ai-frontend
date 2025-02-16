import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from '@reduxjs/toolkit';
import { getAllCart, initializeGuestId } from "../../../redux/slices/cartSlice";
import Cookies from 'js-cookie'; // Add this import
import CartItem from "./CartItem";
import CartRelatedProducts from "./CartRelatedProducts";
import { useRouter } from "next/router";
import Link from "next/link";
import { formatPriceToINR } from "utils/currencyUtils";

// Create memoized selector outside component
const selectInterestedProducts = createSelector(
  [(state) => state.interestedProducts],
  (interestedProducts) => interestedProducts?.items || []
);

// Update selector to include guestId and auth status
const selectCartState = createSelector(
  [(state) => state.cart],
  (cart) => ({
    items: cart.items || [],
    totalAmount: cart.totalAmount || 0,
    loading: cart.loading,
    guestId: cart.guestId
  })
);

console.log("This is the cart state", selectCartState);

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalAmount, loading, guestId } = useSelector(state => state.cart);
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize auth token
  const authToken = useMemo(() => {
    return typeof window !== 'undefined' ? Cookies.get('auth_token') : null;
  }, []);

  // Initialize cart based on auth status
  useEffect(() => {
    const initCart = async () => {
      try {
        if (!isInitialized) {
          if (!authToken && !guestId) {
            // Initialize guest ID for non-authenticated users
            await dispatch(initializeGuestId());
          }

          // Fetch cart data
          await dispatch(getAllCart()).unwrap();
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize cart:', error);
      }
    };

    initCart();
  }, [authToken, guestId, isInitialized, dispatch]);

  // Move debug logging to development only
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      console.log('Cart State:', {
        isAuthenticated: !!authToken,
        guestId,
        itemsCount: items?.length,
        totalAmount
      });
    }, [items, totalAmount]); // Remove authToken and guestId from debug logging dependencies
  }

  const handleCheckout = () => {
    const cartItemsString = JSON.stringify(items);
    router.push({
      pathname: "/checkout",
    });
  };

  const handleShopNow = () => {
    router.push("/shop"); // Navigate to shop page
  };

  // Right Component section
  const renderCartContent = () => {
    if (items?.length === 0) {
      return (
        <div className="flex flex-col h-full justify-center gap-5 items-center">
          <h2 className="text-xl font-bold text-theme-blue mb-1">
            Your Cart is Empty
          </h2>
          <i className="ri-store-2-line md:text-9xl text-7xl text-theme-blue opacity-40"></i>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleShopNow}
              className="bg-theme-blue text-white rounded-md px-6 py-2 text-xs md:text-sm font-bold uppercase hover:bg-discount-color hover:text-theme-blue transition-all duration-100"
            >
              Shop Now
            </button>
            {!authToken && (
              <Link href="/auth/login" className="text-center text-sm text-theme-blue hover:underline">
                Sign in to sync your cart
              </Link>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <h2 className="md:text-xl text-md capitalize text-theme-blue font-bold md:mb-10">
          Your Cart <span className="text-sm font-normal">{authToken?"":"(Guest)"}</span>
        </h2>
        {items?.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </>
    );
  };

  return (
    <div className="flex mb-20 py-16 md:py-0 md:mb-0 flex-col-reverse md:flex-row h-fit md:h-[550px]">
      {/* Left Component - Related Products */}
      <div className="md:w-1/2 p-5 border-r overflow-y-scroll scrollbar-custom">
        <h2 className="md:text-xl text-md capitalize text-theme-blue font-bold md:px-4 mb-5 md:mb-10">
          {authToken ? "Products you may like" : "Sign in to save your cart"}
        </h2>
        <CartRelatedProducts items={items} />
      </div>

      {/* Right Component - Cart Items and Summary */}
      <div className="md:w-1/2 flex flex-col">
        <div className="p-6 flex-1 overflow-y-scroll scrollbar-custom">
          {renderCartContent()}
        </div>

        {/* Subtotal and Action Buttons */}
        {items?.length > 0 && (
          <div className="p-4 bg-white border-t">
            <div className="flex justify-between px-2 mb-6">
              <p className="md:text-lg text-md font-bold text-theme-blue">
                Subtotal:
              </p>
              <p className="md:text-lg text-md font-bold text-cream">
                {formatPriceToINR(totalAmount) || 0}
              </p>
            </div>
            <div className="flex gap-2 md:gap-4 md:px-2 px-1 w-full">
              <Link href="/shop" passHref>
                <button className="duration-200 border border-theme-blue text-sm md:text-base uppercase md:font-bold bg-white text-theme-blue w-full px-10 md:py-3 py-1 rounded-md hover:bg-discount-color hover:text-theme-blue transition-all  hover:border-transparent">
                  Shop
                </button>
              </Link>
              <button
                disabled={items.length === 0}
                onClick={handleCheckout}
                className="cursor-pointer duration-200 bg-theme-blue text-sm md:text-base uppercase md:font-bold text-white w-full px-2 md:px-4 md:py-3 py-1 rounded-md hover:bg-discount-color hover:text-theme-blue transition-all"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
