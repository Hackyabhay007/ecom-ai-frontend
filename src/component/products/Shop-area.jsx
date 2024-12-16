// components/products/ShopArea.jsx
import React, { useState } from "react";
import Filter from "@/component/products/Filter";
import ProductCard from "@/component/products/ProductCard";

const ShopArea = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Ragian Full Sleeve T-Shirt",
      categories: ["clothing", "tshirt"],
      price: 100,
      prevPrice: 200,
      discount: 50,
      image: "/images/shop/shop1.jpg",
      tags: ["NEW"],
    },
    {
      id: 2,
      name: "Kimano Sleeve Top",
      categories: ["clothing", "top"],
      price: 40,
      prevPrice: 60,
      discount: 33,
      image: "/images/shop/shop2.jpg",
      tags: ["SALE"],
    },
    {
      id: 3,
      name: "Vintage Dress",
      categories: ["clothing", "dress"],
      price: 150,
      prevPrice: 250,
      discount: 40,
      image: "/images/shop/shop3.jpg",
      tags: ["NEW"],
    },
    {
      id: 4,
      name: "Floral Swimsuit",
      categories: ["clothing", "swimwear"],
      price: 75,
      prevPrice: 150,
      discount: 50,
      image: "/images/shop/shop4.jpeg",
      tags: ["SALE"],
    },
    {
      id: 5,
      name: "Partywear Sequin Dress",
      categories: ["clothing", "dress", "partywear"],
      price: 120,
      prevPrice: 240,
      discount: 50,
      image: "/images/shop/shop5.jpeg",
      tags: ["NEW"],
    },
    {
      id: 6,
      name: "Casual T-shirt",
      categories: ["clothing", "tshirt"],
      price: 30,
      prevPrice: 60,
      discount: 50,
      image: "/images/shop/shop6.jpeg",
      tags: ["SALE"],
    },
    {
      id: 7,
      name: "Chic Party Dress",
      categories: ["clothing", "dress", "partywear"],
      price: 100,
      prevPrice: 200,
      discount: 50,
      image: "/images/shop/shop7.jpeg",
      tags: ["NEW"],
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const applyFilters = (filters) => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        !filters.category || product.categories.includes(filters.category);
      const matchesPrice =
        product.price >= filters.price[0] && product.price <= filters.price[1];

      return matchesCategory && matchesPrice;
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-6">Shop</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Section */}
        <div className="md:w-1/4 w-full">
          <Filter onApplyFilters={applyFilters} />
        </div>

        {/* Product Section */}

        <div className="w-full md:w-3/4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default ShopArea;
