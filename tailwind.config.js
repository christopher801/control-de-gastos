/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        ink: '#0A0A0A',
        'ink/60': 'rgba(10,10,10,0.6)',
        'ink/20': 'rgba(10,10,10,0.12)',
        'ink/8': 'rgba(10,10,10,0.06)',
        paper: '#F5F4F0',
        surface: '#FAFAF8',
        emerald: '#00875A',
        'emerald-soft': '#E6F5EF',
        crimson: '#C0392B',
        'crimson-soft': '#FDECEA',
        gold: '#C8A96A',
      },
      borderRadius: {
        'xl2': '24px',
        'xl3': '32px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'md': '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        'lg': '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}