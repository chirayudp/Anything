/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          gold: '#f59e0b',
          emerald: '#10b981',
          crimson: '#ef4444',
          sky: '#0284c7',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'monospace', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
