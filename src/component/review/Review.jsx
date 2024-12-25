import React, { useState } from 'react';
import Image from 'next/image';

const reviewsData = [
  {
    id: 1,
    image: '/images/review/review1.png',
    rating: 5,
    heading: 'Variety of Styles, Good Cloth and Luxury',
    review: 'A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.',
    name: 'Rahul Singh',
    date: 'Dec 10, 2024',
  },
  {
    id: 2,
    image: '/images/review/review2.png',
    rating: 4,
    heading: 'Affordable Yet Premium Quality',
    review: 'Highly recommended! The material is great, and the designs are even better. Definitely coming back for more.',
    name: 'Abhay Gupta',
    date: 'Dec 9, 2024',
  },
  {
    id: 3,
    image: '/images/review/review3.png',
    rating: 5,
    heading: 'Great Shopping Experience',
    review: 'Amazing service and fast delivery. The clothes fit perfectly, and the style is just what I was looking for.',
    name: 'Pramod Birla',
    date: 'Dec 8, 2024',
  },
];

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviewsData.length) % reviewsData.length);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} style={{ color: index < rating ? '#FFD700' : '#D3D3D3' }}>
        ★
      </span>
    ));
  };

  return (
    <div className="p-5 ">
      <h2 className="text-center text-xl md:text-3xl font-bold mb-8">What People Are Saying</h2>

      {/* Desktop View */}
      <div className="hidden lg:flex justify-start space-x-4 overflow-x-auto px-5">
        {reviewsData.map((review) => (
          <div
            key={review.id}
            className="w-1/3 px-5 border-2 border-theme-blue rounded-lg"
            style={{ height: 'auto' }} // Ensuring consistent height across all cards
          >
            <div className="relative mb-4">
              <Image
                src={review.image}
                alt={`Review by ${review.name}`}
                width={200}
                height={200}
                className="absolute top-0 left-0 w-16 h-16 rounded-xl object-cover"
              />
              <div className="ml-20 my-5">
                <div className="text-yellow-600">{renderStars(review.rating)}</div>
                <h3 className="font-semibold text-lg mt-2">{review.heading}</h3>
              </div>
                <p className="text-sub-color mt-2">{review.review}</p>
                <p className="text-sm font-bold mt-2">{review.name}</p>
                <p className="text-sm text-sub-color mt-2">{review.date}</p>

            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex justify-center items-center">
        <div className="relative w-full p-5">
          <div className="w-full px-5 py-2 border border-theme-blue rounded-lg h-fit" >
            <div className="relative">
              <Image
                src={reviewsData[currentIndex].image}
                alt={`Review by ${reviewsData[currentIndex].name}`}
                width={200}
                height={200}
                className="absolute top-0 left-0 w-16 h-16 rounded-xl object-cover"
              />
              <div className="ml-20 mt-4">
                <div className="text-yellow-600">{renderStars(reviewsData[currentIndex].rating)}</div>
                <h3 className="font-semibold text-lg mt-2">{reviewsData[currentIndex].heading}</h3>
              </div>
                <p className="text-sub-color mt-2">{reviewsData[currentIndex].review}</p>
                <p className="text-sm font-bold mt-2">{reviewsData[currentIndex].name}</p>
                <p className="text-sm text-sub-color mt-2">{reviewsData[currentIndex].date}</p>

            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="absolute top-1/2 left-0 w-full flex justify-between ">
            <button onClick={prevReview} className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full">
            <i className="ri-arrow-left-s-fill"></i>
            </button>
            <button onClick={nextReview} className="backdrop-blur-sm bg-white/15 p-2 shadow-md rounded-full">
            
            <i className="ri-arrow-right-s-fill"></i>
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {reviewsData.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-theme-blue' : 'bg-gray-400'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
