import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <div className="bg-gray-100 py-10 px-5 md:px-24">
      {/* Desktop Flex, Mobile Stack */}
      <div className="flex flex-col md:flex-row justify-center gap-8 md:space-x-0">
        {/* Column 1: Shop */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <h3 className="text-xl font-bold mb-2">Shop</h3>
          <ul className="text-sub-color space-y-2">
            <li><Link href="/men">Men</Link></li>
            <li><Link href="/women">Women</Link></li>
            <li><Link href="/kids">Kids</Link></li>
          </ul>
        </div>

        {/* Divider for Desktop */}
        <hr className="hidden md:block md:h-auto md:w-px md:bg-gray-300" />

        {/* Column 2: Policy */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <h3 className="text-xl font-bold mb-2">Policy</h3>
          <ul className="text-sub-color space-y-2">
            <li><Link href="/policy/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/policy/shipping-policy">Shipping Policy</Link></li>
            <li><Link href="/policy/cookies-policy">Cookies Policy</Link></li>
            <li><Link href="/policy/term-condition">Terms and Conditions</Link></li>
            <li><Link href="/track-order">Track order</Link></li>
          </ul>
        </div>

        {/* Divider for Desktop */}
        <hr className="hidden md:block md:h-auto md:w-px md:bg-gray-300" />

        {/* Column 3: Contact With Us */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <h3 className="text-xl font-bold">Contact With Us</h3>
          <div className="flex space-x-4 text-xl">
            <Link
              href="#"
              className="hover:text-sub-color transition rounded-lg border border-black p-2 px-3 bg-none"
              aria-label="Facebook"
            >
              <i className="ri-facebook-fill"></i>
            </Link>
            <Link
              href="#"
              className="hover:text-sub-color transition rounded-lg border border-black p-2 px-3 bg-none"
              aria-label="Twitter"
            >
              <i className="ri-twitter-x-line"></i>
            </Link>
            <Link
              href="#"
              className="hover:text-sub-color transition rounded-lg border border-black p-2 px-3 bg-none"
              aria-label="Instagram"
            >
              <i className="ri-instagram-line"></i>
            </Link>
            <Link
              href="#"
              className="hover:text-sub-color transition rounded-lg border border-black p-2 px-3 bg-none"
              aria-label="WhatsApp"
            >
              <i className="ri-whatsapp-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
