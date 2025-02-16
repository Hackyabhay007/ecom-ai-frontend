import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../../redux/slices/shopSlice';

const GridLayout = ({ onLayoutChange, currentLayout, onSortChange, currentSort }) => {
  const dispatch = useDispatch();

  const handleSaleToggle = (e) => {
    const isChecked = e.target.checked;
    dispatch(fetchProducts({
      page: 1,
      filters: {
        onSale: isChecked
      }
    }));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      {/* Layout controls */}
      <div className="flex items-center gap-4">
        {/* Grid/List view toggles */}
        <button onClick={() => onLayoutChange('grid')}
          className={`p-2 ${currentLayout === 'grid' ? 'text-black' : 'text-gray-400'}`}>
          <i className="ri-grid-fill text-xl"></i>
        </button>
        <button onClick={() => onLayoutChange('list')}
          className={`p-2 ${currentLayout === 'list' ? 'text-black' : 'text-gray-400'}`}>
          <i className="ri-list-check text-xl"></i>
        </button>
        
        {/* Sale items toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={handleSaleToggle}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-sm font-medium">Sale Items</span>
        </label>
      </div>

      {/* Sort dropdown */}
      <select
        onChange={(e) => onSortChange(e.target.value)}
        value={currentSort}
        className="border rounded-md p-2"
      >
        <option value="default">Default sorting</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="latest">Latest</option>
      </select>
    </div>
  );
};

export default GridLayout;
