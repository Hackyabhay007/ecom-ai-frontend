import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateLineItem,
  updateCart,
  appendToCart,
} from "../../../lib/data/cart";
import { useRouter } from "next/router";
import { useRegion } from "../../../contexts/RegionContext";
import axios from "axios";
import { fetchProducts } from "@/redux/slices/productSlice";

const QuickView = ({ product : propdata, onClose }) => {
  const { id, title: name, price, prevPrice, image, color = [] } = propdata;
  const { region } = useRegion();
  const Router = useRouter();
  const { temp_size, temp_color } = Router.query;

  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(temp_color || null);
  const [selectedSize, setSelectedSize] = useState(temp_size || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [warning, setWarning] = useState("");
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [additionalImages , setAdditionalImages] = useState([]);
  const [discount, setdiscount] = useState(0);
  const [variantPrice, setVariantPrice] = useState(0);
  const [discountedamount, setDiscountedamount] = useState(0);
  const [categories, setCategory] = useState([]);
  const [rating, setRating] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [avaragerating, setAvaragerating] = useState(0);
  const [product, setProduct] = useState();
  

  useMemo(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/get-product-with-review-and-category/${id}`,
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
  }, [product]);

  const {
    products: data,
    count,
    nextPage,
    status,
    error,
  } = useSelector((state) => state.products);

  console.log(data,status , "this is data");

  useEffect(() => {
    const queryParams = {
      limit: 12,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      id: id,
    };
    dispatch(fetchProducts({ pageParam: 1, queryParams, region }));
  }, [dispatch, region, id]);


  useEffect(() => {
    if (status === "succeeded") {
      setProduct(data[0]);
    }
  }, [status, data]);


  useEffect(() => {
    if (product) {
      setAdditionalImages(product.images)
    }
  }, [product]);

  useMemo(() => {
    if (region) {
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
                (option) =>
                  option.value.toLowerCase() === selectedSize.toLowerCase()
              )
            )
          : product?.variants.find((variant) =>
              variant.options?.some(
                (option) => option.value.toLowerCase() === "m"
              )
            );

      // // console.log(
      //   targetVariant,
      //   "this is target vaiant",
      //   selectedColor,
      //   selectedSize,
      //   product
      // );

      if (targetVariant) {
        setVariantPrice(targetVariant.calculated_price?.calculated_amount);

        const calculatedAmount =
          targetVariant.calculated_price?.calculated_amount;

        if (product.metadata?.discount) {
          setdiscount(product.metadata.discount);
        }
        if (calculatedAmount && product.metadata?.discount > 0) {
          setDiscountedamount(
            calculatedAmount -
              calculatedAmount * (product.metadata?.discount / 100)
          );
        } else {
          setDiscountedamount(0); // Or handle the case when there's no valid amount/discount
        }

        setSelectedVariant(targetVariant);
        // console.log(targetVariant);
        // setLoading(false);
      } else {
        setVariantPrice("N/A");
      }
    }
  }, [product?.metadata, region, discount, selectedColor, selectedSize]);

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

     console.log(selectedVariant , "this is selected variant");
 
     await addToCart(
       {
         variantId: selectedVariant.id,
         quantity: 1,
         region: region,
         Updater: updateCart,
       },
       process.env.NEXT_PUBLIC_REVALIDATE_SECRET
     );
 
     setIsAdded(true);
   };

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

    // console.log(variant?.calculated_price?.calculated_amount);

    // Return the price if a variant is found
    setVariantPrice(variant?.calculated_price?.calculated_amount);
    return variant ? variant?.calculated_price?.calculated_amount : null;
  }

  const handleBuyNow = async () => {
      if (!selectedSize) {
        setWarning("Please select a size.");
        setIsProgressVisible(true);
  
        setTimeout(() => {
          setWarning("");
          setIsProgressVisible(false);
        }, 3000);
        return;
      }
  
      await addToCart(
        {
          variantId: selectedVariant.id,
          quantity: 1,
          region: region,
          Updater: updateCart,
        },
        process.env.NEXT_PUBLIC_REVALIDATE_SECRET
      );
  
      Router.push("/checkout");
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 pb-20 md:pb-5 z-50 ">
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
            src={product?.thumbnail}
            alt={name}
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
          <h1 className="text-2xl font-bold mb-2">{name}</h1>

          {/* Star Rating */}
          <div className="flex items-center mb-4">
            {Array.from({ length: avaragerating }, (_, i) => (
              <i key={i} className="ri-star-fill text-yellow-400"></i>
            ))}
          </div>

          {/* Pricing Details */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-md text-theme-blue font-bold">
            ₹ {product?.metadata?.discount > 0
                ? discountedamount
                : variantPrice}
            </span>
            {product?.metadata?.discount > 0 && (
              <>
                <span className="text-sub-color text-sm line-through">
                ₹ {variantPrice}
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
            {categories.map((category, index) => (
              <span key={index} className="text-sm text-sub-color mr-2">
                {category.name}
              </span>
            ))}
          </div>

          {/* Colors */}
          <div className="mb-4">
            <span className="text-md font-bold">Color: </span>
            <div className="flex my-2 gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                    selectedColor === color ? "border-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    // Router.push({
                    //   pathname: Router.pathname,
                    //   query: {
                    //     ...Router.query,
                    //     temp_color: color,
                    //   },
                    // });
                    getPriceForVariant();
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-4">
            <span className="text-md font-bold">Size: </span>
            <div className="flex my-2 gap-4">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer ${
                    selectedSize === size ? "border-black" : ""
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    // Router.push({
                    //   pathname: Router.pathname,
                    //   query: {
                    //     ...Router.query,
                    //     temp_size: size,
                    //   },
                    // });
                    getPriceForVariant();
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
