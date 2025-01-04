import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { toggleWishlistSidebar } from "../../../redux/slices/wishSlice";
import Search from "../search/Search";
import CategoryDropdown from "../category/CategoryDropdown";
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  if (isMobile) {
    return (
      <nav className="bg-white fixed w-full z-50 text-black p-4 shadow-md">
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
          <Link href="/">
            <div className="flex justify-center items-center relative w-20 h-10">
              {/* Main logo */}
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={500}
                height={500}
                className="absolute w-20  "
              />
              {/* Smaller logo */}
              <Image
                src="/images/logo/logo2.png"
                alt="Logo 2"
                width={500}
                height={500}
                className="absolute left-1 top-4 w-[11px] animate-pulse"
              />
            </div>
          </Link>

          {/* Right Icons */}
          <div className="flex space-x-4 items-center">
            <i
              className="ri-user-line text-2xl cursor-pointer hover:text-black"
              onClick={() =>
                user ? navigateTo("/auth/dashboard") : navigateTo("/auth/login")
              }
            ></i>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-2 p-4 rounded-md">
            {/* Menu Items */}
            <ul className="space-y-4">
              {/* Search Bar */}
              <li>
                <Search onClose={() => setIsMenuOpen(false)} isMobile={true} />
              </li>
              <li
                className={`cursor-pointer hover:text-theme-blue ${
                  router.pathname === "/" ? "text-theme-blue font-semibold" : ""
                }`}
                onClick={() => navigateTo("/")}
              >
               <i class="ri-home-line"></i> Home
              </li>
              <li
                className={`cursor-pointer hover:text-theme-blue ${
                  router.pathname === "/shop"
                    ? "text-theme-blue font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/shop")}
              >
               <i class="ri-shopping-bag-line"></i>  Shop
              </li>
              <li
                className={`cursor-pointer hover:text-theme-blue ${
                  router.pathname === "/about"
                    ? "text-theme-blue font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/about")}
              >
               <i class="ri-information-2-line"></i> About us
              </li>
              <li
                className={`cursor-pointer hover:text-theme-blue ${
                  router.pathname === "/contact-us"
                    ? "text-theme-blue font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/contact-us")}
              >
              <i class="ri-customer-service-line"></i> Contact Us
              </li>
              <li
                className={`cursor-pointer hover:text-theme-blue ${
                  router.pathname === "/wishlist"
                    ? "text-theme-blue font-semibold"
                    : ""
                }`}
                onClick={() => navigateTo("/wishlist")}
              >
                <i class="ri-heart-line"></i> Wishlist
              </li>
            </ul>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="bg-white text-black flex items-center justify-around p-4 py-6 shadow-md">
      <Link href="/">
        {/* Logo */}
        <div className="flex justify-center items-center relative w-28 h-10">
          {/* Main logo */}
          <Image
            src="/images/logo/logo.png"
            alt="Logo"
            width={500}
            height={500}
            className="absolute w-28"
          />
          {/* Smaller logo */}
          <Image
            src="/images/logo/logo2.png"
            alt="Logo 2"
            width={500}
            height={500}
            className="absolute left-1 top-4 w-[15px] animate-pulse"
          />
        </div>
      </Link>
      {/* Navigation Links */}
      <div className="flex items-center space-x-14">
        <div
          className={`cursor-pointer hover:text-theme-blue ${
            router.pathname === "/" ? "text-theme-blue font-semibold" : ""
          }`}
          onClick={() => navigateTo("/")}
        >
          Home
        </div>
        <div
          className={`cursor-pointer hover:text-theme-blue ${
            router.pathname === "/shop" ? "text-theme-blue font-semibold" : ""
          }`}
          onClick={() => navigateTo("/shop")}
        >
          Shop
        </div>
        <div className="">
          <CategoryDropdown />
        </div>
        <div
          className={`cursor-pointer hover:text-theme-blue ${
            router.pathname === "/about" ? "text-theme-blue font-semibold" : ""
          }`}
          onClick={() => navigateTo("/about")}
        >
          About
        </div>
        <div
          className={`cursor-pointer hover:text-theme-blue ${
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
        <i
          className="ri-search-line text-2xl cursor-pointer hover:text-black"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        ></i>
        <i
          className="ri-user-line text-2xl cursor-pointer hover:text-black"
          onClick={() =>
            user ? navigateTo("/auth/dashboard") : navigateTo("/auth/login")
          }
        ></i>
        <i
          className="ri-heart-line text-2xl cursor-pointer hover:text-black"
          onClick={() => dispatch(toggleWishlistSidebar())}
        ></i>
        <div className="relative">
          <Link href="/cart">
            <i className="ri-shopping-bag-line text-2xl cursor-pointer hover:text-black"></i>
          </Link>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Search */}
      {isSearchOpen && (
        <Search onClose={() => setIsSearchOpen(false)} isMobile={false} />
      )}
    </nav>
  );
}

export default Navbar;
