/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {
      fontSize: {
        'md': '1rem',
        'card-type': '.8rem'
      },
      maxWidth: {
        '9xl': '96rem',
        '10xl': '112rem',
      },
      margin: {
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem'
      },
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      height: {
        list: 'calc(100vh - 4rem)',
        viewport: 'calc(100% - 2.25rem)',
        mobileview: 'calc(100vh - 13.0rem)'
      },
      width: {
        searchbar: 'calc(100% - 2rem)',
      },
      colors: {
        'burger': '#098709',
        'update': '#f59e0b',
        'remove': '#ec6060',
        'income': '#426d53',
        'outcome': '#64382b',
        'transfer': '#6e6e6e',
        'input': '#EEF3F5',
        'back': '#f4f4f4'
      }
    },
  },
  plugins: [],
}

