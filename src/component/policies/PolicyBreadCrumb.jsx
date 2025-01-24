// src/component/policy/PolicyBreadCrumb.jsx

import React from "react";
import Link from "next/link";

const PolicyBreadCrumb = ({ title }) => (
  <div className="bg-light-BG py-10 text-center mt-24 md:mt-2">
    <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
    
  </div>
);

export default PolicyBreadCrumb;
