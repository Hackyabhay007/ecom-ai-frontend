import React, { useState } from 'react';
import { formatPriceToINR } from '../../../../utils/currencyUtils';
import { useCart } from '../../../contexts/CartContext';

const ProductDetails = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart({ ...product, selectedSize, quantity: 1 });
  };

  return (
    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {product.name}
      </h1>
      
      <div className="mt-4">
        <div className="flex items-center">
          {product.onSale ? (
            <>
              <span className="text-3xl font-bold text-red-600">
                {formatPriceToINR(product.salePrice)}
              </span>
              <span className="ml-2 text-xl text-gray-500 line-through">
                {formatPriceToINR(product.price)}
              </span>
              <span className="ml-2 text-green-600">
                {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              {formatPriceToINR(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Rest of your product details code */}
    </div>
  );
};

export default ProductDetails;
