import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import { fetchhightlight } from "../../../redux/slices/hightlightSlice.js";
import axios from "axios";

function Collection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [routeofpage, setrouteofpage] = useState([]);
  const dispatch = useDispatch();
  const {
    hightlight: collectionData,
    status,
    error,
  } = useSelector((state) => state.highlightSection);

  useMemo(() => {
    const res = () => {
      const resposne = axios
        .get(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/home/01JG6HH2SRR40N5ESFWXZ44FRY`,
          {
            headers: {
              "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
            },
          }
        )
        .then((res) => {
          // console.log(res.data.home.result, "this is res come from home ");
          setrouteofpage(res.data.home.result);
        });
      return resposne;
    };
    res();
  }, [currentIndex]);

  // Fetching collection data when currentIndex changes
  useEffect(() => {
    dispatch(fetchhightlight());
  }, [currentIndex]);

  // console.log(collectionData, typeof collectionData);
  // Scrolls to the given index
  const scrollToIndex = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const containerWidth = container.offsetWidth;
    const scrollPosition = index * (containerWidth / 3); // 3 images visible at a time
    container.scrollTo({ left: scrollPosition, behavior: "smooth" });
  };

  const handleNext = () => {
    if (collectionData) {
      if (currentIndex < collectionData.length - 3) {
        setCurrentIndex(currentIndex + 1);
        scrollToIndex(currentIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToIndex(currentIndex - 1);
    }
  };

  if (status === "loading") {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center text-white">Error: {error}</div>;
  }

  return (
    collectionData && (
      <div className="bg-zinc-950 min-h-[80%] py-10">
        {/* Top Scrolling Text */}
        <div className="overflow-hidden border-y py-2 mb-6">
          <div className="flex gap-8 md:gap-24 animate-scroll-left whitespace-nowrap">
            {[...Array(2)].map((_, idx) => (
              <React.Fragment key={idx}>
                <span className="mx-4 text-white">Sustainable</span>
                <span className="mx-4 text-white">Affordable</span>
                <span className="mx-4 text-white">Luxurious</span>
                <span className="mx-4 text-white">Trendy</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-white text-3xl md:text-6xl my-14 font-bold">
          New Collection
        </h2>

        {/* Horizontal Scrollable Images with Buttons */}
        <div className="relative px-4 md:px-10">
          {/* Left Button */}
          {currentIndex > 0 && (
            <button
              className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-sm bg-cream/30 text-white border px-[4px] py-[2px] rounded-full z-10 hover:bg-white/40 transition"
              onClick={handlePrev}
            >
              <i className="ri-arrow-drop-left-fill text-3xl"></i>
            </button>
          )}

          {/* Scrollable Images */}
          <div
            ref={scrollContainerRef}
            className="flex gap-7 h-[300px] md:gap-10 md:h-[600px] overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth items-center"
          >
            {collectionData &&
              collectionData.map((item, index) => (
                <div
                  key={index}
                  className="snap-center flex-shrink-0 w-[calc(100%/3)] md:w-[calc(100%/3.2)] max-w-[calc(100%/3)] transition-transform duration-300 ease-in-out"
                >
                  <div className="border border-white rounded-xl p-1 md:p-3 overflow-visible shadow-[0_5px_15px_rgba(255,255,255,0.4)] bg-white/10">
                    <Image
                      src={item.image}
                      alt={item.link || `clt${index + 1}`} // Adding dynamic alt text
                      width={500}
                      height={500}
                      className={`h-[200px] md:h-[450px] rounded-md object-cover ${
                        index === currentIndex + 1
                          ? "border-2 border-cyan-500 shadow shadow-cyan-200 md:scale-100 scale-150 transition-all duration-300 delay-100 ease-in-out"
                          : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Right Button */}
          {currentIndex < collectionData.length - 3 && (
            <button
              className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 backdrop-blur-sm bg-cream/30 text-white border px-[4px] py-[2px] rounded-full z-10 hover:bg-white/40 transition"
              onClick={handleNext}
            >
              <i className="ri-arrow-drop-right-fill text-3xl"></i>
            </button>
          )}
        </div>

        {/* View All Button */}
        <a
          href={"/" + routeofpage.redirect}
          className="flex justify-center mt-6"
        >
          <div className="backdrop-blur-sm bg-white/10 text-white border px-10 py-1 rounded mt-10 transition hover:bg-white/20">
            {routeofpage.text}
          </div>
        </a>
      </div>
    )
  );
}

export default Collection;
