import React from 'react';

const LineLoader = () => {
  return (
    <div className="relative w-full h-1 bg-gray-100 overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-1/3 bg-black animate-line-loader"></div>
    </div>
  );
};

export default LineLoader;
