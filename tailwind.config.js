/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "theme-blue": "#153A63", // blue-950
        "button-color": "#1e3a8a", // blue-950
        "sub-color": "#6E6E6E", // gray-800
        "error-color": "#f87171", // red-400
      },
      animation: {
        "scroll-left": "scroll-left 15s linear infinite",
        "scroll-up": "scroll-up 15s linear infinite",
        "scroll-up-gallery": "scroll-up-gallery 2s linear infinite",
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
      },
    },
  },
  plugins: [],
};
