import React from 'react';

const LineLoader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      <div className="relative w-full h-0.5 bg-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-black animate-line-loader"></div>
      </div>
    </div>
  );
};

export default LineLoader;
