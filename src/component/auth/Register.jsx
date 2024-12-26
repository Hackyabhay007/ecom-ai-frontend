import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUser, setIsUser] = useState(false); // Checkbox state
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault(); // Prevent form submission reload
    register(name, email, password, isUser); // Include isUser in register payload
  };

  return (
    <div className="flex flex-col md:flex-row min-h-fit md:min-h-screen bg-white  pb-16">
      {/* Left Side - Register Form */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="md:text-3xl text-xl font-bold text-[#1F1F1F] mb-6">
          Register
        </h2>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>
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

          {/* Checkbox for Register as User */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="registerAsUser"
              checked={isUser}
              onChange={(e) => setIsUser(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="registerAsUser" className="text-sm text-sub-color">
              Register as user
            </label>
          </div>

          <div className="flex justify-start items-center">
            <button
              type="submit"
              className="bg-black text-sm md:text-md md:font-bold uppercase text-white py-2 px-7 md:px-10 md:py-4 rounded-md md:rounded-xl hover:bg-discount-color transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>

      {/* Divider Line */}
      <div className="hidden sm:flex items-center justify-center w-px">
        <div className="h-80 w-px bg-gray-300"></div>
      </div>

      {/* Right Side - Already User */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h3 className="md:text-4xl text-2xl font-bold text-black mb-4">
          Already User
        </h3>
        <p className="text-sm md:text-base text-sub-color mb-6">
          Welcome back! Sign in to experience your personalized dashboard and
          exclusive benefits. Get amazing offers and insights!
        </p>
        <button
          onClick={() => router.push("/auth/login")}
          className="bg-black w-fit text-sm md:font-bold uppercase py-2 px-5 md:px-10 md:py-4 text-white rounded-md md:rounded-xl hover:bg-discount-color hover:text-cream transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
