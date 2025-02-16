import React from 'react';
import { formatPriceToINR } from '../../../utils/currencyUtils';

const CartSummary = ({ subtotal, shipping = 0, total }) => {
  return (
    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
      <div className="flex justify-between text-base font-medium text-gray-900">
        <p>Subtotal</p>
        <p>{formatPriceToINR(subtotal)}</p>
      </div>
      <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
        <p>Shipping</p>
        <p>{formatPriceToINR(shipping)}</p>
      </div>
      <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
        <p>Total</p>
        <p>{formatPriceToINR(total)}</p>
      </div>
      <p className="mt-0.5 text-sm text-gray-500">
        Shipping and taxes calculated at checkout.
      </p>
    </div>
  );
};

export default CartSummary;
