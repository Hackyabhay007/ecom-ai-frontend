import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice";

const QuickView = ({ product, onClose }) => {
  const {
    id,
    name,
    price,
    prevPrice,
    discount,
    image,
    additionalImages = [],
    averageRating = 0,
    categories = [],
    color = [],
    size = [],
  } = product;

  const dispatch = useDispatch();

  const [selectedColor, setSelectedColor] = useState(color[0] || null);
  const [selectedSize, setSelectedSize] = useState(size[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [warning, setWarning] = useState("");
  const [isProgressVisible, setIsProgressVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
        id,
        name,
        price,
        quantity,
        image,
        color: selectedColor,
        size: selectedSize,
        categories,
      })
    );

    setWarning("");
    setIsAdded(true);

    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 pb-20 md:pb-5 z-50">
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
            src={image}
            alt={name}
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
          {additionalImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Additional Image ${index + 1}`}
              width={300}
              height={100}
              className="rounded-lg object-cover"
            />
          ))}
        </div>

        {/* Product Details Section */}
        <div className="md:w-2/3 w-full p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{name}</h1>

          {/* Star Rating */}
          <div className="flex items-center mb-4">
            {Array.from({ length: averageRating }, (_, i) => (
              <i key={i} className="ri-star-fill text-yellow-400"></i>
            ))}
          </div>

          {/* Pricing Details */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lg">₹{price}</span>
            <span className="line-through text-sub-color text-sm">₹{prevPrice}</span>
            <span className="bg-discount-color text-black px-2 py-1 rounded-full text-xs">
              -{discount}%
            </span>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <span className="text-md font-bold">Category: </span>
            {categories.map((category, index) => (
              <span key={index} className="text-sm text-sub-color mr-2">
                {category}
              </span>
            ))}
          </div>

          {/* Colors */}
          <div className="mb-4">
            <span className="text-md font-bold">Color: </span>
            <div className="flex my-2 gap-2">
              {color.map((color, index) => (
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

          {/* Sizes */}
          <div className="mb-4">
            <span className="text-md font-bold">Size: </span>
            <div className="flex my-2 gap-4">
              {size.map((size, index) => (
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
          <h3 className="my-2 text-md font-semibold">Quantity:</h3>
          <div className="flex flex-wrap items-center gap-2 mb-6">
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
          </div>

          {/* Buy Now Button */}
          <button className="bg-black text-white w-full px-6 py-2 rounded-lg mb-4">
            Buy It Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
