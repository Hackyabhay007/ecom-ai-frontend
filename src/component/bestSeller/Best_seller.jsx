// src/components/BestSeller.js
import React, { useEffect } from 'react';
import BestSellerCard from './BestSellerCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBestSeller_Section } from '../../../redux/slices/homePageSlice'; // Import the fetchHeroSection action creator
import Link from "next/link";



const dummyData = [
  {
    image: '/images/bestseller/best1.png',
    rating: '4.5',
    price: '19.99',
    prevPrice: '39.99',
    discount: '20'
  },
  {
    image: '/images/bestseller/best2.png',
    rating: '4.0',
    price: '24.99',
    prevPrice: '49.99',
    discount: '50'
  },
  {
    image: '/images/bestseller/best3.png',
    rating: '4.7',
    price: '29.99',
    prevPrice: '59.99',
    discount: '45'
  },
  {
    image: '/images/bestseller/best4.png',
    rating: '4.3',
    price: '21.99',
    prevPrice: '44.99',
    discount: '20'
  }
];

function BestSeller() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [shopBtn, setShopBtn] = React.useState({
    text: "",
    link: "",
  });

  const [bestSellerData, setBestSellerData] = React.useState([]);
  const dispatch = useDispatch();
  const { bestSellerSection, loading, error } = useSelector((state) => state?.homePage); // Correct selector

  useEffect(() => {
    dispatch(fetchBestSeller_Section()).then((result) => {
      // console.log("This is the Best Seller data from the BestSeller.js file", result.payload);
    });
  }, [dispatch]);


  // Log the hero section data from state
  useEffect(() => {

    // console.log("This is the Best Seller data from the BestSeller.js file", bestSellerSection?.section_data);
    // console.log("This is the Review data from the Review.js file", reviewSection?.section_data);
    if (bestSellerSection?.section_data?.title) {
      setTitle(bestSellerSection?.section_data?.title);
    }

    if (bestSellerSection?.section_data?.description) {
      // console.log("This is the bestSeller description data ", bestSellerSection?.section_data?.description);
      setDescription(bestSellerSection?.section_data?.description);
    }

    if (bestSellerSection?.section_data?.cta_button?.text && bestSellerSection?.section_data?.cta_button?.link) {
        setShopBtn({
          text: bestSellerSection?.section_data?.cta_button?.text,
          link: bestSellerSection?.section_data?.cta_button?.link,
        });
    }

    if (bestSellerSection?.section_data?.products.length > 0) {
      let bestSeller_Array = bestSellerSection?.section_data?.products.map((product) => {
        return {
          id: product.product_id,
          image: "",
          rating: 0,
          price: 0,
          prevPrice: "",
          discount: "",
        };
      });

      // console.log("This is the bestSeller product array data ", bestSeller_Array);
      setBestSellerData(bestSellerSection?.section_data?.products);
    }
  }, [bestSellerSection]);


  return (
    <div className="h-fit p-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 flex gap-5 flex-col justify-center">
          <h1 className="text-theme-blue text-center md:text-start font-bold text-3xl md:text-5xl lg:text-7xl mb-4">{title || ""}</h1>
          <p className="text-sm text-sub-color mb-4">
            {description || ""}
          </p>
          <button className="bg-white border border-black w-40 rounded-lg p-2 hover:bg-theme-blue hover:text-white transition duration-200 ease-in-out">
            <Link href={shopBtn?.link}>{shopBtn?.text}</Link>
          </button>
        </div>
        <div className="md:w-2/3  flex  overflow-x-scroll space-x-4 scrollbar-custom">
          <div className="flex space-x-4 w-full" style={{ minWidth: '100%' }}>
            {dummyData.map((item, index) => (
              <div key={index} className="flex-none w-full h-full md:w-2/3 lg:w-1/2 md:px-4">
                <BestSellerCard
                  image={item.image}
                  rating={item.rating}
                  price={item.price}
                  prevPrice={item.prevPrice}
                  discount={item.discount}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestSeller;
