/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fossil: {
          50:  '#faf7f0',
          100: '#f0e9d8',
          200: '#dfd0b0',
          300: '#c9af80',
          400: '#b38d54',
          500: '#9a7239',
          600: '#7d5b2e',
          700: '#634827',
          800: '#523c24',
          900: '#463423',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
