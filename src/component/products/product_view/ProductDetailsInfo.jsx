import React from "react";
import Image from "next/image";

const ProductDetailsInfo = ({ categories }) => {
  // Payment options data
  const paymentOptions = [
    { src: "/images/payment/payment1.png", alt: "Payment Option 1" },
    { src: "/images/payment/payment2.png", alt: "Payment Option 2" },
    { src: "/images/payment/payment3.png", alt: "Payment Option 3" },
    { src: "/images/payment/payment4.png", alt: "Payment Option 4" },
    { src: "/images/payment/payment5.png", alt: "Payment Option 5" },
    { src: "/images/payment/payment6.png", alt: "Payment Option 6" },
    { src: "/images/payment/payment7.png", alt: "Payment Option 7" },
    { src: "/images/payment/payment8.png", alt: "Payment Option 8" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-7 my-6 pb-40 md:py-5 px-5 md:px-10 overflow-auto max-h-screen">
      {/* Left Column */}
      <div className="md:w-1/2 w-full ">
        {/* Payment Options */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg text-black font-medium ">Payment Options</h3>
          <div className="flex gap-3 mt-3 border rounded-md px-1 py-3">
            {/* Dynamically map payment options */}
            {paymentOptions.map((option, index) => (
              <div key={index} className="relative w-16 h-10">
                <Image
                  src={option.src}
                  alt={option.alt}
                  layout="fill"
                  objectFit="contain"
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          {/* Get It Today */}
          <div className="flex gap-4 items-start">
            <i className="ri-truck-line text-xl text-black"></i>
            <div>
              <h4 className="text-base font-medium">Get it Today</h4>
              <p className="text-sub-color text-sm">
                Free shipping on orders over ₹500
              </p>
            </div>
          </div>

          {/* Support Everyday */}
          <div className="flex gap-4 items-start">
            <i className="ri-phone-line text-xl text-black"></i>
            <div>
              <h4 className="text-base font-medium">Support Everyday</h4>
              <p className="text-sub-color text-sm">
                Support from 8:30 AM to 10:00 PM every day
              </p>
            </div>
          </div>

          {/* 30 Days Return */}
          <div className="flex gap-4 items-start">
            <i className="ri-refund-line text-xl text-black"></i>
            <div>
              <h4 className="text-base font-medium">30 Days Return</h4>
              <p className="text-sub-color text-sm">
                Not impressed? Get a refund. You have 30 days to break our
                hearts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:w-1/2 w-full ">
        {/* Delivery & Return */}
        <div className="mb-4">
          <div className="flex gap-2 items-center text-black">
            <i className="ri-information-line text-lg"></i>
            <h4 className="text-lg">Delivery & Return</h4>
          </div>
          <p className="text-sub-color mt-2">
            Free shipping for orders over ₹500. Returns available within 30
            days.
          </p>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          {/* Ask a Question */}
          <div className="flex gap-2 items-center">
            <i className="ri-question-line text-lg "></i>
            <h4 className="text-lg">Ask a Question</h4>
          </div>

          {/* Estimate Time */}
          <div className="flex gap-2 items-center">
            <i className="ri-time-line text-lg text-black"></i>
            <p className="text-sub-color">
              Estimated delivery: 12 January to 18 January
            </p>
          </div>

          {/* SKU */}
          <p className="text-sub-color">
            <span className="text-black text-lg">SKU:</span> #12345
          </p>

          {/* Categories */}
          <p className="text-sub-color">
            <span className="text-black text-lg">Categories:</span>{" "}
            {categories &&
              categories.map((category, index) => (
                <span key={index} className="inline-block mr-2">
                  {category}
                  {index < categories.length - 1 ? "," : ""}
                </span>
              ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsInfo;
