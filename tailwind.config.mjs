/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FDFBF7',
        sand: '#F5F0E8',
        stone: '#E5DED3',
        taupe: '#C4B8A5',
        'warm-gray': '#766B5E',
        espresso: '#2D2926',
        ink: '#1A1816',
        brass: {
          DEFAULT: '#B8956E',
          light: '#D4B896',
          dark: '#96744A',
        },
        success: '#5B8A6F',
        error: '#C17059',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
        narrow: '800px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(45, 41, 38, 0.06)',
        'brand-md': '0 8px 30px rgba(45, 41, 38, 0.08)',
        'brand-lg': '0 20px 60px rgba(45, 41, 38, 0.12)',
        'glow': '0 0 40px rgba(184, 149, 110, 0.15)',
      },
      keyframes: {
        expandLine: { to: { width: '50px' } },
        fadeSlideIn: { to: { opacity: '1', transform: 'translateX(0)' } },
        revealUp: { to: { opacity: '1', transform: 'translateY(0)' } },
        fadeSlideUp: { to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { to: { opacity: '1' } },
        slideInRight: { to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { to: { transform: 'scaleX(1)' } },
        shimmer: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'expand-line': 'expandLine 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards',
        'fade-slide-in': 'fadeSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards',
        'reveal-up': 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
        'reveal-up-2': 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards',
        'fade-slide-up': 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards',
        'fade-in-cta': 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards',
        'fade-in-note': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.3s forwards',
        'slide-in-right': 'slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards',
        'scale-in': 'scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards',
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
