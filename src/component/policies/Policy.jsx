// src/component/policy/Policy.jsx

import React from "react";
import PolicyBreadCrumb from "./PolicyBreadCrumb";

const Policy = ({ title, content }) => (
  <div>
    {/* Breadcrumb */}
    <PolicyBreadCrumb title={title} />

    {/* Policy Content */}
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div
        className="text-sm text-sub-color"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  </div>
);

export default Policy;
