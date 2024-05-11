/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainblue: "#2E73B4",
        textblack: "#303A45",
        green: "#28D3A1",
        lightgrey: "#F3F8FE",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
