export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'portrait-mobile': { 'raw': '(max-width: 480px) and (orientation: portrait)' },
        'landscape-mobile': { 'raw': '(min-width: 481px) and (max-width: 768px) and (orientation: landscape)' },
        'desktop': { 'raw': '(min-width: 769px)' },
      },
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
};