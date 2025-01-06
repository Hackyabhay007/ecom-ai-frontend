import ShopArea from "@/component/products/Shop-area";
import React, { useState, useEffect } from "react";
// import Loader from "@/component/loader/Loader";
import Loader from "@/component/loader/Loader_shop";
function Shop() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay for the ShopArea component
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust time as needed (1 second in this case)

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  return (
    <>
      {isLoading ? <Loader /> : <ShopArea />}
    </>
  );
}

export default Shop;
