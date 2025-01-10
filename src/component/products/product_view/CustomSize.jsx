import React from "react";
import Image from "next/image";

const CustomSize = ({ onClose, onApply }) => {
  const sizes = {
    chest: ["28 CM", "32 CM", "34 CM", "36 CM"],
    shoulder: ["30 CM", "32 CM", "34 CM", "36 CM"],
    sleeve: ["20 CM", "22 CM", "24 CM", "26 CM"],
    waist: ["28 CM", "30 CM", "32 CM", "34 CM"],
  };

  const [selectedSizes, setSelectedSizes] = React.useState({
    chest: "",
    shoulder: "",
    sleeve: "",
    waist: "",
  });

  const handleSelectSize = (field, size) => {
    setSelectedSizes((prev) => ({ ...prev, [field]: size }));
  };

  const handleApply = () => {
    if (
      !selectedSizes.chest ||
      !selectedSizes.shoulder ||
      !selectedSizes.sleeve ||
      !selectedSizes.waist
    ) {
      alert("Please select a size for all categories.");
      return;
    }
    onApply(selectedSizes);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-3xl shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto relative p-4">
        {/* Border with padding */}
        <div className="border border-black rounded-2xl p-6 relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 bg-transparent hover:text-black text-2xl focus:outline-none z-50"
            onClick={onClose}
          >
            <i className="ri-close-line"></i>
          </button>

          <h2 className="text-xl text-center font-bold mb-4 underline">
            Select Your Custom Size
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Size Guide Image */}
            <div className="w-full md:w-3/5">
              <Image
                src="/images/shop/size.png"
                alt="Size Guide"
                className="rounded-lg"
                width={500}
                height={500}
                objectFit="cover"
              />
            </div>

            {/* Size Options */}
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  {["chest", "shoulder"].map((field) => (
                    <div key={field} className="mb-4">
                      <h3 className="font-bold capitalize mb-2">{field}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {sizes[field].map((size) => (
                          <div
                            key={size}
                            className={`border border-black rounded-lg px-1 py-1 text-center cursor-pointer text-sm ${
                              selectedSizes[field] === size
                                ? "bg-blue-500 text-white"
                                : "bg-white text-black"
                            }`}
                            onClick={() => handleSelectSize(field, size)}
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div>
                  {["sleeve", "waist"].map((field) => (
                    <div key={field} className="mb-4">
                      <h3 className="font-bold capitalize mb-2">{field}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {sizes[field].map((size) => (
                          <div
                            key={size}
                            className={`border border-black rounded-lg px-2 py-1 text-center cursor-pointer text-sm ${
                              selectedSizes[field] === size
                                ? "bg-blue-500 text-white"
                                : "bg-white text-black"
                            }`}
                            onClick={() => handleSelectSize(field, size)}
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-theme-blue font-bold text-lg w-full hover:bg-discount-color transition-all hover:text-black text-white rounded-lg"
                  onClick={handleApply}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSize;
