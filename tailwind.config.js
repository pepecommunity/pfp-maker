export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'portrait-mobile': { 'raw': '(max-width: 480px) and (orientation: portrait)' },
        'landscape-mobile': { 'raw': '(min-width: 481px) and (max-width: 768px) and (orientation: landscape)' },
        'desktop': { 'raw': '(min-width: 769px)' },
      },
      fontFamily: {
        main: ["TrueGore-Regular"],
        regular: ["Gordita"],
      },
    },
  },
  plugins: [],
};