/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Instrument Sans", "sans-serif"],
      },
      colors: {
        "theme-blue": "#153A63",
        "button-color": "#1e3a8a",
        "sub-color": "#6E6E6E",
        "error-color": "#f87171",
        "light-BG": "#F9F6F1",
        "cream": "#1F1F1F",
        "discount-color": "#D2EF9A",
        "custom-gradient": {
          light: "#6a11cb",
          dark: "#2575fc",
        },
      },
      backgroundImage: {
        "gradient-custom": "linear-gradient(to right, #6a11cb, #2575fc)",
      },
      animation: {
        "scroll-left-gallery": "scroll-left-gallery 2s linear infinite",
        "scroll-left": "scroll-left 15s linear infinite",
        "scroll-up": "scroll-up 15s linear infinite",
        "scroll-down": "scroll-down 15s linear infinite",
        "scroll-up-gallery": "scroll-up-gallery 2s linear infinite",
        slideInLeft: "slideInLeft 0.3s ease-in-out",
        slideInRight: "slideInRight 0.3s ease-in-out",
        handleInfoSlideInRight: "handleInfoSlideInRight 0.5s ease-in-out forwards",
        handleInfoSlideOutLeft: "handleInfoSlideOutLeft 0.5s ease-in-out forwards",
        handleInfoSlideInBottom: "handleInfoSlideInBottom 0.5s ease-in-out forwards",
        handleInfoSlideOutTop: "handleInfoSlideOutTop 0.5s ease-in-out forwards",
        "progress-bar": "progress-bar 2s linear",
        "scale-up": "scale-up 0.3s ease-out",
        dropdown: "dropdown 0.2s ease-in-out",
        "dropdown-out": "dropdown-out 0.2s ease-in-out",
        "fade-in-out": "fade-in-out 2s infinite",
        popup: 'popup 0.3s ease-out',
        fade1: 'fade 4s infinite',
        fade2: 'fade 4s infinite 2s',
        'line-loader': 'line-loader 1.5s ease-in-out infinite',
        // New animations
        'menu-item-hover': 'menu-item-hover 0.2s ease-out',
        'menu-item-out': 'menu-item-out 0.2s ease-in',
        'nav-dropdown-in': 'nav-dropdown-in 0.3s ease-out',
        'nav-dropdown-out': 'nav-dropdown-out 0.3s ease-in',
        'underline-expand': 'underline-expand 0.3s ease-out',
        'underline-collapse': 'underline-collapse 0.3s ease-in',
        'arrow-rotate': 'arrow-rotate 0.2s ease-in-out',
        'scale-fade-in': 'scale-fade-in 0.3s ease-out',
        'scale-fade-out': 'scale-fade-out 0.3s ease-in',
      },
      keyframes: {
        fade: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        "scroll-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-left-gallery": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-5%)" },
        },
        "scroll-up": {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "scroll-down": {
          "0%": { transform: "translateY(-40%)" },
          "50%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-40%)" },
        },
        "scroll-up-gallery": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-5%)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "progress-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        dropdown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "dropdown-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-10px)", opacity: "0" },
        },
        "fade-in-out": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        popup: {
          "0%": { opacity: 0, transform: "scale(0.8)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        slideInBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        handleInfoSlideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        handleInfoSlideOutLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        handleInfoSlideInBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        handleInfoSlideOutTop: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        'line-loader': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        },
        // New keyframes
        'menu-item-hover': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-2px) scale(1.05)' }
        },
        'menu-item-out': {
          '0%': { transform: 'translateY(-2px) scale(1.05)' },
          '100%': { transform: 'translateY(0) scale(1)' }
        },
        'nav-dropdown-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)',
            pointerEvents: 'none'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
            pointerEvents: 'auto'
          }
        },
        'nav-dropdown-out': {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)',
            pointerEvents: 'auto'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(-20px)',
            pointerEvents: 'none'
          }
        },
        'underline-expand': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        },
        'underline-collapse': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' }
        },
        'arrow-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(90deg)' }
        },
        'scale-fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'scale-fade-out': {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          }
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};