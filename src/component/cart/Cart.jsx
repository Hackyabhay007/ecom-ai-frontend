import React from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import CartRelatedProducts from "./CartRelatedProducts";
import { useRouter } from "next/router";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

  const handleShopNow = () => {
    router.push("/shop"); // Navigate to shop page
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-fit md:h-[550px]">
      {/* Left Component - Related Products */}
      <div className="md:w-1/2 p-5 border-r overflow-y-scroll scrollbar-custom">
        <h2 className="text-xl capitalize text-theme-blue font-bold px-4 mb-10">Product you may like</h2>
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
              <h2 className="text-xl font-bold text-theme-blue mb-1">Your Cart is Empty</h2>
              <h1><i class="ri-store-3-line text-5xl  text-theme-blue"></i></h1>
              <button
                className="bg-theme-blue text-white rounded-md px-6 py-2 text-sm font-bold uppercase hover:bg-discount-color hover:text-theme-blue transition-all duration-100"
                onClick={handleShopNow}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl capitalize text-theme-blue font-bold mb-10">Your Cart</h2>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </>
          )}
        </div>

        {/* Subtotal and Action Buttons */}
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between px-2 mb-6">
            <p className="text-lg font-bold text-theme-blue">Subtotal:</p>
            <p className="text-lg font-bold text-cream">₹{subtotal}</p>
          </div>
          <div className="flex gap-5 px-2">
            <button className="border border-theme-blue font-bold bg-white text-theme-blue w-1/2 px-4 py-3 rounded-md hover:bg-discount-color hover:text-theme-blue transition-all duration-100 hover:border-transparent">
              View Cart
            </button>
            <button className="bg-theme-blue uppercase font-bold text-white w-1/2 px-4 py-3 rounded-md hover:bg-discount-color hover:text-theme-blue transition-all duration-100">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
