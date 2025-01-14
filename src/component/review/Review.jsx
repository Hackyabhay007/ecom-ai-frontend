import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchreviews } from "../../../redux/slices/reviewSlicer.js";
import { motion, AnimatePresence } from "framer-motion";

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { reviews, status, error } = useSelector(
    (state) => state.reviewsection
  );

  useEffect(() => {
    dispatch(fetchreviews());
  }, [dispatch]);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 3 + reviews.length) % reviews.length
    );
  };

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

  const reviewsToShow = reviews.slice(currentIndex, currentIndex + 3);

  const animationVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="p-5 relative h-[350px] w-[98.3vw] overflow-hidden ">
      <h2 className="text-center text-xl md:text-3xl font-bold mb-8 h-[30px]">
        What People Are Saying
      </h2>

      {/* Desktop View */}
      <div className=" grid grid-cols-3 row-end-3 px-5 gap-2 relative h-[250x] overflow-y-hidden  ">
        <AnimatePresence initial={false}>
          {reviewsToShow.map((review) => (
            <motion.div
              key={review.id}
              className="w-full px-5 border-2 border-theme-blue rounded-lg"
              style={{ height: "250px" }}
              variants={animationVariants}
              initial="enter"
              animate="center"
              // exit="exit"
              transition={{ duration: 0.2 }}
            >
              <div className="relative mb-4 ">
                <Image
                  src={review.user_pic}
                  alt={`Review by ${review.user_name}`}
                  width={200}
                  height={200}
                  className="absolute top-0 left-0 w-16 h-16 rounded-xl object-cover"
                />
                <div className="ml-20 my-5">
                  <div className="text-yellow-600">
                    {renderStars(review.rating)}
                  </div>
                  <h3 className="font-semibold text-lg mt-2">{review.title}</h3>
                </div>
                <p className="text-sub-color mt-2">{review.description}</p>
                <p className="text-sm font-bold mt-2">{review.user_name}</p>
                <p className="text-sm text-sub-color mt-2">
                  {formatLocalDate(review.created_at)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Carousel Navigation */}
        <div className="absolute top-1/2 left-0 w-full flex justify-between">
          <button
            onClick={prevReview}
            className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full"
          >
            <i className="ri-arrow-left-s-fill"></i>
          </button>
          <button
            onClick={nextReview}
            className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full"
          >
            <i className="ri-arrow-right-s-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
