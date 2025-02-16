import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  toggleWishlistSidebar,
  removeFromWishlist // Add this import
} from "../../../redux/slices/wishlistSlice"; // Fix the path
import QuickView from "./product_view/QuickView";
import { useRegion } from "../../contexts/RegionContext";
import { addToCart, initializeGuestId } from "../../../redux/slices/cartSlice"; // Fixed import path
import { retrieveCustomer, updateCustomer } from "@/redux/slices/authSlice";
import { formatPriceToINR } from "utils/currencyUtils";
import { toast } from 'react-hot-toast';
import { getCookie } from '../../../utils/cookieUtils';
import Link from "next/link";
import { motion } from "framer-motion";

// import "./Hoverimagechnage.css"

const ProductCard = ({ product, layout }) => {
  // console.log(product, " this product was come ");
  const router = useRouter();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer) || {};
  const user = customer?.currentCustomer || null;
  const wishlistState = useSelector((state) => state.wishlist) || {};
  const wishlistMessage = wishlistState.message;
  const wishlistError = useSelector((state) => state.wishlist?.error);
  const wishlistItems = useSelector((state) => state.wishlist?.items) || [];
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false); // Add this state

  useEffect(() => {
    if (!user) {
      dispatch(retrieveCustomer());
    }
  }, [dispatch, user]);

  const [isWishlistAdded, setIsWishlistAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartAdded, setIsCartAdded] = useState(false);
  const { region } = useRegion();
  const currency_code = region?.currency_code || 'INR'; // Add default currency code
  const [products, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variantPrice, setVariantPrice] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [discount, setdiscount] = useState(0);
  const [discountedamount, setDiscountedamount] = useState(0);
  // console.log(product, " this product was come ");
  const { size, color, min_price, max_pirce } = router.query;
  const [notfoundoncurrentvaiant, setNotfoundoncurrentvaiant] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const {
    id,
    name = product.title,
    description = product.description,
    variants = [],
    attributes = {},
    metadata = {},
    created_at
  } = product;

  // Get primary image from first variant or fallback
  const primaryImage = variants[0]?.images?.find(img => img.isPrimary)?.url 
    || variants[0]?.images?.[0]?.url 
    || '/placeholder-image.jpg';

  // Get secondary image for hover effect
  const secondaryImage = variants[0]?.images?.[1]?.url || primaryImage;

  // Get variant price
  const defaultVariant = variants[0] || {};
  const variantPriceValue = defaultVariant.price || 0;

  useEffect(() => {
    const fetchVariantDetails = async () => {
      try {
        setLoading(true);
        
        const targetVariant = variants.find(v => 
          (!size && !color) ? v.isActive :
          (size && color) ? (v.size === size && v.color === color) :
          size ? v.size === size :
          color ? v.color === color : false
        ) || variants[0];

        if (targetVariant) {
          setVariantPrice(targetVariant?.price);

          if (metadata?.discount > 0) {
            setdiscount(metadata.discount);
            const discounted = targetVariant.price * (1 - metadata.discount / 100);
            setDiscountedamount(
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency_code,
              }).format(discounted)
            );
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error processing variant details:", error);
        setLoading(false);
      }
    };

    fetchVariantDetails();
  }, [variants, size, color, currency_code, metadata]);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistState.items && product) {
      setIsInWishlist(wishlistState.items.some(item => 
        item?.product?.id === product.id
      ));
    }
  }, [wishlistState.items, product]);

  // Add this effect to log wishlist items for debugging
  useEffect(() => {
    if (wishlistItems.length > 0) {
      console.log('Current wishlist items:', wishlistItems);
    }
  }, [wishlistItems]);

  // Updated handleAddToWishlist function
  const handleAddToWishlist = async (event) => {
    event.stopPropagation();
    
    // Check for authentication
    const authToken = getCookie('auth_token');
    if (!authToken) {
      toast.error('Please login to add items to your wishlist', {
        duration: 3000,
        position: 'top-center',
        icon: '🔒',
      });
      return;
    }

    setWishlistLoading(true);
    
    try {
      if (isInWishlist) {
        // Find the wishlist item for this product
        const wishlistItem = wishlistItems.find(item => 
          item.product?.id === product.id
        );
        
        console.log('Removing item from wishlist:', {
          wishlistItemId: wishlistItem?.id,
          productId: product.id
        });

        if (wishlistItem?.id) {
          const result = await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
          console.log('Remove result:', result);
          if (result) {
            setIsInWishlist(false);
            toast.success('Removed from wishlist');
          }
        } else {
          console.error('Could not find wishlist item ID for product:', product.id);
        }
      } else {
        const result = await dispatch(addToWishlist({
          productId: product.id,
          variantId: variants[0].id
        })).unwrap();
        
        console.log('Add result:', result);
        if (result) {
          setIsInWishlist(true);
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Update useEffect to check wishlist status and log for debugging
  useEffect(() => {
    if (wishlistItems && product) {
      const isInList = wishlistItems.some(item => item.product?.id === product.id);
      console.log('Wishlist status check:', {
        productId: product.id,
        isInList,
        totalItems: wishlistItems.length
      });
      setIsInWishlist(isInList);
    }
  }, [wishlistItems, product]);

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    
    const firstVariant = product.variants[0];
    
    if (!firstVariant) {
      toast.error('No variant available for this product');
      return;
    }

    try {
      // Initialize guest ID if user is not authenticated
      // const authToken = getCookie('auth_token');
      // if (!authToken) {
      //   dispatch(initializeGuestId());
      // }

      // Create the action payload
      const payload = {
        productId: product.id,
        variantId: firstVariant.id,
        quantity: 1
      };

      const result = await dispatch(addToCart(payload)).unwrap();
      
      if (result) {
        setIsCartAdded(true);
        toast.success('Added to cart successfully');
        setTimeout(() => setIsCartAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  const discountes = product.metadata?.discount || 0; // Ensure discount is a number
  const createdAt = new Date(product.created_at);
  const currentDate = new Date();

  // Calculate the difference in days
  const diffInTime = currentDate - createdAt;
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
  const getTagColor = () => {
    // console.log(discountes, "createAt");

    if (discountes > 0 && diffInDays <= 3) {
      // Both discounted and new
      return "bg-[#FF5733] text-white font-bold"; // Combine styles
    }
    if (discount > 0) {
      // Only discounted
      return "bg-[#DB4444] text-white font-bold";
    }
    if (diffInDays <= 3) {
      // Only new
      return "bg-[#D2EF9A] font-bold";
    }

    // Default case (if neither discounted nor new)
    return "bg-grey-500 font-semibold text-black";
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  useEffect(() => {
    if (!id || !region) {
      setLoading(false); // Safeguard to prevent infinite loading
      return;
    }
  }, [id, region, discount]);

  const getSecondaryImage = () => {
    if (!product.images || product.images.length < 2) {
      return image; // fallback to primary image if no secondary image exists
    }
    return product.images[1].url;
  };

  const handleQuickView = (e) => {
    e.stopPropagation(); // Prevent navigation
    setIsQuickViewOpen(true);
  };

  if (loading) {
    return (
      <div>
        {product.title}
        {variantPrice} {discountedamount}
      </div>
    );
  }

  if (layout === "list") {
    const variant = product.variants?.[0];
    const mainImage = variant?.images?.[0]?.url;
    const price = variant?.price;
    const isOnSale = variant?.isOnSale;
    const salePrice = variant?.salePrice;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="group flex gap-6 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* Product Image Container */}
        <div className="relative w-64 min-h-[300px]">
          <div className="relative h-full w-full">
            <Image
              src={mainImage || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover rounded-l-2xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            {/* Only show Sale tag */}
            {isOnSale && (
              <span className="absolute top-2 left-2 bg-[#DB4444] text-white text-xs px-3 py-1 rounded-full font-medium">
                SALE
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-theme-blue transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {product.category?.name}
              </p>
            </div>
            <div className="text-right">
              {isOnSale ? (
                <div className="flex flex-col items-end">
                  <span className="text-[#DB4444] font-semibold text-lg">{formatPriceToINR(salePrice)}</span>
                  <span className="text-gray-400 line-through text-sm">{formatPriceToINR(price)}</span>
                </div>
              ) : (
                <span className="font-semibold text-lg">{formatPriceToINR(price)}</span>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-6 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Size:</span>
              <span className="font-medium">{variant?.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Color:</span>
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: variant?.color?.toLowerCase() }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Stock:</span>
              <span className={`text-sm font-medium ${variant?.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {variant?.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
              }}
              className="flex-1 bg-black text-white py-2 rounded-full hover:bg-theme-blue transition-colors duration-300"
            >
              {addedToCart ? 'Added ✓' : 'Add to Cart'}
            </button>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
              >
                Quick View
              </button>
              
              {isQuickViewOpen && (
                <QuickView
                  productId={id}
                  initialData={product}
                  onClose={(e) => {
                    e?.stopPropagation();
                    setIsQuickViewOpen(false);
                  }}
                />
              )}
            </div>

            <button
              onClick={(e) => handleAddToWishlist(e)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300 ${
                isInWishlist 
                  ? 'bg-theme-blue text-white border-theme-blue' 
                  : 'border-black hover:bg-black hover:text-white'
              }`}
            >
              <i className={`${isInWishlist ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div
        className={`relative rounded-lg text-center cursor-pointer text-cream ${
          layout === "list" ? "flex" : ""
        }`}
        onClick={() => router.push(`/shop/product/${id}`)}
      >
        {/* Image Section */}
        <div
          className={`relative ${
            layout === "list" ? "md:w-1/4 w-1/2" : "w-full"
          }  h-56 md:h-96 group`}
        >
          {/* Sale and New Tags - Positioned absolutely at top left */}
          <div className="absolute top-2 left-2 z-30 flex flex-col gap-2">
            {discountes > 0 && (
              <span className="bg-[#DB4444] text-white text-xs px-3 py-1 rounded-full font-medium">
                SALE
              </span>
            )}
            {diffInDays <= 3 && (
              <span className="bg-[#D2EF9A] text-black text-xs px-3 py-1 rounded-full font-medium">
                NEW
              </span>
            )}
          </div>

          <Image
            src={primaryImage}
            alt={name}
            layout="fill"
            size={"fit"}
            objectFit="cover"
            className="rounded-2xl hidden max-sm:flex  hover:scale-105 duration-150 shadow-lg  h-72"
          />

          <div className="product-image-wrapper h-[150%] overflow-hidden max-sm:hidden flex">
            <Image layout="fill" src={primaryImage} alt={name} className="product-image" />
            <Image 
              layout="fill" 
              src={secondaryImage} 
              alt={name} 
              className="product-image-hover"
            />
          </div>

          {/* Remove the old sale badge code */}
          {/* Remove or comment out the existing (discountes > 0 || diffInDays <= 3) span */}

          {/* Heart Icon */}
          <div
            className="absolute m-2 top-2 right-2 flex items-center justify-center w-10 h-10 bg-white rounded-full transform translate-x-4 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            onClick={handleAddToWishlist}
          >
            {wishlistLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : (
              <i
                className={`text-xl ${
                  isInWishlist
                    ? "text-black ri-heart-fill"
                    : "text-black ri-heart-line"
                }`}
              ></i>
            )}
          </div>

          {/* Shopping Bag Icon */}
          <button
            className="z-20 absolute bottom-4 right-[10%] md:right-[20%] flex items-center justify-center w-auto h-9 md:w-auto md:h-9 bg-white text-black hover:bg-black hover:text-white rounded-full transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 px-4"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
              setAddedToCart(true);
              setTimeout(() => setAddedToCart(false), 2000);
            }}
          >
            {addedToCart ? 'Added ✓' : 'Add to Cart'}
          </button>

          {/* Quick View Button (For Non-List Layout - Image Hover) */}
          {layout !== "list" && (
            <div
              className="z-20  absolute bottom-4 left-[30%] md:left-1/4 transform -translate-x-1/2  translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
              onClick={handleQuickView}
            >
              <button className="md:px-4 px-2 py-2 bg-white text-black rounded-full text-xs md:text-sm hover:bg-black hover:text-white transition-all duration-150 ease-in-out">
                Quick View
              </button>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div
          className={`p-4 flex flex-col ${
            layout === "list"
              ? "md:w-3/4 w-1/2 pl-10 flex flex-col justify-center items-start"
              : ""
          }`} 
        >
          <h3 className="text-sm md:text-base font-medium text-black mb-2 line-clamp-2 text-left  hover:text-gray-700 pt-2">
            {product.title || name}
          </h3>

          {discount > 0 ? (
            <div className="flex flex-wrap mb-5 gap-2 md:gap-3 items-center">
              <span className="text-sm md:text-md ">{discountedamount}</span>
              {/* <span className="md:text-sm text-xs text-sub-color line-through">
                {variantPrice}
              </span> */}
              <span className="text-black bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs">
                - {discount}% off
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap mb-5 gap-2 md:gap-3 items-center">
              <span className="text-sm md:text-md">{formatPriceToINR(variantPrice)}</span>
              {/* <span className="md:text-sm text-xs text-sub-color line-through">
              {variantPrice}
            </span>
            <span className="text-black bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs">
              - {discount}% off
            </span> */}
            </div>
          )}
          {layout === "list" && (
            <>
              <p className="md:text-sm text-xs text-sub-color mb-2 line-clamp-3 break-words z-30  ">
                {description}
              </p>
              {/* Quick View Button (For List Layout - Below Description) */}
              <div className="mt-2 z-20 ">
                <button
                  className="z-20  px-4 py-2 bg-white text-black rounded-full border border-black text-sm hover:bg-black hover:text-white transition-all duration-150 ease-in-out"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click navigation
                    setIsQuickViewOpen(true);
                  }}
                >
                  Quick View
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickView
          productId={id}
          initialData={product}
          onClose={(e) => {
            e?.stopPropagation();
            setIsQuickViewOpen(false);
          }}
        />
      )}

      {/* Added to Cart Notification */}
      {isCartAdded && (
        <div className="fixed top-20 right-9 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 ">
          Added to Cart
        </div>
      )}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed md:bottom-20 bottom-28 right-5 md:right-20 text-xs  w-fit bg-white text-black  px-4 py-2 rounded-full shadow transition-all hover:bg-gray-100"
        >
          ↑ TOP
        </button>
      )}
    </>
  );
};

export default ProductCard;
