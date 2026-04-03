/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enables toggling dark mode via the "dark" class on the <html> tag
  darkMode: 'class', 
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  
  theme: {
    extend: {
      // You can add custom MakeMyTrip colors here later if you want
      colors: {
        brand: {
          light: '#008cff',
          dark: '#0056b3',
        }
      }
    },
  },
  
  plugins: [],
}