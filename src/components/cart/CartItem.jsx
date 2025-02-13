import React from 'react';
import Image from 'next/image';
import { formatPriceToINR } from '../../../utils/currencyUtils';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={item.images[0]}
          alt={item.name}
          className="h-full w-full object-cover object-center"
          width={100}
          height={100}
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <div className="ml-4">
              {item.onSale ? (
                <div>
                  <p className="text-red-600">{formatPriceToINR(item.salePrice)}</p>
                  <p className="text-gray-500 line-through text-sm">
                    {formatPriceToINR(item.price)}
                  </p>
                </div>
              ) : (
                <p>{formatPriceToINR(item.price)}</p>
              )}
            </div>
          </div>
          {item.selectedSize && (
            <p className="mt-1 text-sm text-gray-500">Size: {item.selectedSize}</p>
          )}
        </div>
        
        {/* Quantity controls and remove button */}
      </div>
    </div>
  );
};

export default CartItem;
