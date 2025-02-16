import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice"; // Update import
import { useRouter } from "next/router";
import { useRegion } from "../../../contexts/RegionContext";
import { formatPriceToINR } from "../../../../utils/currencyUtils"; // Add this import
import { size } from "lodash";

const QuickView = ({ productId, initialData, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { region } = useRegion();
  const { products, filters } = useSelector((state) => state.shop);

  console.log("This is the Products of the QuickView", products);
  console.log("This is the initialData of the QuickView", initialData);

  // Group all useState declarations together
  const [product, setProduct] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [warning, setWarning] = useState("");
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [variantPrice, setVariantPrice] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  // Group useEffects together
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Debug log for initialData
  useEffect(() => {
    console.log('Initial data variants:', initialData?.variants);
  }, [initialData]);

  // Updated useEffect for sizes and colors
  useEffect(() => {
    if (initialData?.variants) {
      // Direct access to size and color properties
      const sizesArray = [...new Set(initialData.variants.map(variant => variant.size))].filter(Boolean);
      const colorsArray = [...new Set(initialData.variants.map(variant => variant.color))].filter(Boolean);

      if (sizesArray.length > 0) {
        setSizes(sizesArray);
        setSelectedSize(sizesArray[0]); // Set first size as default
      }

      if (colorsArray.length > 0) {
        setColors(colorsArray);
        setSelectedColor(colorsArray[0]); // Set first color as default
      }

      // Set initial variant
      if (initialData.variants[0]) {
        setSelectedVariant(initialData.variants[0]);
      }
    }
  }, [initialData]);

  console.log(sizes  , "This is the size of the QuickView");
  console.log(colors  , "This is the color of the QuickView");
  useEffect(() => {
    setLoading(true);
    const currentProduct = products.find(p => p.id === productId);
    if (currentProduct) {
      // const uniqueColors = [...new Set(currentProduct.variants
      //   .map(variant => variant.options?.find(opt => opt.option_id === "opt_color")?.value)
      //   .filter(Boolean))];
      
      // const uniqueSizes = [...new Set(currentProduct.variants
      //   .map(variant => variant.options?.find(opt => opt.option_id === "opt_size")?.value)
      //   .filter(Boolean))];

      const productCategories = filters.categories.filter(cat => 
        currentProduct.categories?.includes(cat.id)
      );

      setProduct(currentProduct);
      // setColors(uniqueColors);
      // setSizes(uniqueSizes);
      setCategories(productCategories);
      
      // Set initial variant and price
      if (currentProduct.variants?.length > 0) {
        setSelectedVariant(currentProduct.variants[0]);
        setVariantPrice(currentProduct.variants[0].price);
        
        if (currentProduct.metadata?.discount) {
          setDiscount(currentProduct.metadata.discount);
          const discounted = currentProduct.variants[0].price * (1 - currentProduct.metadata.discount / 100);
          setDiscountedAmount(discounted);
        }
      }
      
      setLoading(false);
    }
  }, [productId, products, filters]);

  // Helper functions
  const getCurrentVariant = () => {
    return product?.variants?.find(variant => 
      (!selectedColor || variant.options?.some(opt => opt.value === selectedColor)) &&
      (!selectedSize || variant.options?.some(opt => opt.value === selectedSize))
    );
  };

  const getVariantPrice = () => {
    const variant = getCurrentVariant();
    return variant?.price || product?.variants?.[0]?.price || 0;
  };

  // Handler functions
  const handleQuantityChange = (type) => {
    setQuantity(prev => type === "increment" ? prev + 1 : Math.max(1, prev - 1));
  };

  const handleAddToCart = async () => {
    console.log("Handle Add To Cart is called of the Quick View");
    // if (!selectedSize) {
    //   setWarning("Please select a size.");
    //   setIsProgressVisible(true);
    //   setTimeout(() => {
    //     setWarning("");
    //     setIsProgressVisible(false);
    //   }, 3000);
    //   return;
    // }

    console.log("hello")
    try {
      // Create the action payload object
      const payload = {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity
      };

      console.log('Adding to cart:', payload);

      // Dispatch the action and await the result
      await dispatch(addToCart(payload)).unwrap();

      // Show success state
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setWarning("Failed to add to cart");
    }
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  // Loading state check
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleContainerClick} 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50 backdrop-blur-sm"
    >
      <div className="bg-white w-full md:w-4/5 lg:w-3/4 h-[90vh] rounded-2xl flex flex-col md:flex-row relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-black hover:text-white transition-all duration-300"
        >
          ✕
        </button>

        {/* Images Section - Left */}
        <div className="md:w-1/2 p-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
              <Image
                src={initialData?.images[0]?.url}
                alt={initialData?.images[0]?.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Additional Images */}
            <div className="grid grid-cols-2 gap-4">
              {initialData?.variants?.[0]?.images?.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={image.url}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details - Right */}
        <div className="md:w-1/2 p-8 overflow-y-auto scrollbar-hide bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          
          {/* Category */}
          <div className="mb-6">
            <span className="text-gray-600">Category: </span>
            <span className="font-medium">{initialData?.category?.name}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-theme-blue">
              {product?.metadata?.discount > 0
                ? formatPriceToINR(discountedAmount)
                : formatPriceToINR(getVariantPrice())}
            </span>
            {product?.metadata?.discount > 0 && (
              <>
                <span className="text-gray-400 line-through">
                  {formatPriceToINR(getVariantPrice())}
                </span>
                <span className="bg-[#D2EF9A] text-black px-2 py-1 rounded-full text-sm">
                  -{discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Colors */}
          {colors?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Color</h3>
              <div className="flex gap-3">
                {colors?.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-theme-blue ring-2 ring-theme-blue ring-offset-2'
                        : 'border-gray-300 hover:border-theme-blue'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {sizes?.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? 'border-theme-blue bg-theme-blue text-white'
                        : 'border-gray-300 hover:border-theme-blue'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Quantity</h3>
            <div className="flex items-center h-12 w-32 border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-full text-center bg-transparent"
              />
              <button
                onClick={() => handleQuantityChange("increment")}
                className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className={`w-full h-12 rounded-full transition-all ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-theme-blue text-white hover:bg-black'
              }`}
            >
              {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={() => handleBuyNow()}
              className="w-full h-12 rounded-full bg-black text-white hover:bg-theme-blue transition-all"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
