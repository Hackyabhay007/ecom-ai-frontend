import React from 'react';
// Update Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // Change this line
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';

const CollectionsSlider = ({ collections, onCollectionSelect, onClearCollection }) => {
  const router = useRouter();
  const { collection_id } = router.query;

  return (
    <div className="container mx-auto px-4 mb-8">
      <Swiper
        modules={[Navigation]}
        navigation={true}
        spaceBetween={20}
        slidesPerView={'auto'}
        className="collections-slider"
      >
        {collections?.map((collection) => (
          <SwiperSlide key={collection.id} style={{ width: 'auto' }}>
            <div className="relative">
              <button
                onClick={() => onCollectionSelect(collection.id)}
                className={`px-6 py-3 rounded-full transition-all ${
                  collection_id === collection.id
                    ? 'bg-black text-white pr-10' // Added padding for cross button
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {collection.title}
                {collection_id === collection.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearCollection();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                )}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CollectionsSlider;
