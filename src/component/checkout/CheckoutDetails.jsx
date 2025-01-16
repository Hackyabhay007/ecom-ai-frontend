import React, { useState } from "react";

function CheckoutDetails({ onContinue }) {
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
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Phone Number is required";

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
    <div className="flex flex-col w-full md:px-60 p-4">
      <h2 className=" text-xs border-b w-fit border-black md:text-sm text-center  uppercase mb-5 text-black">Personal Details</h2>
      <form className="space-y-5 flex-grow flex flex-col">
        <div className="border pl-2 pb-1 border-black">
          <label className="block text-xs sm:text-sm pl-1 my-1">Country/Region</label>
          <select
            name="country"
            onChange={handleInputChange}
            className={`w-full font-bold text-xs sm:text-sm`}
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
              className={`border p-4 w-full text-xs sm:text-sm border-black`}
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-xs sm:text-sm">{formErrors.firstName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`border p-4 w-full text-xs sm:text-sm border-black`}
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-xs sm:text-sm">{formErrors.lastName}</p>
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
            className={`border p-4 w-full text-xs sm:text-sm border-black`}
          />
          {formErrors.address && (
            <p className="text-red-500 text-xs sm:text-sm">{formErrors.address}</p>
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
              className={`border p-4 w-full text-xs sm:text-sm border-black`}
            />
            {formErrors.landmark && (
              <p className="text-red-500 text-xs sm:text-sm">{formErrors.landmark}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              className={`border p-4 w-full text-xs sm:text-sm border-black`}
            />
            {formErrors.state && (
              <p className="text-red-500 text-xs sm:text-sm">{formErrors.state}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className={`border p-4 w-full text-xs sm:text-sm border-black`}
            />
            {formErrors.pincode && (
              <p className="text-red-500 text-xs sm:text-sm">{formErrors.pincode}</p>
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
            className={`border p-4 w-full text-xs sm:text-sm border-black`}
          />
          {formErrors.phoneNumber && (
            <p className="text-red-500 text-xs sm:text-sm">{formErrors.phoneNumber}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-indigo-950 hover:bg-discount-color transition-all hover:text-black text-sm py-4 text-white hover:font-bold px-4 mt-auto w-full"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default CheckoutDetails;
