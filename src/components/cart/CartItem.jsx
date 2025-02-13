import React, { useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { formatPriceToINR } from '../../../utils/currencyUtils';
import { updateCart } from '../../../redux/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  // Validate item data
  if (!item?.product) {
    return null;
  }

  // Find the matching variant
  const variant = item.product.variants?.find(v => v.id === item.variantId) || {};
  
  // Initialize state
  const [quantity, setQuantity] = useState(item.quantity || 1);
  
  // Get price (use item price or variant price as fallback)
  const basePrice = item.price || variant.price || 0;
  const salePrice = variant.isOnSale ? (variant.salePrice || basePrice) : basePrice;
  const finalPrice = salePrice * quantity;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setQuantity(newQuantity);
      await dispatch(updateCart({
        itemId: item.id,
        updateData: { quantity: newQuantity }
      })).unwrap();
    } catch (error) {
      setQuantity(item.quantity || 1);
      console.error('Failed to update quantity:', error);
    }
  };

  return (
    <div className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={variant.images?.[0]?.url || '/placeholder-image.jpg'}
          alt={item.product.name || 'Product'}
          className="h-full w-full object-cover object-center"
          width={100}
          height={100}
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name || 'Unnamed Product'}</h3>
            <div className="ml-4">
              {variant.isOnSale ? (
                <div>
                  <p className="text-red-600">{formatPriceToINR(finalPrice)}</p>
                  <p className="text-gray-500 line-through text-sm">
                    {formatPriceToINR(basePrice * quantity)}
                  </p>
                </div>
              ) : (
                <p>{formatPriceToINR(finalPrice)}</p>
              )}
            </div>
          </div>
          
          {variant.size && (
            <p className="mt-1 text-sm text-gray-500">Size: {variant.size}</p>
          )}
          {item.color && (
            <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>
          )}
          
          <div className="mt-1 flex items-center gap-2">
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
