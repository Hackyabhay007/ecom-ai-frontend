import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCart } from "@/contexts/CartContext";

const RazorpayPaymentButton = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { cart } = useCart();
  const [orderData, setOrderData] = useState({ id: "" });

  const create_paymentcollection = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-collections`,
        { cart_id: cart.id },
        {
          headers: {
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
          },
        }
      );
      // console.log(response.data.payment_collection, " this is get res");
      return response.data.payment_collection;
    } catch (error) {
      console.error("Error creating payment collection:", error);
      setErrorMessage("Failed to create payment collection. Please try again.");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (cart?.id) {
      create_paymentcollection().then((data) => {
        setOrderData(data);
      });
    }
  }, [cart]);

  const handlePayment = useCallback(async () => {
    create_paymentcollection();
    if (!orderData?.id) {
      setErrorMessage("Order data is not available.");
      setSubmitting(false);
      return;
    }

    // console.log(orderData)
    if (typeof window !== "undefined" && window.Razorpay) {
      const options = {
        key: "rzp_test_v9OipkUZNTnkXj",
        amount: cart.total_amount, // Ensure you have the correct amount in the cart
        order_id: orderData.id,
        currency: cart.currency_code.toUpperCase(),
        name: process.env.COMPANY_NAME || "Your Company Name",
        description: `Order number ${orderData.id}`,
        // image: "",
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: orderData.id }),
              }
            );
            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }
            // console.log("Payment verified successfully");
          } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred during payment verification.");
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: `${cart.billing_address?.first_name || ""} ${
            cart.billing_address?.last_name || ""
          }`,
          email: cart?.email || "",
          contact: cart?.shipping_address?.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", (response) => {
        console.error(response.error);
        setErrorMessage("Payment failed. Please try again.");
        setSubmitting(false);
      });
    } else {
      setErrorMessage("Razorpay SDK failed to load. Please try again later.");
      setSubmitting(false);
    }
  }, [cart, orderData]);

  return (
    <>
      <button
        // disabled={submitting}
        onClick={() => {
          setSubmitting(true);
          handlePayment();
        }}
        className="bg-green-50"
      >
        {submitting ? "Processing..." : "Checkout"}
      </button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default RazorpayPaymentButton;
