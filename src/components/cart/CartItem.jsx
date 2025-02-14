import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { formatPriceToINR } from '../../../utils/currencyUtils';
import { updateCart } from '../../../redux/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (item?.quantity) {
      setQuantity(item.quantity);
    }
  }, [item?.quantity]);

  if (!item || !item.product) {
    return null;
  }

  const variant = item.product.variants?.find(v => v.id === item.variantId);
  const productImage = variant?.images?.[0]?.url || item.product.images?.[0]?.url || '/placeholder-image.jpg';

  const handleQuantityChange = async (type) => {
    const newQuantity = type === 'increment' ? quantity + 1 : quantity - 1;
    
    if (newQuantity < 1) return;
    if (isUpdating) return;

    setIsUpdating(true);
    
    try {
      const updatePayload = {
        itemId: item.id,
        updateData: {
          quantity: newQuantity,
          variantId: item.variantId,
          productId: item.productId,
          price: item.price
        }
      };

      await dispatch(updateCart(updatePayload)).unwrap();
      setQuantity(newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Simple price calculations based on item price
  const basePrice = item.price;
  const totalPrice = basePrice * quantity;

  return (
    <div className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={productImage}
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
            {/* <div className="ml-4">
              <p>{formatPriceToINR(totalPrice)}</p>
            </div> */}
          </div>
          
          <div className="mt-1 space-y-1">
            {item.color && (
              <p className="text-sm text-gray-500">Color: {item.color}</p>
            )}
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange('decrement')}
              className="px-2 py-1 border rounded-md disabled:opacity-50"
              disabled={quantity <= 1 || isUpdating}
            >
              -
            </button>
            <span className="px-4 py-1">
              {isUpdating ? '...' : quantity}
            </span>
            <button
              onClick={() => handleQuantityChange('increment')}
              className="px-2 py-1 border rounded-md"
              disabled={isUpdating}
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
