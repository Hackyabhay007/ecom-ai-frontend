import ShopArea from "@/component/products/Shop-area";
import React, { useState, useEffect } from "react";
import Loader from "@/component/loader/Loader";
import { useRouter } from "next/router";

function Shop() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate a loading delay for the ShopArea component
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Separate condition: Check if 'size' exists in the query
      if (!router.query.size) {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query, // Preserve existing query parameters
            size: "M", // Add 'size' parameter if not present
          },
        });
      }
    }, 1000); // Adjust time as needed (1 second in this case)

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [router]);

  return (
    <>
      {isLoading ? <Loader /> : <ShopArea />}
    </>
  );
}

export default Shop;

