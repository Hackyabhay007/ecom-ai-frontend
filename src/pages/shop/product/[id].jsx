"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ProductView from "@/component/products/product_view/ProductView";
import Navbar from "@/component/header/Navbar";
import Footer from "@/component/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../../../redux/slices/shopSlice";
import Loader from "@/component/loader/Loader";

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const { selectedProduct, selectedProductLoading, selectedProductError } = useSelector(
    (state) => state.shop
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  if (selectedProductLoading || !selectedProduct) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (selectedProductError) {
    return (
      <>
        <Navbar />
        <div className="text-center text-red-500 py-8">Error: {selectedProductError}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProductView productId={id} />
      <Footer />
    </>
  );
};

export default ProductPage;