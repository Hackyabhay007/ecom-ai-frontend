import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/redux/slices/authSlice";

const AddressForm = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [buttonText, setButtonText] = useState("Update Address");

  // Initialize state with user data
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false
  });

  // Update form when user data changes
  useEffect(() => {
    if (user && user.addresses?.[0]) {
      const defaultAddress = user.addresses[0];
      setNewAddress({
        street: defaultAddress.street || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        country: defaultAddress.country || '',
        zipCode: defaultAddress.zipCode || '',
        isDefault: defaultAddress.isDefault || false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setButtonText("Updating...");

      // Create FormData object for the update
      const formData = new FormData();
      
      // Add the address to the addresses array
      formData.append('addresses', JSON.stringify([newAddress]));
      
      // Keep existing user data
      if (user.firstName) formData.append('firstName', user.firstName);
      if (user.lastName) formData.append('lastName', user.lastName);
      if (user.dateOfBirth) formData.append('dateOfBirth', user.dateOfBirth);

      await dispatch(updateProfile(formData)).unwrap();
      setButtonText("Update Successful ✔");
      setTimeout(() => setButtonText("Update Address"), 2000);
    } catch (error) {
      setButtonText("Update Failed ❌");
      console.error("Error updating address:", error);
      setTimeout(() => setButtonText("Update Address"), 2000);
    }
  };

  // ... rest of your render code with the form remains the same, but update input names to match new structure ...
  return (
    <div className="md:p-4 p-1">
      <div className="border rounded-lg p-6 bg-white">
        <h2 className="md:text-lg text-md font-bold mb-6 border-b pb-2">
          Update Address
        </h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address*
            </label>
            <input
              type="text"
              name="street"
              value={newAddress.street}
              onChange={handleChange}
              className="w-full py-4 px-4 border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City*
              </label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State/Province*
              </label>
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country*
              </label>
              <input
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code*
              </label>
              <input
                type="text"
                name="zipCode"
                value={newAddress.zipCode}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddress.isDefault}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-4 rounded-md md:rounded-xl text-xs md:text-sm uppercase md:font-bold hover:bg-discount-color bg-black text-white hover:text-black transition-all duration-200 ease-in-out"
            >
              {buttonText}
            </button>
          </div>
        </form>

        {/* Display existing addresses */}
        {user?.addresses?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((address, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="font-medium">{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                  {address.isDefault && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Default Address
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;