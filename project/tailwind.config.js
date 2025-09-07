/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111111',
          800: '#1a1a1a',
          700: '#2d2d2d',
          600: '#404040',
          500: '#595959',
          400: '#737373',
        },
        blue: {
          400: '#00d4ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
        },
        orange: {
          400: '#ff8c42',
          500: '#ff6b35',
          600: '#ea580c',
        },
        red: {
          400: '#ff6b6b',
          500: '#ff4757',
          600: '#dc2626',
          700: '#b91c1c',
        },
        green: {
          400: '#4ade80',
          500: '#2ed573',
          600: '#16a34a',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      lineHeight: {
        relaxed: '1.75',
        loose: '2',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
};