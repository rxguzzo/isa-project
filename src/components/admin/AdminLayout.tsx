'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut,
  Building2,
  FileText,
  Settings,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { usePersistentSidebar } from '@/hooks/sideBar';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/demandas', label: 'Demandas', icon: FileText },
  { href: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = usePersistentSidebar('sidebar-collapsed', false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Botão hambúrguer para mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobile}
          className="bg-white p-2 rounded-md shadow-md border border-gray-200 hover:text-red-600 transition-transform duration-300"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5 text-gray-600 rotate-90 transition-transform duration-300" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600 rotate-0 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Sidebar fixa */}
      <aside
        className={`fixed top-0 left-0 h-screen ${sidebarWidth} bg-white shadow-lg border-r border-gray-200 z-40 hidden lg:flex flex-col transition-all duration-300 min-w-0 overflow-hidden`}
      >
        {/* Topo com logo condicional e botão de colapso */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 min-w-0">
          {!isCollapsed && (
            <Link href="/admin/dashboard" className="font-display text-xl font-bold text-gray-800">
              ISA Admin
            </Link>
          )}
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-red-600">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="mt-6 flex-1 px-2 space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== '/admin/dashboard');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 font-medium transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-l-4 border-red-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {!isCollapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="border-t border-gray-200 p-4 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && 'Sair'}
          </button>
          {!isCollapsed && (
            <div className="text-xs text-gray-400 text-center mt-2">v1.0.0 • ISA Admin</div>
          )}
        </div>
      </aside>

      {/* Menu mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 z-50">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mt-4"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className={`p-8 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
};
