import React from "react";
import Link from "next/link";

const AboutBreadCrumb = () => (
  <div className="flex flex-col items-center gap-4 justify-center bg-light-BG py-16 text-sm mb-8">
    <h2 className="text-4xl font-bold">About Us</h2>
    <p>
      <Link href="/" className="text-sub-color">
        Home
      </Link>
      <i className="ri-arrow-right-s-line mx-1"></i>
      About Us
    </p>
  </div>
);

export default AboutBreadCrumb;
