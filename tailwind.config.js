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
        "theme-blue": "#153A63", // blue-950
        "button-color": "#1e3a8a", // blue-950
        "sub-color": "#6E6E6E", // gray-800
        "error-color": "#f87171", // red-400
        "light-BG":"#F9F6F1",
        "cream":"#1F1F1F",
        "discount-color":"#D2EF9A",
        'custom-gradient': {
          light: '#6a11cb', // Starting color
          dark: '#2575fc',  // Ending color
        },
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, #6a11cb, #2575fc)',
      },
      animation: {
        "scroll-left-gallery": "scroll-left-gallery 10s linear infinite",
        "scroll-left": "scroll-left 15s linear infinite",
        "scroll-up": "scroll-up 15s linear infinite",
        "scroll-down": "scroll-down 15s linear infinite",
        "scroll-up-gallery": "scroll-up-gallery 10s linear infinite",
        slideInLeft: 'slideInLeft 0.3s ease-in-out',
        slideInRight: 'slideInRight 0.3s ease-in-out',
        "progress-bar": "progress-bar 2s linear",
        'scale-up': 'scale-up 0.3s ease-out',
        dropdown: "dropdown 0.2s ease-in-out",
        "dropdown-out": "dropdown-out 0.2s ease-in-out",
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-left-gallery": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
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
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        "progress-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        dropdown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "dropdown-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-10px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
