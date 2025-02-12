"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";
import { getCookie } from "utils/cookieUtils";

const Register = () => {
  const [firstName, setFirstname] = useState("")
  const [lastName, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [checkpassword, setCheckpassword] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()
  // const { token, isLoading } = useSelector(state => state.customer)
  const {error, loading} = useSelector(state => state.auth)
  const isLoading = false;
  const token = "";

  useEffect(()=>{

  }, [error])

  useEffect(() => {
    const cookie = getCookie("auth_token");
    
    if (cookie) {
      // console.log("User is already Logged Now");
      // router.push("/auth/dashboard");
    }
  }, [router])

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser({
        firstName, 
        lastName, 
        email, 
        phone, 
        password
      })).unwrap();

      // If registration is successful (no error was thrown)
      if (result === undefined) { // Since our registerUser returns undefined on success
        // Show success message (optional)
        // alert("Registration successful! Please login with your credentials.");
        // Redirect to login page
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Registration failed", error);
      // Error handling is already done in the slice
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-fit md:min-h-screen bg-white pb-16">
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="md:text-3xl text-xl font-bold text-[#1F1F1F] mb-6">
          Register
        </h2>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="flex w-full gap-2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstname(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastname(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>
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
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="border p-3 rounded-xl w-full"
              required
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              type={checkpassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border p-3 rounded-xl w-full"
              autoComplete="off"
              required
            />
            <input
              className="size-[20px]"
              onChange={() => setCheckpassword(prev => !prev)}
              type="checkbox"
              title="see password"
            />
          </div>

          <div className="flex justify-start items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-sm md:text-md md:font-bold uppercase text-white py-2 px-7 md:px-10 md:py-4 rounded-md md:rounded-xl hover:bg-discount-color transition duration-300"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>

      <div className="hidden sm:flex items-center justify-center w-px">
        <div className="h-80 w-px bg-gray-300"></div>
      </div>

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
  )
}

export default Register
