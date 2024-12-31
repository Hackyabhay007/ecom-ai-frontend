import React from "react";
import AboutBreadCrumb from "./AboutBreadCrumb";
import Image from "next/image";
const About = () => {
    const zigzagData = [
        {
          icon: "ri-t-shirt-line",
          title: "Premium Quality Clothing",
          description:
            "The Majestic Peacock offers a collection of premium quality clothing crafted with the finest materials. Our garments are designed to provide exceptional comfort, durability, and style, ensuring you always look your best for every occasion. Discover the perfect blend of elegance and modernity with our meticulously crafted apparel.",
          reverse: false,
        },
        {
          icon: "ri-leaf-line",
          title: "Sustainable Fashion",
          description:
            "We are committed to providing sustainable and eco-friendly fashion solutions for a better tomorrow. By sourcing materials responsibly and utilizing environmentally friendly production processes, we aim to reduce our carbon footprint. Join us in our mission to create a more sustainable and conscious fashion industry.",
          reverse: true,
        },
        {
          icon: "ri-team-line",
          title: "Inclusive Designs",
          description:
            "Our designs are inclusive, catering to diverse styles and body types, ensuring everyone feels special. Whether you prefer classic silhouettes or contemporary trends, our collections celebrate individuality and embrace diversity. Experience fashion that truly resonates with your unique personality and preferences.",
          reverse: false,
        },
        {
          icon: "ri-price-tag-3-line",
          title: "Affordable Luxury",
          description:
            "Enjoy luxurious clothing at affordable prices without compromising on quality or style. At The Majestic Peacock, we believe that everyone deserves to indulge in premium fashion. Explore our range of elegant and timeless pieces that redefine value without sacrificing excellence.",
          reverse: true,
        },
        {
          icon: "ri-shield-check-line",
          title: "Unmatched Customer Satisfaction",
          description:
            "Your satisfaction is our top priority. From seamless shopping experiences to dedicated customer support, we ensure every step of your journey with The Majestic Peacock is memorable and fulfilling. Trust us to deliver unmatched service, quality, and care for all your fashion needs.",
          reverse: false,
        },
      ];
      

  const brandLogos = [
    "/images/brand/brand1.png",
    "/images/brand/brand2.png",
    "/images/brand/brand3.png",
    "/images/brand/brand4.png",
    "/images/brand/brand5.png",
  ];

  return (
    <div className="mb-20">
      <AboutBreadCrumb />

      {/* About Us Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {zigzagData.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-b last:border-none ${
              item.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <i
              className={`${
                item.icon
              } text-7xl text-sub-color flex-shrink-0 order-1 md:order-${
                item.reverse ? "2" : "1"
              }`}
            ></i>
            <div
              className={`text-center  flex-1 ${
                item.reverse ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
              }`}
            >
              <h3 className="text-xl mb-4 text-black">{item.title}</h3>
              <p className="text-sub-color text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Our Partner Brands Section */}
      <div className=" py-16">
        <h2 className="text-center text-xl md:text-2xl font-bold mb-10">Our Partner Brands</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 px-4 md:px-16">
          {brandLogos.map((logo, index) => (
            <div key={index} className="relative h-5 md:h-10 w-10 md:w-20">
            <Image
              src={logo}
              alt={`Brand ${index + 1}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
