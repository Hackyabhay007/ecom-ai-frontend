import React, { createContext, useContext } from "react";
import crypto from "crypto";

// Environment variable for secret key
const secretKey = process.env.NEXT_PUBLIC_REVALIDATE_SECRET; // Make sure this is securely set in your environment

// Utility functions for encryption and decryption
const generateIV = () => crypto.randomBytes(16);

const encrypt = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      crypto.createHash("sha256").update(key).digest(),
      iv
    );
    const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  };
  

const decrypt = (encryptedData) => {
  const [ivHex, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(secretKey).digest(),
    iv
  );
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
};

// Create a context
const CryptoContext = createContext();

// Provider component
export const CryptoProvider = ({ children }) => {
  return (
    <CryptoContext.Provider value={{ encrypt, decrypt }}>
      {children}
    </CryptoContext.Provider>
  );
};

// Custom hook for using encryption and decryption
export const useCrypto = () => {
  const context = useContext(CryptoContext);

  if (!context) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }

  return context;
};
