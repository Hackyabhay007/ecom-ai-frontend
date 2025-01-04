import React, { useState } from "react";

const LoyaltyPointsPopup = ({ points, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showCoinGif, setShowCoinGif] = useState(true);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Trigger the onClose callback after the animation
    }, 500); // Ensure the duration matches the CSS closing animation
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-6 transition-opacity duration-500 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`bg-gradient-to-t  py-10 from-sky-600 via-indigo-950 to-blue-900 rounded-xl w-full max-w-3xl shadow-2xl flex flex-col lg:flex-row transform transition-transform duration-500 ${
          isClosing
            ? "scale-75 opacity-0" // Shrinking effect for closing
            : "scale-100 animate-popup" // Popup animation for opening
        }`}
      >
        {/* Right Column: Points Display */}
        <div className="flex-1 md:p-8 flex flex-col items-center justify-center md:border-r-2 border-gray-300">
          <div className="bg-white rounded-full w-32 h-32 flex items-center ani justify-center text-6xl font-bold text-theme-blue shadow-md shadow-cyan-300 mb-6">
           <span className="">{points}</span>
          </div>
         
        </div>

        {/* Left Column: Coin GIF */}
        <div className="flex-1 md:p-8 flex flex-col items-center justify-center">
          
          <p className="md:text-6xl text-5xl font-bold text-center text-white">Your Loyalty Points</p>
        </div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
          onClick={handleClose}
        >
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>
  );
};

export default LoyaltyPointsPopup;
