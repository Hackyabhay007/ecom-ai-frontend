import React, { createContext, useState, useContext } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (email, password) => {
    if (email === "abc@gmail.com" && password === "1234") {
      setUser({ name: "John Doe", email });
      router.push("/auth/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  const register = (name, email, password) => {
    // Dummy registration logic
    setUser({ name, email });
    router.push("/auth/dashboard");
  };

  const logout = () => {
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
