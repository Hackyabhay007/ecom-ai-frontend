"use client";

import {
  CheckCircle,
  Package,
  Printer,
  Share2,
  Ban,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function OrderCompletedTemplate(data) {
  const [currentorder, setcurrentorder] = useState([]);
  const router = useRouter();

  const getCountryName = (countryCode) => {
    const countryList = {
      US: "United States",
      IN: "India",
      CA: "Canada",
      // Add more country codes and names as needed
    };
    return countryList[countryCode] || "Unknown Country";
  };

  useEffect(() => {
    // console.log(data);
    setcurrentorder(data.data);
  }, [data]);

  const copyUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        // console.log("URL copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B4C7E]/5 to-white">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md border border-[#2B4C7E]/10">
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2B4C7E]/10 mb-4">
                  <CheckCircle className="w-8 h-8 text-[#2B4C7E]" />
                </div>
                <h1 className="text-2xl font-semibold text-[#2B4C7E] mb-2">
                  Order Confirmed
                </h1>
                <p className="text-gray-600">Thank you for shopping with us!</p>
              </div>

              <div className="space-y-6">
                <div className="bg-[#2B4C7E]/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="font-medium text-[#2B4C7E]">
                        Order #{currentorder?.display_id}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          currentorder?.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#2B4C7E]">
                        ₹{currentorder.item_subtotal}
                      </p>
                      <p className="text-sm text-gray-600">Paid</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentorder?.items &&
                      currentorder.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-white rounded-lg border border-[#2B4C7E]/10 overflow-hidden">
                            <img
                              src={item.thumbnail}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.subtitle}</h3>
                            <p className="text-sm text-gray-600">
                              variant: {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.total}</p>
                          </div>
                        </div>
                      ))}

                    <div className="h-[1px] bg-gray-200 my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{currentorder.original_item_subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span>{currentorder.shipping_total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span>{currentorder.item_tax_total}</span>
                      </div>
                      {currentorder.discount_total && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount</span>
                          <span>-₹{currentorder.discount_total}</span>
                        </div>
                      )}
                      <div className="h-[1px] bg-gray-200 my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{currentorder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium text-[#2B4C7E]">
                      Shipping Address
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentorder.shipping_address?.first_name}{" "}
                      {currentorder.shipping_address?.last_name}
                      <br />
                      {currentorder.shipping_address?.address_1}
                      <br />
                      {currentorder.shipping_address?.province}{" "}
                      {currentorder.shipping_address?.postal_code}
                      <br />
                      {currentorder.shipping_address?.country_code &&
                        getCountryName(
                          (currentorder.shipping_address?.country_code).toUpperCase()
                        )}
                    </p>
                  </div>
                  {/* <div className="space-y-2">
                    <h3 className="font-medium text-[#2B4C7E]">
                      Estimated Delivery
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>January 30 - February 2</span>
                    </div>
                  </div> */}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button className="flex-1 bg-[#2B4C7E] text-white py-2 px-4 rounded-lg hover:bg-[#2B4C7E]/90 flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Track Order
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center">
                    <Ban className="w-4 h-4 mr-2" />
                    Cancel Order
                  </button>
                  <button
                    onClick={() => copyUrlToClipboard()}
                    className="flex-1 border border-[#2B4C7E] text-[#2B4C7E] py-2 px-4 rounded-lg hover:bg-[#2B4C7E]/10 flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Details
                  </button>

                  <button onClick={()=>router.push("/")} className="flex-1 bg-[#2B4C7E] text-white py-2 px-4 rounded-lg hover:bg-[#2B4C7E]/90 flex items-center justify-center">
                    Home
                  </button>
                  <button/>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
