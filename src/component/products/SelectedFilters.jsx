import React from "react";
import { useRouter } from "next/router";

const SelectedFilters = ({
  filters,
  onClearFilter,
  onClearAllFilters,
  defaultPriceRange,
}) => {
  const router = useRouter();
  const { cat_id, cat_name, size, color } = router.query; // Extract `id` from the query
  const hasFiltersApplied = Object.keys(filters).some((key) => {
    if (key === "price") {
      return (
        filters[key][0] !== defaultPriceRange[0] ||
        filters[key][1] !== defaultPriceRange[1]
      );
    }
    if (Array.isArray(filters[key])) {
      return filters[key].length > 0;
    }
    return filters[key];
  });

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {cat_id && (
        <span className="border border-sub-color text-gray-700 px-2 py-1 rounded-full">
          {cat_name}
          <button
            onClick={() => {
              const { cat_id, cat_name, ...remainingQueries } = router.query; // Remove `id` while keeping other queries
              router.push({
                pathname: router.pathname, // Keep the same page
                query: remainingQueries, // Apply remaining queries
              });
            }}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </span>
      )}

      {filters.price[0] !== defaultPriceRange[0] ||
      filters.price[1] !== defaultPriceRange[1] ? (
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

      {size && (
        <span className="border border-sub-color  px-2 py-1 rounded-full">
          {size}
          <button
            onClick={() => {
              const { ...remainingQueries } = router.query; // Remove `id` while keeping other queries
              router.push({
                pathname: router.pathname, // Keep the same page
                query: {
                  ...remainingQueries,
                  size: "M",
                }, // Apply remaining queries
              });
            }}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </span>
      )}

      {filters.brand.length > 0 &&
        filters.brand.map((brand) => (
          <span
            key={brand}
            className="border border-sub-color  px-2 py-1 rounded-full"
          >
            {brand}
            <button
              onClick={() => onClearFilter("brand", brand)}
              className="ml-2 text-red-500"
            >
              &times;
            </button>
          </span>
        ))}

      {color && (
        <span className="border border-sub-color text-gray-700 px-2 py-1 rounded-full flex gap-2">
          <div
            className="rounded-full opacity-70"
            style={{ backgroundColor: color, height: `25px`, width: `25px` }}
          ></div>
          {color}

          <button
            onClick={() => {
              const { color, ...remainingQueries } = router.query; // Remove `id` while keeping other queries
              router.push({
                pathname: router.pathname, // Keep the same page
                query: remainingQueries, // Apply remaining queries
              });
            }}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </span>
      )}

      {  !cat_name || !color  && (
        <button
          onClick={()=>{
            
            router.push({
            pathname: router.pathname, // Keep the same page
            query: {
              size : "M"
            }, // Apply remaining queries
          })}}
          className="border border-sub-color-red-500 bg-white border-red-600  text-red-600 px-4 py-1 rounded-full"
        >
          &times; Clear All
        </button>
      )}
    </div>
  );
};

export default SelectedFilters;
