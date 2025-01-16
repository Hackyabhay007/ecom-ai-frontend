import React, { useState, useEffect } from "react";
import CheckoutDetails from "./CheckoutDetails";
import DisplayDetails from "./DisplayDetails";
import YourOrder from "./YourOrder";
import PaymentCheckout from "./PaymentCheckout";
import Timeline from "./Timeline"; // Import Timeline component
import { useRouter } from "next/router";

function CheckoutContainer() {
  const router = useRouter();
  const { query } = router; // Extract query from the router
  const [step, setStep] = useState(1); // Current step
  const [formData, setFormData] = useState({}); // Form data state
  const [orderItems, setOrderItems] = useState([]); // Order items array

  useEffect(() => {
    // Safeguard for empty or undefined query
    if (query.product) {
      try {
        setOrderItems([JSON.parse(query.product)]);
      } catch (error) {
        console.error("Failed to parse product data:", error);
      }
    } else if (query.cartItems) {
      try {
        setOrderItems(JSON.parse(query.cartItems));
      } catch (error) {
        console.error("Failed to parse cart items data:", error);
      }
    }
  }, [query]);

  const handleContinue = (data) => {
    setFormData(data); // Save form data
    setStep(2); // Move to DisplayDetails step
  };

  const handleEdit = () => {
    setStep(1); // Go back to CheckoutDetails step
  };

  const handleOrder = () => {
    setStep(3); // Move to YourOrder step
  };

  const handlePayment = () => {
    setStep(4); // Move to Payment step
  };

  const handlePaymentComplete = () => {
    alert("Payment Successful! Thank you for your order.");
    setStep(1); // Reset to first step after completion
  };

  return (
    <div className="container py-20 md:py-0 mx-auto p-6 md:mb-2">
      <Timeline step={step} /> {/* Add the Timeline component here */}
      {step === 1 && (
        <CheckoutDetails
          onContinue={handleContinue}
          productDetails={orderItems}
        />
      )}
      {step === 2 && (
        <DisplayDetails
          details={formData}
          onEdit={handleEdit}
          onContinue={handleOrder}
        />
      )}
      {step === 3 && (
        <YourOrder
          order={orderItems}
          onEdit={() => setStep(2)}
          onPayment={handlePayment}
        />
      )}
      {step === 4 && <PaymentCheckout onPaymentComplete={handlePaymentComplete} />}
    </div>
  );
}

export default CheckoutContainer;
