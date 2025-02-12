import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilters, fetchProducts } from '../../../redux/slices/shopSlice';
import { useRouter } from 'next/router';

const SelectedFilters = ({ onClearFilter, defaultPriceRange }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { appliedFilters, filters } = useSelector((state) => state.shop);

  // Get current active filters from Redux store
  const activeFilters = {
    priceRange: {
      min: appliedFilters.minPrice || defaultPriceRange?.[0] || 0,
      max: appliedFilters.maxPrice || defaultPriceRange?.[1] || 1000
    },
    color: router.query.color,
    size: router.query.size,
    category: router.query.cat_name
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.color ||
      activeFilters.size ||
      activeFilters.category ||
      (activeFilters.priceRange.min !== defaultPriceRange?.[0] || 
       activeFilters.priceRange.max !== defaultPriceRange?.[1])
    );
  };

  const handleClearAll = () => {
    // Clear URL query params by replacing with empty query
    router.replace({
      pathname: '/shop'
    }, undefined, { shallow: true });

    // Clear filters in Redux store
    dispatch(clearFilters());

    // Fetch products without any filters
    dispatch(fetchProducts({ 
      page: 1,
      filters: {} 
    }));
  };

  if (!hasActiveFilters()) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Price Range Filter Tag */}
      {(activeFilters.priceRange.min !== defaultPriceRange?.[0] || 
        activeFilters.priceRange.max !== defaultPriceRange?.[1]) && (
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
          <span>₹{activeFilters.priceRange.min} - ₹{activeFilters.priceRange.max}</span>
          <button
            onClick={() => onClearFilter('priceRange')}
            className="text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>
      )}

      {/* Color Filter Tag */}
      {activeFilters.color && (
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
          <span className="capitalize">{activeFilters.color}</span>
          <button
            onClick={() => onClearFilter('color')}
            className="text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>
      )}

      {/* Size Filter Tag */}
      {activeFilters.size && (
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
          <span className="uppercase">{activeFilters.size}</span>
          <button
            onClick={() => onClearFilter('size')}
            className="text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>
      )}

      {/* Category Filter Tag */}
      {activeFilters.category && (
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
          <span className="capitalize">{activeFilters.category}</span>
          <button
            onClick={() => onClearFilter('category')}
            className="text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>
      )}

      {/* Clear All Button */}
      {hasActiveFilters() && (
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 hover:text-black underline"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default SelectedFilters;
