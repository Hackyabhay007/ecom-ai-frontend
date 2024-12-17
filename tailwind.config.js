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
      },
      animation: {
        "scroll-left": "scroll-left 15s linear infinite",
        "scroll-up": "scroll-up 15s linear infinite",
        "scroll-up-gallery": "scroll-up-gallery 2s linear infinite",
        slideInLeft: 'slideInLeft 0.3s ease-in-out',
        slideInRight: 'slideInRight 0.3s ease-in-out',
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-up": {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "scroll-up-gallery": {
          "0%": { transform: "translateY(8%)" },
          "100%": { transform: "translateY(-10%)" },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
