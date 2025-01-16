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
  // console.log(discount);

  const {
    id,
    name,
    price,
    prevPrice,
    thumbnail: image,
    tags = [],
    description,
    color = [],
    size = [],
  } = product;

  useEffect(() => {
    setLoading(true);

    const targetVariant = product.variants.find((variant) =>
      variant.options?.some((option) => option.value.toLowerCase() === "m")
    );

    if (targetVariant) {
      setVariantPrice(
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: region.currency_code,
        }).format(targetVariant.calculated_price?.calculated_amount)
      );
      // console.log(
      //   "Calculated Amount:",
      //   targetVariant.calculated_price?.calculated_amount
      // );
      // console.log("Discount:", product.metadata.discount);

      const calculatedAmount =
        targetVariant.calculated_price?.calculated_amount;
      // console.log(
      //   targetVariant.calculated_price?.calculated_amount *
      //     product.metadata.discount,
      //   "targetVariant.calculated_price?.calculated_amount"
      // );
      if (product.metadata?.discount) {
        setdiscount(product.metadata.discount);
        // console.log();
      }
      if (calculatedAmount && product.metadata.discount > 0) {
        setDiscountedamount( new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: region.currency_code,
        }).format( calculatedAmount -
          (calculatedAmount * (product.metadata.discount / 100)))
        );
      } else {
        setDiscountedamount(0); // Or handle the case when there's no valid amount/discount
      }
      setLoading(false);
    } else {
      setVariantPrice("N/A");
    }
  }, [product.metadata ,id, region, discount]);
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

  const getTagColor = (tag) => {
    if (tag === "SALE") return "bg-[#DB4444] text-white font-bold";
    if (tag === "NEW") return "bg-[#D2EF9A] font-bold";
    return "bg-gray-300";
  };
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <>
      <div
        className={`relative rounded-lg text-center cursor-pointer text-cream ${
          layout === "list" ? "flex" : ""
        }`}
        onClick={() => router.push(`/shop/${id}`)}
      >
        {/* Image Section */}
        <div
          className={`relative ${
            layout === "list" ? "md:w-1/4 w-1/2" : "w-full"
          } h-64 md:h-96 group`}
        >
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-none"
          />
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`${getTagColor(
                tag
              )} text-black text-xs px-3 py-1 absolute top-2 left-2 rounded-full`}
            >
              {tag}
            </span>
          ))}

          {/* Heart Icon */}
          <div
            className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-white rounded-full transform translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
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
            className="absolute bottom-4 right-[10%] md:right-[20%] flex items-center justify-center w-10 h-9 md:w-20 md:h-9 bg-white text-black hover:bg-black hover:text-white  rounded-full transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            onClick={handleAddToCart}
          >
            <i className="ri-shopping-bag-2-line text-sm md:text-lg"></i>
          </div>

          {/* Quick View Button (For Non-List Layout - Image Hover) */}
          {layout !== "list" && (
            <div
              className="absolute bottom-4 left-[30%] md:left-1/4 transform -translate-x-1/2  translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
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
          className={`mt-4 ${
            layout === "list"
              ? "md:w-3/4 w-1/2 pl-10 flex flex-col justify-center items-start"
              : ""
          }`}
        >
          <h3 className="mb-2 text-wrap font-medium text-sm md:text-md text-cream text-left overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </h3>

          <div className="flex flex-wrap mb-5 gap-2 md:gap-3 items-center">
            <span className="text-sm md:text-md">{discountedamount}</span>
            <span className="md:text-sm text-xs text-sub-color line-through">
              {variantPrice}
            </span>
            <span className="text-black bg-[#D2EF9A] rounded-full px-[6px] py-[3px] font-thin text-xs">
              - {discount}% off
            </span>
          </div>
          {layout === "list" && (
            <>
              <p className="md:text-sm text-xs text-sub-color mb-2 line-clamp-3 break-words">
                {description}
              </p>
              {/* Quick View Button (For List Layout - Below Description) */}
              <div className="mt-2">
                <button
                  className="px-4 py-2 bg-white text-black rounded-full border border-black text-sm hover:bg-black hover:text-white transition-all duration-150 ease-in-out"
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
        <div className="fixed top-20 right-9 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
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

// {
//   "id": "prod_01JFY5AK5P4FE6SF82QHJ6NJWA",
//   "title": "Medusa T",
//   "description": "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
//   "handle": "t-shirt",
//   "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
//   "discountable": true,
//   "is_giftcard": false,
//   "created_at": "2024-12-25T05:41:08.905Z",
//   "updated_at": "2024-12-25T05:41:08.905Z",
//   "images": [
//     {
//       "id": "img_01JFY5AK7398DYWFB290B3ZM44",
//       "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
//       "created_at": "2024-12-25T05:41:08.905Z"
//     },
//     {
//       "id": "img_01JFY5AK73A19RDP5SNTZ18P70",
//       "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
//       "created_at": "2024-12-25T05:41:08.905Z"
//     },
//     {
//       "id": "img_01JFY5AK73YZPYXK0YQ6R78C6X",
//       "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
//       "created_at": "2024-12-25T05:41:08.905Z"
//     },
//     {
//       "id": "img_01JFY5AK73A7DWS7CJ14ACV5CE",
//       "url": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
//       "created_at": "2024-12-25T05:41:08.905Z"
//     }
//   ],
//   "options": [
//     {
//       "id": "opt_01JFY5AK661B0M2YV7DMS6E8ZS",
//       "title": "Size",
//       "values": ["S", "M", "L", "XL"],
//       "created_at": "2024-12-25T05:41:08.905Z"
//     },
//     {
//       "id": "opt_01JFY5AK67YR2FZZZGSBHZBH22",
//       "title": "Color",
//       "values": ["Black", "White"],
//       "created_at": "2024-12-25T05:41:08.905Z"
//     }
//   ],
//   "variants": [
//     {
//       "id": "variant_01JFY5AK8CWYH0GGHH1YMC9VW1",
//       "title": "S / Black",
//       "sku": "SHIRT-S-BLACK",
//       "allow_backorder": false,
//       "manage_inventory": true,
//       "created_at": "2024-12-25T05:41:09.008Z"
//     },
//     {
//       "id": "variant_01JFY5AK8DYW4AFX0N1ADMV1XS",
//       "title": "S / White",
//       "sku": "SHIRT-S-WHITE",
//       "allow_backorder": false,
//       "manage_inventory": true,
//       "created_at": "2024-12-25T05:41:09.008Z"
//     },
//     {
//       "id": "variant_01JFY5AK8DCHDSV5KC3WY7VNA5",
//       "title": "M / Black",
//       "sku": "SHIRT-M-BLACK",
//       "allow_backorder": false,
//       "manage_inventory": true,
//       "created_at": "2024-12-25T05:41:09.008Z"
//     },
//     {
//       "id": "variant_01JFY5AK8DYW4AFX0N1ADMV1XS",
//       "title": "XL / White",
//       "sku": "SHIRT-XL-WHITE",
//       "allow_backorder": false,
//       "manage_inventory": true,
//       "created_at": "2024-12-25T05:41:09.008Z"
//     }
//   ]
// }
