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
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
