// components/products/ProductCard.jsx
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4 text-center">
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600">Category: {product.category}</p>
      <p className="text-md font-bold mt-2">${product.price}</p>
    </div>
  );
};

export default ProductCard;
