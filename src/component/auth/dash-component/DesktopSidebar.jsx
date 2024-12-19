import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
const DesktopSidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", tab: "dashboard" },
    { name: "Order History", tab: "history" },
    { name: "My Address", tab: "address" },
    { name: "Settings", tab: "settings" },
    { name: "Logout", tab: "logout" },
  ];

  return (
    <div className="bg-light-BG w-64 min-h-screen p-4 shadow-md">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/images/review/review1.png"
          alt="User Avatar"
          width={200}
          height={200}
          className="rounded-full object-cover w-20 h-20 mb-4"
        />
        <h3 className="text-lg font-bold">{user?.name}</h3>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            onClick={() =>
              item.tab === "logout" ? logout() : setActiveTab(item.tab)
            }
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === item.tab ? "bg-white font-bold" : "bg-light-BG"
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DesktopSidebar;
