import React from "react";
import Link from "next/link";

const ProductViewBreadcrumb = ({ categories }) => {
  const firstCategory = categories?.[0] || "Category";

  return (
    <div className="text-xs uppercase mb-4">
      <nav className="flex items-center gap-2">
        <Link href="/shop" className="text-theme-blue hover:underline">
          Shop
        </Link>
        <span>/</span>
        <Link href="/shop" className="text-theme-blue hover:underline">
          Explore
        </Link>
        <span>/</span>
        <span className="text-theme-blue">{firstCategory}</span>
      </nav>
    </div>
  );
};

export default ProductViewBreadcrumb;
