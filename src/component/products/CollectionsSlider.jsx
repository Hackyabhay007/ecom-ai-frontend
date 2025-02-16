import React from 'react';
// Update Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // Change this line
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';

const CollectionsSlider = ({ collections, onCollectionSelect }) => {
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
            <button
              onClick={() => onCollectionSelect(collection.id)}
              className={`px-6 py-3 rounded-full transition-all ${
                collection_id === collection.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {collection.title}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CollectionsSlider;
