import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveCustomer,
  updateCustomer,
  updateCustomerPassword,
} from "@/redux/slices/authSlice";
import axios from "axios";
import { Spinner } from "@medusajs/icons";

const SettingsTab = () => {
  const { currentCustomer: user } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch]);

  const [userInfo, setUserInfo] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "Male",
    dob: user?.dob || "1990-01-01",
  });

  const [loading , setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updateStatus, setUpdateStatus] = useState({
    profileMessage: "",
    passwordMessage: "",
  });
  const [image, setImage] = useState(null);
  const [editImage, setEditImage] = useState(user?.metadata?.avatar || "");
  const [newimage , setNewImage] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(event.target.files[0]);
      setEditImage(imageUrl);
      setNewImage(true);
    }
  };

  const uploadImage = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        console.log("formData", file);  

        const response = await axios.post(
          `https://storage.themajesticpeacock.com/upload/100`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization:
                "Bearer 5d92b8f69c9dda89f38c10fa6750376a25b53a9afd47e74951104769630d4ccc",
            },
          }
        ).catch((error) => {
          console.log(error);
        });

        setImage(response?.data);

        console.log("response", response?.data);
        return response?.data;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
     const resiamgelink = newimage ?  await uploadImage(image) : editImage;
      const result = await dispatch(
        updateCustomer({
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          phone: userInfo.phone,
          metadata: {
            gender: userInfo.gender,
            dob: userInfo.dob,
            avatar : resiamgelink,
          },
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        setUpdateStatus((prev) => ({
          ...prev,
          profileMessage: "Profile updated successfully!",
        }));
      }
      setLoading(false);
      setNewImage(false);
    } catch (error) {
      setUpdateStatus((prev) => ({
        ...prev,
        profileMessage: "Failed to update profile.",
      }));
      
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setUpdateStatus((prev) => ({
        ...prev,
        passwordMessage: "New passwords do not match!",
      }));
      return;
    }

    try {
      const result = await dispatch(
        updateCustomerPassword({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        setUpdateStatus((prev) => ({
          ...prev,
          passwordMessage: "Password changed successfully!",
        }));

        // Reset password fields
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setUpdateStatus((prev) => ({
        ...prev,
        passwordMessage: "Failed to change password.",
      }));
    }
  };

 

  return (
    <div className="p-4 border rounded-xl my-2">
      <div className="p-4 border rounded-xl my-2">
        {/* Information Section data  */}
        <h2 className="text-xl font-bold mb-4">Information</h2>
        <div className="border rounded-lg p-6 bg-white">
          {/* Avatar Upload */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <label htmlFor="avatar">
              <div className="w-24 h-24 border rounded-full overflow-hidden relative">
                <img
                  src={editImage}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="w-full h-full hover:bg-zinc-800/40 duration-200 top-0 left-0 absolute ">
                  <div className="flex justify-center items-center w-full h-full bg-black/50 text-white text-sm font-bold">
                    Upload Avatar
                    </div>
                </div>
              </div>
            </label>
            <div className="hidden">
              <h3 className="text-lg font-bold">Upload Avatar</h3>
              <p className="text-sm text-gray-500">JPG 120x120px</p>
              <div className="border rounded-lg w-fit p-2 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  id="avatar"
                  onChange={handleImageChange}
                  className="text-gray-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* User Info Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleUserChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleUserChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number*
              </label>
              <input
                type="text"
                name="phone"
                value={userInfo.phone}
                onChange={handleUserChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address*
              </label>
              <input
                type="email"
                name="email"
                disabled
                value={userInfo.email}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={userInfo.gender}
                onChange={handleUserChange}
                className="w-full py-4 px-4 border rounded-lg"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={userInfo.dob}
                onChange={handleUserChange}
                placeholder="mm/dd/yyyy"
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleSaveChanges}
            className="mt-6 px-6 md:py-4 py-3 rounded-md md:rounded-xl text-xs md:text-sm uppercase md:font-bold bg-black text-white  hover:bg-discount-color transition-all duration-200 ease-in-out min-w-44 hover:text-black"
          >
            {loading ? <> <div className="animate-spin"><Spinner/></div> </> : "Save Changes"}
          </button>
        </div>

        {/* Change Password Section */}
        <div className="mt-10 border rounded-lg p-6 bg-white">
          <h3 className="text-lg font-bold mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password*
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password*
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password*
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            className="mt-6 px-6 md:py-4 py-3 uppercase md:font-bold rounded-md md:rounded-xl text-xs md:text-sm  bg-black text-white hover:bg-discount-color transition-all duration-200 ease-in-out"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Add status messages */}
      {updateStatus.profileMessage && (
        <div
          className={`mt-4 p-2 rounded ${
            updateStatus.profileMessage.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {updateStatus.profileMessage}
        </div>
      )}

      {updateStatus.passwordMessage && (
        <div
          className={`mt-4 p-2 rounded ${
            updateStatus.passwordMessage.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {updateStatus.passwordMessage}
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
