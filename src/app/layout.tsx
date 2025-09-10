// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Lato } from "next/font/google"; // <-- 1. Importe as fontes
import "./globals.css";

// 2. Configure as fontes
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins' // Define uma variável CSS
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-lato' // Define uma variável CSS
});

export const metadata: Metadata = {
  title: "ISA - Soluções Administrativas",
  description: "Inteligência e Eficiência para a Gestão da Sua Empresa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Aplique as variáveis ao <html>
    <html lang="pt-BR" className={`${poppins.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}