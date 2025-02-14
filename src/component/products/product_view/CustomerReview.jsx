import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import CustomerComment from "./CustomerComment";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../../../redux/slices/reviewSlice";

const CustomerReview = ({ productImage, productId }) => {
  const dispatch = useDispatch();
  const { reviews, stats, loading, meta } = useSelector((state) => state.reviews);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [localReviews, setLocalReviews] = useState([]); // Add local reviews state

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews({ 
        productId, 
        page: currentPage, 
        limit: reviewsPerPage 
      }));
    }
  }, [dispatch, productId, currentPage]);

  useEffect(() => {
    // Update local reviews when Redux reviews change
    if (reviews) {
      setLocalReviews(reviews);
    }
  }, [reviews]);

  // Use stats from Redux store instead of calculating
  const totalRatings = stats.total;
  const overallRating = stats.average;
  const ratingBreakdown = {
    5: stats.distribution["5"].percentage,
    4: stats.distribution["4"].percentage,
    3: stats.distribution["3"].percentage,
    2: stats.distribution["2"].percentage,
    1: stats.distribution["1"].percentage,
  };

  console.log("This is the Product Image from the CustomerReview.jsx page", productImage);

  const handleReviewAdded = (newReview) => {
    setLocalReviews(prev => [newReview, ...prev]);
    // Update the stats immediately for better UX
    dispatch(fetchReviews({ productId }));
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

  // Add loading state display
  if (loading) {
    return <div className="mt-8 bg-[#F7F7F7] p-6 rounded-lg">Loading reviews...</div>;
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-8 bg-[#F7F7F7] p-6 rounded-lg">
      {/* Top Heading */}
      <h2 className="text-xl font-bold">Customer Reviews</h2>

      {/* Overall Rating */}
      <div className="flex flex-wrap gap-5 flex-col mt-6">
        <div className="flex w-full md:w-1/3">
          <div className="text-center rounded-lg p-4">
            <h3 className="text-5xl font-bold">{isNaN(overallRating) ? "0" : overallRating}</h3>
            <div className="text-yellow-500 flex justify-center">
              {"★".repeat(Math.round(overallRating))}
            </div>
            <p className="text-sm mt-1 text-gray-500 flex">(<span>{totalRatings}</span>&nbsp;<span>Ratings </span>)</p>
          </div>

          <div className="flex-1 w-fit ml-8">
            {Object.keys(ratingBreakdown).map((star) => (
              <div key={star} className="flex items-center pb-2">
                <span className="text-sm">{star} ★</span>
                <div className="flex-1 w-40 h-2 bg-gray-200 rounded-full mx-2">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${isNaN(ratingBreakdown[star]) ? 0 :ratingBreakdown[star]}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{isNaN(ratingBreakdown[star]) ? 0 :ratingBreakdown[star]}%</span>
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

      {/* Customer Reviews with Pagination */}
      <div className="mt-8 space-y-2 flex flex-col gap-3">
        {reviews && reviews.length > 0 ? (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full px-5 border-2 border-theme-blue rounded-lg"
                >
                  <div className="relative mb-4">
                    <Image
                      src={review.user_pic || '/default-avatar.png'} // Add fallback image
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
                      {formatLocalDate(review.created_at || Date.now())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 pb-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(meta.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === index + 1
                          ? 'bg-black text-white'
                          : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === meta.totalPages
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">No reviews yet. Be the first to review!</div>
        )}
      </div>

      {/* Full-Screen Popup */}
      {isPopupOpen && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="fixed inset-0 md:bg-transparent bg-white flex flex-col items-center justify-center overflow-auto">
            <button
              className="absolute top-4 right-4 text-gray-800 bg-white rounded-full text-xl px-[10px] py-1"
              onClick={() => setIsPopupOpen(false)}
            >
              ✕
            </button>
            <div className="w-full max-w-4xl p-6">
              <CustomerComment 
                productImage={productImage} 
                setIsPopupOpen={setIsPopupOpen}
                productId={productId}
                onReviewAdded={handleReviewAdded}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomerReview;
