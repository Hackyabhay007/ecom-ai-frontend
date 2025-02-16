import React from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Breadcrumb = ({ heading, onCollectionSelect }) => {
  const { filters } = useSelector(state => state.shop);
  const collections = filters.collections || [];
  const router = useRouter();
  const { collection_id } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{heading}</h1>
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

export default Breadcrumb;
