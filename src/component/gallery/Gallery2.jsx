import React, { useEffect, useState } from "react";
import Image from "next/image";
import ImageStackSlider from "./ImageStackSlider";
import { useDispatch, useSelector } from "react-redux";
import { fetchfeatureds } from "../../../redux/slices/featuredSlicer.js";

function Gallery2() {
  const dispatch = useDispatch();
  const { featureds, status, error } = useSelector(
    (state) => state.featuredection
  );

  const [catalogdata, setCatalogdata] = useState([]);
  const [galleryData, setGalleryData] = useState([]);

  useEffect(() => {
    dispatch(fetchfeatureds());
  }, [dispatch]);

  useEffect(() => {
    // Set gallery data to featureds from redux state
    setGalleryData(featureds);
  }, [featureds]);

  // Logic to select the first video or image
  const selectedItem = galleryData.find((item) => item.type === "video") || galleryData.find((item) => item.type === "image");

  useEffect(() => {
    if (featureds.length) {
      const videos = featureds.filter(item => item.type === "catalog");

      // Ensure catalogData is an array before setting it
      const catalogArray = Array.isArray(videos[0]?.catalogData)
        ? videos[0].catalogData
        : Object.values(videos[0]?.catalogData || {}); // Convert to array if it's an object

      setCatalogdata(catalogArray);
    }
  }, [featureds]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[80%] md:h-96">
      {/* Display the first selected item */}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {selectedItem && (
        <div className="relative w-full h-[40%] md:h-full md:w-1/2 group">
          {selectedItem.type === "image" ? (
            <Image
              src={selectedItem.image} // Assuming image is the property in your data
              alt={selectedItem.title || "Image"}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={selectedItem.image} // Assuming video URL is stored in 'image' property
              muted
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-500">
            <h2 className="text-white text-4xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {selectedItem.title || "Title"}
            </h2>
            <button className="text-black bg-white rounded-lg text-lg shadow-lg py-2 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {selectedItem.text || "View All"}
            </button>
          </div>
        </div>
      )}

      {/* Black Strip with Scrolling Text */}
      <div className="bg-black h-8 pt-1 text-white text-sm flex overflow-hidden md:flex-col md:h-full gap-11 w-full md:w-10 items-center justify-center md:writing-mode-vertical px-2">
        <div className="gap-4 md:gap-0 flex flex-row md:flex-col h-fit animate-scroll-left-gallery md:animate-scroll-up-gallery md:space-y-10">
          {Array.from({ length: 20 }, (_, i) => (
            <p
              key={`original-${i}`}
              className="md:mb-0 rotate-0 md:rotate-90 whitespace-nowrap"
            >
              NEW
            </p>
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <p
              key={`duplicate-${i}`}
              className="md:mb-0 rotate-0 md:rotate-90 whitespace-nowrap"
            >
              NEW
            </p>
          ))}
        </div>
      </div>

      {/* Image 2 (ImageStackSlider) */}
      <div className="relative w-full h-[40%] md:h-full md:w-1/2 group">
        <ImageStackSlider catalogdata={catalogdata} />
      </div>
    </div>
  );
}

export default Gallery2;
