// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Lato } from "next/font/google"; // <-- 1. Importe as fontes
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ISA Sistema",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    "msapplication-TileImage": "/icons/icon-144x144.png",
    "msapplication-TileColor": "#b91c1c",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#b91c1c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Aplique as variáveis ao <html>
    <html lang="pt-BR" className={`${poppins.variable} ${lato.variable}`}>
      <body>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}