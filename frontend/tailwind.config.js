/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'portrait': { 'raw': '(orientation: portrait)' },
      'landscape': { 'raw': '(orientation: landscape)' },
      'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
      'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
    },
    extend: {
      colors: {
        /* Agriculture theme */
        primary: {
          DEFAULT: '#2D5016',
          50: '#f0f7ed',
          100: '#e0efdb',
          200: '#c2dfb7',
          300: '#9bc98d',
          400: '#74b363',
          500: '#4A7C59',
          600: '#3A6B35',
          700: '#2D5016',
          800: '#264013',
          900: '#1e3510',
        },
        earth: {
          50: '#faf6f2',
          100: '#f0e6dc',
          200: '#e0cdb9',
          300: '#c9a88a',
          400: '#A0522D',
          500: '#8B4513',
          600: '#6d3710',
          700: '#552b0d',
          800: '#3d1f0a',
          900: '#2e1708',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#F4A460',
          300: '#DAA520',
          400: '#FFD700',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        crop: {
          DEFAULT: '#7CB342',
          light: '#9CCC65',
          dark: '#558b2f',
        },
        cream: {
          50: '#FFF8DC',
          100: '#FAF8F3',
          200: '#F5F1E8',
          300: '#ebe5d8',
        },
        soil: {
          DEFAULT: '#3E2723',
          light: '#4E342E',
          dark: '#2c1815',
        },
        /* Legacy aliases for compatibility */
        secondary: {
          50: '#faf6f2',
          100: '#f0e6dc',
          200: '#e0cdb9',
          300: '#c9a88a',
          400: '#A0522D',
          500: '#8B4513',
          600: '#6d3710',
          700: '#552b0d',
          800: '#552b0d',
          900: '#2e1708',
        },
        accent: '#DAA520',
        success: '#7CB342',
        warning: '#F4A460',
        error: '#dc2626',
        info: '#3A6B35',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'display': ['3rem', { lineHeight: '1.2' }],
        'hero': ['2.5rem', { lineHeight: '1.25' }],
      },
      lineHeight: {
        'relaxed': '1.6',
        'tight': '1.3',
      },
      boxShadow: {
        'agri': '0 4px 14px 0 rgba(45, 80, 22, 0.12)',
        'agri-lg': '0 10px 40px -10px rgba(45, 80, 22, 0.2)',
        'agri-glow': '0 0 20px rgba(218, 165, 32, 0.25)',
        'earth': '0 4px 14px 0 rgba(139, 69, 19, 0.15)',
        'glass': '0 8px 32px rgba(62, 39, 35, 0.08)',
        'card-hover': '0 20px 40px -12px rgba(45, 80, 22, 0.18)',
      },
      borderRadius: {
        'agri': '12px',
        'agri-lg': '16px',
        'agri-xl': '20px',
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2D5016 0%, #3A6B35 50%, #4A7C59 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F4A460 0%, #DAA520 50%, #FFD700 100%)',
        'gradient-earth': 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(45, 80, 22, 0.85) 0%, rgba(45, 80, 22, 0.4) 50%, transparent 100%)',
        'pattern-wheat': 'url("/images/pattern-wheat.svg")',
        'hero-farmer': 'url("/images/hero-farmer.jpg")',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out',
        'wheat-spin': 'wheatSpin 2s linear infinite',
        'typing-dot': 'typingDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wheatSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        typingDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        'agri': '300ms',
      },
      transitionTimingFunction: {
        'agri': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        'glass': '12px',
        'navbar': '16px',
      },
      width: {
        'screen-safe': 'calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right))',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

