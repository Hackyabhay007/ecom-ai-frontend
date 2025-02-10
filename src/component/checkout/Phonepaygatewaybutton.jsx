/* eslint-disable @typescript-eslint/no-explicit-any */
import { medusaClient } from "@lib/config";
import { Spinner } from "@medusajs/icons";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { createPaymentSession } from "@/lib/data/cart";

export const PhonePePaymentButton = ({
  session,
  updateCart,
  notReady,
  shippingmethods,
  placeOrder,
  cart,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const {  updatedCart: setCart } = useCart();
  useEffect(() => {
    console.log(JSON.stringify(session));
    if (!session && cart?.payment?.provider_id == "phonepe") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [session, cart]);

  console.log("this is the current session", session , cart);

  const handlePayment = async (event) => {
    event.preventDefault();
    console.log("this is the current session" + session);
    setSubmitting(true);
    if (!cart) {
      setSubmitting(false);
      return;
    }
    console.log("updating the current session");
    await createPaymentSession({
      cart: cart,
      updateCart: updateCart,
      provider_id: session,
      key: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
    });
    await createPaymentSession(
      {
        cart: cart,
        updateCart: updateCart,
        provider_id: session,
        key: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
      },
      {
        onSuccess: async ({ cart }, variables, context) => {
          console.log(
            "checking update successful or not  the current session" +
              JSON.stringify(cart) +
              " variables: ",
            JSON.stringify(variables) + " context :",
            JSON.stringify(context)
          );
          setCart(cart);
          const updatedCart = await medusaClient.carts.retrieve(cart.id);
          console.log(
            "updating the current session cart  : " +
              JSON.stringify(updatedCart)
          );
          console.log(
            "cart payment session updated:",
            JSON.stringify(updatedCart.cart.payment_session)
          );

          console.log(
            "refreshing payment session data" +
              JSON.stringify(updatedCart.cart.payment_session)
          );
          const paymentSessionData = updatedCart.cart.payment_session?.data;
          const redirectUrl =
            paymentSessionData?.data?.instrumentResponse?.redirectInfo?.url;
          console.log(`redirect url: ${redirectUrl}`);

          if (
            redirectUrl?.includes("https") &&
            redirectUrl.includes("token=")
          ) {
            window.location.replace(redirectUrl);
          } else {
            throw new Error(
              "mutation didn't signal, please click checkout again"
            );
          }
        },
        onError: (error, variables, context) => {
          console.log("message : " + error.message);
          console.log("variables: " + JSON.stringify(variables));
          console.log("context: " + JSON.stringify(context));
          setErrorMessage("error processing request: " + error.message);
          setSubmitting(false);
        },
      }
    );
  };
  return (
    <>
      <button
        disabled={submitting || disabled || notReady}
        onClick={handlePayment}
      >
        {submitting ? <Spinner /> : "Checkout"}
      </button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  );
};
