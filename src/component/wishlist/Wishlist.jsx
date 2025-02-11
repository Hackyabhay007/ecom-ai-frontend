import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WishlistBreadCrumb from "./WishlistBreadCrumb";
import WishlistGridLayout from "./WishlistGridLayout";
import Image from "next/image";
import { removeFromWishlist } from "@/redux/slices/wishSlice";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { retrieveCustomer, updateCustomer } from "@/redux/slices/authSlice";


const Wishlist = () => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { currentCustomer: user } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {

      dispatch(retrieveCustomer());

    } 
  }, [dispatch, user]); 
  const [layout, setLayout] = useState(3);
  const [filters, setFilters] = useState({
    category: "all",
    sort: "best-selling",
  });
  const router = useRouter()

  const handleLayoutChange = (newLayout) => setLayout(newLayout);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  // Apply Filters
  const filteredWishlist = wishlist.filter((product) => {
    if (filters.category === "all") return true;
    return product.category === filters.category;
  });

  // Apply Sorting
  const sortedWishlist = filteredWishlist.sort((a, b) => {
    if (filters.sort === "low-high") return a.price - b.price;
    if (filters.sort === "high-low") return b.price - a.price;
    if (filters.sort === "discount") return b.discount - a.discount;
    return 0; // Default sorting for "best-selling" or no specific order
  });

  return (
    <div className="mb-10 pt-16 md:pt-0">
      <WishlistBreadCrumb />
      <WishlistGridLayout
        onLayoutChange={handleLayoutChange}
        onFilterChange={handleFilterChange}
      />
      <span className="text-sub-color font-medium text-lg px-5">
        {sortedWishlist.length} Product{sortedWishlist.length !== 1 && "s"}{" "}
        Found
      </span>
      <div
        className={`grid gap-4 p-4`}
        style={{
          gridTemplateColumns: `repeat(${layout}, minmax(0, 1fr))`,
        }}
      >
        {sortedWishlist.map((product) => (
          <div
            key={product.id}
            className="rounded-lg text-center  relative text-cream cursor-pointer"
            
          >
            {/* Image */}
            <div onClick={() => (router.push(`/shop/product/${product.id}`))} className="relative w-full h-32 md:h-96">
              <Image
                src={product.thumbnail}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
                
              />
            </div>

            {/* Product Information */}
            <div className="mt-4 px-2">
              <h3 className="mb-1 font-medium text-xs md:text-md text-cream text-left overflow-hidden text-ellipsis whitespace-nowrap">
                {product.title}
              </h3>

              <div className="flex flex-wrap mb-5 gap-3 items-center justify-between pr-10 ">
                <span className="md:text-lg text-xs">₹{product.variants[0].calculated_price.calculated_amount}</span>
                {product.prevPrice && (
                  <span className="text-xs text-sub-color line-through">
                    ₹{product.prevPrice}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-[#D2EF9A] rounded-full px-[5px] py-[2px] font-thin text-xs text-black">
                    -{product.discount}% 
                  </span>
                )}
                <button
                 onClick={() => {
                
                                  if (!user) {
                                    router.push("/auth/login"); // Redirect to login if no user is logged in
                                    return;
                                  }
                
                                  const update = {
                                    metadata: {
                                      wishlist: user?.metadata?.wishlist.filter((wishlistItem) => wishlistItem.id !== product.id),
                                    },
                                  };
                                
                                  console.log(update, "update");
                                
                                  if (JSON.stringify(update.metadata.wishlist) === JSON.stringify(user?.metadata?.wishlist)) {
                                    console.log("No change");
                                    return;
                                  }
                                
                                  dispatch(updateCustomer(update));
                                
                                  dispatch(
                                    removeFromWishlist({
                                      productId: product.id,
                                      userurrentCustomer: user,
                                    })
                                  );
                                
                                  dispatch(retrieveCustomer());
                                  console.log(user, "user");
                                }}
                                
                                  className="bg-red-500 duration-200 text-white px-2 py-1  rounded-lg hover:bg-red-700 "
                                 
                >
                  remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
