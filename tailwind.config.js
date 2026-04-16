/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DA291C", // A strong brand red
        secondary: "#111111", // Near Soft Black
        background: "#FFFFFF", // Clean White
        muted: "#F5F5F5", // Soft gray
        border: "#E5E5E5", // Line border
      }
    },
  },
  plugins: [],
}
