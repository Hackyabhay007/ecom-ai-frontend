import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from "@/../redux/slices/authSlice";





const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errorValue, setErrorValue] = useState(""); // For displaying error messages
  const { login } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const error = useSelector((state) => state?.auth?.error);
  const user = useSelector((state) => state.auth?.user);
  const loading = useSelector((state) => state.auth?.loading);


  useEffect(() => {
    if (user) {
      console.log("This is the user of the Login Page", user);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // if (error) setErrorValue(""); // Reset error message


    // Dummy login logic
    if (email && password) {
      const credentials = { email, password };
      // console.log("This is the credentials of the Login Page", credentials);
      dispatch(loginAdmin(credentials)); // Dispatch login action
      // await login(email, password); // Proceed with login from context
    } 
    // else {
    //   setErrorValue("Invalid email or password."); // Set error message
    // }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-fit md:min-h-screen bg-white">
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="md:text-3xl text-xl font-bold text-[#1F1F1F] mb-6">
          Login
        </h2>

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>

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
              disabled={isLoading}
              className="bg-black text-sm md:text-md md:font-bold uppercase text-white py-2 px-7 md:px-10 md:py-4 rounded-md md:rounded-xl hover:bg-discount-color hover:text-cream transition duration-300"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
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

      <div className="md:w-1/2 p-8 flex flex-col justify-center border-light-BG">
        <h3 className="md:text-4xl text-2xl font-bold text-black mb-4">
          New Customer
        </h3>
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
  )
}

export default Login
