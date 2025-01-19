import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ProductView from "@/component/products/product_view/ProductView";
import products from "@/component/products/data/product_data"; // Your products data
import Navbar from "@/component/header/Navbar";
import Footer from "@/component/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../../redux/slices/productSlice";
import { useRegion } from "../../../contexts/RegionContext.jsx";


  

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const { region } = useRegion();
  

  const { products:data, count, nextPage, status, error } = useSelector(
    (state) => state.products
  );

  useEffect(()=>{
    const queryParams = { 
      limit: 12,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      id : id

      // Add other query params as necessary
    };
    dispatch(fetchProducts({ pageParam: 1, queryParams, region }));
    console.log(region)
  },[dispatch , region , id])

  console.log("hi",data,error)

  const product = data[0]

  return (
    <>
      <Navbar />
      <ProductView product={data[0]}  allProducts={products} />
      <Footer />
    </>
  );
};

export default ProductPage;
