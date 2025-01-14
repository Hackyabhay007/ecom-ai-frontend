"use client"; // include with Next.js 13+

import { createContext, useContext, useEffect, useState } from "react";

const RegionContext = createContext(null);

const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState();

  useEffect(() => {
    if (region) {
      // Set its ID in the local storage in case it changed
      localStorage.setItem("region_id", region.id);
      return;
    }

    const regionId = localStorage.getItem("region_id");
    if (!regionId) {
      // Retrieve regions and select the first one
      fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/regions`, {
        credentials: "include",
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
        },
      })
        .then((res) => res.json())
        .then(({ regions }) => {
          setRegion(regions[0]);
        });
    } else {
      // Retrieve selected region
      fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/regions/${regionId}`, {
        credentials: "include",
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
        },
      })
        .then((res) => res.json())
        .then(({ region: dataRegion }) => {
          setRegion(dataRegion);
        });
    }
  }, [region]);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

const useRegion = () => {
  const context = useContext(RegionContext);

  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }

  return context;
};

export { RegionProvider, useRegion };
