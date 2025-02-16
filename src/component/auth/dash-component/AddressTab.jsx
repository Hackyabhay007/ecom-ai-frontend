import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/redux/slices/authSlice";

const AddressTab = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [buttonText, setButtonText] = useState("Add Address");
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Initialize state with user data
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    addressName: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false,
    companyName: ''
  });

  const canAddNewAddress = !user?.addresses || user.addresses.length < 2;

  useEffect(() => {
    if (user && user.addresses?.[0]) {
      const defaultAddress = user.addresses[0];
      setNewAddress({
        firstName: user.firstName || defaultAddress.firstName || '',
        lastName: user.lastName || defaultAddress.lastName || '',
        phone: user.phone || defaultAddress.phone || '',
        addressName: defaultAddress.addressName || '',
        addressLine1: defaultAddress.addressLine1 || '',
        addressLine2: defaultAddress.addressLine2 || '',
        landmark: defaultAddress.landmark || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        country: defaultAddress.country || '',
        zipCode: defaultAddress.zipCode || '',
        isDefault: defaultAddress.isDefault || false,
        companyName: defaultAddress.companyName || ''
      });
    }
  }, [user]);

  const handleEdit = (address, index) => {
    setEditingIndex(index);
    setNewAddress({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      phone: address.phone || '',
      addressName: address.addressName || '',
      addressLine1: address.street || '',
      addressLine2: address.addressLine2 || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || '',
      zipCode: address.zipCode || '',
      isDefault: address.isDefault || false,
      companyName: address.companyName || ''
    });
    setShowForm(true);
  };

  const handleRemove = async (index) => {
    try {
      const updatedAddresses = user.addresses.filter((_, idx) => idx !== index);
      
      // If removing default address, make the first remaining address default
      if (updatedAddresses.length > 0) {
        const removedAddress = user.addresses[index];
        if (removedAddress.isDefault) {
          updatedAddresses[0].isDefault = true;
        }
      }

      const updatePayload = {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        addresses: updatedAddresses,
        profilePicture: user.profilePicture
      };

      const formData = new FormData();
      Object.keys(updatePayload).forEach(key => {
        if (key === 'addresses') {
          formData.append(key, JSON.stringify(updatePayload[key]));
        } else if (updatePayload[key]) {
          formData.append(key, updatePayload[key]);
        }
      });

      await dispatch(updateProfile(formData)).unwrap();
    } catch (error) {
      console.error("Error removing address:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setButtonText(editingIndex !== null ? "Updating..." : "Adding...");

      const formattedAddress = {
        street: newAddress.addressLine1,
        city: newAddress.city,
        state: newAddress.state,
        country: newAddress.country,
        zipCode: newAddress.zipCode,
        isDefault: newAddress.isDefault,
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        phone: newAddress.phone,
        companyName: newAddress.companyName,
        addressName: newAddress.addressName,
        addressLine2: newAddress.addressLine2,
        landmark: newAddress.landmark
      };

      let updatedAddresses = [...(user?.addresses || [])];
      
      if (editingIndex !== null) {
        // Update existing address
        updatedAddresses[editingIndex] = formattedAddress;
      } else {
        // Add new address
        updatedAddresses.push(formattedAddress);
      }

      // Handle default address logic
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr, idx) => ({
          ...addr,
          isDefault: editingIndex === idx ? true : false
        }));
      } else if (updatedAddresses.length === 1) {
        // If this is the only address, make it default
        updatedAddresses[0].isDefault = true;
      }

      const updatePayload = {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        addresses: updatedAddresses,
        profilePicture: user.profilePicture
      };

      const formData = new FormData();
      Object.keys(updatePayload).forEach(key => {
        if (key === 'addresses') {
          formData.append(key, JSON.stringify(updatePayload[key]));
        } else if (updatePayload[key]) {
          formData.append(key, updatePayload[key]);
        }
      });

      const result = await dispatch(updateProfile(formData)).unwrap();
      
      if (result?.addresses) {
        setButtonText("Address Added ✔");
        setShowForm(false);
        // Reset form
        setNewAddress({
          firstName: '',
          lastName: '',
          phone: '',
          addressName: '',
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
          isDefault: false,
          companyName: ''
        });
      }

      setTimeout(() => setButtonText("Add Address"), 2000);
    } catch (error) {
      console.error("Error updating address:", error);
      setButtonText(editingIndex !== null ? "Update Failed ❌" : "Add Failed ❌");
      setTimeout(() => setButtonText(editingIndex !== null ? "Update Address" : "Add Address"), 2000);
    }
  };

  return (
    <div className="md:p-4 p-1">
      <div className="border rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Addresses</h2>
          {canAddNewAddress && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add New Address
            </button>
          )}
        </div>

        {/* Display existing addresses first */}
        {user?.addresses?.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((address, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{address.addressName || `Address ${index + 1}`}</p>
                      <p className="text-sm text-gray-600">{address.firstName} {address.lastName}</p>
                      <p className="text-gray-600">{address.street}</p>
                      <p className="text-gray-600">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                      <p className="text-gray-600">{address.phone}</p>
                      {address.isDefault && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Default Address
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(address, index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <i className="ri-edit-line text-xl"></i>
                      </button>
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!canAddNewAddress && (
          <div className="text-center p-4 bg-yellow-50 text-yellow-700 rounded-md">
            Maximum of two addresses allowed. Please remove an address to add a new one.
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={newAddress.firstName}
                  onChange={(e) => setNewAddress(prev => ({...prev, firstName: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={newAddress.lastName}
                  onChange={(e) => setNewAddress(prev => ({...prev, lastName: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({...prev, phone: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Name</label>
                <input
                  type="text"
                  name="addressName"
                  placeholder="e.g., Home, Office"
                  value={newAddress.addressName}
                  onChange={(e) => setNewAddress(prev => ({...prev, addressName: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={newAddress.companyName}
                  onChange={(e) => setNewAddress(prev => ({...prev, companyName: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Address Lines */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address Line 1*</label>
              <input
                type="text"
                name="addressLine1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress(prev => ({...prev, addressLine1: e.target.value}))}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress(prev => ({...prev, addressLine2: e.target.value}))}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress(prev => ({...prev, landmark: e.target.value}))}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City*</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({...prev, city: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State/Province*</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress(prev => ({...prev, state: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Country*</label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress(prev => ({...prev, country: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code*</label>
                <input
                  type="text"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress(prev => ({...prev, zipCode: e.target.value}))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress(prev => ({...prev, isDefault: e.target.checked}))}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Set as default address {user?.addresses?.some(addr => addr.isDefault) && '(Will replace current default)'}
              </label>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingIndex(null);
                  setNewAddress({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    addressName: '',
                    addressLine1: '',
                    addressLine2: '',
                    landmark: '',
                    city: '',
                    state: '',
                    country: '',
                    zipCode: '',
                    isDefault: false,
                    companyName: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingIndex !== null ? 'Update Address' : 'Add Address'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressTab;