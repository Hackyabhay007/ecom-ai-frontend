import React from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';

const Breadcrumb = ({ heading, onCollectionSelect }) => {
  const router = useRouter();
  const { collection_id } = router.query;
  const { filters } = useSelector(state => state.shop);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{heading}</h1>
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={15}
          slidesPerView="auto"
          className="collections-slider py-2"
        >
          {filters.collections?.map((collection) => (
            <SwiperSlide key={collection.id} style={{ width: 'auto' }}>
              <button
                onClick={() => onCollectionSelect(collection.id)}
                className={`px-6 py-3 rounded-full transition-all hover:bg-theme-blue hover:text-white ${
                  collection_id === collection.id
                    ? 'bg-theme-blue text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {collection.title}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Breadcrumb;
