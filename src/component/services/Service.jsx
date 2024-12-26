import React from 'react';

const serviceData = [
  {
    id: 1,
    image: '/images/service/customer-care.png',
    heading: 'Customer Care',
    text: 'A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.',
  },
  {
    id: 2,
    image: '/images/service/money-back.png',
    heading: '14-Days Money Back',
    text: 'A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.',
  },
  {
    id: 3,
    image: '/images/service/guarantee.png',
    heading: 'Our Guarantee',
    text: 'A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.',
  },
  {
    id: 4,
    image: '/images/service/shipping.png',
    heading: 'Shipping Worldwide',
    text: 'A customer review is a form of feedback or personal evaluation provided by a customer who has used a product or service.',
  },
];

function Service() {
  return (
    <div className="p-5 py-10 ">
     
      <div className="flex flex-wrap justify-center lg:flex-row lg:space-x-20 space-y-6 lg:space-y-0">
        {serviceData.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-center text-center w-64"
          >
            <img
              src={service.image}
              alt={service.heading}
              className="w-16 h-16 mb-4 object-contain"
            />
            <h3 className="text-lg font-bold mb-2">{service.heading}</h3>
            <p className="text-sm text-gray-800">{service.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
