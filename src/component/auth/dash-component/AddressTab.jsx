import React, { useState } from "react";

const AddressTab = () => {
  const [address, setAddress] = useState({
    firstName: "John",
    lastName: "Doe",
    companyName: "",
    country: "United States",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "1234567890",
    email: "john.doe@example.com",
  });

  const [newAddress, setNewAddress] = useState({ ...address });
  const [buttonText, setButtonText] = useState("Update Address");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    setAddress(newAddress);
    setButtonText("Update Successful ✔");
    setTimeout(() => setButtonText("Update Address"), 4000); // Revert button text after 2 seconds
  };

  return (
    <div className="p-4">
      <div className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-bold mb-6 border-b pb-2">Billing Address</h2>
        <div className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name*</label>
              <input
                type="text"
                name="firstName"
                value={newAddress.firstName}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={newAddress.lastName}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name (Optional)</label>
              <input
                type="text"
                name="companyName"
                value={newAddress.companyName}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country/Region*</label>
              <input
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Street Address*</label>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Town/City*</label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">State*</label>
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zip Code*</label>
              <input
                type="text"
                name="zip"
                value={newAddress.zip}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          {/* Fifth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone*</label>
              <input
                type="text"
                name="phone"
                value={newAddress.phone}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email*</label>
              <input
                type="email"
                name="email"
                value={newAddress.email}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-start">
            <button
              onClick={handleUpdate}
              className="px-6 py-4 rounded-xl text-sm uppercase font-bold hover:bg-discount-color bg-black text-white hover:text-black transition-all duration-200 ease-in-out"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressTab;
