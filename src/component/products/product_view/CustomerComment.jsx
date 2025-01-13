import React, { useState } from "react";
import Image from "next/image";

const CustomerComment = ({ productImage }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleStarClick = (star) => {
    setSelectedStars(star);
  };

  const handleTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const wordCount = reviewText.split(/\s+/).filter((word) => word).length;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-2 md:p-6 bg-[#F7F7F7] rounded-lg">
      {/* Product Image */}
      <div className="w-full md:w-1/3">
        <Image
          src={productImage}
          alt="Product"
          width={200}
          height={200}
          className="md:w-full h-1/4 md:h-auto rounded-lg border"
        />
      </div>

      {/* Review Form */}
      <div className="w-full md:w-2/3">
        <h2 className="md:text-4xl text-2xl font-bold mb-4">Write a Review</h2>
        <form>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-3xl ${
                  star <= selectedStars ? "text-yellow-500" : "text-gray-400"
                }`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-gray-500">{selectedStars} Star{selectedStars > 1 ? "s" : ""}</span>
          </div>

          {/* Review Text Area */}
          <textarea
            placeholder="Write your review (minimum 200 words)"
            value={reviewText}
            onChange={handleTextChange}
            className="border p-2 rounded-xl w-full mt-4"
            rows={6}
          />
          <p className="text-sm mt-2 text-gray-500">
            Word count: {wordCount} / 200
          </p>
          {/* {wordCount < 200 && (
            <p className="text-sm text-red-500">Please write at least 200 words.</p>
          )} */}

          {/* Submit Button */}
          <button
            className="border-black border py-2 px-4 rounded-lg mt-4 w-full sm:w-auto"
            disabled={wordCount < 200}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerComment;
