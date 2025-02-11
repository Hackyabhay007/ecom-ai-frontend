import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";

function Footer() {
  const { items } = useSelector((state) => state.cart);
  const totalItems = items.length;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the screen size is mobile
    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobileView();

    // Add event listener to handle screen resizing
    window.addEventListener("resize", checkMobileView);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-lg z-50">
          <div className="flex justify-around items-center py-3 text-lg">
            <Link href="/" className="flex flex-col items-center">
              <i className="ri-home-line text-xl"></i>
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/shop" className="flex flex-col items-center text-gray-600 hover:text-black transition-colors">
              <i className="ri-shopping-bag-line text-xl"></i>
              <span className="text-xs mt-1">Shop</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-black transition-colors">
              <i className="ri-heart-line text-xl"></i>
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
            <Link href="/cart" className="flex relative flex-col items-center text-gray-600 hover:text-black transition-colors">
              <i className="ri-shopping-cart-line text-xl"></i>
              <span className="text-xs mt-1">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      ) : (
        <footer className="bg-gray-100">
          <div className="container mx-auto px-4 py-6">
            {/* Logo Section - Reduced spacing */}
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <Image
                  src="/images/logo/logo.png"
                  alt="Company Logo"
                  width={150}
                  height={50}
                  className="h-auto mx-auto"
                />
                <p className="text-sub-color mt-2 max-w-md mx-auto text-sm">
                  Your trusted destination for quality products and exceptional shopping experience.
                </p>
              </div>
            </div>

            {/* Main Footer Content - Adjusted spacing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
              {/* Shop Column */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl font-bold mb-4">Shop</h3>
                <ul className="text-sub-color space-y-3">
                  <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
                  <li><Link href="/contact-us" className="hover:text-black transition-colors">Contact us</Link></li>
                </ul>
              </div>

              {/* Policy Column */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl font-bold mb-4">Policy</h3>
                <ul className="text-sub-color space-y-3">
                  <li><Link href="/policy/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/policy/shipping-policy" className="hover:text-black transition-colors">Shipping Policy</Link></li>
                  <li><Link href="/policy/cookies-policy" className="hover:text-black transition-colors">Cookies Policy</Link></li>
                  <li><Link href="/policy/term-condition" className="hover:text-black transition-colors">Terms and Conditions</Link></li>
                </ul>
              </div>

              {/* Connect Column */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <Link href="#" className="border border-black p-2 px-3 hover:bg-black hover:text-white transition-all rounded-lg">
                    <i className="ri-facebook-fill text-xl"></i>
                  </Link>
                  <Link href="#" className="border border-black p-2 px-3 hover:bg-black hover:text-white transition-all rounded-lg">
                    <i className="ri-twitter-x-line text-xl"></i>
                  </Link>
                  <Link href="#" className="border border-black p-2 px-3 hover:bg-black hover:text-white transition-all rounded-lg">
                    <i className="ri-instagram-line text-xl"></i>
                  </Link>
                  <Link href="#" className="border border-black p-2 px-3 hover:bg-black hover:text-white transition-all rounded-lg">
                    <i className="ri-whatsapp-line text-xl"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Copyright Section - Adjusted spacing */}
            <div className="border-t border-gray-300 pt-4 mt-4 text-center">
              <p className="text-sub-color text-sm">
                © {new Date().getFullYear()} The Majestic Peacock. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default Footer;
