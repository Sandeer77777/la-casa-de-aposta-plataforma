
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta La Casas de Aposta - Tema Vermelho Heist
        'team': {
          black: '#050505',
          graphite: '#121212',
          'graphite-light': '#1a1a1a',
          gold: '#ef4444', // Vermelho Vibrante
          'gold-dark': '#991b1b', // Vermelho Escuro/Sangue
          'gold-light': '#f87171',
          neon: '#ef4444',
          'neon-dark': '#b91c1c',
          'neon-light': '#fca5a5',
          white: '#ffffff',
          'gray-light': '#f5f5f5',
          'gray-medium': '#a1a1aa'
        }
      },
      boxShadow: {
        'float': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'float-hover': '0 12px 40px rgba(0, 0, 0, 0.7)',
        'neon': '0 0 20px rgba(239, 68, 68, 0.3)',
        'gold': '0 0 20px rgba(239, 68, 68, 0.3)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
