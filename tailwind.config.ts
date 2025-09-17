// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Exemplo: se você usa uma fonte personalizada, descomente e configure
        // display: ['YourDisplayFont', 'sans-serif'], 
      },
      keyframes: { // Seção para definir animações personalizadas
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': { // Exemplo de outra animação se precisar no futuro
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: { // Seção para aplicar as keyframes como animações
        'scale-in': 'scale-in 0.2s ease-out forwards', // 'forwards' mantém o estado final da animação
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
      },
      // Cores personalizadas, etc. podem ir aqui
      colors: {
        // Exemplo de como você pode definir sua cor principal para facilitar o uso
        // primary: '#b91c1c', 
        // lightPrimary: '#fef2f2',
      },
    },
  },
  plugins: [],
};