/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'neo-white': '#FFFFFF',
        'neo-black': '#000000',
        'neo-yellow': '#FFE800',
        'neo-pink': '#FF90E8',
        'neo-blue': '#00F0FF',
        'neo-green': '#00FF94',
      },
      borderRadius: {
        'base': '8px',
      },
      boxShadow: {
        'neo': '4px 4px 0px rgba(0,0,0,1)',
        'neo-active': '0px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
