import React, { useState } from "react";
import DesktopSidebar from "./dash-component/DesktopSidebar";
import DashboardContent from "./dash-component/DashboardContent";
import OrderHistory from "./dash-component/OrderHistory";
import AddressTab from "./dash-component/AddressTab";
import SettingsTab from "./dash-component/SettingsTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "history":
        return <OrderHistory />;
      case "address":
        return <AddressTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <p>Select a tab</p>;
    }
  };

  return (
    <div className="flex p-10">
      <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
