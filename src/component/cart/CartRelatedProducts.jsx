import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { addToCart, getAllCart } from "../../../redux/slices/cartSlice";
import { formatPriceToINR } from "../../../utils/currencyUtils";
import { fetchProductsByIds, selectVisitedProducts } from "../../../redux/slices/productSlice";
import { selectMatchingProducts } from "../../../redux/slices/shopSlice";

const CartRelatedProducts = ({ items, totalAmount }) => {
  const dispatch = useDispatch();
  const { visitedProducts } = useSelector(state => state.auth);
  const allProducts = useSelector(state => state.shop.products);
  
  // Move formatProductData function definition to the top
  const formatProductData = (product) => ({
    id: product.id,
    title: product.title || product.name,
    price: product.variants[0]?.calculated_price || product.variants[0]?.price,
    thumbnail: product.thumbnail || '/placeholder-image.jpg',
    selectedVariant: product.variants[0]?.id,
    variants: product.variants
  });

  // Get product IDs from visited products
  const visitedProductIds = visitedProducts?.map(item => item.productId) || [];
  
  // Get matched products from visited products
  const matchedProducts = useSelector(state => 
    selectMatchingProducts(state, visitedProductIds)
  );

  // Get cart product IDs
  const cartProductIds = items.map(item => item.productId);

  // Create suggested products from all products excluding cart items
  const suggestedProducts = allProducts
    .filter(product => 
      product?.variants?.length > 0 && 
      !cartProductIds.includes(product.id)
    )
    .map(formatProductData)
    .slice(0, 5);

  // Determine which products to display
  const displayProducts = matchedProducts.length > 0
    ? matchedProducts
        .filter(product => !cartProductIds.includes(product.id))
        .map(formatProductData)
        .slice(0, 5)
    : suggestedProducts;

  // Debug logging
  useEffect(() => {
    console.log("Matched Products:", matchedProducts);
    console.log("Suggested Products:", suggestedProducts);
    console.log("Display Products:", displayProducts);
  }, [matchedProducts, suggestedProducts, displayProducts]);

  const handleAddToCart = async (product, variantId, e) => {
    e.stopPropagation(); // Prevent navigation
    try {
      // Add to cart
      await dispatch(addToCart({
        productId: product.id,
        variantId: variantId,
        quantity: 1
      })).unwrap();

      // Fetch updated cart data immediately after adding
      await dispatch(getAllCart()).unwrap();
      
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  // Add error handling and loading state
  const productsLoading = useSelector(state => state.products?.status === 'loading');
  if (productsLoading) {
    return <div>Loading related products...</div>;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 px-1 md:px-8">
      {/* Display Header based on which products are shown */}
      <div className="col-span-2 mb-4">
        <h2 className="text-xl font-semibold">
          {matchedProducts.length > 0 
            ? "Products You've Viewed"
            : "Suggested Products"}
        </h2>
      </div>

      {displayProducts?.map((product) => (
        <div
          key={product.id}
          className="rounded-lg text-center relative cursor-pointer bg-white shadow-md overflow-hidden transition-transform transform h-fit hover:shadow-lg"
          onClick={() => window.location.href = `/shop/${product.id}`}
        >
          {console.log(product)}
          <div className="relative w-full h-48">
            <Image
              src={product.variants[0]?.images[0]?.url || product.thumbnail}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg object-top h-fit"
            />
          </div>

          <div className="p-2 md:p-4">
            <h3 className="font-medium text-sm md:text-md text-black text-center overflow-hidden text-ellipsis whitespace-nowrap">
              {product.title}
            </h3>

            <div className="flex flex-wrap mb-3 gap-2 items-center justify-center">
              <span className="text-black md:text-sm text-xs">
                {formatPriceToINR(product.price)}
              </span>
            </div>

            <button
              className="mt-2 w-full text-black border hover:text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-800"
              onClick={(e) => handleAddToCart(product, product.selectedVariant, e)}
              disabled={cartProductIds.includes(product.id)}
            >
              <i className="ri-shopping-cart-line text-center"></i>
              <span className="md:block hidden">
                {cartProductIds.includes(product.id) ? 'In Cart' : 'Add to Cart'}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartRelatedProducts;
