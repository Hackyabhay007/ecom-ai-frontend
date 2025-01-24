"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import { toggleWishlistSidebar } from "@/redux/slices/wishSlice"
import Search from "../search/Search"
import NavCategory from "./NavCategory"
import { retrieveCustomer } from "@/redux/slices/authSlice"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const { currentCustomer } = useSelector(state => state.customer)
  const { cart } = useSelector(state => state.cart)

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto"
  }, [isMenuOpen])

  useEffect(() => {
    dispatch(retrieveCustomer())
  }, [dispatch])

  const navigateTo = path => {
    setIsMenuOpen(false)
    router.push(path)
  }

  const renderUserSection = () => {
    const userText = currentCustomer
      ? `Hello, ${currentCustomer.first_name || "User"}`
      : "Sign In / Register"

    const userPath = currentCustomer ? "/auth/dashboard" : "/auth/login"

    return (
      <li
        className={`cursor-pointer bg-light-BG hover:text-theme-blue border-b border-gray-400 text-lg p-5`}
        onClick={() => navigateTo(userPath)}
      >
        <i className="ri-user-line pr-4"></i> {userText}
      </li>
    )
  }

  const desktopUserSection = () => (
    <i
      className="ri-user-line text-xl cursor-pointer hover:text-black"
      onClick={() =>
        currentCustomer
          ? navigateTo("/auth/dashboard")
          : navigateTo("/auth/login")
      }
    />
  )

  if (isMobile) {
    return (
      <nav
        className={`bg-white fixed w-full p-4 shadow-md text-black ${
          isMenuOpen ? "z-50" : "z-40"
        }`}
      >
        {/* Mobile Navigation Implementation */}
        <div className="flex items-center justify-between">
          <Link href="/">
          <div className="flex justify-center items-center relative w-28 h-10">
        {/* First logo with fade animation */}
        <Image
          src="/images/logo/logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="absolute w-28 animate-fade1"
        />
        {/* Second logo with delayed fade animation */}
        <Image
          src="/images/logo/logo2.png"
          alt="Logo 2"
          width={500}
          height={500}
          className="absolute w-6 animate-fade2"
        />
      </div>
          </Link>

          <div className="flex space-x-4 items-center justify-end">
            <i
              className="ri-search-line text-xl cursor-pointer hover:text-black"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
            <i
              className={`text-xl cursor-pointer transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "ri-close-line rotate-180"
                  : "ri-pause-large-line rotate-90"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>

          {isSearchOpen && (
            <Search onClose={() => setIsSearchOpen(false)} isMobile={false} />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-19 right-0 h-screen w-full bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "animate-slideInLeft translate-x-0"
              : "animate-slideInRight translate-x-full"
          }`}
        >
          <div className="mt-2 py-4 h-full">
            <ul className="space-y-0">
              {renderUserSection()}
              <div className="md:hidden w-full">
                <NavCategory />
              </div>
              <div className="space-y-6 py-4 px-2">
                {/* Additional Mobile Navigation Items */}
              </div>
            </ul>
          </div>
        </div>
      </nav>
    )
  }

  // Desktop View
  return (
    <nav className="bg-white text-black flex items-center justify-around p-4 py-6 shadow-md">
      {/* Logo */}
      <Link href="/">
      <div className="flex justify-center items-center relative w-28 h-10">
        {/* First logo with fade animation */}
        <Image
          src="/images/logo/logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="absolute w-28 animate-fade1"
        />
        {/* Second logo with delayed fade animation */}
        <Image
          src="/images/logo/logo2.png"
          alt="Logo 2"
          width={500}
          height={500}
          className="absolute w-6 animate-fade2"
        />
      </div>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="flex items-center space-x-14">
        {/* Navigation Items */}
        <div
          className={`cursor-pointer uppercase text-sm hover:text-theme-blue border-b-2 border-transparent hover:border-theme-blue transition-all ease-in-out ${
            router.pathname === "/"
              ? "text-theme-blue font-semibold border-b-2 border-theme-blue"
              : ""
          }`}
          onClick={() => navigateTo("/")}
        >
          Home
        </div>
        <div
          className={`cursor-pointer uppercase text-sm hover:text-theme-blue border-b-2 border-transparent hover:border-theme-blue transition-all ease-in-out ${
            router.pathname === "/shop"
              ? "text-theme-blue font-semibold border-b-2 border-theme-blue"
              : ""
          }`}
          onClick={() => navigateTo("/shop")}
        >
          Shop
        </div>
        <div className="">
          <NavCategory />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex space-x-4 items-center text-sm font-thin text-theme-blue">
        <i
          className="ri-search-line text-xl cursor-pointer hover:text-black"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        />
        {desktopUserSection()}
        <i
          className="ri-heart-line text-xl cursor-pointer hover:text-black"
          onClick={() => dispatch(toggleWishlistSidebar())}
        />
        <div className="relative">
          <Link href="/cart">
            <i className="ri-shopping-bag-line text-xl cursor-pointer hover:text-black"></i>
          </Link>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-white text-black border border-theme-blue p-1 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              <span className="animate-pulse">{totalItems}</span>
            </span>
          )}
        </div>
      </div>

      {/* Desktop Search */}
      {isSearchOpen && (
        <Search onClose={() => setIsSearchOpen(false)} isMobile={false} />
      )}
    </nav>
  )
}

export default Navbar
