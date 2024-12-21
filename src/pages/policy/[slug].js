// src/pages/policy/[slug].js

import React from "react";
import Policy from "@/component/policies/Policy";
import { policiesData } from "@/component/policies/policies-data";
import { useRouter } from "next/router";
import Navbar from "@/component/header/Navbar";
import Footer from "@/component/footer/Footer";

const PolicyPage = () => {
  const { slug } = useRouter().query;

  // Retrieve policy data based on the slug
  const policy = policiesData[slug];

  // If no matching policy is found, return a 404-like message
  if (!policy) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Policy Not Found</h1>
          <p className="text-sm text-sub-color">
            The policy you are looking for does not exist.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  // Render the Policy component
  return( <><Navbar/>
  <Policy title={policy.title} content={policy.content} />
  <Footer/>
  </>);
};

export default PolicyPage;
