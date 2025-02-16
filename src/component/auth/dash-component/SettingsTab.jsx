import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { updateCustomer } from "@/redux/slices/authSlice";
import axios from "axios";
import { Spinner } from "@medusajs/icons";

const SettingsTab = ({ userInfo }) => { // Get userInfo from props instead of state
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth || {});

  // Log the userInfo to check what we're receiving
  console.log('User Info received:', userInfo);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "1990-01-01",
  });

  // Update form when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setUserData({
        firstName: userInfo.firstName || userInfo.first_name || "",
        lastName: userInfo.lastName || userInfo.last_name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        gender: userInfo.metadata?.gender || userInfo.gender || "Male",
        dob: userInfo.metadata?.dob || userInfo.dob || "1990-01-01",
      });
      setEditImage(userInfo.metadata?.avatar || userInfo.avatar || "");
    }
  }, [userInfo]);

  const [formLoading, setFormLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [editImage, setEditImage] = useState("");
  const [newImage, setNewImage] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({
    profileMessage: "",
    passwordMessage: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setFormLoading(true);
    try {
      const imageLink = newImage ? await uploadImage(image) : editImage;
      
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        metadata: {
          ...userInfo.metadata, // Preserve existing metadata
          gender: userData.gender,
          dob: userData.dob,
          avatar: imageLink,
        },
      };

      console.log('Updating with data:', updateData);
      await dispatch(updateCustomer(updateData)).unwrap();
      
      setUpdateStatus(prev => ({
        ...prev,
        profileMessage: "Profile updated successfully!"
      }));
      setNewImage(false);
    } catch (error) {
      console.error('Update error:', error);
      setUpdateStatus(prev => ({
        ...prev,
        profileMessage: "Failed to update profile."
      }));
    } finally {
      setFormLoading(false);
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

  // Show loading state if no user data
  if (!userInfo) {
    return <div className="text-center py-4">Loading user information...</div>;
  }

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
                value={userData.firstName}
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
                value={userData.lastName}
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
                value={userData.phone}
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
                value={userData.email}
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
                value={userData.gender}
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
                value={userData.dob}
                onChange={handleUserChange}
                placeholder="mm/dd/yyyy"
                className="w-full py-4 px-4 border rounded-lg"
              />
            </div>
          </div>

          <button
            disabled={formLoading}
            onClick={handleSaveChanges}
            className="mt-6 px-6 md:py-4 py-3 rounded-md md:rounded-xl text-xs md:text-sm uppercase md:font-bold bg-black text-white  hover:bg-discount-color transition-all duration-200 ease-in-out min-w-44 hover:text-black"
          >
            {formLoading ? <> <div className="animate-spin"><Spinner/></div> </> : "Save Changes"}
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
