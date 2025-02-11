// src/component/policy/Policy.jsx

import React from "react";
import PolicyBreadCrumb from "./PolicyBreadCrumb";

const Policy = ({ title, content }) => (
  <div className="min-h-screen bg-gray-50 ">
    <PolicyBreadCrumb title={title} />
    
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white shadow-sm rounded-lg my-8">
      {/* <h1 className="text-3xl font-semibold text-gray-900 mb-6 pb-4 border-b">{title}</h1>
       */}
      <div 
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-600 policy-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <style jsx global>{`
        .policy-container {
          margin-bottom: 2rem;
        }
        .last-updated {
          color: #666;
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }
        .policy-section {
          margin-bottom: 2.5rem;
        }
        .policy-section h3 {
          color: #1a1a1a;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f3f4f6;
        }
        .policy-section ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 1rem 0;
        }
        .policy-section ul li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        .policy-section p {
          margin: 1rem 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  </div>
);

export default Policy;
