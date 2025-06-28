/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
         colors: {
        // Custom colors
        'dark-purple': '#8e7ab5', // Example: Blue-500 as primary
        'secondary': '#10b981', // Example: Emerald-500 as secondary
        'custom-blue': {
          100: '#dbeafe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}