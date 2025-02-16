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
    // console.log("This is the Review Section data", reviewSection);
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
    if (reviewsData.length > 0) {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % reviewsData.length
      );
    }
  };

  const prevReview = () => {
    if (reviewsData.length > 0) {
      setCurrentIndex((prevIndex) => 
        (prevIndex - 1 + reviewsData.length) % reviewsData.length
      );
    }
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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const ReviewCard = ({ review, index, animate = true }) => (
    <motion.div 
      className="w-full md:w-1/3 px-4 mb-4 flex"
      initial={animate ? { opacity: 0, y: 20 } : { opacity: 1 }}
      animate={animate ? { 
        opacity: 1, 
        y: 0,
        transition: { 
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut"
        } 
      } : {}}
      exit={animate ? { opacity: 0, y: -20 } : {}}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <motion.div 
        className="border-2 border-theme-blue rounded-lg p-6 shadow-md bg-white w-full flex flex-col"
        initial={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        whileHover={{ 
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
          transition: { duration: 0.3 }
        }}
      >
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            <Image
              src={review?.profile_picture || '/default-avatar.png'}
              alt={`${review?.name || 'User'}'s profile`}
              width={64}
              height={64}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-yellow-600 mb-2">
              {renderStars(review?.rating)}
            </div>
            <h3 className="font-semibold text-lg mb-2 truncate">
              {review?.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {review?.date}
            </p>
          </div>
        </div>
        <p className="text-gray-700 flex-1 line-clamp-4">
          {review?.message}
        </p>
      </motion.div>
    </motion.div>
  );

  if (loading) {
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
    <div className="p-5">
      <motion.h2 
        className="text-center text-xl md:text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      <div className="relative">
        <motion.div 
          className="flex flex-nowrap overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence initial={false} mode="wait">
            <div className="flex flex-col md:flex-row w-full">
              {/* Mobile View */}
              <div className="block md:hidden w-full">
                {reviewsData[currentIndex] && (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25
                    }}
                  >
                    <ReviewCard review={reviewsData[currentIndex]} index={0} />
                  </motion.div>
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden md:flex space-x-4 w-full">
                <div className="flex space-x-4 w-full justify-center">
                  {reviewsData.slice(0, 3).map((review, index) => (
                    <ReviewCard 
                      key={review.name + index} 
                      review={review}
                      index={index}
                      animate={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Controls - Only show in mobile or when more than 3 reviews in desktop */}
        {reviewsData.length > 0 && (
          <>
            <div className="md:hidden absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2 px-2 pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevReview}
                className="bg-white/80 p-3 rounded-full shadow-lg pointer-events-auto"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextReview}
                className="bg-white/80 p-3 rounded-full shadow-lg pointer-events-auto"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </motion.button>
            </div>

            {/* Pagination Dots - Only show in mobile */}
            <div className="md:hidden flex justify-center space-x-2 mt-6">
              {reviewsData.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 w-2 rounded-full cursor-pointer ${
                    index === currentIndex ? 'bg-theme-blue' : 'bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: index === currentIndex ? 1.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Review;
