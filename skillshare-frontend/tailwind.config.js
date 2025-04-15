/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#9043C7',
          secondary: '#999999',
          button: '#004FE0',
          'button-dark': '#003bb3',
        },
      },
    },
    plugins: [],
  }
  