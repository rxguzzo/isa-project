// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ===== ADICIONE ESTE BLOCO =====
      fontFamily: {
        sans: ['var(--font-lato)'],
        display: ['var(--font-poppins)'],
      },
      // =============================
      colors: {
        vinho: {
          // ... sua paleta de cores vinho
        },
      },
      // ...
    },
  },
  plugins: [],
}
export default config