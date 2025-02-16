import React from 'react';

const FilterSkeleton = () => (
  <div className="animate-pulse">
    {/* Filter Header */}
    <div className="mb-6">
      <div className="h-6 w-20 bg-gray-200 rounded mb-4"></div>
    </div>

    {/* Categories Skeleton */}
    <div className="mb-6">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
      ))}
    </div>

    {/* Size Filter Skeleton */}
    <div className="mb-6">
      <div className="h-5 w-16 bg-gray-200 rounded mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>

    {/* Price Range Skeleton */}
    <div className="mb-6">
      <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
      <div className="h-12 w-full bg-gray-200 rounded mb-3"></div>
      <div className="h-8 w-full bg-gray-200 rounded"></div>
    </div>

    {/* Colors Skeleton */}
    <div>
      <div className="h-5 w-20 bg-gray-200 rounded mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
        ))}
      </div>
    </div>
  </div>
);

export default FilterSkeleton;
