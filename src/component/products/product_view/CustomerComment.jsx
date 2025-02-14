import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addReview, postReview } from "@/redux/slices/reviewSlice";
import { retrieveCustomer } from "@/redux/slices/authSlice";
import Link from "next/link";
import { getCookie } from "../../../../utils/cookieUtils";
import { toast } from 'react-hot-toast';

const CustomerComment = ({ productImage, setIsPopupOpen, productId, onReviewAdded }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState(""); // Add this for title
  const [reviewError, setReviewError] = useState(""); // Add this for error handling
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();

  // Fix the selector to properly access customer state
  const customer = useSelector((state) => state.auth?.customer) || {};
  const { status, error } = useSelector((state) => state.reviews);

  console.log("This is the value of the productImage it is getting int he CustomerComment component", productImage)

  useEffect(()=>{
    console.log("Customer Comment Page error", error);
  }, [error]);

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log("Review submission error from Redux state:", error);
      setReviewError(error.message || "An error occurred while submitting the review");
    }
  }, [error]);

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
    // Prevent default form submission
    event.preventDefault();
    event.stopPropagation();
    
    setReviewError("");
    console.log('1. Starting review submission...');

    // Add more detailed validation logging
    if (!selectedStars) {
      console.log('Validation failed: No rating');
      toast.error("Please select a rating");
      return;
    }

    if (!reviewTitle.trim()) {
      console.log('Validation failed: No title');
      toast.error("Please enter a review title");
      return;
    }

    if (!reviewText.trim()) {
      console.log('Validation failed: No review text');
      toast.error("Please enter a review message");
      return;
    }

    const reviewData = {
      productId: productId, // Make sure productId is passed correctly
      rating: selectedStars,
      title: reviewTitle.trim(),
      message: reviewText.trim()
    };

    console.log('Submitting review data:', reviewData);

    // Show loading state
    const loadingToast = toast.loading('Submitting your review...');

    try {
      const result = await dispatch(postReview(reviewData)).unwrap();
      console.log('Review submission result:', result);

      toast.dismiss(loadingToast);
      toast.success('Review submitted successfully!');

      // Create UI review data
      if (result.data) {
        const uiReviewData = {
          id: result.data.id,
          rating: selectedStars,
          title: reviewTitle,
          description: reviewText,
          user_pic: customer?.avatar || '/default-avatar.png',
          user_name: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Anonymous',
          created_at: new Date().toISOString(),
          product_id: productId,
        };

        onReviewAdded(uiReviewData);
        setShowSuccess(true);

        // Reset form
        setSelectedStars(0);
        setReviewTitle('');
        setReviewText('');

        // Close popup after delay
        setTimeout(() => {
          setShowSuccess(false);
          setIsPopupOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to submit review');
      setReviewError(error.message || 'Failed to submit review');
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl border-2 border-green-500 max-w-md mx-4">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-2 mx-auto w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Submitted Successfully!</h3>
              <p className="text-gray-600">Thank you for sharing your feedback.</p>
            </div>
          </div>
        </div>
      )}
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
          <form onSubmit={handleSubmit} className="w-full">
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

            {/* Review Title */}
            <input
              placeholder="Title of your review" // Changed placeholder
              value={reviewTitle}
              onChange={(event)=>{ setReviewTitle(event.target.value)}}
              className="border p-2 rounded-xl w-full mt-4"
              rows={6}
            />


            {/* Review Text Area */}
            <textarea
              placeholder="Write your review (maximum 300 words)" // Changed placeholder
              value={reviewText}
              onChange={handleTextChange}
              className="border p-2 rounded-xl w-full mt-4"
              rows={6}
            />
            <p className="text-sm mt-2 text-gray-500">Word count: {wordCount} / 1</p> {/* Changed word count target */}

            {/* Error Message */}
            {reviewError && (
              <p className="text-sm text-red-500 mt-2">{reviewError}</p>
            )}

            {/* Submit Button - update minimum word requirement */}
            <button
              type="submit"
              className="border-black border py-2 px-4 rounded-lg mt-4 w-full sm:w-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedStars || !reviewTitle.trim() || !reviewText.trim() || wordCount < 1}
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomerComment;
