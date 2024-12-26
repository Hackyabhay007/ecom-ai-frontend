import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

function Footer() {
  const { items } = useSelector((state) => state.cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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
        // Mobile Fixed Footer
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50">
          <div className="flex justify-around items-center py-2 text-lg">
            <Link href="/" className="flex flex-col items-center">
              <i className="ri-home-line"></i>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/category" className="flex flex-col items-center">
              <i className="ri-list-unordered"></i>
              <span className="text-xs">Category</span>
            </Link>
            <Link href="/shop" className="flex flex-col items-center">
              <i className="ri-shopping-bag-line"></i>
              <span className="text-xs">Shop</span>
            </Link>
            <Link href="/cart" className="flex relative flex-col items-center">
              <i className="ri-shopping-cart-line"></i>
              <span className="text-xs">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      ) : (
        // Desktop Footer
        <div className="bg-gray-100 py-10 px-5 md:px-24">
          {/* Desktop Flex, Mobile Stack */}
          <div className="flex flex-col md:flex-row justify-center gap-8 md:space-x-0">
            {/* Column 1: Shop */}
            <div className="flex flex-col items-center text-center gap-2 w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-2">Shop</h3>
              <ul className="text-sub-color space-y-2">
                <li>
                  <Link href="/men">Men</Link>
                </li>
                <li>
                  <Link href="/women">Women</Link>
                </li>
                <li>
                  <Link href="/kids">Kids</Link>
                </li>
              </ul>
            </div>

            {/* Divider for Desktop */}
            <hr className="hidden md:block md:h-auto md:w-px md:bg-gray-300" />

            {/* Column 2: Policy */}
            <div className="flex flex-col items-center text-center gap-2 w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-2">Policy</h3>
              <ul className="text-sub-color space-y-2">
                <li>
                  <Link href="/policy/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/policy/shipping-policy">Shipping Policy</Link>
                </li>
                <li>
                  <Link href="/policy/cookies-policy">Cookies Policy</Link>
                </li>
                <li>
                  <Link href="/policy/term-condition">Terms and Conditions</Link>
                </li>
                <li>
                  <Link href="/track-order">Track order</Link>
                </li>
              </ul>
            </div>

            {/* Divider for Desktop */}
            <hr className="hidden md:block md:h-auto md:w-px md:bg-gray-300" />

            {/* Column 3: Contact With Us */}
            <div className="flex flex-col items-center text-center gap-4 w-full md:w-1/3">
              <h3 className="text-xl font-bold">Contact With Us</h3>
              <div className="flex space-x-4 text-xl">
                <Link
                  href="#"
                  className="hover:text-white transition-all rounded-lg border border-black p-2 px-3 hover:bg-black"
                  aria-label="Facebook"
                >
                  <i className="ri-facebook-fill"></i>
                </Link>
                <Link
                  href="#"
                  className="hover:text-white transition-all rounded-lg border border-black p-2 px-3 hover:bg-black"
                  aria-label="Twitter"
                >
                  <i className="ri-twitter-x-line"></i>
                </Link>
                <Link
                  href="#"
                  className="hover:text-white transition-all rounded-lg border border-black p-2 px-3 hover:bg-black"
                  aria-label="Instagram"
                >
                  <i className="ri-instagram-line"></i>
                </Link>
                <Link
                  href="#"
                  className="hover:text-white transition-all rounded-lg border border-black p-2 px-3 hover:bg-black"
                  aria-label="WhatsApp"
                >
                  <i className="ri-whatsapp-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
