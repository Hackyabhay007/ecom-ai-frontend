"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductDetails from "./ProductDetails";
import CustomerReview from "./CustomerReview.jsx";
import CustomerComment from "./CustomerComment";
import RelatedProducts from "./RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { addToCartoncaches } from "../../../../redux/slices/cartSlice";
import ProductDetailsInfo from "./ProductDetailsInfo";
import CustomSize from "./CustomSize";
import HandleInfo from "./HandleInfo";
import ImageCarousel from "./ImageCrousal";
import products from "../data/product_data";
import { useRegion } from "../../../contexts/RegionContext";
import axios from "axios";
import {
  addToCart,
  updateLineItem,
  appendToCart,
} from "../../../lib/data/cart";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";
import Loader from "../../loader/Loader";
import { addProduct } from "@/redux/slices/intrestedSlice";
import { fetchSingleProduct } from "../../../../redux/slices/shopSlice";

const ProductView = ({ productId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Get data from Redux store
  const { selectedProduct, selectedProductLoading, selectedProductError } = useSelector(
    (state) => state.shop,
    (prev, next) => {
      // Prevent unnecessary re-renders
      return prev.selectedProduct?.id === next.selectedProduct?.id &&
             prev.selectedProductLoading === next.selectedProductLoading &&
             prev.selectedProductError === next.selectedProductError;
    }
  );

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [warning, setWarning] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isCustomSizeVisible, setIsCustomSizeVisible] = useState(false);
  const [category, setCategory] = useState([]);
  const { updateCart } = useCart();
  
  // Initialize ratings state with empty array and 0 average
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // Add new state for images
  const [productImages, setProductImages] = useState([]);

  // Update state declarations
  const [selectedColor, setSelectedColor] = useState(null);
  const [price, setPrice] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // Add customSize state
  const [customSize, setCustomSize] = useState(null);

  // Add renderStars function
  const renderStars = (rating) => {
    const stars = [];
    const totalStars = 5;
    const filledStars = Math.round(rating);

    for (let i = 0; i < totalStars; i++) {
      if (i < filledStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </span>
        );
      }
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Only fetch product if we don't have it already
  useEffect(() => {
    if (productId && (!selectedProduct || selectedProduct.id !== productId)) {
      dispatch(fetchSingleProduct(productId));
    }
  }, [dispatch, productId, selectedProduct]);

  // Update local state when product data changes
  useEffect(() => {
    if (selectedProduct?.variants?.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
      setSelectedSize(selectedProduct.variants[0].size);
      setCategory(selectedProduct.category ? [selectedProduct.category] : []);
    }
  }, [selectedProduct?.id]); // Only run when product ID changes

  // Add useEffect for ratings
  useEffect(() => {
    if (selectedProduct?.ratings) {
      setRatings(selectedProduct.ratings);
      // Calculate average if ratings exist
      const avg = selectedProduct.ratings.length > 0
        ? selectedProduct.ratings.reduce((acc, curr) => acc + curr.rating, 0) / selectedProduct.ratings.length
        : 0;
      setAverageRating(avg);
    }
  }, [selectedProduct?.ratings]);

  // Add new useEffect to handle images
  useEffect(() => {
    if (selectedProduct?.variants) {
      const allImages = selectedProduct.variants.reduce((acc, variant) => {
        if (variant.images && variant.images.length > 0) {
          const variantImages = variant.images.map(img => ({
            url: img.url,
            alt: img.alt || variant.color,
            isPrimary: img.isPrimary || false
          }));
          return [...acc, ...variantImages];
        }
        return acc;
      }, []);

      const sortedImages = allImages.sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return 0;
      });

      setProductImages(sortedImages);
    }
  }, [selectedProduct]);

  // Add effect to process variant data
  useEffect(() => {
    if (selectedProduct?.variants) {
      // Extract unique sizes and colors
      const uniqueSizes = [...new Set(selectedProduct.variants.map(v => v.size))];
      const uniqueColors = [...new Set(selectedProduct.variants.map(v => v.color))];
      
      setSizes(uniqueSizes);
      setColors(uniqueColors);

      // Set initial variant and price
      if (selectedProduct.variants.length > 0) {
        const initialVariant = selectedProduct.variants[0];
        setSelectedVariant(initialVariant);
        setSelectedColor(initialVariant.color);
        setSelectedSize(initialVariant.size);
        setPrice(initialVariant.price);
        
        // Handle sale price if available
        if (initialVariant.isOnSale && initialVariant.salePrice) {
          const discountPercentage = Math.round((1 - initialVariant.salePrice / initialVariant.price) * 100);
          setDiscount(discountPercentage);
          setDiscountedAmount(initialVariant.salePrice);
        }
      }
    }
  }, [selectedProduct]);

  // Update price when variant changes
  const getPriceForVariant = () => {
    const variant = selectedProduct.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
    
    if (variant) {
      setPrice(variant.price);
      if (variant.isOnSale && variant.salePrice) {
        const discountPercentage = Math.round((1 - variant.salePrice / variant.price) * 100);
        setDiscount(discountPercentage);
        setDiscountedAmount(variant.salePrice);
      } else {
        setDiscount(0);
        setDiscountedAmount(null);
      }
    }
  };

  useEffect(() => {
    if (selectedSize && selectedColor) {
      getPriceForVariant();
    }
  }, [selectedSize, selectedColor]);

  const handleApplyCustomSize = (size) => {
    setCustomSize(size);
    setSelectedSize("Custom");
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setWarning("Please select size.");
      setIsProgressVisible(true);
      setTimeout(() => {
        setWarning("");
        setIsProgressVisible(false);
      }, 3000);
      return;
    }

    const variantToAdd = selectedProduct.variants.find(v => v.size === selectedSize);
    if (!variantToAdd) {
      setWarning("Selected size not available");
      return;
    }

    // ... rest of your cart logic
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setWarning("Please select size.");
      setIsProgressVisible(true);
      setTimeout(() => {
        setWarning("");
        setIsProgressVisible(false);
      }, 3000);
      return;
    }

    const variantToAdd = selectedProduct.variants.find(v => v.size === selectedSize);
    if (!variantToAdd) {
      setWarning("Selected size not available");
      return;
    }

    try {
      await handleAddToCart();
      router.push('/checkout');
    } catch (error) {
      setWarning("Error processing purchase");
      console.error("Buy now error:", error);
    }
  };

  if (selectedProductLoading) {
    return <Loader />;
  }

  if (selectedProductError) {
    return <div>Error loading product: {selectedProductError}</div>;
  }

  if (!selectedProduct) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full">
          {/* Explicitly log images before passing to carousel */}
          {console.log('Images being passed to carousel:', productImages)}
          <ImageCarousel images={productImages} />
        </div>
        <div>
          {/* Product Title */}
          <h1 className="text-2xl font-bold mb-4">{selectedProduct.name}</h1>
            
          {/* Star Rating */}
          <div className="flex items-center mb-4">
            {renderStars(averageRating)}
          </div>

          
          {/* Category */}
          {selectedProduct.category && (
            <div className="mb-4">
              <span className="text-sm text-theme-blue">Category: </span>
              <span className="text-xs text-theme-blue cursor-pointer">
                {selectedProduct.category.name}
              </span>
            </div>
          )}

          {/* Pricing Details */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-md text-theme-blue font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(discountedAmount || price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-sub-color text-sm line-through">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                  }).format(price)}
                </span>
                <span className="text-cream bg-discount-color px-2 py-1 rounded-full text-xs font-semibold">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div>
            {/* Colors */}
            {colors && (
              <div className="mb-4">
                <span className="text-sm text-cream">Color: </span>
                <div className="flex gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-lg border-2 cursor-pointer bg-red-300 ${
                        selectedColor === color ? "border-black" : ""
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }} // Ensures proper color formatting
                      onClick={() => {
                        setSelectedColor(color);
                        getPriceForVariant();
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-4 text-xs">
              <span className="text-sm text-cream">Size: </span>
              <div className="flex flex-wrap gap-4">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`w-14 h-8 border px-2 rounded-lg flex items-center justify-center cursor-pointer ${
                      selectedSize === size ? "border-black" : ""
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      getPriceForVariant();
                    }}
                  >
                    {size}
                  </button>
                ))}
                <button
                  className={`w-fit hover:bg-discount-color border border-gray-300 rounded-lg transition-all px-4 h-8 flex items-center justify-center cursor-pointer ${
                    selectedSize === "Custom" ? "border-black" : ""
                  }`}
                  onClick={() => setIsCustomSizeVisible(true)}
                >
                  Custom size
                </button>
                {warning && !selectedSize && (
                  <div className="text-red-700 text-sm mt-2 capitalize">
                    <i className="ri-information-fill"></i> Please select a size
                  </div>
                )}
              </div>
            </div>

            {customSize && (
              <div className="mt-2 text-sm text-gray-600">
                Custom Size Selected: Chest {customSize.chest} cm, Sleeve{" "}
                {customSize.sleeve} cm, Shoulder {customSize.shoulder} cm, Waist{" "}
                {customSize.waist} cm
              </div>
            )}
          </div>

          {/* Render CustomSize popup */}
          {isCustomSizeVisible && (
            <CustomSize
              onClose={() => setIsCustomSizeVisible(false)}
              onApply={(selectedSizes) => {
                setCustomSize(selectedSizes);
                setSelectedSize("Custom");
              }}
            />
          )}



            {/* Render CustomSize popup */}
            {isCustomSizeVisible && (
              <CustomSize
                onClose={() => setIsCustomSizeVisible(false)}
                onApply={(selectedSizes) => {
                  setCustomSize(selectedSizes);
                  setSelectedSize("Custom");
                }}
              />
            )}

            {/* Add to Cart and Buy Now */}
            <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center gap-4 mb-6">
              <button
                className={`flex-1 w-full md:w-1/2 px-6 py-2 bg-black text-black  ${
                  isAdded ? "bg-discount-color " : "bg-black text-white"
                }`}
                onClick={() => {
                  handleAddToCart();
                  // console.log("run");
                }}
              >
                {isAdded ? (
                  <>
                    <i className="ri-luggage-cart-line mr-2"></i> Added
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 w-full md:w-1/2 bg-white text-black border border-cream px-6 py-2"
              >
                Buy It Now
              </button>
            </div>
            {/* Product Description */}
            <div className="my-8">
              <p className="text-theme-blue text-sm leading-relaxed">
                {selectedProduct?.description}
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="text-black flex items-center gap-2">
                <span>
                  <i className="ri-share-fill text-xl border rounded-lg p-2"></i>
                </span>{" "}
                Share
              </button>
            </div>
            <HandleInfo
              categories={category}
              product={selectedProduct}
              reviews={ratings} // Changed from rating to ratings
            />
        </div>
      </div>

      {/* Additional Sections */}
      <ProductDetailsInfo categories={category} />
      <>
        <ProductDetails product={selectedProduct} />
        <CustomerReview reviews={ratings} /> {/* Changed from rating to ratings */}
      </>
      {/* <RelatedProducts currentProduct={selectedProduct} allProducts={allProducts} /> */}
      {/* <CustomerComment /> */}

      {/* Related Products */}
    </div>
  );
};

export default React.memo(ProductView); // Add memoization