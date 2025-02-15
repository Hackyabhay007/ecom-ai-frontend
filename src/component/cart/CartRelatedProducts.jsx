import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { addToCart, getAllCart } from "../../../redux/slices/cartSlice";
import { formatPriceToINR } from "../../../utils/currencyUtils";
import { 
  fetchProductsBySearch,
  selectMatchingProducts  // Add this import
} from "../../../redux/slices/shopSlice";

const CartRelatedProducts = ({items}) => {
  const [cartRelatedArray, setCartRelatedArray] = useState([]);
  const dispatch = useDispatch();
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const cartItems = useSelector(state => state.cart.items);
  const searchResults = useSelector(state => state.shop.products);
  const searchLoading = useSelector(state => state.shop.searchLoading);
  const allProducts = useSelector(state => state.shop.products);
  const {products} = useSelector(state => state.shop);


  
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

  const firstCartItemId = cartItems[0]?.product?.categoryId;

  useEffect(()=>{
    if(firstCartItemId){
      dispatch(fetchProductsBySearch({
        filters: {
          categories: firstCartItemId,
          limit: 10
        }
      }))
    }
  }, [cartItems]);

  useEffect(() => {
    if(products.length > 0){
      setCartRelatedArray(products);
    }
  }, [products]);
  
  // Get matched products from visited products
  const matchedProducts = useSelector(state => 
    selectMatchingProducts(state)
  );

  // Get cart product IDs
  const cartProductIds = items.map(item => item.productId);


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

  // Fetch suggested products based on first cart item's category
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      if (cartItems && cartItems.length > 0) {
        const firstItemCategoryId = cartItems[0]?.product?.categoryId;
        
        if (firstItemCategoryId) { 
          try {
            await dispatch(fetchProductsBySearch({
              filters: {
                categories: firstItemCategoryId,
                limit: 10
              }
            })).unwrap();
          } catch (error) {
            console.error('Error fetching suggested products:', error);
          }
        }
      }
    };

    fetchSuggestedProducts();
  }, [dispatch, cartItems]);


  
  // Determine which products to display
  const displayProducts = suggestedProducts.length > 0
    ? suggestedProducts
    : cartRelatedArray;



  // Update suggested products when search results change
  useEffect(() => {
    if (searchResults) {
      // Filter out products that are already in cart
      const cartProductIds = cartItems.map(item => item?.product?.id);
      const filteredProducts = searchResults.filter(product => 
        !cartProductIds.includes(product.id)
      ).slice(0, 5);

      setSuggestedProducts(filteredProducts);
    }
  }, [searchResults, cartItems]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 px-1 md:px-8">
      {/* Display Header based on which products are shown */}
      <div className="col-span-2 mb-4">
        <h2 className="text-xl font-semibold">
          {cartItems.length > 0 ? "Similar Products" : "Suggested Products"}
        </h2>
      </div>

      {searchLoading ? (
        <div className="col-span-2 text-center">Loading suggestions...</div>
      ) : (
        displayProducts?.map((product) => (
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
                  {formatPriceToINR(product.variants[0]?.price)}
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
        ))
      )}
    </div>
  );
};

export default CartRelatedProducts;
