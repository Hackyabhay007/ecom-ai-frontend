import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import CartRelatedProducts from "./CartRelatedProducts";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  // const { items } = useSelector((state) => state.cart);
  const { cart } = useCart();

  console.log(cart);

  // console.log(cart, " this is cart");
  const [items, setitems] = useState([]);

  useEffect(() => {
    cart?.items && setitems(cart.items);
  }, [cart]);

  const router = useRouter();
  const handleCheckout = () => {
    const cartItemsString = JSON.stringify(items);
    router.push({
      pathname: "/checkout",
    });
  };
  const handleShopNow = () => {
    router.push("/shop"); // Navigate to shop page
  };

  console.log(cart);

  return (
    <div className="flex mb-20 py-16 md:py-0 md:mb-0 flex-col-reverse md:flex-row h-fit md:h-[550px]">
      {/* Left Component - Related Products */}
      <div className="md:w-1/2 p-5 border-r overflow-y-scroll scrollbar-custom">
        <h2 className="md:text-xl text-md capitalize text-theme-blue font-bold md:px-4 mb-5 md:mb-10">
          Product you may like
        </h2>
        {items.length > 0 ? (
          <CartRelatedProducts />
        ) : (
          <p className="text-gray-500">Add items in the cart</p>
        )}
      </div>

      {/* Right Component - Cart Items and Summary */}
      <div className="md:w-1/2 flex flex-col">
        <div className="p-6 flex-1 overflow-y-scroll scrollbar-custom">
          {items.length === 0 ? (
            <div className="flex flex-col h-full justify-center gap-5 items-center">
              <h2 className="text-xl font-bold text-theme-blue mb-1">
                Your Cart is Empty
              </h2>
              <h1>
                <i class="ri-store-2-line md:text-9xl text-7xl  text-theme-blue opacity-40"></i>
              </h1>
              <button
                className="bg-theme-blue text-white rounded-md px-6 py-2 text-xs md:text-sm font-bold uppercase hover:bg-discount-color hover:text-theme-blue transition-all duration-100"
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
              {items.map((item) => (
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
              ₹{cart.item_subtotal}
            </p>
          </div>
          <div className="flex gap-2 md:gap-4 md:px-2 px-1 w-full">
            <Link href="/shop" passHref>
              <button className="border border-theme-blue text-sm md:text-base uppercase md:font-bold bg-white text-theme-blue w-full px-10 md:py-3 py-1 rounded-md hover:bg-discount-color hover:text-theme-blue transition-all duration-100 hover:border-transparent">
                Shop
              </button>
            </Link>
            <button
              onClick={handleCheckout}
              className="bg-theme-blue text-sm md:text-base uppercase md:font-bold text-white w-full px-2 md:px-4 md:py-3 py-1 rounded-md hover:bg-discount-color hover:text-theme-blue transition-all duration-100"
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
