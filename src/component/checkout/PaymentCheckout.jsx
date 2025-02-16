import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { processPayment } from "@/redux/slices/orderSlice";
import PaymentOptions from './PaymentOptions';
import { clearCart } from "@/redux/slices/cartSlice";

function PaymentCheckout({ onPaymentComplete }) {
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentOrder } = useSelector(state => state.orders);
  const { items, totalAmount } = useSelector(state => state.cart);

  const handlePayment = async () => {
    if (!selectedMethod || !currentOrder?.id) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      await dispatch(processPayment({
        orderId: currentOrder.id,
        paymentMethod: selectedMethod,
        paymentData: {
          amount: totalAmount,
          currency: 'INR',
          // Add other payment-specific data here
        }
      })).unwrap();

      // Clear cart after successful payment
      dispatch(clearCart());
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
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
