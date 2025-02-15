import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { fetchSingleProduct } from '../../../redux/slices/shopSlice';
import { formatPriceToINR } from 'utils/currencyUtils';
import Link from 'next/link';

const BestSellerCard = ({ id }) => {
  const dispatch = useDispatch();
  const { selectedProduct, selectedProductLoading, selectedProductError } = useSelector((state) => {
    return state.shop;
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id))
        .unwrap()
        .then(result => console.log('Fetch result:', result))
        .catch(error => console.error('Fetch error:', error));
    }
  }, [dispatch, id]);

  useEffect(() => {
    console.log('State Update:', {
      selectedProduct,
      selectedProductLoading,
      selectedProductError
    });
  }, [selectedProduct, selectedProductLoading, selectedProductError]);

  if (selectedProductLoading) {
    console.log('Rendering loading state');
    return <div className="animate-pulse">Loading...</div>;
  }

  if (selectedProductError) {
    console.error('Rendering error state:', selectedProductError);
    return <div>Error loading product</div>;
  }

  if (!selectedProduct) {
    console.log('No product data available');
    return null;
  }

  console.log('Rendering product:', selectedProduct);
  const mainVariant = selectedProduct.variants[0];

  console.log("This is the iamge nad the id ", id, mainVariant.images[0].url);
  // console.log('Main variant:', mainVariant);

  const mainImage =  mainVariant?.images[0] || selectedProduct.images[0];
  console.log('Main image:', mainImage);

  return (
    <div className="relative group text-cream cursor-pointer border">
      <Link href={`/shop/product/${id}`}>
        <div className="relative w-full h-96 overflow-hidden rounded-lg">
          <Image
            src={mainImage?.url || '/images/placeholder.jpg'}
            alt={mainImage?.alt || selectedProduct.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium">{selectedProduct.name}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-300">{selectedProduct.category?.name}</p>
            <p className="text-lg font-semibold">{formatPriceToINR(mainVariant?.price)}</p>
            {mainVariant?.isOnSale && mainVariant?.salePrice && (
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-400">{formatPriceToINR(mainVariant.price)}</span>
                <span className="text-red-500">{formatPriceToINR(mainVariant.salePrice)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BestSellerCard;
