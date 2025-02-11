import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addReview } from "@/redux/slices/reviewSlice"; // Import Redux action
import { retrieveCustomer } from "@/redux/slices/authSlice";

const CustomerComment = ({ productImage, setReviewData, setIsPopupOpen, productId }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const dispatch = useDispatch();

  const { currentCustomer: user } = useSelector((state) => state.customer);
  const { status, error } = useSelector((state) => state.reviews); // Get review submission state

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch]);

  const handleStarClick = (star) => {
    setSelectedStars(star);
  };

  const handleTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const wordCount = reviewText.split(/\s+/).filter((word) => word).length;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reviewData = {
      rating: selectedStars,
      title: reviewText.split(" ").slice(0, 5).join(" "),
      description: reviewText,
      user_pic: user?.metadata?.avatar,
      user_name: `${user?.first_name} ${user?.last_name}`,
      date: new Date().toISOString(),
      product_id: productId,
    };

    const res = dispatch(addReview(reviewData));
    if (res) {  
      setIsPopupOpen(false);
      setReviewData((prev) => [ ...prev , reviewData ]);
    }
    console.log(reviewData);
  };

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
            <span className="ml-2 text-gray-500">
              {selectedStars} Star{selectedStars > 1 ? "s" : ""}
            </span>
          </div>

          {/* Review Text Area */}
          <textarea
            placeholder="Write your review (minimum 200 words)"
            value={reviewText}
            onChange={handleTextChange}
            className="border p-2 rounded-xl w-full mt-4"
            rows={6}
          />
          <p className="text-sm mt-2 text-gray-500">Word count: {wordCount} / 200</p>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}

          {/* Submit Button */}
          <button
            className="border-black border py-2 px-4 rounded-lg mt-4 w-full sm:w-auto"
            disabled={wordCount < 4 || status === "loading"}
            onClick={(event) => handleSubmit(event)}
          >
            {status === "loading" ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerComment;
