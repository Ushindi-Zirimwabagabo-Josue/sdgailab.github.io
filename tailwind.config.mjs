/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        lab: {
          base: '#15181C',
          section: '#1B1F24',
          surface: '#21262C',
          elevated: '#2C323A',
          text: '#D9DDE2',
          muted: '#B7BFC7',
          subtle: '#8D96A1',
          border: 'rgba(217, 221, 226, 0.16)',
          accent: '#1C61AC',
          'accent-soft': '#6EC6E8',
          teal: '#0383AE',
          amber: '#6EC6E8',
          'border-soft': 'rgba(217, 221, 226, 0.10)',
          'glow-blue': 'rgba(28, 97, 172, 0.09)',
          'glow-teal': 'rgba(3, 131, 174, 0.09)',
        },
        primary: {
          DEFAULT: '#4C86FF',
          light: '#7FA9FF',
          dark: '#2F6FE8',
          50: '#EDF4FF',
          100: '#DCEBFF',
          200: '#B8D4FF',
          300: '#8DB8FF',
          400: '#6DA3FF',
          500: '#4C86FF',
          600: '#2F6FE8',
          700: '#265BC0',
          800: '#224A91',
          900: '#1D365F',
        },
        accent: {
          DEFAULT: '#4C86FF',
          light: '#7FA9FF',
          dark: '#2F6FE8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"Cabinet Grotesk"', 'Inter', 'sans-serif'],
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
      },
      keyframes: {
        'landing-float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.35' },
          '50%': { transform: 'translateY(-18px) scale(1.15)', opacity: '0.72' },
        },
        'partner-marquee-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'landing-float': 'landing-float 9s ease-in-out infinite',
        'partner-marquee-scroll': 'partner-marquee-scroll 34s linear infinite',
      },
    },
  },
  plugins: [],
};

