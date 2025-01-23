import Cookies from "js-cookie";
import crypto from "crypto";



// Generate a random IV
const generateIV = () => crypto.randomBytes(16);

const secretKey =process.env.NEXT_PUBLIC_REVALIDATE_SECRET

// Function to encrypt data
const encrypt = (data, key) => {
  if(secretKey){
    console.error("seceret is not present")
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(secretKey).digest(),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

// Function to decrypt data
const decrypt = (encryptedData, key) => {
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


// Securely store the token in cookies
export const setAuthToken = async (token , secretKey) => {
  const encryptedToken = encrypt(token , secretKey);

  console.log(encryptedToken)

  Cookies.set("_medusa_jwt", encryptedToken, {
    // maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  console.log("Token stored securely");
};

// Retrieve and decrypt token from cookies
export const getAuthHeaders = async () => {
  const encryptedToken = Cookies.get("_medusa_jwt");

  if (!encryptedToken) {
    return {};
  }

  try {
    const token = decrypt(encryptedToken);
    return { authorization: `Bearer ${token}` };
  } catch (error) {
    console.error("Error decrypting token:", error);
    return {};
  }
};

// Remove the auth token securely
export const removeAuthToken = async () => {
  Cookies.remove("_medusa_jwt", {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};


// Function to set the cart ID securely in cookies
export const setCartId = async (cartId , secretKey) => {
  const data = JSON.stringify({ cartId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 }); // 7 days expiration
  const encryptedCartId = encrypt(data , secretKey);

  Cookies.set("_medusa_cart_id", encryptedCartId, {
    // maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  console.log("Cart ID stored securely in cookies");
};

// Function to retrieve the cart ID securely from cookies
export const getCartId = async (secretKey) => {
  const encryptedCartId = Cookies.get("_medusa_cart_id");

  if (!encryptedCartId) {
    return null;
  }

  try {
    const { cartId, expiresAt } = JSON.parse(decrypt(encryptedCartId , secretKey));

    if (Date.now() > expiresAt) {
      await removeCartId();
      return null;
    }

    return cartId;
  } catch (error) {
    console.error("Error decrypting cart ID:", error);
    return null;
  }
};

// Function to remove the cart ID securely from cookies
export const removeCartId = async () => {
  Cookies.remove("_medusa_cart_id", {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  

  console.log("Cart ID removed from cookies");
};


// Get cache tag securely
export const getCacheTag = async (tag) => {
  try {
    const cacheId = localStorage.getItem("_medusa_cache_id");

    if (!cacheId) {
      return "";
    }

    return `${tag}-${cacheId}`;
  } catch (error) {
    return "";
  }
};

// Get cache options securely
export const getCacheOptions = async (tag) => {
  if (typeof window === "undefined") {
    return {};
  }

  const cacheTag = await getCacheTag(tag);

  if (!cacheTag) {
    return {};
  }

  return { tags: [`${cacheTag}`] };
};
