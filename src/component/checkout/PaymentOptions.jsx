import React from 'react';
import Image from 'next/image';

const PaymentOptions = ({ selectedMethod, onSelect }) => {
  const paymentMethods = [
    {
      id: 'phonepe',
      name: 'PhonePe',
      logo: '/images/phonepe-logo.png',
      description: 'Pay securely with PhonePe'
    },
    {
      id: 'payu',
      name: 'PayU',
      logo: '/images/payu-logo.png',
      description: 'Pay using credit/debit card, netbanking, or UPI'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-theme-blue">Select Payment Method</h3>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedMethod === method.id
                ? 'border-theme-blue bg-blue-50'
                : 'border-gray-200 hover:border-theme-blue'
            }`}
            onClick={() => onSelect(method.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <Image
                  src={method.logo}
                  alt={method.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div>
                <h4 className="font-medium text-theme-blue">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;
