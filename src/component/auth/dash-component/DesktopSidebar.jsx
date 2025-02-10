import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { retrieveCustomer, signout } from "@/redux/slices/authSlice";

const DesktopSidebar = ({ activeTab, setActiveTab }) => {
  const { currentCustomer: user } = useSelector(state => state.customer);
  const dispatch = useDispatch();
  const router = useRouter();
  const {tab} = router.query;

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch]);
  
  const menuItems = [
    { name: "Dashboard", tab: "dashboard", icon: "ri-home-2-line" },
    { name: "Order History", tab: "history", icon: "ri-hourglass-2-fill" },
    { name: "My Address", tab: "address", icon: "ri-map-pin-user-line" },
    { name: "Settings", tab: "settings", icon: "ri-settings-3-line" },
    { name: "Logout", tab: "logout", icon: "ri-logout-box-r-line" },
  ];

  const handleMenuClick = (item) => {
    if (item.name === "Logout") {
      dispatch(signout()).then(() => {
        // Redirect to login page after logout
        router.push('/auth/login');
      });
    } else {
      setActiveTab(item.tab);
    }
  };



  return (
    <div className="bg-light-BG md:w-80 w-full min-h-fit md:min-h-screen rounded-xl p-4 shadow-md">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src={user?.metadata?.avatar || "https://i.pinimg.com/736x/d3/f3/b4/d3f3b4a5bac5a1e52a801dba8d952851.jpg"}
          alt="User Avatar"
          width={200}
          height={200}
          className="rounded-full object-cover w-24 h-24 mb-4"
        />
        <h3 className="text-xl font-bold">{user?.name || user?.first_name}</h3>
        <p className="text-gray-600">{user?.email}</p>
      </div> 

      {/* Navigation Menu */}
      <nav className="space-y-4 text-lg">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => {handleMenuClick(item)
              router.push({
                path : router.pathname,
                query : {tab : item.tab}
              })
            }}
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