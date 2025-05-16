/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        scanlines: "url('/images/scan3.png')",
      },
      colors: {
        gameboyFade: '#f5f5e0',
        gameboy: '#d3d179',
        gameboyMedium: '#bdbb92',
        gameboyDark: '#3a4a2c',
        gameboyButton: '#7e9833',
        textPrimary: '#1a1a1a',
      },      
      fontFamily: {
        gameboy: ['EarlyGameBoy', 'sans-serif'],
        ibm: ['IBM', 'monospace'],
        vt: ['VT323', 'monospace'],
      },
      animation: {
        flicker: 'flicker 1.5s infinite',
        shake: 'shake 0.5s ease-in-out infinite',
        ghost: 'ghostFade 4s ease-in-out infinite',
        cursed: 'cursedGlow 0.5s ease-in-out infinite',
        scanlineDrift: 'scanlineDrift 3s linear infinite',
        floaty: 'floaty 2.5s ease-in-out infinite', 
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '10%': { opacity: '0.9' },
          '20%': { opacity: '0.95' },
          '30%': { opacity: '0.85' },
          '40%': { opacity: '0.9' },
          '50%': { opacity: '1' },
          '60%': { opacity: '0.95' },
          '70%': { opacity: '0.9' },
          '80%': { opacity: '1' },
          '90%': { opacity: '0.92' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '50%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-3px)' },
        },
        ghostFade: {
          '0%, 100%': { opacity: 0.25 },
          '50%': { opacity: 1 },
        },
        cursedGlow: {
          '0%, 100%': { boxShadow: '0 0 4px #8bac0f' },
          '50%': { boxShadow: '0 0 12px #8bac0f' },
        },
        scanlineDrift: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
}