import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";

const Category = ({ activeCategory = "unisex", onNavigate }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { categories, loading, error } = useSelector((state) => state.categories);

  // Keep existing fetch logic
  useEffect(() => {
    dispatch(fetchCategories({
      searchParams: {
        gender: activeCategory,
        isActive: true
      }
    }));
  }, [dispatch, activeCategory]);

  // Keep existing scroll handlers
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3"
        >
          <i className="ri-arrow-left-s-line text-lg backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3"
        >
          <i className="ri-arrow-right-s-line text-lg backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>

        {/* Updated Categories Section */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-custom2 p-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            Array.isArray(categories) && categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 cursor-pointer w-[350px]" // Increased from 300px to 350px
                style={{ scrollSnapAlign: "start" }}
                onClick={() => onNavigate(`/shop?cat_id=${category.id}&cat_name=${category.name}`)}
              >
                <div className="relative group h-96 overflow-hidden"> {/* Fixed height instead of aspect ratio */}
                  <Image
                    src={category.image?.url || '/images/placeholder.jpg'}
                    alt={category.name}
                    fill
                    sizes="350px"
                    className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                  {/* New gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-4">
                    <p className="text-white text-2xl font-bold text-center px-2 mb-2 drop-shadow-lg">
                      {category.name}
                    </p>
                    <div className="w-12 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <p className="text-white/90 mt-2 text-sm uppercase tracking-wider">
                      View Collection
                    </p>
                  </div>

                  {/* Border overlay on hover */}
                  <div className="absolute inset-[12px] border-2 border-white/0 group-hover:border-white/40 transition-all duration-500 transform scale-90 group-hover:scale-100" />
                </div>
                <div className="mt-3 ml-1">
                  <p className="text-left text-sm font-medium tracking-wide uppercase">
                    {category.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
