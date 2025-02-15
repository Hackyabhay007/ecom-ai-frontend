import React, { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/slices/categorySlice";
import Link from "next/link";

const CollectionComponent = ({ activeCategory = "women", setActiveCategory }) => {
  // 1. All hooks at the top
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { categories, loading, error } = useSelector((state) => state.categories);

  // 2. useEffect hooks together
  useEffect(() => {
    const gender = activeCategory?.toLowerCase() === "woman" ? "women" : activeCategory?.toLowerCase();
    console.log('Fetching categories with gender:', gender);
    
    dispatch(fetchCategories({
      searchParams: {
        gender: gender
      }
    }));
  }, [dispatch, activeCategory]);

  // 3. Memoized values
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    return categories.filter(category => {
      const categoryGender = category.gender?.toLowerCase();
      const activeGender = activeCategory?.toLowerCase();
      const normalizedActiveGender = activeGender === "woman" ? "women" : activeGender;
      
      return categoryGender === normalizedActiveGender && category.isActive;
    });
  }, [categories, activeCategory]);

  // 4. Event handlers
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  // 5. Render content based on state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-400">{error}</div>;
    }

    return (
      <div className="flex space-x-4 overflow-x-auto scrollbar-custom2 p-2">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={{
              pathname: "/shop",
              query: { cat_id: category.id, cat_name: category.name }
            }}
            onClick={() => setActiveCategory(null)}
            className="flex-shrink-0 cursor-pointer"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="w-full h-96">
              <Image
                src={category.image?.url || "/placeholder.png"}
                alt={category.image?.alt || category.name}
                width={500}
                height={500}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </div>
            <p className="text-left text-sm font-medium mt-2">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    );
  };

  // 6. Main render
  return (
    <div className="p-6 text-white bg-zinc-900 z-[9999]">
      <h2 className="text-2xl font-bold mb-6 capitalize">
        {activeCategory}'s collections
      </h2>
      <div className="relative">
        {/* Navigation arrows */}
        <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3">
          <i className="ri-arrow-left-s-line text-lg backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>

        <div ref={scrollRef} style={{ scrollSnapType: "x mandatory" }}>
          {renderContent()}
        </div>

        <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3">
          <i className="ri-arrow-right-s-line text-lg backdrop-blur-sm bg-white/30 p-4 rounded-full"></i>
        </button>
      </div>
    </div>
  );
};

export default CollectionComponent;
