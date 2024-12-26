import React, { useState } from "react";
import { useRouter } from "next/router";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = () => {
    // Simulate a password reset process
    alert("Password reset instructions sent to your email.");
    router.push("/auth/register"); // Redirect to register after reset
  };

  return (
    <div className="flex flex-col md:flex-row min-h-fit md:min-h-screen bg-white">
      {/* Left Side - Reset Password Form */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="md:text-3xl text-xl font-bold text-[#1F1F1F] mb-2">
          Reset Your Password
        </h2>
        <p className="capitalize mb-6 text-sm md:text-xl text-cream">
          We will send you an email to reset your password.
        </p>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent page reload
            handleReset();
          }}
        >
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>
          <div className="flex justify-start items-center">
            <button
              type="submit"
              className="bg-black text-sm md:text-md md:font-bold uppercase text-white py-2 px-7 md:px-10 md:py-4 rounded-md md:rounded-xl hover:text-cream hover:bg-discount-color transition duration-300"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>

      {/* Divider Line */}
      <div className="hidden sm:flex items-center justify-center w-px">
        <div className="h-80 w-px bg-gray-300"></div>
      </div>

      {/* Right Side - Register as New User */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h3 className="md:text-4xl text-2xl font-bold text-black mb-4">
          Register
        </h3>
        <p className="text-sm md:text-base text-sub-color mb-6">
          Be part of our growing family! Join us today to unlock exclusive
          benefits, personalized experiences, and amazing offers tailored just
          for you.
        </p>
        <button
          onClick={() => router.push("/auth/register")}
          className="bg-black w-fit text-sm md:font-bold uppercase py-2 px-5 md:px-10 md:py-4 text-white rounded-md md:rounded-xl hover:text-cream hover:bg-discount-color transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
