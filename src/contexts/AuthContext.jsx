import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import { useCrypto } from "./CryptoContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {encrypt , decrypt} = useCrypto()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For handling loading state
  const router = useRouter();

  // Function to fetch user data
  const fetchUserData = async (token) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me`,
        {}, // Send an empty body if your API doesn't require one
        {
          headers: {
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.customer)
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  // Check for token on initial render
  useEffect(() => {
    const token = Cookies.get("_medusa_jwt");


    if (token) {
      fetchUserData(decrypt(token)); // Fetch user data if token is present
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  // Login function




  // Logout function
  const logout = () => {
    Cookies.remove("_medusa_jwt"); // Remove token from cookies
    setUser(null); // Clear user data
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user,  logout, loading , fetchUserData }}>
      {!loading && children} {/* Ensure children are rendered only after loading */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
