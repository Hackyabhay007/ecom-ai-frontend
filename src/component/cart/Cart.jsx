import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from '@reduxjs/toolkit'; // Add this import
import { getAllCart } from "../../../redux/slices/cartSlice";
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

const selectCartState = createSelector(
  [(state) => state.cart],
  (cart) => ({
    items: cart.items || [],
    totalAmount: cart.totalAmount || 0,
    loading: cart.loading
  })
);

const Cart = () => {
  const dispatch = useDispatch();
  
  // Use memoized selectors
  const { items, totalAmount, loading } = useSelector(selectCartState);
  const interestedProducts = useSelector(selectInterestedProducts);
  const router = useRouter();

  useEffect(() => {
    dispatch(getAllCart());
  }, [dispatch]);

  const handleCheckout = () => {
    const cartItemsString = JSON.stringify(items);
    router.push({
      pathname: "/checkout",
    });
  };

  const handleShopNow = () => {
    router.push("/shop"); // Navigate to shop page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("This is the items value from the Cart.jsx", items);

  return (
    <div className="flex mb-20 py-16 md:py-0 md:mb-0 flex-col-reverse md:flex-row h-fit md:h-[550px]">
      {/* Left Component - Related Products */}
      <div className="md:w-1/2 p-5 border-r overflow-y-scroll scrollbar-custom">
        <h2 className="md:text-xl text-md capitalize text-theme-blue font-bold md:px-4 mb-5 md:mb-10">
          Product you may like
        </h2>
        <CartRelatedProducts items={items} totalAmount={totalAmount} />
        {/* {interestedProducts?.length > 0 ? (
          <CartRelatedProducts items={items} totalAmount={totalAmount} />
        ) : (
          <p className="text-gray-500">Add items in the cart</p>
        )} */}
      </div>

      {/* Right Component - Cart Items and Summary */}
      <div className="md:w-1/2 flex flex-col">
        <div className="p-6 flex-1 overflow-y-scroll scrollbar-custom">
          {items?.length === 0 ? (
            <div className="flex flex-col h-full justify-center gap-5 items-center">
              <h2 className="text-xl font-bold text-theme-blue mb-1">
                Your Cart is Empty
              </h2>
              <h1>
                <i class="ri-store-2-line md:text-9xl text-7xl  text-theme-blue opacity-40"></i>
              </h1>
              <button
                className=" bg-theme-blue text-white rounded-md px-6 py-2 text-xs md:text-sm font-bold uppercase hover:bg-discount-color hover:text-theme-blue transition-all duration-100"
                onClick={handleShopNow}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              <h2 className="md:text-xl text-md capitalize text-theme-blue font-bold md:mb-10">
                Your Cart
              </h2>
              {items?.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </>
          )}
        </div>

        {/* Subtotal and Action Buttons */}
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
      </div>
    </div>
  );
};

export default Cart;
