import React, { useState } from "react";

function CheckoutDetails({ onContinue, productDetails }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    state: "",
    pincode: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState({}); // Track errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for the field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.landmark.trim()) errors.landmark = "Landmark is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone Number is required";

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      // No errors, proceed with submission
      onContinue(formData);
    } else {
      // Set errors and prevent submission
      setFormErrors(errors);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
      {/* Left Section: Product Card */}
      <div className="w-full lg:w-1/2 flex-shrink-0">
        <div className="p-4 flex flex-col h-full">
          <img
            src={productDetails.image}
            alt="Product"
            className="w-full object-cover mb-4"
            style={{ height: "250px" }}
          />
          <div>
            <h2 className="text-lg font-semibold">{productDetails.productName}</h2>
            <p className="text-gray-700">Qty: {productDetails.quantity}</p>
            <p className="text-gray-700">Price: {productDetails.price}</p>
            <p className="bg-blue-600 text-sm font-t rounded-full w-fit text-white px-2">
              Discount: - {productDetails.discountPercentage}%
            </p>
            <p className="text-black font-bold">Total: {productDetails.total}</p>
          </div>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex-shrink-0">
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Personal Details</h2>
          <form className="space-y-4 flex-grow flex flex-col">
            <div className="border pl-2 pb-1 border-black rounded-md">
              <label className="block text-sm pl-1 my-1">Country/Region</label>
              <select
                name="country"
                onChange={handleInputChange}
                className={`w-full font-bold`}
              >
                <option value="India">India</option>
                <option value="US">United States</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`border rounded-md p-2 w-full ${
                    formErrors.firstName ? "border-red-400" : "border-black"
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`border rounded-md p-2 w-full ${
                    formErrors.lastName ? "border-red-400" : "border-black"
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className={`border rounded-md p-2 w-full ${
                  formErrors.address ? "border-red-400" : "border-black"
                }`}
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm">{formErrors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className={`border rounded-md p-2 w-full ${
                    formErrors.landmark ? "border-red-400" : "border-black"
                  }`}
                />
                {formErrors.landmark && (
                  <p className="text-red-500 text-sm">{formErrors.landmark}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`border rounded-md p-2 w-full ${
                    formErrors.state ? "border-red-400" : "border-black"
                  }`}
                />
                {formErrors.state && (
                  <p className="text-red-500 text-sm">{formErrors.state}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`border rounded-md p-2 w-full ${
                    formErrors.pincode ? "border-red-400" : "border-black"
                  }`}
                />
                {formErrors.pincode && (
                  <p className="text-red-500 text-sm">{formErrors.pincode}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`border rounded-md p-2 w-full ${
                  formErrors.phoneNumber ? "border-red-400" : "border-black"
                }`}
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-sm">{formErrors.phoneNumber}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-950 text-white py-2 px-4 rounded-md mt-auto w-full"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutDetails;
