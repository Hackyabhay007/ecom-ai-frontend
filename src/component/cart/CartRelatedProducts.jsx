import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { addToCart, getAllCart } from "../../../redux/slices/cartSlice";
import { formatPriceToINR } from "../../../utils/currencyUtils";
import { fetchProductsBySearch } from "../../../redux/slices/shopSlice";
import { getViewedProducts } from "../../../utils/cookieUtils";
import { useRouter } from 'next/router';

const CartRelatedProducts = ({items}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);
  const { products } = useSelector(state => state.shop);
  const cartItems = useSelector(state => state.cart.items);
  const [addingToCart, setAddingToCart] = useState({});

  // Get category from first cart item
  const firstCartItemCategory = useMemo(() => {
    return cartItems[0]?.product?.categoryId;
  }, [cartItems[0]?.product?.categoryId]);

  // Load and prepare products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Get recently viewed products from cookies
        const viewedProducts = getViewedProducts();
        const cartProductIds = new Set(cartItems.map(item => item?.product?.id));
        
        // Filter out products that are already in cart
        const availableViewedProducts = viewedProducts.filter(
          product => !cartProductIds.has(product.id)
        ).slice(0, 3);

        if (availableViewedProducts.length >= 3) {
          // If we have enough viewed products, use them
          setDisplayProducts(availableViewedProducts);
        } else {
          // Otherwise, fetch category products to fill the gap
          if (firstCartItemCategory) {
            await dispatch(fetchProductsBySearch({
              filters: {
                categories: firstCartItemCategory,
                limit: 4
              }
            }));
            
            const categoryProducts = products
              .filter(product => !cartProductIds.has(product.id))
              .slice(0, 4 - availableViewedProducts.length);

            setDisplayProducts([...availableViewedProducts, ...categoryProducts]);
          }
        }
      } catch (error) {
        console.error('Error loading related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [firstCartItemCategory, cartItems]);

  const handleProductClick = (productId) => {
    router.push(`/shop/${productId}`);
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      // Add to cart
      await dispatch(addToCart({
        productId: product.id,
        variantId: product.variants[0]?.id,
        quantity: 1
      })).unwrap();

      // Immediately fetch updated cart data
      await dispatch(getAllCart()).unwrap();

      // Update display products by removing the added product
      setDisplayProducts(prev => prev.filter(p => p.id !== product.id));
      
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayProducts.map((product) => (
        <div
          key={product.id}
          onClick={() => handleProductClick(product.id)}
          className="rounded-lg relative cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          {/* Product Image */}
          <div className="relative w-full pt-[100%]">
            <Image
              src={product.variants[0]?.images[0]?.url || '/placeholder-image.jpg'}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="absolute top-0 left-0"
            />
          </div>

          {/* Product Info */}
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formatPriceToINR(product.variants[0]?.price)}
            </p>
            <button
              onClick={(e) => handleAddToCart(product, e)}
              disabled={addingToCart[product.id]}
              className="mt-2 w-full text-xs bg-theme-blue text-white py-1.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(CartRelatedProducts, (prevProps, nextProps) => {
  // Improve memoization to prevent unnecessary rerenders
  return JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items);
});
