"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import { toggleWishlistSidebar } from "@/redux/slices/wishSlice"
import Search from "../search/Search"
import NavCategory from "./NavCategory"
import { retrieveCustomer } from "@/redux/slices/authSlice"
import { retrieveCart } from "@/lib/data/cart"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/CartContext"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const { cart } = useCart();

  const router = useRouter()
  const dispatch = useDispatch()

  const { currentCustomer } = useSelector(state => state.customer)

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  console.log(cart , "cart from navbar")

  const menuItemVariants = {
    hidden: { 
      opacity: 0,
      y: -5 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      y: -2,
      scale: 1.05,
      color: "#153A63", // theme-blue color
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  }

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  }

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.3
      }
    },
    open: {
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto"
  }, [isMenuOpen])

  useEffect(() => {
    dispatch(retrieveCustomer());
  }, [dispatch])

  const navigateTo = path => {
    setIsMenuOpen(false)
    setActiveLink(path)
    router.push(path)
  }

  const renderUserSection = () => {
    const userText = currentCustomer
      ? `Hello, ${currentCustomer.first_name || "User"}`
      : "Sign In / Register"

    const userPath = currentCustomer ? "/auth/dashboard" : "/auth/login"

    return (
      <motion.li
        variants={menuItemVariants}
        whileHover="hover"
        className="cursor-pointer bg-light-BG hover:text-theme-blue border-b border-gray-400 text-lg p-5"
        onClick={() => navigateTo(userPath)}
      >
        <i className="ri-user-line pr-4"></i> {userText}
      </motion.li>
    )
  }

  const desktopUserSection = () => (
    <motion.i
      variants={iconVariants}
      whileHover="hover"
      whileTap="tap"
      className="ri-user-line text-xl cursor-pointer hover:text-black"
      onClick={() =>
        currentCustomer
          ? navigateTo("/auth/dashboard")
          : navigateTo("/auth/login")
      }
    />
  )

  if (isMobile) {
    return (
      <nav className={`bg-white fixed w-full p-4 shadow-md text-black ${
        isMenuOpen ? "z-50" : "z-40"
      }`}>
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center relative w-28 h-10"
            >
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={500}
                height={500}
                className="absolute w-28 animate-fade1"
              />
              <Image
                src="/images/logo/logo2.png"
                alt="Logo 2"
                width={500}
                height={500}
                className="absolute w-6 animate-fade2"
              />
            </motion.div>
          </Link>

          <div className="flex space-x-4 items-center justify-end">
            <motion.i
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="ri-search-line text-xl cursor-pointer hover:text-black"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
            <motion.i
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className={`text-xl cursor-pointer transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "ri-close-line rotate-180"
                  : "ri-pause-large-line rotate-90"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <Search onClose={() => setIsSearchOpen(false)} isMobile={false} />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-19 right-0 h-screen w-full bg-white shadow-lg z-50"
            >
              <div className="mt-2 py-4 h-full">
                <motion.ul 
                  className="space-y-0"
                  variants={menuItemVariants}
                >
                  {renderUserSection()}
                  <div className="md:hidden w-full">
                    <NavCategory />
                  </div>
                </motion.ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    )
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white text-black flex items-center justify-around p-4 py-6 shadow-md"
    >
      <Link href="/">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center relative w-28 h-10"
        >
          <Image
            src="/images/logo/logo.png"
            alt="Logo"
            width={500}
            height={500}
            className="absolute w-28 animate-fade1"
          />
          <Image
            src="/images/logo/logo2.png"
            alt="Logo 2"
            width={500}
            height={500}
            className="absolute w-6 animate-fade2"
          />
        </motion.div>
      </Link>

      <div className="flex items-center space-x-14">
        {["Home", "Shop"].map((item) => (
          <motion.div
            key={item}
            variants={menuItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`cursor-pointer uppercase text-sm hover:text-theme-blue relative ${
              activeLink === `/${item.toLowerCase()}` ? "text-theme-blue font-semibold" : ""
            }`}
            onClick={() => navigateTo(`${item === "Home" ? "/" : `/${item.toLowerCase()}`}`)}
          >
            {item}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-theme-blue origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: activeLink === `${item === "Home" ? "/" : `/${item.toLowerCase()}`  }` ? 1 : 0 }}
              
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
        <div className="">
          <NavCategory />
        </div>
      </div>

      <div className="flex space-x-4 items-center text-sm font-thin text-theme-blue">
        <motion.i
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
          className="ri-search-line text-xl cursor-pointer hover:text-black"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        />
        {desktopUserSection()}
        <motion.i
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
          className="ri-heart-line text-xl cursor-pointer hover:text-black"
          onClick={() => dispatch(toggleWishlistSidebar())}
        />
        <div className="relative">
          <Link href="/cart">
            <motion.i
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap" 
              className="ri-shopping-bag-line text-xl cursor-pointer hover:text-black"
            />
          </Link>
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute  -top-1 -right-2 bg-[rgb(255,255,255)] text-black border border-theme-blue p-1 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
              >
                <span className="">{totalItems}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <Search onClose={() => setIsSearchOpen(false)} isMobile={false} />
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar