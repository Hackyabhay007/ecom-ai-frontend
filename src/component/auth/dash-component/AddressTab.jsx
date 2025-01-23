import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveCustomer,
  createOrUpdateAddress,
} from "@/redux/slices/authSlice";

const AddressForm = () => {
  const { currentCustomer: user } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  // Get the first address or use default empty state
  const existingAddress = user?.addresses?.[0] || {};

  const initialAddressState = {
    address_name: existingAddress.address_name || `${user?.first_name || ''} ${user?.last_name || ''}`,
    company: existingAddress.company || user?.company_name || '',
    first_name: existingAddress.first_name || user?.first_name || '',
    last_name: existingAddress.last_name || user?.last_name || '',
    address_1: existingAddress.address_1 || '',
    address_2: existingAddress.address_2 || '',
    city: existingAddress.city || '',
    country_code: existingAddress.country_code || '',
    province: existingAddress.province || '',
    postal_code: existingAddress.postal_code || '',
    phone: existingAddress.phone || user?.phone || '',
    is_default_billing: existingAddress.is_default_billing || false,
    is_default_shipping: existingAddress.is_default_shipping || false,
    metadata: existingAddress.metadata || {},
  };

  const [newAddress, setNewAddress] = useState(initialAddressState);
  const [buttonText, setButtonText] = useState("Update Address");

  useEffect(() => {
    if (!user) {
      dispatch(retrieveCustomer());
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async () => {
    try {
      setButtonText("Updating...");

      await dispatch(createOrUpdateAddress({ addressData: newAddress }));

      setButtonText("Update Successful ✔");
      setTimeout(() => setButtonText("Update Address"), 4000);
    } catch (error) {
      setButtonText("Update Failed ❌");
      setTimeout(() => setButtonText("Update Address"), 4000);
    }
  };

  return (
    <div className="md:p-4 p-1">
      <div className="border rounded-lg p-6 bg-white">
        <h2 className="md:text-lg text-md font-bold mb-6 border-b pb-2">
          Billing Address
        </h2>
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <input
                type="text"
                name="first_name"
                value={newAddress.first_name}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name*
              </label>
              <input
                type="text"
                name="last_name"
                value={newAddress.last_name}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Company and Address Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={newAddress.company}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Name
              </label>
              <input
                type="text"
                name="address_name"
                value={newAddress.address_name}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address 1*
            </label>
            <input
              type="text"
              name="address_1"
              value={newAddress.address_1}
              onChange={handleChange}
              className="w-full py-4 px-4 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address 2
            </label>
            <input
              type="text"
              name="address_2"
              value={newAddress.address_2}
              onChange={handleChange}
              className="w-full py-4 px-4 border rounded-lg"
            />
          </div>

          {/* City, Province, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Province/State*
              </label>
              <input
                type="text"
                name="province"
                value={newAddress.province}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code*
              </label>
              <input
                type="text"
                name="postal_code"
                value={newAddress.postal_code}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Country and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country Code*
              </label>
              <input
                type="text"
                name="country_code"
                value={newAddress.country_code}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone*
              </label>
              <input
                type="tel"
                name="phone"
                value={newAddress.phone}
                onChange={handleChange}
                className="w-full py-4 px-4 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Default Address Checkboxes */}
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default_billing"
                checked={newAddress.is_default_billing}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Default Billing Address
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default_shipping"
                checked={newAddress.is_default_shipping}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Default Shipping Address
              </label>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={handleUpdate}
              className="px-6 py-4 rounded-md md:rounded-xl text-xs md:text-sm uppercase md:font-bold hover:bg-discount-color bg-black text-white hover:text-black transition-all duration-200 ease-in-out"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;