/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBlue: "#d9d7d7",
        secondaryBlue: "#8f8b8b",
      },
      fontFamily: {
        main: ["KapsalonPrint"],
        regular: ["Gordita"],
      },
    },
  },
  plugins: [],
};
