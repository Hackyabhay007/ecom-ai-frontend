import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsBySearch, clearFilters } from '../../../redux/slices/shopSlice';

const GridLayout = ({ onLayoutChange, currentLayout }) => {
  const dispatch = useDispatch();
  const { isFiltered } = useSelector(state => state.shop);

  const handleSort = (value) => {
    // Map the UI sort values to API sort parameters
    const sortMapping = {
      'price_low': 'price_asc',
      'price_high': 'price_desc',
      'latest': 'date_desc',
      'default': ''
    };

    // Dispatch search with sort parameter
    dispatch(fetchProductsBySearch({
      filters: {
        sort: sortMapping[value]
      }
    }));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
      {/* Layout controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onLayoutChange('grid')}
          className={`p-2 transition-colors duration-200 ${
            currentLayout === 'grid' 
              ? 'text-theme-blue' 
              : 'text-gray-400 hover:text-theme-blue'
          }`}
        >
          <i className="ri-grid-fill text-xl"></i>
        </button>
        <button 
          onClick={() => onLayoutChange('list')}
          className={`p-2 transition-colors duration-200 ${
            currentLayout === 'list' 
              ? 'text-theme-blue' 
              : 'text-gray-400 hover:text-theme-blue'
          }`}
        >
          <i className="ri-list-check text-xl"></i>
        </button>
      </div>

      {/* Sort and Clear Filters Group */}
      <div className="flex items-center gap-3">
        {isFiltered && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="flex items-center gap-1 px-4 py-2 text-sm text-theme-blue hover:text-black transition-colors duration-200"
          >
            <i className="ri-filter-off-line"></i>
            Clear Filters
          </button>
        )}

        {/* Sort dropdown */}
        <div className="relative">
          <select
            onChange={(e) => handleSort(e.target.value)}
            defaultValue="default"
            className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:border-theme-blue focus:ring-1 focus:ring-theme-blue text-sm font-medium"
          >
            <option value="default">Default sorting</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="latest">Latest</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <i className="ri-arrow-down-s-line"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridLayout;
