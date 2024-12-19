import React, { useState } from "react";

const SettingsTab = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    gender: "Male",
    dob: "1990-01-01",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    alert("Profile updated successfully!"); // Replace with UI feedback
  };

  const handleChangePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!"); // Replace with UI feedback
    } else {
      alert("Password changed successfully!"); // Replace with API call
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="space-y-6">
        {/* User Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleUserChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleUserChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleUserChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleUserChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={userInfo.gender}
            onChange={handleUserChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={userInfo.dob}
            onChange={handleUserChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleSaveChanges}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>

      {/* Change Password */}
      <div className="mt-10 space-y-4">
        <h3 className="text-lg font-bold">Change Password</h3>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleChangePassword}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
