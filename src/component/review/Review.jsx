import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchreviews } from "../../../redux/slices/reviewSlicer.js";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { reviews, status, error } = useSelector((state) => state.reviewsection);
  const [itemsPerView, setItemsPerView] = useState(3);

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

  useEffect(() => {
    dispatch(fetchreviews());
  }, [dispatch]);

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
    <div className="p-3 md:p-5 relative h-auto min-h-[350px] w-full overflow-hidden" {...swipeHandlers}>
      <h2 className="text-center text-xl md:text-3xl font-bold mb-4 md:mb-8">
        What People Are Saying
      </h2>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 md:px-5 relative`}>
        <AnimatePresence initial={false} mode="wait">
          {reviewsToShow.map((review) => (
            <motion.div
              key={review.id}
              className="w-full px-3 md:px-5 border-2 border-theme-blue rounded-lg"
              style={{ minHeight: "250px" }}
              variants={{
                enter: { opacity: 0, x: 50 },
                center: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -50 }
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="relative py-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <Image
                      src={review.user_pic}
                      alt={`${review.user_name}'s profile`}
                      width={64}
                      height={64}
                      className="rounded-xl object-cover w-full h-full"
                      style={{ aspectRatio: '1/1' }}
                      priority={true}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-yellow-600" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                      {renderStars(review.rating)}
                    </div>
                    <h3 className="font-semibold text-lg mt-2">{review.title}</h3>
                  </div>
                </div>
                <p className="text-sub-color mt-4 line-clamp-3">{review.description}</p>
                <div className="mt-4">
                  <p className="text-sm font-bold">{review.user_name}</p>
                  <p className="text-sm text-sub-color">{formatLocalDate(review.created_at)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {reviews.length > itemsPerView && (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-2">
            <button
              onClick={prevReview}
              className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full hover:bg-white/25 transition-colors"
              aria-label="Previous reviews"
            >
              <i className="ri-arrow-left-s-fill"></i>
            </button>
            <button
              onClick={nextReview}
              className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full hover:bg-white/25 transition-colors"
              aria-label="Next reviews"
            >
              <i className="ri-arrow-right-s-fill"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
