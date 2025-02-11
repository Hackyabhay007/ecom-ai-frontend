import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  removeFromCart,
  updateQuantity,
} from "../../../redux/slices/cartSlice";
import Image from "next/image";
import { useRegion } from "@/contexts/RegionContext";
import { updateLineItem, deleteLineItem } from "@/lib/data/cart";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { region } = useRegion();

  const [newQuantity, setNewQuantity] = useState(item?.quantity); // Initialize with item's quantity
  const [isUpdating, setIsUpdating] = useState(false); // Track API update state
  const [isVisible, setIsVisible] = useState(true); // Track visibility of the item

  // Debounced API call
  useEffect(() => {
    if (isUpdating) {
      const timer = setTimeout(() => {
        updateLineItem({ lineId: item.id, quantity: newQuantity })
          .then(() => {
            dispatch(updateQuantity({ id: item.id, quantity: newQuantity })); // Update Redux state
          })
          .catch((err) => {
            console.error("Error updating line item:", err);
          })
          .finally(() => {
            setIsUpdating(false); // Reset updating state
          });
      }, 300); // Debounce delay

      return () => clearTimeout(timer); // Cleanup on unmount or quantity change
    }
  }, [newQuantity, isUpdating, dispatch, item.id]);

  // Handle button click for increment/decrement
  const handleQuantityChange = (type) => {
    const updatedQuantity =
      type === "increment" ? newQuantity + 1 : newQuantity - 1;
    if (updatedQuantity >= 1) {
      setNewQuantity(updatedQuantity);
      setIsUpdating(true);
    }
  };

  // Handle direct input change
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setNewQuantity(Number(value) || 1); // Set the quantity to at least 1
  };

  // Handle input blur (when user leaves the input field)
  const handleInputBlur = () => {
    if (newQuantity !== item.quantity) {
      setIsUpdating(true); // Trigger API call on blur
    }
  };

  const handleRemove = () => {
    deleteLineItem(item.id) // API call to remove item
      .then(() => {
        dispatch(removeFromCart(item.id)); // Remove item from Redux store
        setIsVisible(false); // Hide the item visually
      })
      .catch((err) => {
        console.error("Error removing item:", err);
      });
  };

  const handleProductClick = () => {
    router.push(`/shop/${item.id}`); // Navigate to product page
  };

  if (!isVisible) return null; // Do not render if item is not visible

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-4">
        <Image
          src={item.thumbnail}
          alt={item.product.title}
          width={200}
          height={200}
          className="w-16 h-16 rounded-lg object-cover cursor-pointer"
          onClick={handleProductClick}
        />
        <div>
          <h4
            className="font-medium cursor-pointer md:text-base text-xs"
            onClick={handleProductClick}
          >
            {item.product_title}
          </h4>
          <p className="md:text-sm text-xs text-gray-500">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: region ? region.currency_code : "inr",
            }).format(
              (item.adjustments[0]?.amount? item.unit_price - item.adjustments[0].amount : item.unit_price) * newQuantity
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-5 md:gap-10">
        <div className="flex gap-2 md:gap-4 items-center border p-1 border-cream">
          {/* Decrement Button */}
          <button
            className="px-2 py-0 bg-theme-blue text-white rounded-sm"
            onClick={() => handleQuantityChange("decrement")}
            disabled={isUpdating}
          >
            -
          </button>

          {/* Quantity Input */}
          <input
            type="text"
            value={newQuantity}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-12 text-center border border-gray-300 rounded-sm text-black"
          />

          {/* Increment Button */}
          <button
            className="px-2 py-0 border bg-theme-blue text-white rounded-sm"
            onClick={() => handleQuantityChange("increment")}
            disabled={isUpdating}
          >
            +
          </button>
        </div>

        {/* Remove Button */}
        <button
          className="text-black border border-black px-2 py-1 hover:bg-black hover:text-white transition-all duration-200 rounded"
          onClick={handleRemove}
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
