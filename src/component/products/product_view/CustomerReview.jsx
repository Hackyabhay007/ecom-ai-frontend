import React, { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import CustomerComment from "./CustomerComment";

const CustomerReview = ({ reviews, productImage }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Calculate overall rating and total ratings
  const totalRatings = reviews.length;
  const overallRating = (
    reviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings
  ).toFixed(1);

  const ratingBreakdown = {
    5: (reviews.filter((review) => review.rating === 5).length / totalRatings) * 100,
    4: (reviews.filter((review) => review.rating === 4).length / totalRatings) * 100,
    3: (reviews.filter((review) => review.rating === 3).length / totalRatings) * 100,
    2: (reviews.filter((review) => review.rating === 2).length / totalRatings) * 100,
    1: (reviews.filter((review) => review.rating === 1).length / totalRatings) * 100,
  };

  // Render the full-screen modal using a portal
  const renderPopup = () =>
    createPortal(
      <div className="fixed  inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="fixed inset-0 md:bg-transparent bg-white   flex flex-col items-center justify-center overflow-auto">
          <button
            className="absolute top-4 right-4 text-gray-800 bg-white rounded-full text-xl px-[10px] py-1"
            onClick={() => setIsPopupOpen(false)}
          >
            ✕
          </button>
          <div className="w-full max-w-4xl p-6">
            <CustomerComment productImage={productImage} />
          </div>
        </div>
      </div>,
      document.body // Render the modal outside of the component tree
    );

  return (
    <div className="mt-8 bg-[#F7F7F7] p-6 rounded-lg">
      {/* Top Heading */}
      <h2 className="text-xl font-bold">Customer Reviews</h2>

      {/* Overall Rating */}
      <div className="flex flex-wrap gap-5 flex-col mt-6">
        <div className="flex w-full md:w-1/3">
          <div className="text-center rounded-lg p-4">
            <h3 className="text-5xl font-bold">{overallRating}</h3>
            <div className="text-yellow-500 flex justify-center">
              {"★".repeat(Math.round(overallRating))}
            </div>
            <p className="text-sm mt-1 text-gray-500">({totalRatings} Ratings)</p>
          </div>

          <div className="flex-1 w-fit ml-8">
            {Object.keys(ratingBreakdown).map((star) => (
              <div key={star} className="flex items-center pb-2">
                <span className="text-sm">{star} ★</span>
                <div className="flex-1 w-40 h-2 bg-gray-200 rounded-full mx-2">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${ratingBreakdown[star]}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{ratingBreakdown[star]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Images from Customers */}
        {/* <div className="w-2/3 md:ml-8">
          <h3 className="text-sm font-bold pb-2">Images from Customers</h3>
          <div className="flex flex-wrap gap-2">
            {reviews.map((review, index) => (
              <Image
                key={index}
                src={review.image}
                alt="Customer purchase"
                width={100}
                height={100}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div> */}
      </div>

      {/* Write a Review Button */}
      <div className="text-center mt-6">
        <button
          className="bg-white border border-black px-4 py-2 rounded-lg text-sm"
          onClick={() => setIsPopupOpen(true)}
        >
          Write a Review
        </button>
      </div>

      {/* Customer Reviews */}
      <div className="mt-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-t border-gray-300 py-6">
            <div className="flex items-start gap-4">
              {/* <Image
                src={review.image}
                alt="Reviewer"
                width={50}
                height={50}
                className="w-12 h-12 object-cover rounded-lg"
              /> */}
              <div>
                <div className="flex items-center pb-2">
                  <span className="text-yellow-500 mr-2">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-sm text-gray-500">({review.rating})</span>
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen Popup */}
      {isPopupOpen && renderPopup()}
    </div>
  );
};

export default CustomerReview;
