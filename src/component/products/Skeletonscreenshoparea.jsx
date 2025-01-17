import React from "react";

const SkeletonScreen = () => {
  return (
    <div className="p-4 space-y-2 w-screen h-screen fixed">
      {/* Header */}

      <div className="  h-8 bg-gray-200 rounded-md w-1/4 animate-pulse "></div>
      <div className="animate-pulse  h-14 bg-gray-200 rounded-md w-[10%]"></div>
      <div className="animate-pulse  flex gap-4 ">
      <div className="animate-pulse  flex gap-4 w-fit">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse  h-10 bg-gray-200 rounded-md w-[7vw]"></div>
            ))}
          </div>
      </div>
        

      {/* Filter and Product Grid */}
      <div className="animate-pulse  flex space-x-6">
        {/* Filter Section */}
        <div className="animate-pulse  w-1/4 space-y-4">
          <div className="animate-pulse  h-6 bg-gray-200 rounded-md w-3/4"></div>
          <div className="animate-pulse  h-4 bg-gray-200 rounded-md w-1/2"></div>

          {/* Filter Items */}
          <div className="  space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse  h-4 bg-gray-200 rounded-md w-3/4"></div>
            ))}
          </div>
        </div>

        {/* Product Grid Section */}
        <div className=" flex-1 grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse  rounded-lg shadow-sm space-y-4"
            >
              <div className="animate-pulse  h-[50vh] bg-gray-200 rounded-md"></div>
              {/* <div className="animate-pulse  h-6 bg-gray-200 rounded-md w-3/4"></div> */}
              {/* <div className="animate-pulse  h-4 bg-gray-200 rounded-md w-1/2"></div> */}
              <div className="animate-pulse  h-6 bg-gray-200 rounded-md w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonScreen;
