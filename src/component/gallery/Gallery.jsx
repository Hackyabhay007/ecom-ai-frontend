import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchGalleryOneSection } from "@/redux/slices/homePageSlice.js";

// import { fetchcataloges } from "../../../redux/slices/catalogSlicer.js";
import { set } from "lodash";

function Gallery() {
  const [mainImage, setMainImage] = useState({
    url: "",
    alt: ""
  });
  const [imageCarousel, setImageCarousel] = useState([]);

  const dispatch = useDispatch();
  const { galleryOneSection, loading, error } = useSelector((state) => state?.homePage); // Correct selector

  useEffect(() => {
    dispatch(fetchGalleryOneSection());
  }, [dispatch]);

  useEffect(() => {
    if (galleryOneSection?.section_data?.main_image?.url) {
      setMainImage({
        url: galleryOneSection.section_data.main_image.url,
        alt: galleryOneSection.section_data.main_image.alt
      });
    }


    if (galleryOneSection?.section_data?.gallery?.length > 0) {
      // console.log("This is the galleryOneSection array from the Gallery.jsx file", galleryOneSection?.section_data?.gallery);
      const imageArray = galleryOneSection?.section_data?.gallery?.map((image) => {
        return {
          id: image.id,
          url: image.url,
          alt: image.alt
        };
      });

      if (imageArray?.length > 0) {
        setImageCarousel(imageArray);
      }
    }
  }, [galleryOneSection]);

  // console.log(Array.isArray(catalog));
  return (
    <div
      className="relative bg-cover md:bg-center min-h-96 h-[500px] flex"
      style={{ backgroundImage: `url(${mainImage?.url})` }}
    >
      {/* Right Side Grid with Scrolling Animation */}
      <div className="ml-auto w-full md:w-1/2 lg:w-1/3 h-full overflow-hidden flex justify-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">


          {/* Grid Column 1 - Scroll Up */}
          <div className="space-y-4 animate-scroll-up">
            {(imageCarousel)?.map((currElem, i) => (
              <div
                key={currElem?.id}
                className="bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={currElem?.url} // Loop images
                  alt={currElem?.alt}
                  width={176}
                  height={176}
                  className="object-cover object-top h-full w-full"
                />
              </div>
            ))}
          </div>


          {/* Grid Column 2 - Scroll Down (Hidden on Small Screens) */}
          <div className="space-y-4 animate-scroll-down hidden md:block">
            {(imageCarousel)?.map((currElem) => (
              <div
                key={currElem?.id}
                className="bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={currElem?.url} // Loop images
                  alt={currElem?.alt}
                  width={176}
                  height={176}
                  className="object-cover object-top h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
