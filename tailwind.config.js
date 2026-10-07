/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F8F4ED',
          200: '#F0E9DC',
          300: '#E5DAC8',
        },
        espresso: {
          400: '#5C4A42',
          600: '#3D302A',
          700: '#2C221E',
          800: '#1E1815',
        },
        terracotta: {
          50: '#FBF0EC',
          100: '#F5DDD3',
          200: '#EBBBA8',
          300: '#DD987F',
          400: '#C86D51',
          500: '#B55840',
          600: '#9C4836',
          700: '#7D3A2C',
        },
        sage: {
          50: '#F2F5F3',
          100: '#DDE7E1',
          200: '#C2D2C9',
          300: '#A5BCB0',
          400: '#8EA89D',
          500: '#7A978A',
          600: '#627A6F',
          700: '#4D5F57',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-800px 0' },
          '100%': { backgroundPosition: '800px 0' },
        },
      },
    },
  },
  plugins: [],
};
