"use server";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ProductDetails from "./ProductDetails";
import CustomerReview from "./CustomerReview.jsx";
import CustomerComment from "./CustomerComment";
import RelatedProducts from "./RelatedProducts";
import { useDispatch } from "react-redux";
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
import {addProduct} from "@/redux/slices/intrestedSlice"

const ProductView = ({ product, allProducts }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const router = useRouter();
  const { region } = useRegion();
  // console.log(product);
  const [selectedSize, setSelectedSize] = useState(null);
  const [warning, setWarning] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isCustomSizeVisible, setIsCustomSizeVisible] = useState(false);
  const [customSize, setCustomSize] = useState(null);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountedamount, setDiscountedamount] = useState(0);
  const [selectedVariant, setselectedVariant] = useState([]);
  const { updateCart, cart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  // // console.log(region, "region");

  const [rating, setRating] = useState([]);
  const [avaragerating, setAvaragerating] = useState(0);

  // store/products/get-product-with-review-and-category/prod_01JHSYYSJD80XCWWVMDM1QV6ZA

  useMemo(() => {
    if (product) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/get-product-with-review-and-category/${product.id}`,
          {
            headers: {
              "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
            },
          }
        )
        .then((res) => {
          const responses = res.data.productsubdetails;
          // console.log(res.data.productsubdetails);
          if (responses?.reviews) {
            setRating(responses.reviews);
            setAvaragerating(responses.averageRating);
          }
          if (responses?.categories) {
            setCategory(responses.categories);
          }
        });
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      setIsLoading(false);
    }
  }, [product]);
  

  

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
    process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
    if (!selectedSize) {
      setWarning("Please select  size.");
      setIsProgressVisible(true);

      setTimeout(() => {
        setWarning("");
        setIsProgressVisible(false);
      }, 3000);
      return;
    }
      if (!selectedSize) {
        setWarning("Please select  size.");
        setIsProgressVisible(true);
  
        setTimeout(() => {
          setWarning("");
          setIsProgressVisible(false);
        }, 3000);
        return;
      }
  
      // Rest of handleAddToCart implementation...
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* Image carousel component */}
            <ImageCarousel images={product?.images || []} />
          </div>
          <div>
            <>
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
                {product?.description}
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
              product={product}
              reviews={rating}
            />
          </>
        </div>
      </div>

      {/* Additional Sections */}
      <ProductDetailsInfo categories={category} />
      <>
        <ProductDetails product={product} />
        <CustomerReview reviews={rating} />
      </>
      {/* <RelatedProducts currentProduct={product} allProducts={allProducts} /> */}
      {/* <CustomerComment /> */}

      {/* Related Products */}
      </div>
    );
};

export default ProductView;