import React, { useEffect, useMemo, useState } from "react";
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
import { useRegion } from "../../../contexts/RegionContext";
import axios from "axios";
import { useRouter } from "next/router";

const ProductView = ({  product, allProducts }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
     null
  );
  const router = useRouter();
  const { region } = useRegion();
  console.log(product);
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

  const [rating, setRating] = useState([]);
  const [avaragerating, setAvaragerating] = useState(0);

  // store/products/get-product-with-review-and-category/prod_01JHSYYSJD80XCWWVMDM1QV6ZA

  useMemo(() => {
    if(product){
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
        console.log(res.data.productsubdetails);
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


  const handleBuyNow = () => {
    if (!selectedSize) {
      setWarning("Please select a size.");
      setTimeout(() => setWarning(""), 3000);
      return;
    }
    const checkoutProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      discount: product.discount,
    };
    router.push({
      pathname: "/checkout",
      query: { product: JSON.stringify(checkoutProduct) },
    });
  };

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
        discount: product.discount,
      })
    );
    setWarning(""); // Clear warning on successful addition
    setIsAdded(true); // Indicate item was added

    // Reset isAdded after 3 seconds
    setTimeout(() => setIsAdded(false), 3000);
  };


  const [mainImage, setMainImage] = useState(product?.thumbnail);
  const [additionalImages, setAdditionalImages] = useState();
  // initialAdditionalImages
  const [slideDirection, setSlideDirection] = useState("");
 

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <i key={i} className="ri-star-fill text-yellow-400"></i>
    ));
  };
  
  
  useMemo(() => {
      if(region){
        const targetVariant =
        selectedSize && selectedColor
          ? product?.variants.find((v) =>
              v.options?.some(
                (option) =>
                  option.value.toLowerCase() === selectedColor.toLowerCase() &&
                  v.options?.some(
                    (option) =>
                      option.value.toLowerCase() === selectedSize.toLowerCase()
                  )
              )
            )
          : selectedColor
          ? product?.variants.find((variant) =>
              variant.options?.some(
                (option) =>
                  option.value.toLowerCase() === selectedColor.toLowerCase()
              )
            )
          : selectedSize
          ? product?.variants.find((variant) =>
              variant.options?.some(
                (option) => option.value.toLowerCase() === selectedSize.toLowerCase()
              )
            )
          : product?.variants.find((variant) =>
              variant.options?.some(
                (option) => option.value.toLowerCase() === "m"
              )
            );
  
      console.log(
        targetVariant,
        "this is target vaiant",
        selectedColor,
        selectedSize,
        product
      );
  
      if (targetVariant) {
        setPrice(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: region?.currency_code,
          }).format(targetVariant.calculated_price?.calculated_amount)
        );
  
        const calculatedAmount =
          targetVariant.calculated_price?.calculated_amount;
  
        if (product.metadata?.discount) {
          setDiscount(product.metadata.discount);
          // console.log();
        }
        if (calculatedAmount && product.metadata?.discount > 0) {
          setDiscountedamount(
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: region?.currency_code,
            }).format(
              calculatedAmount -
                calculatedAmount * (product.metadata?.discount / 100)
            )
          );
        } else {
          setDiscountedamount(0); // Or handle the case when there's no valid amount/discount
        }
        // setLoading(false);
      } else {
        setPrice("N/A");
      }
      }
    }, [product?.metadata,  region, discount, selectedColor, selectedSize]);

  useEffect(() => {
    if (product?.images) {
      const images = product?.images.map((i) => i.url);
      setAdditionalImages(images);
      console.log(images);
    }
  }, [product]);

  const colors =
    product?.options
      ?.find((option) => option.title === "Color")
      ?.values.map((v) => v.value) || [];
  const sizes =
    product?.options
      ?.find((option) => option.title === "Size")
      ?.values.map((v) => v.value) || [];

  function getPriceForVariant() {
    // Find the variant matching the selected color and size
    const variant = product.variants.find(
      (v) =>
        v.options.some(
          (o) => o.option.title === "Color" && o.value === selectedColor
        ) &&
        v.options.some(
          (o) => o.option.title === "Size" && o.value === selectedSize
        )
    );

    console.log(variant?.calculated_price?.calculated_amount);

    // Return the price if a variant is found
    setPrice(variant?.calculated_price?.calculated_amount);
    return variant ? variant?.calculated_price?.calculated_amount : null;
  }

  return (
    <div className="mb-10 md:mb-0">
      {/* Product Images and Details */}
      <div className="w-full container mx-auto py-8 px-2 flex flex-col md:flex-row">
        {/* Images Section */}
        <ImageCarousel
          mainImage={product?.thumbnail}
          additionalImages={additionalImages}
        />
        {/* Product Details Section */}
        <div className="md:flex-1 px-5 py-10">
          <h1 className="text-2xl font-bold text-theme-blue mb-2">
            {product?.title}{" "}
          </h1>
          {/* Star Rating */}
          <div className="flex items-center mb-4">{renderStars(avaragerating)}</div>
          {/* Category */}
          <div className="mb-4">
            <span className="text-sm text-theme-blue">Category: </span>
            {category.map((category, index) => (
              <span
                key={index}
                className="text-xs text-theme-blue cursor-pointer mr-1"
              >
                {category.name}
                {index < category.length - 1 && " ,"}
              </span>
            ))}
          </div>

          {/* Pricing Details */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-md text-theme-blue font-bold">
              {product?.metadata?.discount > 0 ?  discountedamount : price}
            </span>
            {product?.metadata?.discount > 0 && (
              <>
                <span className="text-sub-color text-sm line-through">
                  {price}
                </span>{" "}
                <span className="text-cream bg-discount-color px-2 py-1 rounded-full text-xs font-semibold">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div>
            {/* Colors */}
           {colors &&  <div className="mb-4">
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
            </div>}

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
            <button onClick={handleBuyNow}  className="flex-1 w-full md:w-1/2 bg-white text-black border border-cream px-6 py-2">
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
        </div>
      </div>

      {/* Additional Sections */}
      {/* <ProductDetailsInfo categories={categories} />
      <ProductDetails product={product} />
      <CustomerReview reviews={reviews} /> */}
      {/* <RelatedProducts currentProduct={product} allProducts={allProducts} /> */}
      {/* <CustomerComment /> */}

      {/* Related Products */}
    </div>
  );
};

export default ProductView;