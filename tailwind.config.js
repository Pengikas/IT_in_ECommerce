/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3A",
        accent: "#2D9CDB",
      },
    },
  },
  plugins: [],
};