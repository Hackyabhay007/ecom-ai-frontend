import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { fetchCategories } from "@/redux/slices/categorySlice";

const Category = ({ activeCategory = "unisex", onNavigate }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { categories, loading, error } = useSelector((state) => state.categories);

  // Improved image error handling
  const [failedImages, setFailedImages] = useState(new Set());

  const handleImageError = (categoryId, imageUrl) => {
    // console.log('Image failed to load for category:', {
    //   categoryId,
    //   imageUrl
    // });
    setFailedImages(prev => new Set([...prev, categoryId]));
  };

  // Get placeholder image URL
  const getImageUrl = (category) => {
    if (failedImages.has(category.id)) {
      return '/images/placeholder.jpg';
    }
    return category.image?.url || '/images/placeholder.jpg';
  };

  useEffect(() => {
    dispatch(fetchCategories({
      searchParams: {
        gender: activeCategory,
        isActive: true
      }
    }));
  }, [dispatch, activeCategory]);


  // console.log('Categories Data:', categories);

  // Debug logging
  // useEffect(() => {
  //   // console.log('Categories Data:', {
  //   //   categories,
  //   //   loading,
  //   //   error
  //   // });
  // }, [categories, loading, error]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="p-6 text-white bg-zinc-900">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="flex items-center justify-center w-full h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-zinc-900">
      <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3"
        >
          <i className="ri-arrow-left-s-line text-lg backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3"
        >
          <i className="ri-arrow-right-s-line text-lg backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>

        {/* Categories Section */}
        <div
          ref={scrollRef}
          className=" category_container flex space-x-4 overflow-x-auto scrollbar-custom2 p-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {Array.isArray(categories) && categories.map((category) => (
            <div
              key={category.id}
              className="flex-shrink-0 cursor-pointer min-w-[250px]"
              style={{ scrollSnapAlign: "start" }}
              onClick={() => onNavigate(`/shop?cat_id=${category.id}&cat_name=${category.name}`)}
            >
              <div className="w-full h-96 relative group overflow-hidden rounded-lg">
                <Image
                  src={getImageUrl(category)}
                  alt={category.image?.alt || category.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => {
                    if (!failedImages.has(category.id)) {
                      handleImageError(category.id, category.image?.url);
                    }
                  }}
                  loading={category.id === categories[0]?.id ? 'eager' : 'lazy'}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={true} // Add this for external URLs
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xl font-bold text-center px-4">
                    {category.name}
                  </p>
                  <p className="text-white text-sm mt-2 text-center px-4">
                    {category.description}
                  </p>
                </div>
              </div>
              <p className="text-left text-sm font-medium mt-2">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
