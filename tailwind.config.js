/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'seasons': ['"The Seasons"', 'Georgia', 'serif'],
        'josefin': ['"Josefin Sans"', 'sans-serif'],
      },
      colors: {
        pink: {
          hot: '#FF2D9B',
          light: '#FFB3D9',
          pale: '#FFE4F0',
          medium: '#FF69B4',
        }
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
