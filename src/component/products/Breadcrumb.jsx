import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const Breadcrumb = ({ heading, onCollectionSelect, onClearAllFilters }) => {
  const router = useRouter();
  const { collection_id, collection_name } = router.query;
  const { filters, appliedFilters, isFiltered } = useSelector(state => state.shop);
  const [selectedCollection, setSelectedCollection] = useState(collection_name || "");

  const handleCollectionSelect = async (collection) => {
    // Update URL first
    router.push({
      pathname: "/shop",
      query: { 
        collection_id: collection.id, 
        collection_name: collection.title 
      }
    }, undefined, { shallow: true });
    
    setSelectedCollection(collection.title);
    
    // Call the parent handler after URL update
    if (onCollectionSelect) {
      await onCollectionSelect(collection.id);
    }
  };

  return (
    <div className="mb-0 py-5">
      {/* Breadcrumb Navigation */}
      <div className="py-1 mb-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <nav className="text-sm text-sub-color flex justify-start gap-0">
              <span className="text-[#1F1F1F]">Homepage / </span>
              <span> Shop </span>
              {selectedCollection && <span> / {selectedCollection}</span>}
              {heading && !selectedCollection && <span> / {heading}</span>}
            </nav>
       
          </div>
          <p className="text-4xl font-bold pt-3">{heading}</p>
        </div>
      </div>

      {/* Collections */}
      <div className="px-4 md:px-14 md:ml-8">
        <div className="flex overflow-x-auto gap-4 text-xs md:text-sm font-semibold text-[#1F1F1F] uppercase no-scrollbar">
          {filters.collections?.map((collection) => (
            <span
              key={collection.id}
              className={`
                relative cursor-pointer group rounded-full border 
                transition-all duration-300 ease-in-out transform 
                hover:scale-105 px-4 py-2 flex items-center justify-center whitespace-nowrap
                ${collection_id === collection.id
                  ? "bg-theme-blue text-white border-theme-blue shadow-lg"
                  : "border-[#1F1F1F] text-[#1F1F1F] hover:bg-theme-blue hover:text-white hover:border-theme-blue"
                }
              `}
              style={{
                minWidth: "100px",
                height: "40px",
                lineHeight: "1.5",
              }}
              onClick={() => handleCollectionSelect(collection)}
            >
              {collection.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
