// src/components/admin/AdminLayout.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Building2, FileText, Settings, LayoutDashboard } from 'lucide-react';

// Itens do menu para facilitar a manutenção
const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/demandas', label: 'Demandas', icon: FileText },
  { href: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar de Navegação Fixa */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg border-r border-gray-200 hidden lg:flex flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <Link href="/admin/dashboard" className="text-2xl font-bold text-gray-800 font-display hover:text-red-600 transition-colors">
            ISA Admin
          </Link>
        </div>
        <nav className="mt-6 flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            // Lógica para destacar o link ativo, mesmo em sub-rotas
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-md px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        {children} {/* O conteúdo da sua página específica será renderizado aqui */}
      </main>
    </div>
  );
};