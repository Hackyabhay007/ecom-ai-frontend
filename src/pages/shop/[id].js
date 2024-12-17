import React from "react";
import { useRouter } from "next/router";
import ProductView from "@/component/products/product_view/ProductView";
import products from "@/component/products/data/product_data"; // Your products data
import Navbar from "@/component/header/Navbar";
import Footer from "@/component/footer/Footer";

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const product = products.find((p) => p.id === parseInt(id)); // Find product by ID

  if (!product) {
    return (
      <>
        <Navbar />
        <div>Product not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProductView product={product} allProducts={products} />
      <Footer />
    </>
  );
};

export default ProductPage;
