import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { postReview } from "@/redux/slices/reviewSlice";
import { retrieveCustomer } from "@/redux/slices/authSlice";
import Link from "next/link";
import { getCookie } from "../../../../utils/cookieUtils";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { createApiUrl } from '../../../../utils/apiConfig'; // Fix import path

const CustomerComment = ({ productImage, setIsPopupOpen, productId, onReviewAdded }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
  
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.auth?.user); // Fix selector
  const { status, error } = useSelector((state) => state.reviews);

  // Check if user has already reviewed
  useEffect(() => {
    const checkExistingReview = async () => {
      const authToken = getCookie('auth_token');
      if (!authToken || !productId) return;

      try {
        // Using the correct endpoint
        const response = await axios.get(
          createApiUrl(`/reviews/user/check/${productId}`), // Updated endpoint
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Check review response:', response.data);

        if (response.data?.success) {
          setHasAlreadyReviewed(response.data.data.hasReviewed);
          if (response.data.data.hasReviewed) {
            toast.info("You have already reviewed this product");
          }
        }
      } catch (err) {
        // Better error handling
        if (err.response?.status === 404) {
          console.log('No previous review found');
          // 404 means no review exists, which is fine
          setHasAlreadyReviewed(false);
          return;
        }
        
        console.error('Error checking review status:', {
          status: err.response?.status,
          message: err.response?.data?.message || err.message
        });
      }
    };

    checkExistingReview();
  }, [productId]);

  // Authentication check
  const authToken = getCookie('auth_token');
  if (!authToken) {
    return (
      <div className="p-6 bg-[#F7F7F7] rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
        <p className="text-gray-600">Please sign in to write a review.</p>
        <Link href="/auth/login">
          <button
            className="mt-4 bg-black text-white px-4 py-2 rounded"
            onClick={() => setIsPopupOpen(false)}
          >
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  const handleStarClick = (star) => {
    if (!hasAlreadyReviewed) {
      setSelectedStars(star);
    }
  };

  // Handle text change for review text
  const handleReviewTextChange = (event) => {
    if (!hasAlreadyReviewed) {
      setReviewText(event.target.value);
    }
  };

  // Handle text change for review title
  const handleReviewTitleChange = (event) => {
    if (!hasAlreadyReviewed) {
      setReviewTitle(event.target.value);
    }
  };

  // Fix success modal rendering
  const renderSuccessModal = () => {
    if (!showSuccess) return null;

    return (
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
    );
  };

  // Calculate word count
  const wordCount = reviewText.split(/\s+/).filter(word => word.length > 0).length;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!selectedStars) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewTitle.trim()) {
      toast.error("Please enter a review title");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please enter a review message");
      return;
    }

    const loadingToast = toast.loading('Submitting your review...');

    try {
      const result = await dispatch(postReview({
        productId,
        rating: selectedStars,
        title: reviewTitle.trim(),
        message: reviewText.trim()
      })).unwrap();

      toast.dismiss(loadingToast);
      toast.success('Review submitted successfully!');

      if (result?.data) {
        onReviewAdded({
          id: result.data.id,
          rating: selectedStars,
          title: reviewTitle,
          description: reviewText,
          user_pic: customer?.avatar || '/default-avatar.png',
          user_name: customer?.name || 'Anonymous',
          created_at: new Date().toISOString(),
          product_id: productId,
        });

        setHasAlreadyReviewed(true);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
          setIsPopupOpen(false);
        }, 2000);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to submit review');
      setReviewError(error.message || 'Failed to submit review');
    }
  };

  return (
    <>
      {renderSuccessModal()}
      <div className="flex flex-col md:flex-row gap-6 p-2 md:p-6 bg-[#F7F7F7] rounded-lg">
        {/* Product Image Section */}
        <div className="w-full md:w-1/3">
          <Image
            src={productImage}
            alt="Product"
            width={200}
            height={200}
            className="md:w-full h-1/4 md:h-auto rounded-lg border"
          />
        </div>

        {/* Review Form Section */}
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
                  } ${hasAlreadyReviewed ? "cursor-not-allowed" : ""}`}
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
              placeholder="Title of your review"
              value={reviewTitle}
              onChange={handleReviewTitleChange}
              disabled={hasAlreadyReviewed}
              className="border p-2 rounded-xl w-full mt-4"
            />

            {/* Review Text Area */}
            <textarea
              placeholder="Write your review (maximum 300 words)"
              value={reviewText}
              onChange={handleReviewTextChange}
              disabled={hasAlreadyReviewed}
              className="border p-2 rounded-xl w-full mt-4"
              rows={6}
            />
            <p className="text-sm mt-2 text-gray-500">
              Word count: {wordCount} / 300
            </p>

            {/* Error Message */}
            {reviewError && (
              <p className="text-sm text-red-500 mt-2">{reviewError}</p>
            )}

            {/* Submit Button */}
            {hasAlreadyReviewed ? (
              <button
                type="button"
                className="border-gray-300 border py-2 px-4 rounded-lg mt-4 w-full sm:w-auto cursor-not-allowed bg-gray-100 text-gray-500"
                disabled
              >
                Already Reviewed
              </button>
            ) : (
              <button
                type="submit"
                className="border-black border py-2 px-4 rounded-lg mt-4 w-full sm:w-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomerComment;
