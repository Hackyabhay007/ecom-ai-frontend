"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { userInfo } from "@/redux/slices/authSlice"
import Cookies from "js-cookie"
import { getCookie } from "utils/cookieUtils"

import DesktopSidebar from "./dash-component/DesktopSidebar"
import DashboardContent from "./dash-component/DashboardContent"
import OrderHistory from "./dash-component/OrderHistory"
import AddressTab from "./dash-component/AddressTab"
import SettingsTab from "./dash-component/SettingsTab"

const Dashboard = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    const checkAuth = async () => {
      // Only fetch if we haven't attempted yet and don't have user data
      if (!hasAttemptedFetch && !user) {
        try {
          setHasAttemptedFetch(true);
          await dispatch(userInfo()).unwrap();
        } catch (error) {
          console.error('Auth check failed:', error);
          if (error?.message === 'No auth token found' || error?.message === 'Session expired. Please login again.') {
            router.push('/auth/login');
          }
        }
      }
    };

    checkAuth();

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [dispatch, router, user, hasAttemptedFetch]);

  useEffect(() => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent userInfo={user} />
      case "history":
        return <OrderHistory userId={user?.id} />
      case "address":
        return <AddressTab />
      case "settings":
        console.log('Passing user data to SettingsTab:', user); // Debug log
        return <SettingsTab userInfo={user} /> // Pass user info as prop
      default:
        return <p>Select a tab</p>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>
  }

  return (
    <div className="flex flex-col md:flex-row p-2 mb-20 md:p-10">
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userInfo={user}
      />
      <div className="flex-1 p-1 md:p-6">{renderContent()}</div>
    </div>
  )
}

export default Dashboard
