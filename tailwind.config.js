/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      colors: {
        primary: {
          10: '#C8F3ED',
          50: '#00D7B9',
          80: '#00564A',
        },
        'oa-gray': {
          5: '#F2F2F2',
          40: '#949494',
          70: '#4A4A4A',
        },
        'oa-border': '#E0E0E0',
        'oa-text': 'rgba(0,0,0,0.87)',
        'oa-text-mid': 'rgba(0,0,0,0.54)',
        'oa-control': 'rgba(0,0,0,0.42)',
      },
      boxShadow: {
        oa: '0px 1px 2px rgba(0,0,0,0.24), 0px 2px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
