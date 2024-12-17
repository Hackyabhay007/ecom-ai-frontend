import React from "react";

const SelectedFilters = ({ filters, onClearFilter, onClearAllFilters, defaultPriceRange }) => {
  const hasFiltersApplied = Object.keys(filters).some((key) => {
    if (key === "price") {
      return filters[key][0] !== defaultPriceRange[0] || filters[key][1] !== defaultPriceRange[1];
    }
    if (Array.isArray(filters[key])) {
      return filters[key].length > 0;
    }
    return filters[key];
  });

  return (
    <div className="flex gap-2 items-center">
      {filters.category && (
        <span className="border border-sub-color-sub-color border-sub-color text-gray-700 px-2 py-1 rounded-full">
          {filters.category}
          <button
            onClick={() => onClearFilter("category", filters.category)}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </span>
      )}

      {filters.price[0] !== defaultPriceRange[0] || filters.price[1] !== defaultPriceRange[1] ? (
        <span className="border border-sub-color  px-2 py-1 rounded-full">
          Price: ${filters.price[0]} - ${filters.price[1]}
          <button
            onClick={() => onClearFilter("price", filters.price)}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </span>
      ) : null}

      {filters.size && (
        <span className="border border-sub-color  px-2 py-1 rounded-full">
          {filters.size}
          <button
            onClick={() => onClearFilter("size", filters.size)}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </span>
      )}

      {filters.brand.length > 0 &&
        filters.brand.map((brand) => (
          <span key={brand} className="border border-sub-color  px-2 py-1 rounded-full">
            {brand}
            <button
              onClick={() => onClearFilter("brand", brand)}
              className="ml-2 text-red-500"
            >
              &times;
            </button>
          </span>
        ))}

      {filters.color && (
        <span className="border border-sub-color text-gray-700 px-2 py-1 rounded-full">
          {filters.color}
          <button
            onClick={() => onClearFilter("color", filters.color)}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </span>
      )}

      {hasFiltersApplied && (
        <button
          onClick={onClearAllFilters}
          className="border border-sub-color-red-500 bg-red-500 border-red-600  text-white px-4 py-1 rounded-full"
        >
          Clear All 
        </button>
      )}
    </div>
  );
};

export default SelectedFilters;
