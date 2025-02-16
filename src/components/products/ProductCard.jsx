import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPriceToINR } from '../../../utils/currencyUtils';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative">
      <Link href={`/shop/product/${product.id}`}>
        <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            width={300}
            height={300}
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <div className="mt-1">
            {product.onSale ? (
              <div className="flex items-center">
                <span className="text-red-500 font-medium">
                  {formatPriceToINR(product.salePrice)}
                </span>
                <span className="ml-2 text-gray-500 line-through">
                  {formatPriceToINR(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-gray-900 font-medium">
                {formatPriceToINR(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
