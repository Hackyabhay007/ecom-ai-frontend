import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchcategores } from "../../../redux/slices/categorySlice";
import { useRouter } from "next/router";

const Category = ({ activeCategory = "woman" }) => {
  const dispatch = useDispatch();
  const { categories : data, status, error } = useSelector(
    (state) => state.categorysection
  );

  useEffect(()=>{
      dispatch(fetchcategores())
  },[dispatch])

  console.log(data ,status)

  const router = useRouter();
  const categories = {
    woman: [
      { name: "Plazo", image: "/images/category/woman/cat1.jpeg" },
      { name: "Coat", image: "/images/category/woman/cat2.jpg" },
      { name: "Blouse", image: "/images/category/woman/cat3.jpg" },
      { name: "Jacket", image: "/images/category/woman/cat4.jpg" },
      { name: "Dress", image: "/images/category/woman/cat5.jpg" },
    ],
    men: [
      { name: "Shirt", image: "/images/category/man/cat1.jpg" },
      { name: "Pants", image: "/images/category/man/cat2.jpg" },
      { name: "Suit", image: "/images/category/man/cat3.jpg" },
      { name: "Blazer", image: "/images/category/man/cat4.jpg" },
      { name: "Jeans", image: "/images/category/man/cat5.jpg" },
    ],
    kids: [
      { name: "T-shirt", image: "/images/category/kids/cat1.jpg" },
      { name: "Shorts", image: "/images/category/kids/cat2.jpg" },
      { name: "Dress", image: "/images/category/kids/cat3.jpg" },
      { name: "Sweater", image: "/images/category/kids/cat4.jpg" },
      { name: "Jumpsuit", image: "/images/category/kids/cat5.jpg" },
    ],
  };

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Validate the active category
  const categoryData = categories[activeCategory] || [];

  return (
    <div className="p-6 text-white bg-zinc-900">
      <h2 className="text-2xl font-bold mb-6 capitalize">
        {activeCategory}&#39;s Categories
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
          {data.map((category, index) => (
            <div
              onClick={()=>router.push(`/store/${category.id}`)}
              key={index}
              className="flex-shrink-0 cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="w-full h-96">
                <Image
                  src={category.metadata?.img}
                  alt={category.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
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
