import React, { useEffect, useState } from "react";
import BestSellerCard from "./BestSellerCard";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { fetchproductonhomes } from "../../../redux/slices/productonhomeSlicer.js";
import axios from "axios";

function BestSeller() {
  const dispatch = useDispatch();
  const {
    productonhomes: best_product,
    status,
    error,
  } = useSelector((state) => state.productonhomesection);

  const [pageroutedeatils, setPageroutedeatils] = useState([]);

  const fetchpagedeatils = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/home/01JJ481GVMHWHJ3GHBN9XFW3AD`,
        {
          headers: {
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data.home.result);
        setPageroutedeatils(res.data.home.result);
        //data come it
        // created_at: "2024-12-28T11:48:47.515Z";
        // deleted_at: null;
        // id: "01JG6HHXRSA1X4HJ64532PHCH9";
        // index: 4;
        // redirect: "default_value";
        // route: "/items";
        // text: "default_text";
        // title: "Product on Homepage";
        // updated_at: "2025-01-12T12:20:03.799Z";
      });
  };

  useEffect(() => {
    dispatch(fetchproductonhomes());
    fetchpagedeatils();
  }, [dispatch]);

  // Ensure the data is converted into an array
  const productArray = Array.isArray(best_product) ? best_product : [];

  return (
    <div className="h-fit p-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 flex gap-5 flex-col justify-center">
          <h1 className="text-theme-blue text-center md:text-start font-bold text-3xl md:text-5xl lg:text-7xl mb-4">
            Best Seller Products
          </h1>
          <p className="text-sm text-sub-color mb-4">
            "Fashion Fads May come and go, but my style is eternal. Your Fashion
            always reflects who you really are. Fashion is always Right, and I
            am living proof."
          </p>
          <a
            href={"/" + pageroutedeatils.redirect}
            className="text-center bg-white border border-black w-40 rounded-lg p-2 hover:bg-theme-blue hover:text-white transition duration-200 ease-in-out"
          >
            {pageroutedeatils.text}
          </a>
        </div>
        <div className="md:w-2/3  flex  overflow-x-scroll space-x-4 scrollbar-custom">
          <div className="flex space-x-4 w-full" style={{ minWidth: "100%" }}>
            {productArray.map((item, index) => (
              <div
                key={index}
                className="flex-none w-full h-full md:w-2/3 lg:w-1/2 md:px-4"
              >
                <BestSellerCard
                  id={item.id}
                  image={item.thumbnail}
                  rating={item?.rating || 0}
                  price={item.price}
                  prevPrice={item.prevPrice}
                  discount={item.discount}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestSeller;
