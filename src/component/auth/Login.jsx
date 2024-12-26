import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For displaying error messages
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset error message

    // Dummy login logic
    if (email === "abc@gmail.com" && password === "1234") {
      await login(email, password); // Proceed with login from context
    } else {
      setError("Invalid email or password."); // Set error message
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-fit md:min-h-screen bg-white">
      {/* Left Side - Login Form */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="md:text-3xl text-xl font-bold text-[#1F1F1F] mb-6">Login</h2>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-500 mb-4">
            {error}
          </p>
        )}

        <form
          className="space-y-6"
          onSubmit={handleLogin} // Use form submission handler
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 mr-2 accent-white"
            />
            <label htmlFor="rememberMe" className="text-sm text-sub-color">
              Remember Me
            </label>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-black text-sm md:text-md md:font-bold uppercase text-white py-2 px-7 md:px-10 md:py-4 rounded-md md:rounded-xl hover:bg-discount-color hover:text-cream transition duration-300"
            >
              Login
            </button>
            {/* Forgot Password */}
            <button
              type="button"
              onClick={() => router.push("/auth/forget-password")}
              className="text-black text-sm md:text-lg font-bold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>

      <div className="hidden sm:flex items-center justify-center w-px">
        <div className="h-80 w-px bg-gray-300"></div>
      </div>

      {/* Right Side - New Customer */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center border-light-BG">
        <h3 className="md:text-4xl text-2xl font-bold text-black mb-4">New Customer</h3>
        <p className="text-normal text-wrap text-sub-color mb-6">
          Be part of our growing family and enjoy exclusive benefits. Join us
          today and unlock a world of exclusive benefits and offers tailored
          just for you.
        </p>
        <button
          onClick={() => router.push("/auth/register")}
          className="bg-black w-fit text-sm md:font-bold uppercase py-2 px-5 md:px-10 md:py-4 text-white rounded-md md:rounded-xl hover:bg-discount-color hover:text-cream transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
