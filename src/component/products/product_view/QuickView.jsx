import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice"; // Update import
import { updateCart } from "../../../lib/data/cart";
import { useRouter } from "next/router";
import { useRegion } from "../../../contexts/RegionContext";
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
    <div onClick={handleContainerClick} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 pb-20 md:pb-5 z-50 ">
      <div className="bg-white w-full md:w-2/3 h-full md:h-auto md:max-h-[90%] rounded-lg flex flex-col md:flex-row transform px-1 pb-2 animate-scale-up sm:overflow-hidden overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300 rounded-full w-8 h-8 flex items-center justify-center text-black"
          onClick={onClose}
        >
          X
        </button>

        {/* Images Section */}
        <div className="md:w-1/3 w-full flex flex-col items-center min-h-20 gap-4 p-4 overflow-y-auto scrollbar-custom">
          <Image
            src={initialData?.images[0]?.url}
            alt={initialData?.images[0]?.alt}
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
          {additionalImages && additionalImages.map((image, index) => (
            <Image
              key={index}
              src={image.url}
              alt={`Additional Image ${index + 1}`}
              width={300}
              height={100}
              className="rounded-lg object-cover"
            />
          ))}
        </div>

        {/* Product Details Section */}
        <div className="md:w-2/3 w-full p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

          {/* Star Rating */}
          <div className="flex items-center mb-4">
            {Array.from({ length: averageRating }, (_, i) => (
              <i key={i} className="ri-star-fill text-yellow-400"></i>
            ))}
          </div>

          {/* Pricing Details */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-md text-theme-blue font-bold">
            ₹ {product?.metadata?.discount > 0
                ? discountedAmount
                : getVariantPrice()}
            </span>
            {product?.metadata?.discount > 0 && (
              <>
                <span className="text-sub-color text-sm line-through">
                ₹ {getVariantPrice()}
                </span>{" "}
                <span className="text-cream bg-discount-color px-2 py-1 rounded-full text-xs font-semibold">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Categories */}
          <div className="mb-4">
            <span className="text-md font-bold">Category: </span>
            {
              initialData?.category?.name
            }
            {/* {categories.map((category, index) => (
              <span key={index} className="text-sm text-sub-color mr-2">
                {category.name}
              </span>
            ))} */}
          </div>

          {/* Colors */}
          <div className="mb-4">
            <span className="text-md font-bold">Color: </span>
            <div className="flex my-2 gap-2">
              {colors?.map((color, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                    selectedColor === color ? "border-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    getVariantPrice();
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-4">
            <span className="text-md font-bold">Size: </span>
            <div className="flex my-2 gap-4">
              {sizes?.map((size, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer ${
                    selectedSize === size ? "border-black" : ""
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    getVariantPrice();
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <h3 className=" text-md font-semibold">Quantity:</h3>
          <div className="flex flex-wrap items-center gap-2 ">
            <div className="flex items-center min-w-20 w-1/3 border rounded-lg">
              <button
                className="px-3 py-2"
                onClick={() => handleQuantityChange("decrement")}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-full text-center"
              />
              <button
                className="px-3 py-2"
                onClick={() => handleQuantityChange("increment")}
              >
                +
              </button>
            </div>
            <button
              className={`w-full  rounded-lg px-6 py-2 ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-white border-2 border-gray-300"
              }`}
              onClick={handleAddToCart}
            >
              {isAdded ? "Added to Cart" : "Add to Cart"}
            </button>
            <button onClick={()=>handleBuyNow()} className="bg-black text-white w-full px-6 py-2 rounded-lg ">
              Buy It Now
            </button>
          </div>

          {/* Buy Now Button */}
        </div>
      </div>
    </div>
  );
};

export default QuickView;
