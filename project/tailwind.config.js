/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
        code: ['Source Code Pro', 'monospace'],
      },
      colors: {
        primary: '#1e40af',
        accent: '#14b8a6',
        glass: 'rgba(255,255,255,0.7)',
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: '#22c55e',
        info: '#0ea5e9',
        warning: '#f59e42',
        error: '#ef4444',
        medical: {
          100: '#e0f7fa',
          200: '#b2ebf2',
          300: '#80deea',
          400: '#4dd0e1',
          500: '#26c6da',
          600: '#00bcd4',
          700: '#00acc1',
          800: '#0097a7',
          900: '#00838f',
        },
        cyberpunk: {
          100: '#f72585',
          200: '#b5179e',
          300: '#7209b7',
          400: '#560bad',
          500: '#480ca8',
          600: '#3a0ca3',
          700: '#4361ee',
          800: '#4895ef',
          900: '#4cc9f0',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.23, 1, 0.32, 1) both',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) both',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};