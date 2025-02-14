import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addReview, postReview } from "@/redux/slices/reviewSlice";
import { retrieveCustomer } from "@/redux/slices/authSlice";
import Link from "next/link";
import { getCookie } from "../../../../utils/cookieUtils";

const CustomerComment = ({ productImage, setIsPopupOpen, productId, onReviewAdded }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState(""); // Add this for error handling
  const dispatch = useDispatch();

  // Fix the selector to properly access customer state
  const customer = useSelector((state) => state.auth?.customer) || {};
  const { status, error } = useSelector((state) => state.reviews);

  useEffect(()=>{
    console.log("Customer Comment Page error", error);
  }, [error]);

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch]);

  // Replace customer authentication check with cookie check
  const authToken = getCookie('auth_token'); // or whatever your cookie name is
  console.log("This is the authToken of the Customer Comment Page", authToken);
  if (!authToken) {
    return (
      <div className="p-6 bg-[#F7F7F7] rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
        <p className="text-gray-600">Please sign in to write a review.</p>
        <button
          className="mt-4 bg-black text-white px-4 py-2 rounded"
          onClick={() => {
            setIsPopupOpen(false);
          }}
        >
          <Link href="/auth/login">Sign In</Link>
        </button>
      </div>
    );
  }

  const handleStarClick = (star) => {
    setSelectedStars(star);
  };

  const handleTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const wordCount = reviewText.split(/\s+/).filter((word) => word).length;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setReviewError(""); // Clear any previous errors
    
    if (!selectedStars) {
      setReviewError("Please select a rating");
      return;
    }

    if (wordCount < 10) {
      setReviewError("Please write at least 10 words");
      return;
    }

    try {
      // Format review data according to API requirements
      const reviewData = {
        productId: productId,
        rating: selectedStars,
        title: reviewText.split(" ").slice(0, 5).join(" "), // First 5 words as title
        message: reviewText // Full review text
      };

      console.log('Sending review data:', reviewData); // Debug log

      const resultAction = await dispatch(postReview(reviewData)).unwrap();
      console.log('API Response:', resultAction); // Debug log

      if (resultAction) {
        // Create UI update data
        const uiReviewData = {
          id: resultAction.id, // Assuming API returns review ID
          rating: selectedStars,
          title: reviewData.title,
          description: reviewText,
          user_pic: customer?.avatar || '/default-avatar.png',
          user_name: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Anonymous',
          created_at: new Date().toISOString(),
          product_id: productId,
        };
        
        onReviewAdded(uiReviewData);
        setIsPopupOpen(false);
      }
    } catch (err) {
      console.error('Failed to add review:', err);
      setReviewError(err.message || "Failed to submit review. Please try again.");
    }
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
            placeholder="Write your review (minimum 10 words)" // Changed placeholder
            value={reviewText}
            onChange={handleTextChange}
            className="border p-2 rounded-xl w-full mt-4"
            rows={6}
          />
          <p className="text-sm mt-2 text-gray-500">Word count: {wordCount} / 10</p> {/* Changed word count target */}

          {/* Error Message */}
          {reviewError && (
            <p className="text-sm text-red-500 mt-2">{reviewError}</p>
          )}

          {/* Submit Button - update minimum word requirement */}
          <button
            className="border-black border py-2 px-4 rounded-lg mt-4 w-full sm:w-auto cursor-pointer"
            disabled={wordCount < 10 || status === "loading"} // Changed minimum word requirement
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
