/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          bg: '#F5F5F7',
          surface: '#FFFFFF',
          blue: '#0071E3',
          'blue-hover': '#0077ED',
          'blue-light': '#E8F0FE',
          text: '#1D1D1F',
          secondary: '#86868B',
          border: 'rgba(0,0,0,0.08)',
          red: '#FF3B30',
          green: '#34C759',
          orange: '#FF9500',
          purple: '#AF52DE',
          pink: '#FF2D55',
          yellow: '#FFCC00',
        },
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0,0,0,0.08)',
        'apple-md': '0 4px 16px rgba(0,0,0,0.10)',
        'apple-lg': '0 8px 32px rgba(0,0,0,0.12)',
        'apple-xl': '0 16px 48px rgba(0,0,0,0.14)',
        'apple-card': '0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'apple-card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        apple: '18px',
        'apple-sm': '12px',
        'apple-lg': '24px',
      },
    },
  },
  plugins: [],
}
