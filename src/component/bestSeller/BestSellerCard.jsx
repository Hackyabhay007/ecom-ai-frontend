import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { fetchSingleProduct } from '../../../redux/slices/shopSlice';
import { formatPriceToINR } from 'utils/currencyUtils';

const BestSellerCard = ({ id }) => {
  const dispatch = useDispatch();
  const { selectedProduct, selectedProductLoading, selectedProductError } = useSelector((state) => state.shop);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
      console.log("got products here ",id);
      
    }
  }, [dispatch, id]);

  if (selectedProductLoading) {
    return (
      <div className="bg-white border-2 border-theme-blue overflow-hidden rounded-lg shadow-lg my-5 flex flex-col animate-pulse">
        <div className="w-full h-96 bg-gray-200"></div>
        <div className="flex flex-col p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProductError || !selectedProduct) {
    return null;
  }

  const mainVariant = selectedProduct.variants[0];
  const mainImage = mainVariant?.images[0];
  const isOnSale = mainVariant?.isOnSale;
  const discount = isOnSale ? 
    Math.round(((mainVariant.price - mainVariant.salePrice) / mainVariant.price) * 100) : 0;

  return (
    <Link href={`/shop/product/${id}`}>
      <div className="bg-white border-2 border-theme-blue overflow-hidden rounded-lg shadow-lg my-5 flex flex-col group">
        <div className="relative w-full h-96">
          <Image
            src={mainImage?.url || '/images/placeholder.jpg'}
            alt={mainImage?.alt || selectedProduct.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-theme-blue text-white rounded-full px-3 py-1 text-sm">
              -{discount}% off
            </div>
          )}
        </div>
        
        <div className="flex flex-col p-4">
          <h2 className="font-bold text-lg mb-2">{selectedProduct.name}</h2>
          
          <div className="flex items-center mb-2">
            {selectedProduct.rating && (
              <span className="text-yellow-600 font-semibold mr-2">
                {selectedProduct.rating} ★
              </span>
            )}
            <span className="text-gray-500">{selectedProduct.category?.name}</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <span className="font-bold text-lg">
              {formatPriceToINR(mainVariant?.price)}
            </span>
            {isOnSale && (
              <span className="text-sub-color line-through">
                {formatPriceToINR(mainVariant.salePrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BestSellerCard;
