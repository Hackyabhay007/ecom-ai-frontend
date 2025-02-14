import React from "react";
import Image from "next/image";

const ProductDetails = ({ product }) => {
  return (
    <div className="w-full px-5 py-20 bg-white">
      {/* Product Title */}
      <h2 className="text-xl md:text-2xl font-bold mb-4">{product?.title}</h2>

      {/* Product Description */}
      <div className="mt-4 text-sm md:text-base">
        <p>{product?.description}</p>
      </div>

      {/* Material */}
      <div className="mt-4">
        <strong>Material:</strong> {product?.material}
      </div>

      {/* Price */}
      <div className="">
        <strong>Discount:</strong> {product?.metadata?.discount}%
      </div>

      {/* Product Images
      <div className="mt-4">
        <strong>Images:</strong>
        <div className="flex gap-4">
          {product?.images?.map((image, index) => (
            <Image
              key={index}
              layout="fill"
              src={image?.url}
              alt={`Product Image ${index + 1}`}
              className="w-20 h-20 object-cover"
            />
          ))}
        </div>
      </div> */}

      {/* Product Thumbnail */}
      {/* <div className="mt-4">
        <strong>Thumbnail:</strong>
        <Image
          layout="fill"
          src={product?.thumbnail}
          alt="Product Thumbnail"
          className="w-32 h-32 object-cover mt-2"
        />
      </div> */}

      {/* Variants */}
      
        {product?.variants?.length > 0 && (
          <div className="mt-4 w-fit h-fit  ">
            <strong>Available Variants:</strong>
            <div className="flex flex-wrap w-full  h-full gap-4">
              
                {product?.variants?.map((variant, index) => (
                  <div
                    key={index}
                    className="bg-white text-black hover:bg-black hover:text-white border-2 border-black duration-200 px-2 py-1 rounded-full cursor-pointer"
                  >
                    {variant?.title}
                  </div>
                ))}
              
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductDetails;
