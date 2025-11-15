/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './navigation/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff5f',
        secondary: '#0080ff',
        dark: '#1a1a1a',
        darker: '#0d0d0d',
        success: '#55ff00',
        danger: '#ff0000',
        warning: '#ffaa00',
      },
    },
  },
  plugins: [],
};
