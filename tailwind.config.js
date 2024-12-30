/* eslint-env node */
module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      
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