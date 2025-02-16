"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
// Update this import
import {
  toggleWishlistSidebar,
  selectWishlistCount,
  selectWishlistItems
} from "../../../redux/slices/wishlistSlice"
import Search from "../search/Search"
import NavCategory from "./NavCategory"
import { retrieveCustomer } from "@/redux/slices/authSlice"
import { retrieveCart } from "@/lib/data/cart"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/CartContext"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeLink, setActiveLink] = useState("")
  const { cart } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const currentCustomer = "";

  const router = useRouter()
  const dispatch = useDispatch();
  // Add wishlist count selector
  // const wishlistCount = useSelector(selectWishlistCount);

  const {items} = useSelector(state => state.cart);
  const { items: cartItems } = useSelector(state => state.cart);

  const {items: totalItems} = useSelector(state => state.wishlist) || 0;

  useEffect(() => { 
    setCartCount(items.length);
  }, [items]);

  useEffect(() => {
    if (totalItems) {
      setWishlistCount(totalItems.length);
    }
  }, [totalItems]);

  useEffect(() => {
    // Count from Redux cart
    const reduxCartCount = cartItems?.length || 0;
    
    // Count from Cart Context
    const contextCartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    
    // Use whichever is greater (in case one hasn't updated yet)
    setCartItemsCount(Math.max(reduxCartCount, contextCartCount));
  }, [cartItems, cart?.items]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const cartCount = 0;

  // const { currentCustomer } = useSelector(state => state.customer)



  console.log(cart, "cart from navbar")

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

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768)
  //   }
  //   handleResize()
  //   window.addEventListener("resize", handleResize)
  //   return () => window.removeEventListener("resize", handleResize)
  // }, [])

  // useEffect(() => {
  //   document.body.style.overflow = isMenuOpen ? "hidden" : "auto"
  // }, [isMenuOpen])

  // useEffect(() => {
  //   dispatch(retrieveCustomer());
  // }, [dispatch])

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

  // Add handler for wishlist icon click
  const handleWishlistClick = () => {
    dispatch(toggleWishlistSidebar());
  };

  if (isMobile) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-white z-40 shadow-md">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/">
            <div className="relative w-20 h-8">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-4">
            <motion.div className="relative">
              <Link href="/cart">
                <motion.i
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="ri-shopping-bag-line text-xl"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black border border-theme-blue w-5 h-5 text-xs flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </motion.div>

            <motion.i
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="ri-search-line text-xl"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />

            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="text-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white"
            >
              <div className="flex flex-col py-2">
                <Link href="/" className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  Home
                </Link>
                <Link href="/shop" className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  Shop
                </Link>
                <div className="p-4 border-b border-gray-100">
                  <NavCategory />
                </div>
                <div 
                  className="p-4 border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => currentCustomer ? navigateTo("/auth/dashboard") : navigateTo("/auth/login")}
                >
                  <i className="ri-user-line mr-2"></i>
                  {currentCustomer ? `Hello, ${currentCustomer.first_name || "User"}` : "Sign In / Register"}
                </div>
                <div 
                  className="p-4 border-b border-gray-100 hover:bg-gray-50"
                  onClick={handleWishlistClick}
                >
                  <i className="ri-heart-line mr-2"></i>
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-2 bg-white text-black border border-theme-blue px-2 py-1 text-xs rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <Search onClose={() => setIsSearchOpen(false)} isMobile={true} />
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
            className={`cursor-pointer uppercase text-sm hover:text-theme-blue relative ${activeLink === `/${item.toLowerCase()}` ? "text-theme-blue font-semibold" : ""
              }`}
            onClick={() => navigateTo(`${item === "Home" ? "/" : `/${item.toLowerCase()}`}`)}
          >
            {item}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-theme-blue origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: activeLink === `${item === "Home" ? "/" : `/${item.toLowerCase()}`}` ? 1 : 0 }}

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
        {/* Update wishlist icon section */}
        <motion.i
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
          className="ri-heart-line relative text-xl cursor-pointer hover:text-black"
          onClick={handleWishlistClick}
        >
          {/* Optional: Add wishlist count badge */}
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-white text-black border border-theme-blue p-1 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {wishlistCount}
            </span>
          )}
        </motion.i>
        <div className="relative">
          <Link href="/cart">
            <motion.i
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="ri-shopping-bag-line relative text-xl cursor-pointer hover:text-black"
            />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-white text-black border border-theme-blue p-1 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <AnimatePresence>
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute  -top-1 -right-2 bg-[rgb(255,255,255)] text-black border border-theme-blue p-1 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
              >
                <span className="">{wishlistCount}</span>
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