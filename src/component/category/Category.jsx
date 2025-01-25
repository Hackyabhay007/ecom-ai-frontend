import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeCategories } from "../../../redux/slices/homeCategorySlice";
import { useRouter } from "next/router";
import Link from "next/link";

const DUMMY_CATEGORIES = {
  product_categories: [
    {
      id: "dummy_1",
      name: "Shirts",
      metadata: { img: "/images/category/woman/cat1.jpeg" }
    },
    {
      id: "dummy_2",
      name: "Sweatshirts",
      metadata: { img: "/images/category/woman/cat2.jpg" }
    },
    {
      id: "dummy_3",
      name: "Pants",
      metadata: { img: "/images/category/woman/cat3.jpg" }
    },
    {
      id: "dummy_4",
      name: "Merch",
      metadata: { img: "/images/category/woman/cat4.jpg" }
    }
  ]
};

const Category = ({ activeCategory = "woman", onNavigate }) => {
  const dispatch = useDispatch();
  const {
    categories: apiData,
    status,
    error,
  } = useSelector((state) => state.homeCategories);

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  const scrollRef = useRef(null);

  // Use API data if available, otherwise use dummy data
  const data = apiData?.product_categories?.length > 0 
    ? apiData.product_categories 
    : DUMMY_CATEGORIES.product_categories;

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="p-6 text-white bg-zinc-900">
      <h2 className="text-2xl font-bold mb-6">
        Featured Categories
      </h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 "
        >
          <i className="ri-arrow-left-s-line text-lg  backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 "
        >
          <i className="ri-arrow-right-s-line text-lg backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>

        {/* Categories Section */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-custom2 p-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {status === 'loading' ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            data.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 cursor-pointer min-w-[250px]"
                style={{ scrollSnapAlign: "start" }}
                onClick={() => onNavigate(`/shop?cat_id=${category.id}&cat_name=${category.name}`)}
              >
                <div className="w-full h-96 relative group">
                  <Image
                    src={category.metadata?.img || '/images/placeholder.jpg'}
                    alt={category.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover  transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xl font-bold">
                      {category.name}
                    </p>
                  </div>
                </div>
                <p className="text-left text-sm font-medium mt-2">
                  {category.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
