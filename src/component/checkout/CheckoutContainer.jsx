import React, { useState } from "react";
import CheckoutDetails from "./CheckoutDetails";
import DisplayDetails from "./DisplayDetails";
import YourOrder from "./YourOrder";
import PaymentCheckout from "./PaymentCheckout";
import Timeline from "./Timeline"; // Import Timeline component

function CheckoutContainer() {
  const [step, setStep] = useState(1); // Current step
  const [formData, setFormData] = useState({}); // Form data state
  const [orderDetails, setOrderDetails] = useState({
    productName: "Sample Product",
    image: "images/collection/collection1.png",
    quantity: 1,
    discountPercentage: 20,
    prevPrice: "₹50",
    price: "₹45",
    subtotal: "₹45",
    total: "₹45",
    clothType: "Cotton",
    size: "M",
    shippingCharge: 0, // Free shipping
  });

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
    <div className="container mx-auto p-6">
      <Timeline step={step} /> {/* Add the Timeline component here */}
      {step === 1 && (
        <CheckoutDetails
          onContinue={handleContinue}
          productDetails={orderDetails}
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
          order={orderDetails}
          onEdit={() => setStep(2)}
          onPayment={handlePayment}
        />
      )}
      {step === 4 && <PaymentCheckout onPaymentComplete={handlePaymentComplete} />}
    </div>
  );
}

export default CheckoutContainer;
