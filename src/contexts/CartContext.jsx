import React, { createContext, useState, useEffect, useContext } from "react";
import { retrieveCart } from "@lib/data/cart";
import { useCrypto } from "./CryptoContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to update both state and localStorage
  const updateCart = (newCartData) => {
    setCart(newCartData);
    localStorage.setItem("_medusa_cart_data", JSON.stringify(newCartData));
  };

  // Fetch cart data from API
  const fetchCart = async (cartId) => {
    try {
      setLoading(true);
      const response = await retrieveCart(cartId);
      updateCart(response); // Use centralized function
      setLoading(false);
    } catch (err) {
      setError("Error retrieving cart");
      setLoading(false);
    }
  };

  // Sync context with local storage on mount and during updates
  useEffect(() => {
    const syncCartFromLocalStorage = () => {
      const localCartData = localStorage.getItem("_medusa_cart_data");

      if (localCartData) {
        const parsedCartData = JSON.parse(localCartData);

        // Only update if the local storage data differs from the current context state
        if (!cart || JSON.stringify(parsedCartData) !== JSON.stringify(cart)) {
          setCart(parsedCartData);
        }
      }
    };

    // Check local storage on mount
    syncCartFromLocalStorage();

    // Set up periodic polling to detect changes
    const interval = setInterval(syncCartFromLocalStorage, 1000); // Check every 1 second

    return () => clearInterval(interval); // Clean up on unmount
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, loading, error, updateCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export { CartProvider, useCart };
