import React from "react";
import Timeline from "./Timeline";

function DisplayDetails({ details, onEdit, onContinue }) {
  return (
    <div>
     
      <div className="flex flex-col lg:flex-row justify-center items-start space-y-8 lg:space-y-0 lg:space-x-4 mt-8 md:px-40">
        {/* Left Card: Your Order */}
        <div className="border border-black rounded-md w-full lg:w-1/2  flex flex-col min-h-80">
          <div className="flex items-center justify-between  p-4">
            <div className="flex items-center">
              <i className="ri-truck-line text-blue-950 text-2xl mr-2"></i>
              <h2 className="text-lg font-bold text-blue-950">Your Order</h2>
            </div>
            <button
              onClick={onEdit}
              className="text-blue-950 font-bold underline"
            >
              Edit
            </button>
          </div>
          <hr className="border-black mb-4" />
          <div className="flex-grow ">
            <div className="px-6">
              <h3 className="font-semibold text-blue-950">Address:</h3>
              <p>{details.address}</p>
              <p>{details.landmark}</p>
              <p>{details.country}</p>
              <p>{details.state}</p>
            </div>
            <hr className="border-black mt-4 mb-4" />
            <div className="px-6 pb-4">
              <h3 className="font-semibold text-blue-950">Pin Code:</h3>
              <p>{details.pincode}</p>
            </div>
          </div>
        </div>

        {/* Right Card: Policy */}
        <div className="bg-blue-200 text-blue-950 rounded-md w-full lg:w-1/2 p-6 flex flex-col min-h-80">
          <h2 className="text-lg font-bold border-b-2 border-blue-950 py-1">10 Days Return Policy</h2>
          <ul className="list-disc list-inside space-y-2 mt-4 flex-grow">
            <li>Return the product within 10 days if unsatisfied.</li>
            <li>Product must be in original condition and packaging.</li>
            <li>Refund will be processed after quality checks.</li>
          </ul>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-6 md:px-40">
        <button
          onClick={onContinue}
          className="bg-blue-950 text-white w-full py-3 rounded-md font-bold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default DisplayDetails;
