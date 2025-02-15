import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { updateCart, getAllCart } from "../../../redux/slices/cartSlice"; // Add getAllCart import
import { formatPriceToINR } from "../../../utils/currencyUtils";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  
  // Get cart state and loading status
  const { items, loading } = useSelector(state => state.cart);
  const updatedItem = items.find(cartItem => cartItem.id === item.id);

  // Update quantity only when the specific item changes
  useEffect(() => {
    if (updatedItem && updatedItem.quantity !== quantity) {
      setQuantity(updatedItem.quantity);
    }
  }, [updatedItem?.quantity]);

  // Basic validation
  if (!item || !item.product) {
    console.error('Missing item or product data');
    return null;
  }

  // Get image from product or variant
  const getImageUrl = () => {
    console.log('Item:', item);
    const variant = item.product.variants[0]?.images[0]?.url;
    return variant || '/placeholder-image.jpg';
  };

  // Handle quantity changes
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const payload = {
        itemId: item.id,
        updateData: { 
          quantity: newQuantity
        }
      };

      await dispatch(updateCart(payload)).unwrap();
      // Refresh all cart items after update
      await dispatch(getAllCart());
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert to previous quantity on error
      setQuantity(updatedItem?.quantity || quantity);
    }
  };

  // Calculate price
  const totalPrice = item.price * quantity;

  return (
    <div className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={getImageUrl()}
          alt={item.product.name}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name}</h3>
            <div className="ml-4">
              <p>{formatPriceToINR(totalPrice)}</p>
            </div>
          </div>
          
          <div className="mt-1 space-y-1">
            {item.color && (
              <p className="text-sm text-gray-500">Color: {item.color}</p>
            )}
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 border rounded-md disabled:opacity-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-1">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 border rounded-md"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
