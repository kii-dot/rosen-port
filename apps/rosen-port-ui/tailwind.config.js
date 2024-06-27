/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/{pages, renderer, components}/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mallard': '#2c4d52',
        'ice-climber': '#64d3cb',
        'petrol-slumber': '#2a2d3f',
        'corbeau': '#141320',
        'dark-sea': '#080813',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
