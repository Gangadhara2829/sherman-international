/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sherman: {
          50: '#f0f4f9',
          100: '#e1ecf4',
          200: '#c3d8e9',
          300: '#95bcda',
          400: '#5f9bc6',
          500: '#337ab7',
          600: '#1d5f99',
          700: '#154b7b',
          800: '#0f3559',
          900: '#0a233c',
          950: '#071626',
        },
        navy: {
          DEFAULT: '#0f2238',
          light: '#183454',
          deep: '#0a1624',
          muted: '#243b55',
        },
        accent: {
          DEFAULT: '#006699', // Classic corporate engineering blue
          amber: '#d97706',  // Restrained industrial amber
          dark: '#004c73',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
