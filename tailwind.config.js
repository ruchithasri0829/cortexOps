/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          900: '#0f172a', // Deep slate/black background
          800: '#1e293b', // Cards/Panels
          700: '#334155', // Borders/Hover
          accent: '#06b6d4', // Cyan accent
          alert: '#ef4444', // Red critical
          warning: '#f59e0b', // Amber watch
          success: '#10b981', // Green normal
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
