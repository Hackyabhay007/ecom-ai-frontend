import React, { useState } from "react";
import Image from "next/image";
import ProductDetails from "./ProductDetails";
import CustomerReview from "./CustomerReview.jsx";
import CustomerComment from "./CustomerComment";
import RelatedProducts from "./RelatedProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice";
import ProductDetailsInfo from "./ProductDetailsInfo";
import CustomSize from "./CustomSize";
import HandleInfo from "./HandleInfo";
import ImageCarousel from "./ImageCrousal";
import products from "../data/product_data";
const ProductView = ({ product, allProducts }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [warning, setWarning] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isCustomSizeVisible, setIsCustomSizeVisible] = useState(false);
  const [customSize, setCustomSize] = useState(null);

  const handleApplyCustomSize = (size) => {
    setCustomSize(size);
    setSelectedSize("Custom");
  };
  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setWarning("Please select both color and size.");
      setIsProgressVisible(true);

      setTimeout(() => {
        setWarning("");
        setIsProgressVisible(false);
      }, 3000);
      return;
    }
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        color: selectedColor,
        size: selectedSize,
        categories: product.categories,
      })
    );
    setWarning(""); // Clear warning on successful addition
    setIsAdded(true); // Indicate item was added

    // Reset isAdded after 3 seconds
    setTimeout(() => setIsAdded(false), 3000);
  };

  const {
    name,
    price,
    prevPrice,
    discount,
    image,
    additionalImages: initialAdditionalImages,
    reviews,
    categories,
    colors,
    sizes,
  } = product;

  const [mainImage, setMainImage] = useState(image);
  const [additionalImages, setAdditionalImages] = useState(
    initialAdditionalImages
  );
  const [slideDirection, setSlideDirection] = useState("");

  const getAverageRating = () => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return reviews.length ? Math.round(totalRating / reviews.length) : 0;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        style={{
          color: index < rating ? "#FFD700" : "#D3D3D3", // Gold for filled, Light Gray for empty
          fontSize: "1.5rem", // Adjust size as needed
          marginRight: "0.2rem",
        }}
      >
        ★
      </span>
    ));
  };

  const averageRating = getAverageRating();

  return (
    <div className="mb-10 md:mb-0">
      {/* Product Images and Details */}
      <div className="w-full container mx-auto py-8 px-2 flex flex-col md:flex-row">
        {/* Images Section */}
        <ImageCarousel mainImage={image} additionalImages={additionalImages} />

        {/* Product Details Section */}
        <div className="md:flex-1 px-5 py-10">
          <h1 className="text-2xl font-bold text-theme-blue mb-2">{name}</h1>
          {/* Star Rating */}
          {/* <div className="flex items-center mb-4">{renderStars(averageRating)}</div> */}
          {/* Category */}
          <div className="mb-4">
            <span className="text-sm text-theme-blue">Category: </span>
            {categories.map((category, index) => (
              <span
                key={index}
                className="text-xs text-theme-blue cursor-pointer mr-1"
              >
                {category}
                {index < categories.length - 1 && " ,"}
              </span>
            ))}
          </div>

          {/* Pricing Details */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-md text-theme-blue font-bold">₹{price}</span>
            <span className="text-sub-color text-sm line-through">
              ₹{prevPrice}
            </span>
            {/* <span className="text-cream bg-discount-color px-2 py-1 rounded-full text-xs font-semibold">
        -{discount}%
      </span> */}
          </div>

          {/* Colors */}
          <div className="mb-4">
            <span className="text-sm text-cream">Color: </span>
            <div className="flex gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-lg border-2 cursor-pointer ${
                    selectedColor === color ? "border-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4 text-xs">
            <span className="text-sm text-cream">Size: </span>
            <div className="flex flex-wrap gap-4">
              {product.sizes.map((size, index) => (
                <div
                  key={index}
                  className={`w-14 h-8  border px-2 rounded-lg flex items-center justify-center cursor-pointer ${
                    selectedSize === size ? "border-black" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
              <div
                className={`w-fit hover:bg-discount-color border border-gray-300 rounded-lg transition-all px-4 h-8 flex items-center justify-center cursor-pointer ${
                  selectedSize === "Custom" ? "border-black" : ""
                }`}
                onClick={() => setIsCustomSizeVisible(true)}
              >
                Custom size
              </div>
              {warning && !selectedSize && (
                <div className="text-red-700 text-sm mt-2 capitalize">
                  <i class="ri-information-fill"></i> Please select a size
                </div>
              )}
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

          {/* Add to Cart and Buy Now */}
          <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center gap-4 mb-6">
            <button
              className={`flex-1 w-full md:w-1/2 px-6 py-2 bg-black text-black  ${
                isAdded ? "bg-discount-color " : "bg-black text-white"
              }`}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <>
                  <i className="ri-luggage-cart-line mr-2"></i> Added
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
            <button className="flex-1 w-full md:w-1/2 bg-white text-black border border-cream px-6 py-2">
              Buy It Now
            </button>
          </div>
          {/* Product Description */}
          <div className="my-8">
            <p className="text-theme-blue text-sm leading-relaxed">
              {product.description}
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
            categories={categories}
            product={product}
            reviews={reviews}
          />
        </div>
      </div>

      {/* Additional Sections */}
      {/* <ProductDetailsInfo categories={categories} />
      <ProductDetails product={product} />
      <CustomerReview reviews={reviews} /> */}
      <RelatedProducts currentProduct={product} allProducts={allProducts} />
      {/* <CustomerComment /> */}

      {/* Related Products */}
    </div>
  );
};

export default ProductView;
