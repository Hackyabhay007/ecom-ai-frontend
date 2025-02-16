import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "@/redux/slices/orderSlice";
import CheckoutDetails from "./CheckoutDetails";
import DisplayDetails from "./DisplayDetails";
import YourOrder from "./YourOrder";
import PaymentCheckout from "./PaymentCheckout";
import Timeline from "./Timeline"; // Import Timeline component
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";
import { useRegion } from "@/contexts/RegionContext";

function CheckoutContainer() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const router = useRouter();
  const { query } = router; // Extract query from the router
  const [step, setStep] = useState(1); // Current step
  const [formData, setFormData] = useState({}); // Form data state
  const [orderItems, setOrderItems] = useState([]); // Order items array
  const { cart } = useCart();
  const { region } = useRegion();

  // console.log("cart", cart);
  useEffect(() => {
    // Set the initial step from the query param if available
    if (query.step) {
      setStep(Number(query.step));
    }

    // Safeguard for empty or undefined query
    if (cart?.items) {
      try {
        setOrderItems(cart?.items);
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
  }, [cart, query.step]);

  const handleContinue = (data) => {
    setFormData(data); // Save form data
    setStep(2); // Move to DisplayDetails step
    router.push({ query: { ...query, step: 2 } }); // Update URL with new step
  };

  const handleEdit = () => {
    setStep(1); // Go back to CheckoutDetails step
    router.push({ query: { ...query, step: 1 } }); // Update URL with new step
  };

  const handleOrder = async () => {
    try {
      await dispatch(createOrder({
        items,
        totalAmount,
        shippingAddress: formData,
        // Add other order details as needed
      })).unwrap();
      setStep(3);
      router.push({ query: { ...query, step: 3 } });
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handlePayment = () => {
    setStep(4); // Move to Payment step
    router.push({ query: { ...query, step: 4 } }); // Update URL with new step
  };

  const handlePaymentComplete = async () => {
    try {
      // Add any necessary payment completion logic here
      // For example, clear cart, save order details, etc.
      alert('Payment Successful! Thank you for your order.');
      router.push('/order-confirmation'); // Redirect to order confirmation page
    } catch (error) {
      console.error('Error completing payment:', error);
      alert('Error processing payment. Please try again.');
    }
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
          order={cart}
          onEdit={() => setStep(2)}
          onPayment={handlePayment}
        />
      )}
      {step === 4 && (
        <PaymentCheckout 
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}

export default CheckoutContainer;
