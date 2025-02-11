import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchreviews } from "../../../redux/slices/reviewSlicer.js";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { fetchReviewSection } from "@/redux/slices/homePageSlice.js"

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const { reviews, status, error } = useSelector((state) => state.reviewsection);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [title, setTitle] = useState("");
  const [reviewsData, setReviewsData] = useState([]);
  const reviews = [];

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dispatch = useDispatch();
  const { reviewSection, loading, error } = useSelector((state) => state?.homePage); // Correct selector


  useEffect(() => {
    dispatch(fetchReviewSection());
  }, [dispatch]);

  useEffect(() => {
    console.log("This is the Review Section data", reviewSection);
    if(reviewSection?.section_data?.title){
      setTitle(reviewSection?.section_data?.title);
    }


    if(reviewSection?.section_data?.testimonials?.length>0){
      const reviewsArray = reviewSection?.section_data?.testimonials.map((item) => {
        return {
          date: item.date,
          message: item.message,
          name: item.name,
          profile_picture: item.profile_picture,
          rating: item.rating
        }
      });
      setReviewsData(reviewsArray);
    }
  }, [reviewSection])

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerView) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerView + reviews.length) % reviews.length);
  };

  // Add swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextReview,
    onSwipedRight: prevReview,
    preventDefaultTouchmoveEvent: true,
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        style={{ color: index < rating ? "#FFD700" : "#D3D3D3" }}
      >
        ★
      </span>
    ));
  };

  function formatLocalDate(isoDate) {
    const date = new Date(isoDate);
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);

    return formattedDate;
  }

  const reviewsToShow = reviews.slice(currentIndex, currentIndex + itemsPerView);

  if (status === 'loading') {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-red-500">
        Error loading reviews. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-5 ">
      <h2 className="text-center text-xl md:text-3xl font-bold mb-8">{title}</h2>

      {/* Desktop View */}
      <div className="hidden lg:flex justify-start space-x-4 overflow-x-auto px-5">
        {reviewsData?.map((review) => (
          <div
            key={review?.name}
            className="w-1/3 px-5 border-2 border-theme-blue rounded-lg"
            style={{ height: 'auto' }} // Ensuring consistent height across all cards
          >
            <div className="relative mb-4">
              <Image
                src={review?.profile_picture}
                alt={`Review by ${review?.name}`}
                width={200}
                height={200}
                className="absolute top-0 left-0 w-16 h-16 rounded-xl object-cover"
              />
              <div className="ml-20 my-5">
                <div className="text-yellow-600">{renderStars(review?.rating)}</div>
                <h3 className="font-semibold text-lg mt-2">{review?.message}</h3>
              </div>
              {/* <p className="text-sub-color mt-2">{review?.review}</p> */}
              <p className="text-sm font-bold mt-2">{review?.name}</p>
              <p className="text-sm text-sub-color mt-2">{review?.date}</p>

            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex justify-center items-center">
        <div className="relative w-full p-5">
          <div className="w-full px-5 py-2 border border-theme-blue rounded-lg h-fit" >
            <div className="relative">
              <Image
                src={reviewsData[currentIndex]?.profile_picture}
                alt={`Review by ${reviewsData[currentIndex]?.name}`}
                width={200}
                height={200}
                className="absolute top-0 left-0 w-16 h-16 rounded-xl object-cover"
              />
              <div className="ml-20 mt-4">
                <div className="text-yellow-600">{renderStars(reviewsData[currentIndex]?.rating)}</div>
                {/* <h3 className="font-semibold text-lg mt-2">{reviewsData[currentIndex]?.heading}</h3> */}
              </div>
              <p className="text-sub-color mt-2">{reviewsData[currentIndex]?.message}</p>
              <p className="text-sm font-bold mt-2">{reviewsData[currentIndex]?.name}</p>
              <p className="text-sm text-sub-color mt-2">{reviewsData[currentIndex]?.date}</p>

            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="absolute top-1/2 left-0 w-full flex justify-between ">
            <button onClick={prevReview} className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full">
              <i className="ri-arrow-left-s-fill"></i>
            </button>
            <button onClick={nextReview} className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full">

              <i className="ri-arrow-right-s-fill"></i>
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {reviewsData?.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-theme-blue' : 'bg-gray-400'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
