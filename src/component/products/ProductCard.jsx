import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  addToWishlist,
  toggleWishlistSidebar,
} from "../../../redux/slices/wishSlice";
import QuickView from "./product_view/QuickView";
import { useRegion } from "../../contexts/RegionContext";
import { addToCart, updateCart } from "@/lib/data/cart";
// import "./Hoverimagechnage.css"

const ProductCard = ({ product, layout }) => {
  console.log(product, " this product was come ");
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [isWishlistAdded, setIsWishlistAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartAdded, setIsCartAdded] = useState(false);
  const { region } = useRegion();
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
    name,
    price,
    prevPrice,
    thumbnail: image,
    tags = [],
    description,
  } = product;

  // console.log(product.variants[0], " this is product card data");

  useEffect(() => {
    const fetchVariantDetails = async () => {
      try {
        setLoading(true);

        let targetVariant =
          size && color
            ? product?.variants.find((v) =>
                v.options?.some(
                  (option) =>
                    option.value.toLowerCase() === color.toLowerCase() &&
                    v.options?.some(
                      (option) =>
                        option.value.toLowerCase() === size.toLowerCase()
                    )
                )
              )
            : color
            ? product?.variants.find((variant) =>
                variant.options?.some(
                  (option) => option.value.toLowerCase() === color.toLowerCase()
                )
              )
            : size
            ? product?.variants.find((variant) =>
                variant.options?.some(
                  (option) => option.value.toLowerCase() === size.toLowerCase()
                )
              )
            : product.variants[0];

        if (!targetVariant) {
          targetVariant = product.variants[0];
          setNotfoundoncurrentvaiant(product.variants[0]);
        }

        if (targetVariant) {
          setVariantPrice(
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: region.currency_code,
            }).format(targetVariant.calculated_price?.calculated_amount)
          );

          const calculatedAmount =
            targetVariant.calculated_price?.calculated_amount;

          if (product.metadata?.discount) {
            setdiscount(product.metadata.discount);
          }

          if (calculatedAmount && product.metadata?.discount > 0) {
            setDiscountedamount(
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: region.currency_code,
              }).format(
                calculatedAmount -
                  calculatedAmount * (product.metadata?.discount / 100)
              )
            );
          } else {
            setDiscountedamount(0); // Handle no valid amount/discount case
          }
          setLoading(false);
        } else {
          setVariantPrice("N/A");
          setLoading(false); // Stop loading in case no variant is found
        }
      } catch (error) {
        console.error("Error fetching variant details:", error);
        // Handle error gracefully, e.g., show a message or fallback value
        setVariantPrice("Error fetching price");
        setDiscountedamount("Error calculating discount");
        setLoading(false); // Stop loading on error
      }
    };

    fetchVariantDetails();
  }, [
    product.metadata,
    id,
    region,
    discount,
    size,
    color,
    max_pirce,
    min_price,
  ]);

  const handleAddToWishlist = (event) => {
    event.stopPropagation(); // Prevent card click navigation
    dispatch(addToWishlist(product));
    dispatch(toggleWishlistSidebar());
    setIsWishlistAdded(true); // Mark as added to wishlist
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    
    // Get the first variant's options
    const firstVariant = product.variants[0];
    const defaultColor = firstVariant?.options?.find(opt => opt.option_id === "opt_color")?.value || null;
    const defaultSize = firstVariant?.options?.find(opt => opt.option_id === "opt_size")?.value || null;

    try {
      await addToCart({
        variantId: firstVariant.id,
        quantity: 1,
        region,
        Updater: updateCart,
      }, process.env.NEXT_PUBLIC_REVALIDATE_SECRET);

      setIsCartAdded(true);
      setTimeout(() => setIsCartAdded(false), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
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

  if (loading) {
    return (
      <div>
        {product.title}
        {variantPrice} {discountedamount}
      </div>
    );
  }

  // console.log(product.images[1].url, "product.images");

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
            src={image}
            alt={name}
            layout="fill"
            size={"fit"}
            objectFit="cover"
            className="rounded-2xl hidden max-sm:flex  hover:scale-105 duration-150 shadow-lg  h-72"
          />

          <div class="product-image-wrapper h-[150%]  overflow-hidden max-sm:hidden flex">
            <Image layout="fill" src={image} alt={name} class="product-image" />
            <Image
              layout="fill"
              src={product.images[1].url}
              alt={name}
              class="product-image-hover"
            />
          </div>

          {/* Remove the old sale badge code */}
          {/* Remove or comment out the existing (discountes > 0 || diffInDays <= 3) span */}

          {/* Heart Icon */}
          <div
            className="absolute m-2 top-2 right-2 flex items-center justify-center w-10 h-10 bg-white rounded-full transform translate-x-4 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            onClick={handleAddToWishlist}
          >
            <i
              className={`text-xl ${
                isWishlistAdded
                  ? "text-black ri-heart-fill"
                  : "text-black ri-heart-line"
              }`}
            ></i>
          </div>

          {/* Shopping Bag Icon */}
          <div
            className="z-20  absolute bottom-4 right-[10%] md:right-[20%] flex items-center justify-center w-10 h-9 md:w-20 md:h-9 bg-white text-black hover:bg-black hover:text-white  rounded-full transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            onClick={handleAddToCart}
          >
            <i className="ri-shopping-bag-2-line text-sm md:text-lg"></i>
          </div>

          {/* Quick View Button (For Non-List Layout - Image Hover) */}
          {layout !== "list" && (
            <div
              className="z-20  absolute bottom-4 left-[30%] md:left-1/4 transform -translate-x-1/2  translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click navigation
                setIsQuickViewOpen(true);
              }}
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
              <span className="text-sm md:text-md">{discountedamount}</span>
              {/* <span className="md:text-sm text-xs text-sub-color line-through">
                {variantPrice}
              </span> */}
              <span className="text-black bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs">
                - {discount}% off
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap mb-5 gap-2 md:gap-3 items-center">
              <span className="text-sm md:text-md">{variantPrice}</span>
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
          product={{
            ...product,
            size,
            color,
          }}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}

      {/* Added to Cart Notification */}
      {isCartAdded && (
        <div className="fixed top-20 right-9 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 z-20 ">
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
