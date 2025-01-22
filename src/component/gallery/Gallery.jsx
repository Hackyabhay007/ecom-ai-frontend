import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import { fetchcataloges } from "../../../redux/slices/catalogSlicer.js";

function Gallery() {
  const dispatch = useDispatch();
  const { cataloges, status, error } = useSelector(
    (state) => state.catalogSection
  );
  const [catalog, setcatalog] = useState([]);

  useEffect(() => {
    dispatch(fetchcataloges());
  }, [dispatch]);

  useEffect(() => {
    // Convert cataloges into an array
    setcatalog(Object.entries(cataloges));
  }, [cataloges]);

  // console.log(Array.isArray(catalog));
  return (
    <div
      className="relative bg-cover md:bg-center min-h-96 h-[500px] flex"
      style={{ backgroundImage: "url('/images/gallery/gallery1.png')" }}
    >
      {/* Right Side Grid with Scrolling Animation */}
      <div className="ml-auto w-full md:w-1/2 lg:w-1/3 h-full overflow-hidden flex justify-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Grid Column 1 - Scroll Up */}
          <div className="space-y-4 animate-scroll-up">
            {catalog &&
              catalog.map(([key, value], index) => {
                // console.log(value);
                return (
                  <div
                    key={`up-${key}`}
                    className="bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg"
                  >
                    <Image
                      src={value.image} // Use the correct image path
                      onClick={() => (window.location.href = value.link)} // Corrected syntax
                      alt={`Image ${index}`}
                      width={176}
                      height={176}
                      className="object-cover object-top h-full w-full cursor-pointer" // Added cursor-pointer for a clickable effect
                    />
                  </div>
                );
              })}
          </div>

          {/* Grid Column 2 - Scroll Down (Hidden on Small Screens) */}
          <div className="space-y-4 animate-scroll-down hidden md:block">
            {catalog &&
              catalog.map(([key, value], index) => (
                <div
                  key={`down-${index}`}
                  className="bg-gray-800 w-44 h-44 border border-white rounded-lg overflow-hidden shadow-lg"
                >
                  <Image
                    src={value.image} // Use the correct image path
                    alt={`Image ${index}`}
                    onClick={() => (window.location.href = value.link)}
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
