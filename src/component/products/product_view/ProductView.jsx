import React, { useState } from "react";
import Image from "next/image";
import ProductDetails from "./ProductDetails";
import CustomerReview from "./CustomerReview.jsx";
import CustomerComment from "./CustomerComment";
import RelatedProducts from "./RelatedProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice";
import ProductDetailsInfo from "./ProductDetailsInfo";
const ProductView = ({ product, allProducts }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [warning, setWarning] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
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

  const handleImageClick = (selectedImage) => {
    if (selectedImage !== mainImage) {
      setSlideDirection("right-to-left");
      setTimeout(() => {
        const updatedImages = [
          mainImage,
          ...additionalImages.filter((img) => img !== selectedImage),
        ];
        setMainImage(selectedImage);
        setAdditionalImages(updatedImages);
        setSlideDirection("");
      }, 300);
    }
  };

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
    <div className="">
            {warning && (
        <div className="fixed top-20 right-10 z-50 flex flex-col items-center bg-white text-[#112A46] border-t-4 border-red-500  rounded-b-lg shadow shadow-black p-4 w-72">
          <div className="flex items-center w-full">
            <i className="ri-error-warning-line mr-3 text-xl"></i>
            <p className="font-bold">{warning}</p>
          </div>
          {/* Progressive Bar */}
          <div className="relative mt-2 w-full h-1 bg-red-300 overflow-hidden rounded">
            {isProgressVisible && (
              <div className="absolute top-0 left-0 h-1 bg-[#112A46] animate-progress-bar"></div>
            )}
          </div>
        </div>
      )}

      {/* Product Images and Details */}
      <div className="w-full container mx-auto py-8 px-2">
  {/* Images Section */}
  <div className="flex w-full">
    {[mainImage, ...additionalImages].map((img, index) => (
      <div
        key={index}
        className="relative flex-1 h-96  overflow-hidden"
        style={{ flexBasis: `${100 / (additionalImages.length + 1)}%` }}
      >
        <Image
          src={img}
          alt={`Product Image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className=""
        />
      </div>
    ))}
  </div>

  {/* Product Details Section */}
  <div className="px-5 py-10">
    <h1 className="text-2xl mb-2">{name}</h1>
    {/* Star Rating */}
    <div className="flex items-center mb-4">{renderStars(averageRating)}</div>

    {/* Pricing Details */}
    <div className="flex items-center gap-4 mb-4">
      <span className="text-xl text-cream">₹{price}</span>
      <span className="text-sub-color line-through">₹{prevPrice}</span>
      <span className="text-cream bg-discount-color px-2 py-1 rounded-full text-xs font-semibold">
        -{discount}%
      </span>
    </div>

    {/* Category */}
    <div className="mb-4">
      <span className="text-sm text-cream">Category: </span>
      {categories.map((category, index) => (
        <span
          key={index}
          className="text-sm text-sub-color cursor-pointer mr-2"
        >
          {category}
        </span>
      ))}
    </div>

    {/* Colors */}
    <div className="mb-4">
      <span className="text-sm text-cream">Color: </span>
      <div className="flex gap-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
              selectedColor === color ? "border-black" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>

    {/* Size Selection */}
    <div className="mb-4">
      <span className="text-sm text-cream">Size: </span>
      <div className="flex gap-4">
        {sizes.map((size, index) => (
          <div
            key={index}
            className={`w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer ${
              selectedSize === size ? "border-black" : ""
            }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </div>
        ))}
      </div>
    </div>

    {/* Quantity and Add to Cart */}
    <h3 className="my-2 text-black">Quantity:</h3>
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center w-1/4 border rounded-lg">
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
        className={`w-3/4 rounded-lg px-6 py-2 text-black ${
          isAdded ? "bg-discount-color" : "bg-white border-2 border-cream"
        }`}
        onClick={handleAddToCart}
      >
        {isAdded ? (
          <>
            <i className="ri-luggage-cart-line mr-2"></i> Added to Cart
          </>
        ) : (
          "Add to Cart"
        )}
      </button>
    </div>

    {/* Buy Now, Compare, Share */}
    <button className="bg-black text-white w-full px-6 py-2 rounded-lg mb-4">
      Buy It Now
    </button>
    <div className="flex gap-4 mt-4">
      <button className="text-black flex items-center gap-2">
        <span>
          <i className="ri-expand-width-fill text-xl border rounded-lg p-2"></i>
        </span>{" "}
        Compare
      </button>
      <button className="text-black flex items-center gap-2">
        <span>
          <i className="ri-share-fill text-xl border rounded-lg p-2"></i>
        </span>{" "}
        Share
      </button>
    </div>
  </div>
</div>


      {/* Additional Sections */}
      <ProductDetailsInfo categories={categories} />
      <ProductDetails product={product} />
      <CustomerReview reviews={reviews} />
      <CustomerComment />

      {/* Related Products */}
      <RelatedProducts currentProduct={product} allProducts={allProducts} />
    </div>
  );
};

export default ProductView;
