import React, { useEffect } from "react";
import BestSellerCard from "./BestSellerCard";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { fetchproductonhomes } from "../../../redux/slices/productonhomeSlicer.js";

function BestSeller() {
  const dispatch = useDispatch();
  const {
    productonhomes: best_product,
    status,
    error,
  } = useSelector((state) => state.productonhomesection);

  useEffect(() => {
    dispatch(fetchproductonhomes());
  }, [dispatch]);

  // Ensure the data is converted into an array
  const productArray = Array.isArray(best_product) ? best_product : [];

  // collection: null;
  // collection_id: null;
  // created_at: "2024-12-25T05:41:08.905Z";
  // deleted_at: null;
  // description: "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.";
  // discountable: true;
  // external_id: null;
  // handle: "t-shirt";
  // height: null;
  // hs_code: null;
  // id: "prod_01JFY5AK5P4FE6SF82QHJ6NJWA";
  // is_giftcard: false;
  // length: null;
  // material: null;
  // metadata: null;
  // mid_code: null;
  // origin_country: null;
  // show_on_home_id: "01JGX7ZGBDY6FE5EGZMN3T556A";
  // status: "published";
  // subtitle: null;
  // thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png";
  // title: "Medusa T";
  // type: null;
  // type_id: null;
  // updated_at: "2024-12-25T05:41:08.905Z";
  // weight: "400";
  // width: null;

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
          <button className="bg-white border border-black w-40 rounded-lg p-2 hover:bg-theme-blue hover:text-white transition duration-200 ease-in-out">
            Shop Now
          </button>
        </div>
        <div className="md:w-2/3  flex  overflow-x-scroll space-x-4 scrollbar-custom">
          <div className="flex space-x-4 w-full" style={{ minWidth: "100%" }}>
            {productArray.map((item, index) => (
              <div
                key={index}
                className="flex-none w-full h-full md:w-2/3 lg:w-1/2 md:px-4"
              >
                <BestSellerCard
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

// const dummyData = [
//   {
//     image: "/images/bestseller/best1.png",
//     rating: "4.5",
//     price: "19.99",
//     prevPrice: "39.99",
//     discount: "20",
//   },
//   {
//     image: "/images/bestseller/best2.png",
//     rating: "4.0",
//     price: "24.99",
//     prevPrice: "49.99",
//     discount: "50",
//   },
//   {
//     image: "/images/bestseller/best3.png",
//     rating: "4.7",
//     price: "29.99",
//     prevPrice: "59.99",
//     discount: "45",
//   },
//   {
//     image: "/images/bestseller/best4.png",
//     rating: "4.3",
//     price: "21.99",
//     prevPrice: "44.99",
//     discount: "20",
//   },
// ];
