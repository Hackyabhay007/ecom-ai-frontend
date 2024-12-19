import React, { useState } from "react";

const AddressTab = () => {
  const [address, setAddress] = useState({
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
  });

  const [newAddress, setNewAddress] = useState({ ...address });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    setAddress(newAddress);
    alert("Address updated successfully!"); // Replace with UI feedback
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Address</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            name="street"
            value={newAddress.street}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={newAddress.city}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={newAddress.state}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Zip Code</label>
          <input
            type="text"
            name="zip"
            value={newAddress.zip}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Update Address
        </button>
      </div>
    </div>
  );
};

export default AddressTab;
