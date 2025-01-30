"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { retrieveCustomer } from "@/redux/slices/authSlice"
import Cookies from "js-cookie"

import DesktopSidebar from "./dash-component/DesktopSidebar"
import DashboardContent from "./dash-component/DashboardContent"
import OrderHistory from "./dash-component/OrderHistory"
import AddressTab from "./dash-component/AddressTab"
import SettingsTab from "./dash-component/SettingsTab"

const Dashboard = () => {

  const router = useRouter()
  const tab = router.query?.tab
  const [activeTab, setActiveTab] = useState(tab || "dashboard")
  const dispatch = useDispatch()
  const { currentCustomer, token } = useSelector(state => state.customer)

  useEffect(() => {
    // Redirect if no token
    if (!Cookies.get("_medusa_jwt")) {
      router.push("/auth/login")
    } else {
      // Fetch user data
      dispatch(retrieveCustomer())
    }
  }, [dispatch, router])

  useEffect(() => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, [tab]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent customer={currentCustomer} />
      case "history":
        return <OrderHistory />
      case "address":
        return <AddressTab />
      case "settings":
        return <SettingsTab />
      default:
        return <p>Select a tab</p>
    }
  }

  if (!currentCustomer) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col md:flex-row p-2 mb-20 md:p-10">
      <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-1 md:p-6">{renderContent()}</div>
    </div>
  )
}

export default Dashboard
