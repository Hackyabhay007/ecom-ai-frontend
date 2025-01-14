import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

const DesktopSidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", tab: "dashboard", icon: "ri-home-2-line" },
    { name: "Order History", tab: "history", icon: "ri-hourglass-2-fill" },
    { name: "My Address", tab: "address", icon: "ri-map-pin-user-line" },
    { name: "Settings", tab: "settings", icon: "ri-settings-3-line" },
    { name: "Logout", tab: "logout", icon: "ri-logout-box-r-line" },
  ];

  return (
    <div className="bg-light-BG  md:w-80 w-full min-h-fit md:min-h-screen rounded-xl p-4 shadow-md">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/images/review/review1.png"
          alt="User Avatar"
          width={200}
          height={200}
          className="rounded-full object-cover w-24 h-24 mb-4"
        />
        <h3 className="text-xl font-bold">{user?.name}</h3>
        <p className="text-gray-600">{user?.email}</p>
      </div> 

      {/* Navigation Menu */}
      <nav className="space-y-4 text-lg">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            onClick={() =>
              item.tab === "logout" ? logout() : setActiveTab(item.tab)
            }
            className={`flex items-center w-full text-left px-4 py-2 rounded-md ${
              activeTab === item.tab ? "bg-white font-bold" : "bg-light-BG"
            }`}
          >
            <i
              className={`${item.icon} text-xl mr-3 ${
                activeTab === item.tab ? "text-black" : "text-gray-600"
              }`}
            ></i>
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DesktopSidebar;
