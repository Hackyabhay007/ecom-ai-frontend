import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { updateCart, getAllCart, selectGuestId } from "../../../redux/slices/cartSlice";
import { formatPriceToINR } from "../../../utils/currencyUtils";
import Cookies from 'js-cookie';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const { items, loading } = useSelector(state => state.cart);
  const guestId = useSelector(selectGuestId);
  const authToken = Cookies.get('auth_token');
  
  // Find updated item from redux store
  const updatedItem = items.find(cartItem => cartItem.id === item.id);

  // Update local quantity when redux store updates
  useEffect(() => {
    if (updatedItem && updatedItem.quantity !== quantity) {
      setQuantity(updatedItem.quantity);
    }
  }, [updatedItem?.quantity]);

  // Memoized quantity change handler
  const handleQuantityChange = useCallback(async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      console.log('Starting quantity update:', {
        itemId: item.id,
        newQuantity,
        guestId,
        hasToken: !!authToken
      });

      await dispatch(updateCart({
        itemId: item.id,
        updateData: { 
          quantity: newQuantity,
          ...((!authToken && guestId) && { guestId })
        }
      })).unwrap();

      // Only fetch updated cart after successful update
      await dispatch(getAllCart());
      
    } catch (error) {
      console.error('Quantity update failed:', error);
      // Revert to previous quantity
      setQuantity(item.quantity);
    }
  }, [dispatch, item.id, item.quantity, guestId, authToken]);

  if (!item?.product) return null;

  const getImageUrl = () => {
    return item.product.variants?.[0]?.images?.[0]?.url || '/placeholder-image.jpg';
  };

  return (
    <div className="flex py-6">
      {/* Image section */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={getImageUrl()}
          alt={item.product.name}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content section */}
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name}</h3>
            <div className="ml-4">
              <p>{formatPriceToINR(item.price * quantity)}</p>
            </div>
          </div>
          
          {/* Product details */}
          <div className="mt-1 space-y-1">
            {item.color && (
              <p className="text-sm text-gray-500">Color: {item.color}</p>
            )}
          </div>
          
          {/* Quantity controls */}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 border rounded-md disabled:opacity-50"
              disabled={quantity <= 1 || loading}
            >
              -
            </button>
            <span className="px-4 py-1">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 border rounded-md"
              disabled={loading}
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
