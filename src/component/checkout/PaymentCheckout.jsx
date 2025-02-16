import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "@/redux/slices/orderSlice";
import PaymentOptions from './PaymentOptions';
import { clearCart } from "@/redux/slices/cartSlice";

function PaymentCheckout({ onPaymentComplete, formData }) {
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, totalAmount } = useSelector(state => state.cart);
  const { currentOrder, paymentData } = useSelector(state => state.orders);

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const result = await dispatch(createOrder({
        items,
        shippingAddress: formData,
        paymentMethod: selectedMethod // This should now be one of: phonepe, razorpay, payu, cod
      })).unwrap();

      // If payment URL is provided, redirect to payment gateway
      if (result.paymentData?.url) {
        window.location.href = result.paymentData.url;
      } else {
        // Handle other payment flows
        dispatch(clearCart());
        onPaymentComplete(result.order);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-theme-blue mb-6">Payment</h2>
      
      <PaymentOptions 
        selectedMethod={selectedMethod}
        onSelect={setSelectedMethod}
      />

      <div className="mt-8">
        <button
          onClick={handlePayment}
          disabled={isProcessing || !selectedMethod}
          className={`w-full py-3 rounded-md font-bold text-white
            ${isProcessing || !selectedMethod 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-theme-blue hover:bg-blue-700'
            }`}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Your payment is secure and encrypted.</p>
      </div>
    </div>
  );
}

export default PaymentCheckout;
