import React from "react";
import { useRouter } from "next/router";

const BreadcrumbAuth = () => {
  const router = useRouter();

  // Extract the path and split into segments
  const pathSegments = router.pathname.split("/").filter((segment) => segment);

  // Get the last segment for the page name
  const currentPage = pathSegments[pathSegments.length - 1];

  return (
    <div className="md:py-14 pt-28 pb-11 bg-light-BG">
      {/* Dynamic Heading */}
      <h1 className="md:text-4xl text-3xl font-bold text-center text-[#1F1F1F] mb-4">
        {currentPage ? currentPage.replace("-", " ").toUpperCase() : "Home"}
      </h1>

      {/* Breadcrumb Navigation */}
      <div className="py-1">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-sub-color flex justify-center gap-0">
            <span className="text-[#1F1F1F]">Auth</span>
            {currentPage && (
              <>
                <i className="ri-arrow-right-s-line"></i>
                <span className="text-sub-color">{currentPage.replace("-", " ")}</span>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbAuth;
