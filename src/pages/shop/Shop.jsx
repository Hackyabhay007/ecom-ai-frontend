// pages/shop/Shop.jsx
import React, { useState } from "react";
import Filter from "@/component/products/Filter";
import ProductCard from "@/component/products/ProductCard";
const Shop = () => {
  const [products] = useState([
    { id: 1, name: "Laptop", category: "electronics", price: 900 },
    { id: 2, name: "T-Shirt", category: "clothing", price: 20 },
    { id: 3, name: "Sofa", category: "furniture", price: 500 },
    { id: 4, name: "Headphones", category: "electronics", price: 150 },
    { id: 5, name: "Jacket", category: "clothing", price: 80 },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const applyFilters = (filters) => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.price[0] && product.price <= filters.price[1];

      return matchesCategory && matchesPrice;
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-center font-bold mb-6">Shop</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Section */}
        <div className="w-full md:w-1/4">
          <Filter onApplyFilters={applyFilters} />
        </div>

        {/* Product Section */}
        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-full">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
