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
  

const Cart = ({item}) => {
  const [newQuantity, setNewQuantity] = useState(item?.quantity); // Initialize with item's quantity
  const [isUpdating, setIsUpdating] = useState(false); // Track API update state
  const [isVisible, setIsVisible] = useState(true); // Track visibility of the item
  const dispatch = useDispatch();

  console.log(item)
  // Debounced API call
  useEffect(() => {
    if (isUpdating) {
      const timer = setTimeout(() => {
        updateLineItem({ lineId: item.id, quantity: newQuantity })
          .then(() => {
            dispatch(
              updateQuantity({
                id: item.id,
                quantity: newQuantity,
              })
            ); // Update Redux state
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
  return (
   item &&   <tr  className="border-b-2 border-dashed border-gray-600">
      <td className="py-4 flex flex-col items-start md:flex-row md:items-center">
        <img
          src={item.thumbnail}
          alt="Product"
          className="h-14 md:h-20 w-auto"
        />
        <div className="md:ml-4">
          <h3 className="font-medium">{item.product_title}</h3>
          <p className="text-sm text-gray-500">
            Properties: {(item?.variant_title)}
          </p>
        </div>
      </td>
    
      <td className="text-center text-red-500 font-semibold">
        {item?.adjustments[0]?.amount
          ? `${((item.adjustments[0]?.amount / item.unit_price) * 100).toFixed(
              2
            )}%`
          : "0%"}
      </td>
      <td className="text-right font-bold text-gray-900">
        ₹
        {item.adjustments[0]
          ? item.unit_price - item.adjustments[0]?.amount
          : item.unit_price}
      </td>
    </tr>
  );
};

export default Cart;
