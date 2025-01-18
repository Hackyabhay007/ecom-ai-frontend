import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  addToWishlist,
  toggleWishlistSidebar,
} from "../../../redux/slices/wishSlice";
import { addToCart } from "../../../redux/slices/cartSlice";
import QuickView from "./product_view/QuickView";
import { useRegion } from "../../contexts/RegionContext";
// import "./Hoverimagechnage.css"

const ProductCard = ({ product, layout }) => {
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
  console.log(product, " this product was come ");
  const {size} = router.query

  const {
    id,
    name,
    price,
    prevPrice,
    thumbnail: image,
    tags = [],
    description,
    color = [],
  } = product;

  useEffect(() => {
    setLoading(true);

    const targetVariant = product.variants.find((variant) =>
      variant.options?.some((option) => option.value.toLowerCase() === size.toLowerCase())
    );

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
        // console.log();
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
        setDiscountedamount(0); // Or handle the case when there's no valid amount/discount
      }
      setLoading(false);
    } else {
      setVariantPrice("N/A");
    }
  }, [product.metadata, id, region, discount , size]);
  const handleAddToWishlist = (event) => {
    event.stopPropagation(); // Prevent card click navigation
    dispatch(addToWishlist(product));
    dispatch(toggleWishlistSidebar());
    setIsWishlistAdded(true); // Mark as added to wishlist
  };

  const handleAddToCart = (event) => {
    event.stopPropagation(); // Prevent card click navigation

    const defaultColor = color[0] || null;
    const defaultSize = size[0] || null;

    dispatch(
      addToCart({
        id,
        name,
        price,
        quantity: 1,
        image,
        color: defaultColor,
        size: defaultSize,
        discount,
      })
    );

    setIsCartAdded(true); // Show added to cart notification
    setTimeout(() => setIsCartAdded(false), 3000); // Remove notification after 3 seconds
  };

  const discountes = product.metadata?.discount || 0; // Ensure discount is a number
  const createdAt = new Date(product.created_at);
  const currentDate = new Date();

  // Calculate the difference in days
  const diffInTime = currentDate - createdAt;
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
  const getTagColor = () => {
    console.log(discountes, "createAt");

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
    return <div>Loading...</div>;
  }

  console.log(product.images[1].url ,"product.images")

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
          } h-72 md:h-96 group`}
        >
          <Image
            src={image}
            alt={name}
            layout="fill"
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

          {(discountes > 0 || diffInDays <= 3) && (
            <span
              // key={index}
              className={`${getTagColor(
                discount
              )} text-black text-xs px-3 py-1 absolute md:top-2 lg:top-2 xl:top-2 max-sm:bottom-2 left-2    z-20  rounded-full`}
            >
              {discountes > 0 && diffInDays <= 3
                ? "New & Best Price!"
                : discountes > 0
                ? "SALE"
                : "NEW"}
            </span>
          )}

          {/* Heart Icon */}
          <div
            className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-white rounded-full transform translate-x-4 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
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
          className={`mt-4 z-20  ${
            layout === "list"
              ? "md:w-3/4 w-1/2 pl-10 flex flex-col justify-center items-start"
              : ""
          }`}
        >
          <h3 className="mb-2 text-wrap font-medium text-sm md:text-md text-cream text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </h3>

          {discount > 0 ? (
            <div className="flex flex-wrap mb-5 gap-2 md:gap-3 items-center">
              <span className="text-sm md:text-md">{discountedamount}</span>
              <span className="md:text-sm text-xs text-sub-color line-through">
                {variantPrice}
              </span>
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
