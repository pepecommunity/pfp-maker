/* eslint-env node */
module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'portrait-mobile': { 'raw': '(max-width: 480px)' },
        'landscape-mobile': { 'raw': '(min-width: 481px) and (max-width: 768px)' },
        'desktop': { 'raw': '(min-width: 769px)' },
      },
      fontFamily: {
        main: ["True Gore"],
        regular: ["True Gore"], // Changed to True Gore
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};