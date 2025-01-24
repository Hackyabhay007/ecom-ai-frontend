// src/pages/policy/[slug].js

import React from "react";
import Policy from "@/component/policies/Policy";
import { policiesData } from "@/component/policies/policies-data";
import { useRouter } from "next/router";
import Navbar from "@/component/header/Navbar";
import Footer from "@/component/footer/Footer";

const PolicyPage = () => {
  const { slug } = useRouter().query;
  const policy = policiesData[slug];

  if (!policy) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Policy Not Found</p>
            <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Return to Homepage
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Policy title={policy.title} content={policy.content} />
      </div>
      <Footer />
    </div>
  );
};

export default PolicyPage;
