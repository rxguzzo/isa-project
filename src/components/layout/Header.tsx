// src/components/Header.tsx
import Link from 'next/link';
import { PanelTopOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 shadow-md backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Cor manual com código hexadecimal direto */}
          <PanelTopOpen className="h-6 w-6 text-[#b91c1c]" />
          <span className="text-lg font-bold">ISA</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {/* Cor manual no hover */}
          <Link href="#sobre" className="text-gray-600 transition-colors hover:text-[#b91c1c]">
            Sobre a ISA
          </Link>
          <Link href="#diferenciais" className="text-gray-600 transition-colors hover:text-[#b91c1c]">
            Diferenciais
          </Link>
          <Link href="#contato" className="text-gray-600 transition-colors hover:text-[#b91c1c]">
            Contato
          </Link>
        </nav>

        <Link
          href="/cadastro"
          // Cores manuais para background e hover
          className="hidden rounded-md bg-[#b91c1c] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#991b1b] md:block"
        >
          Cadastrar Empresa
        </Link>
      </div>
    </header>
  );
}