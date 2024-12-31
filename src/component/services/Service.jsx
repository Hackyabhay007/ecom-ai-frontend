import React from "react";
import Image from "next/image";
const serviceData = [
  {
    id: 1,
    image: "/images/service/customer-care.png",
    heading: "Customer Care",
    text: "A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.",
  },
  {
    id: 2,
    image: "/images/service/money-back.png",
    heading: "14-Days Money Back",
    text: "A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.",
  },
  {
    id: 3,
    image: "/images/service/guarantee.png",
    heading: "Our Guarantee",
    text: "A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.",
  },
  {
    id: 4,
    image: "/images/service/shipping.png",
    heading: "Shipping Worldwide",
    text: "A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.",
  },
];

function Service() {
  return (
    <div className="px-10 py-10 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceData.map((service) => (
          <div key={service.id} className="flex flex-col items-center text-center">
            <Image
              src={service.image}
              alt={service.heading}
              width={200}
              height={200}
              className="w-14 h-14 mb-4 object-contain"
            />
            <h3 className="text-md font-bold mb-2">{service.heading}</h3>
            <p className="text-sm text-sub-color  md:max-w-[80%]">{service.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
