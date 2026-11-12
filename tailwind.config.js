/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7f8',
          100: '#e1eef1',
          200: '#c3dde3',
          300: '#94c2cc',
          400: '#5da0af',
          500: '#3c8393',
          600: '#2b6977',
          700: '#0F5B66', // Primary deep teal
          800: '#0c4952',
          900: '#08333a',
        },
        clinical: {
          bg: '#F4F6F8',
          surface: '#FFFFFF',
          border: '#D9DEE4',
          subtle: '#EEF1F4',
          darkBg: '#0F141C',
          darkSurface: '#161D26',
          darkBorder: '#27313F',
          darkSubtle: '#1C2430',
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '6px',
        xl: '6px',
        '2xl': '6px',
        '3xl': '6px',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        drawer: '-4px 0 24px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
