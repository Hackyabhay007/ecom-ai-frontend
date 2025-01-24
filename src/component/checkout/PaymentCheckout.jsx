import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";
import { listCartPaymentMethods } from "@/lib/data/payment";
import { useRegion } from "@/contexts/RegionContext";
import { RazorpayPaymentButton } from "./RazorpayPaymentButton.jsx";
import { useCart } from "@/contexts/CartContext";
import { createPaymentSession } from "@/lib/data/cart";

function PaymentCheckout({ onPaymentComplete }) {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedUPI, setSelectedUPI] = useState("");
  const [providers, setProviders] = useState([]);
  const { region } = useRegion();
  const { cart , updateCart  , fetchCart} = useCart();
  const notReady =
    !cart || !cart.shipping_address || !cart.billing_address || !cart.email;

  useEffect(() => {
    region?.id &&
      listCartPaymentMethods(region.id).then((res) => {
        setProviders(res);
        console.log(res);
      });
  }, [region]);

  function sliceLastWord(inputString) {
    // Split the string into an array of words using "_" as the separator
    const words = inputString.split("_");
    // Remove the last word
    const lastWord = words.pop();
    // Join the remaining words back together
    const slicedString = words.join("_");
    return { slicedString, lastWord };
  }

  console.log(providers);

  const handlePaymentSelection = (paymentType) => {
    setSelectedPayment(paymentType.id);
    setSelectedUPI(""); // Reset selected UPI when switching payment methods
  };

  // cartId , updateCart , pp_id , ke
  useEffect(()=>{
    if(selectedPayment){
      if(!cart) {console.log("carts is not present") }
      else{
      createPaymentSession(cart , updateCart , selectedPayment , process.env.NEXT_PUBLIC_REVALIDATE_SECRET , fetchCart  )}
    }
  },[selectedPayment])

  

  const handleCompletePayment = () => {
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }
    onPaymentComplete();
  };

  const [paymentSession,setpaymentSession] = useState() 

  useEffect(()=>{
    if(cart) setpaymentSession(cart?.payment_collection?.payment_sessions?.[0])
  },[cart])

  console.log(cart , " tjos sos odnfkjvdnvs")

  return (
    <>
      <div className="md:p-6">
        {/* Card Container */}
        <div className="border border-black rounded-md">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b border-black px-4 py-3">
            <div className="flex items-center text-theme-blue">
              <i className="ri-wallet-3-line text-xl mr-2"></i>
              <h2 className="text-lg font-semibold">Payment Method</h2>
            </div>
            <h3 className="text-lg font-semibold underline cursor-pointer">
              Add New Payment
            </h3>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Section - Payment Options */}
            <div className="w-full md:w-1/4 border-b md:border-r border-black scrollbar-custom overflow-y-auto max-h-96">
              {providers &&
                providers.map((paymentType, index) => (
                  <div
                    key={index}
                    className={`p-4 cursor-pointer border-b last:border-none ${
                      selectedPayment === paymentType ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handlePaymentSelection(paymentType)}
                  >
                    <span className="text-black font-medium">
                      {sliceLastWord(paymentType.id).lastWord}
                    </span>
                  </div>
                ))}
            </div>
            <RazorpayPaymentButton
              session={paymentSession}
              notReady={notReady}
              cart={cart}
            />

            {/* Right Section - Selected Payment Details */}
            <div className="w-full md:w-3/4 md:p-4 mt-4 md:mt-0">
              {!selectedPayment && (
                <div className="text-gray-500">
                  Select a payment method to continue.
                </div>
              )}
              {selectedPayment && (
                <div>
                  {selectedPayment === "UPI" && (
                    <div className="p-4">
                      <h3 className="text-gray-700 font-medium mb-2">
                        Select UPI
                      </h3>
                      <select
                        className="w-full p-2 border-b border-dashed border-black outline-none mb-4"
                        value={selectedUPI}
                        onChange={(e) => setSelectedUPI(e.target.value)}
                      >
                        <option value="">-- Select UPI --</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="Paytm">Paytm</option>
                        <option value="Other">Other</option>
                      </select>

                      {selectedUPI && (
                        <div className="border border-black rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-black">
                              <i className="ri-radio-button-line text-sm"></i>{" "}
                              {selectedUPI}
                            </span>
                          </div>
                          <button className="bg-theme-blue text-white py-2 px-4 rounded-md w-full mt-4">
                            Pay ₹ 500
                          </button>
                          <button
                            className="bg-white border border-black text-black py-2 px-4 rounded-md w-full mt-4"
                            onClick={handleCompletePayment}
                          >
                            Continue
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedPayment === "Credit/Debit Card" && (
                    <div className="border border-black rounded-md p-4">
                      <label className="block mb-2 text-gray-700 font-medium">
                        Enter Card Details
                      </label>
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full p-2 border rounded-md mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Name on Card"
                        className="w-full p-2 border rounded-md mb-4"
                      />
                      <div className="border-b border-dashed mb-4"></div>
                      <button className="bg-theme-blue text-white py-2 px-4 rounded-md w-full">
                        Pay ₹ 500
                      </button>

                      <button
                        className="bg-white border border-black text-black py-2 px-4 rounded-md w-full mt-4"
                        onClick={handleCompletePayment}
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {selectedPayment === "Net Banking" && (
                    <div className="border border-black rounded-md p-4">
                      <label className="block mb-2 text-gray-700 font-medium">
                        Select Bank
                      </label>
                      <select className="w-full p-2 border rounded-md mb-4">
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>SBI</option>
                        <option>Other</option>
                      </select>
                      <div className="border-b border-dashed mb-4"></div>
                      <button className="bg-theme-blue text-white py-2 px-4 rounded-md w-full">
                        Pay ₹ 500
                      </button>

                      <button
                        className="bg-white border border-black text-black py-2 px-4 rounded-md w-full mt-4"
                        onClick={handleCompletePayment}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentCheckout;
