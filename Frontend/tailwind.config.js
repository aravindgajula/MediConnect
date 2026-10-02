/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#002366"
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill,minmax(223px,1fr))'
      }
    },
  },
  plugins: [],
}