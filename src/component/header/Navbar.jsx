import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"; // Import useDispatch for Redux
import { toggleWishlistSidebar } from "../../../redux/slices/wishSlice";
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch(); // Initialize dispatch for Redux

  const { items } = useSelector((state) => state.cart); // Access cart items from Redux
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0); // Calculate total items in cart
  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigateTo = (path) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  if (isMobile) {
    return (
      <nav className="bg-white text-black p-4 shadow-md">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          {/* Menu Icon */}
          <i
            className={`text-2xl cursor-pointer ${
              isMenuOpen ? "ri-close-line" : "ri-menu-2-line"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          ></i>

          {/* Logo */}
          <div className="flex justify-center items-center">
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={500}
              height={500}
              className="w-20"
            />
          </div>

          {/* Right Icons */}
          <div className="flex space-x-4 items-center">
            <i className="ri-search-line text-2xl cursor-pointer hover:text-blue-500"></i>
          <Link href='/cart'>
          <i className="ri-shopping-bag-line text-2xl cursor-pointer hover:text-blue-500"></i>
          </Link>  
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-2 p-4 rounded-md">
            <ul className="space-y-4">
              <li
                className={`cursor-pointer hover:text-blue-500 ${
                  router.pathname === "/" ? "text-blue-500 font-semibold" : ""
                }`}
                onClick={() => navigateTo("/")}
              >
                Home
              </li>
              <li
                className={`cursor-pointer hover:text-blue-500 ${
                  router.pathname === "/shop"
                    ? "text-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/shop")}
              >
                Shop
              </li>
              <li
                className={`cursor-pointer hover:text-blue-500 ${
                  router.pathname === "/category"
                    ? "text-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/category")}
              >
                Category
              </li>
              <li
                className={`cursor-pointer hover:text-blue-500 ${
                  router.pathname === "/about"
                    ? "text-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/about")}
              >
                About
              </li>
              <li
                className={`cursor-pointer hover:text-blue-500 ${
                  router.pathname === "/contact-us"
                    ? "text-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/contact-us")}
              >
                Contact Us
              </li>
            </ul>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="bg-white text-black flex items-center justify-around p-4 py-6 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/images/logo/logo.png"
          alt="Logo"
          width={400}
          height={400}
          className="w-28"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-14   ">
        <div
          className={`cursor-pointer hover:text-blue-500 ${
            router.pathname === "/" ? "text-theme-blue font-semibold" : ""
          }`}
          onClick={() => navigateTo("/")}
        >
          Home
        </div>
        <div
          className={`cursor-pointer hover:text-blue-500 ${
            router.pathname === "/shop" ? "text-theme-blue font-semibold" : ""
          }`}
          onClick={() => navigateTo("/shop")}
        >
          Shop
        </div>
        <div
          className={`cursor-pointer hover:text-blue-500 ${
            router.pathname === "/category"
              ? "text-theme-blue font-semibold"
              : ""
          }`}
          onClick={() => navigateTo("/category")}
        >
          Category
        </div>
        <div
          className={`cursor-pointer hover:text-blue-500 ${
            router.pathname === "/checkout" ? "text-theme-blue font-semibold" : ""
          }`}
          onClick={() => navigateTo("/checkout")}
        >
          About(checkout testing)
        </div>
        <div
          className={`cursor-pointer hover:text-blue-500 ${
            router.pathname === "/contact-us"
              ? "text-theme-blue font-semibold"
              : ""
          }`}
          onClick={() => navigateTo("/contact-us")}
        >
          Contact Us 
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex space-x-4 items-center text-sm font-thin text-theme-blue">
        <i className="ri-search-line text-2xl cursor-pointer hover:text-black"></i>
        <i
          className="ri-user-line text-2xl cursor-pointer hover:text-black"
          onClick={() =>
            user ? navigateTo("/auth/dashboard") : navigateTo("/auth/login")
          }
        ></i>
        <i
          className="ri-heart-line text-2xl cursor-pointer hover:text-black"
          onClick={() => dispatch(toggleWishlistSidebar())} // Dispatch action to open the sidebar
        ></i>{" "}
        <div className="relative">
          <Link href="/cart">
            <i className="ri-shopping-bag-line text-2xl cursor-pointer hover:text-black"></i>
          </Link>
          {totalItems > 0 && (
            <span className="absolute -top-1  -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
