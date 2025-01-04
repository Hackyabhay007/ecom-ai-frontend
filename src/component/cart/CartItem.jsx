import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  removeFromCart,
  updateQuantity,
} from "../../../redux/slices/cartSlice";
import Image from "next/image";
const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleQuantityChange = (type) => {
    const newQuantity =
      type === "increment" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart({ id: item.id }));
  };

  const handleProductClick = () => {
    router.push(`/shop/${item.id}`); // Navigate to product page
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <d iv className="flex items-center gap-4">
        <Image
          src={item.image}
          alt={item.name}
          width={200}
          height={200}
          className="w-16 h-16 rounded-lg object-cover cursor-pointer"
          onClick={handleProductClick} // Navigate to product page
        />
        <div>
          <h4
            className="font-medium cursor-pointer md:text-base text-xs"
            onClick={handleProductClick}
          >
            {item.name}
          </h4>
          <p className="md:text-sm text-xs text-gray-500">₹{item.price}</p>
        </div>
      </d>
      <div className="flex items-center gap-5 md:gap-10">
        <div className="flex gap-2 md:gap-4 items-center border p-1 border-cream">
        <button
          className="px-2 py-0 bg-theme-blue text-white rounded-sm"
          onClick={() => handleQuantityChange("decrement")}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          className="px-2 py-0 border bg-theme-blue text-white rounded-sm"
          onClick={() => handleQuantityChange("increment")}
        >
          +
        </button>
        </div>
        
        <button
          className="text-black border border-black px-2 py-1 hover:bg-black hover:text-white transition-all duration-200  rounded"
          onClick={handleRemove}
        >
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
