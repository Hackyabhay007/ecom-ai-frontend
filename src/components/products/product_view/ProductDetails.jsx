import { formatPriceToINR } from '../../../../utils/currencyUtils';
// ...existing imports...

const ProductDetails = ({ product }) => {
  // ...existing code...

  return (
    <div className=''>
      {/* ...existing code... */}
      <div className="price-section">
        {product.onSale ? (
          <div className="flex items-center">
            <span className="text-2xl font-bold text-red-500">
              {formatPriceToINR(product.salePrice)}
            </span>
            <span className="ml-2 text-lg text-gray-500 line-through">
              {formatPriceToINR(product.price)}
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold">
            {formatPriceToINR(product.price)}
          </span>
        )}
      </div>
      {/* ...existing code... */}
    </div>
  );
};
