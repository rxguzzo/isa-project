// src/components/layout/Footer.tsx
import Link from 'next/link';
import { PanelTopOpen, Linkedin, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Coluna da Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <PanelTopOpen className="h-7 w-7 text-white" />
              <span className="text-xl font-bold text-white">ISA</span>
            </Link>
            <p className="max-w-md text-sm text-gray-400">
              Inteligência e Eficiência para a Gestão da Sua Empresa. Simplificando a burocracia para você focar no crescimento.
            </p>
          </div>

          {/* Coluna de Navegação */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white">Navegação</h3>
            <ul className="space-y-3">
              <li><Link href="#sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</Link></li>
              <li><Link href="#contato" className="hover:text-white transition-colors">Contato</Link></li>
              <li><Link href="/cadastro" className="hover:text-white transition-colors">Cadastrar Empresa</Link></li>
            </ul>
          </div>

          {/* Coluna de Redes Sociais */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white">Siga-nos</h3>
            <div className="flex items-center space-x-4">
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Barra de Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500 md:flex md:justify-between">
          <p>&copy; {currentYear} ISA - Inteligência em Soluções Administrativas. Todos os direitos reservados.</p>
          <p className="mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">Termos de Serviço</Link> | <Link href="#" className="hover:text-white">Política de Privacidade</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}