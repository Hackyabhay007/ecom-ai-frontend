import React from "react";

const ProductDetails = ({ product }) => {
  return (
    <div className="w-full px-5 py-20">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold mb-4">Product Specifications Details</h2>
      
      {/* Specifications Content */}
      <div className="mt-4 text-sm md:text-base">
        <p>{product.specifications}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
