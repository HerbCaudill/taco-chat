const windmill = require('@windmill/react-ui/config')
const { colors, fontSize } = require('tailwindcss/defaultTheme')

module.exports = windmill({
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'Segoe UI Emoji', 'monospace'],
        sans: ['IBM Plex Sans', 'Segoe UI Emoji', 'sans-serif'],
        condensed: ['IBM Plex Sans Condensed', 'Segoe UI Emoji', 'sans-serif'],
        serif: ['IBM Plex Serif', 'Segoe UI Emoji', 'serif'],
      },
      zIndex: {},
      colors: {
        primary: colors.teal,
        secondary: colors.blue,
        neutral: colors.gray,
        success: colors.green,
        warning: colors.orange,
        danger: colors.red,
      },
      fontSize: {},
      fontWeight: {
        thin: 200,
        normal: 400,
        bold: 600,
        extrabold: 800,
      },
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
})
