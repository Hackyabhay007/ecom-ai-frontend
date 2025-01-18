import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchcollections } from "../../../redux/slices/collectionSlice";
import { useRouter } from "next/router";
import Link from "next/link";


const index = ({ activeCategory = "woman" }) => {
    const dispatch = useDispatch();
  const {
    collections:data,
    status,
    error,
  } = useSelector((state) => state.collection);

  useEffect(() => {
    dispatch(fetchcollections());
  }, [dispatch]);

  console.log(data, status);

  const router = useRouter();


  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="p-6 text-white bg-zinc-900">
      <h2 className="text-2xl font-bold mb-6 capitalize">
         Categories
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
            <Link
            href={{
              pathname: "/shop",
              query: { id: category.id }, // Add category ID as a query parameter
            }}
            key={index}
            className="flex-shrink-0 cursor-pointer"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="w-full h-96">
              <Image
                src={category.metadata?.img}
                alt={category.name}
                width={500}
                layout=""
                height={500}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-left text-sm font-medium mt-2">{category.name}</p>
          </Link>
          
          ))}
        </div>
      </div>
    </div>
  );
}

export default index




