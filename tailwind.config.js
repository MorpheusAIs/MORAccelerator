/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      colors: {
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          primary: '#BB86FC',
          secondary: '#03DAC6',
          error: '#CF6679',
          onBg: '#FFFFFF',
          onSurface: '#FFFFFF',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'nav-color': '#acacac',
        'morpheus-green': '#00FF84',
        'morpheus-black': '#000000',
        'morpheus-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neuromorphic': '20px 20px 60px #1a1b2e, -20px -20px 60px #24263f',
        'neuromorphic-hover': '25px 25px 75px #1a1b2e, -25px -25px 75px #24263f',
        'neuromorphic-sm': '10px 10px 30px #1a1b2e, -10px -10px 30px #24263f',
        'neon-sm': '0 0 5px rgba(0, 255, 132, 0.3)',
        'neon-md': '0 0 10px rgba(0, 255, 132, 0.3), 0 0 20px rgba(0, 255, 132, 0.2)',
        'neon-lg': '0 0 15px rgba(0, 255, 132, 0.3), 0 0 30px rgba(0, 255, 132, 0.2), 0 0 45px rgba(0, 255, 132, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(0, 255, 132, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 132, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.dark.text.primary'),
            h1: { color: theme('colors.dark.text.primary') },
            h2: { color: theme('colors.dark.text.primary') },
            h3: { color: theme('colors.dark.text.primary') },
            h4: { color: theme('colors.dark.text.primary') },
            strong: { color: theme('colors.dark.text.primary') },
            a: { color: theme('colors.primary.400') },
            blockquote: { color: theme('colors.dark.text.secondary') },
            code: { color: theme('colors.dark.text.primary') },
          },
        },
      }),
      backgroundColor: {
        dark: {
          DEFAULT: '#121212',
          paper: '#1E1E1E',
        }
      },
      textColor: {
        dark: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
        }
      }
    },
    container: {
      padding: {
        md: '8rem',
        sm: '4rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
