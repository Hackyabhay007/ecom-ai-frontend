import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice"; // Change from signout to logout

const DesktopSidebar = ({ activeTab, setActiveTab, userInfo }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {tab} = router.query;

  const menuItems = [
    { name: "Dashboard", tab: "dashboard", icon: "ri-home-2-line" },
    { name: "Order History", tab: "history", icon: "ri-hourglass-2-fill" },
    { name: "My Address", tab: "address", icon: "ri-map-pin-user-line" },
    { name: "Settings", tab: "settings", icon: "ri-settings-3-line" },
    { name: "Logout", tab: "logout", icon: "ri-logout-box-r-line" },
  ];

  const handleMenuClick = (item) => {
    if (item.name === "Logout") {
      dispatch(logout()); // Changed from signout to logout
      router.push('/auth/login');
    } else {
      setActiveTab(item.tab);
      router.push({
        pathname: router.pathname,
        query: { tab: item.tab }
      });
    }
  };

  return (
    <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md">
      {/* User Info Section */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">{userInfo?.firstName} {userInfo?.lastName}</h2>
        <p className="text-gray-600">{userInfo?.email}</p>
        <p className="text-sm text-gray-500">
          Member since {new Date(userInfo?.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-4 text-lg">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => handleMenuClick(item)}
            className={`flex items-center w-full text-left px-4 py-2 rounded-md ${
              activeTab === item.tab ? "bg-white font-bold" : "bg-light-BG"
            }`}
          >
            <i className={`${item.icon} text-xl mr-3 ${
              activeTab === item.tab ? "text-black" : "text-gray-600"
            }`}></i>
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DesktopSidebar;