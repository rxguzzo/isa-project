'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut,
  Building2,
  FileText,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
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
  const firstMobileRef = useRef<HTMLButtonElement | null>(null);

  const toggleSidebar = () => setIsCollapsed((s) => !s);
  const toggleMobile = () => setIsMobileOpen((s) => !s);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  // Bloqueia scroll de fundo quando drawer mobile aberto
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = isMobileOpen ? 'hidden' : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileOpen]);

  // Fecha drawer ao mudar de rota
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // ESC fecha e foco no primeiro botão do mobile quando aberto
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMobileOpen(false);
    }
    if (isMobileOpen) {
      document.addEventListener('keydown', onKey);
      setTimeout(() => firstMobileRef.current?.focus(), 50);
    } else {
      document.removeEventListener('keydown', onKey);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileOpen]);

  const desktopWidth = isCollapsed ? 'w-20' : 'w-64';
  const mainMarginClass = isCollapsed ? 'lg:ml-20' : 'lg:ml-64';

  // Navegação via router.push com logs (remova console.log quando confirmar)
  const handleNav = async (href: string) => {
    // eslint-disable-next-line no-console
    console.log('[AdminLayout] click ->', href);
    setIsMobileOpen(false);
    try {
      await router.push(href);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AdminLayout] router.push error', err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* botão hamburger mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobile}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-sidebar"
          aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
          className="bg-white p-2 rounded-md shadow border border-gray-200 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          {isMobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow border-r border-gray-200 z-40 hidden lg:flex flex-col transition-all duration-300 overflow-hidden ${desktopWidth}`}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-red-600 font-semibold">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="hidden lg:block">
                <circle cx="12" cy="12" r="10" fill="#9C0720" />
                <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white" fontFamily="sans-serif">ISA</text>
              </svg>
            </div>
            {!isCollapsed && <span className="font-display text-lg font-bold text-gray-800 truncate">ISA Admin</span>}
          </div>

          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            className="p-1 rounded hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-200"
            title={isCollapsed ? 'Expandir' : 'Recolher'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-6 flex-1 px-2 space-y-1" aria-label="Navegação principal">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard');
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`group flex items-center gap-3 px-3 py-2 rounded-md font-medium w-full text-left transition-colors duration-150 ${
                  isActive ? 'bg-gradient-to-r from-red-50 to-white text-red-700 border-l-4 border-red-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
                type="button"
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 flex flex-col gap-2">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 w-full">
            <LogOut className="w-4 h-4" />
            {!isCollapsed && 'Sair'}
          </button>
          {!isCollapsed && <div className="text-xs text-gray-400 text-center mt-2">v1.0.0 • ISA Admin</div>}
        </div>
      </aside>

      {/* MOBILE DRAWER — CORREÇÃO IMPORTANTE: pointer-events-none quando fechado */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isMobileOpen}
      >
        {/* backdrop: só captura clique quando aberto */}
        <div
          className={`${isMobileOpen ? 'absolute inset-0 bg-black bg-opacity-50 opacity-100' : 'pointer-events-none'}`}
          onClick={() => setIsMobileOpen(false)}
        />

        <aside
          id="mobile-sidebar"
          role="dialog"
          aria-modal="true"
          className={`absolute top-0 left-0 h-full w-64 bg-white shadow p-4 transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ pointerEvents: isMobileOpen ? 'auto' : 'none' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="font-display text-lg font-bold text-gray-800">ISA Admin</div>
            <button onClick={() => setIsMobileOpen(false)} aria-label="Fechar menu" className="p-1 rounded hover:bg-gray-100 focus:outline-none">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <nav className="space-y-1" aria-label="Menu mobile">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard');
              return (
                <button
                  ref={idx === 0 ? firstMobileRef : undefined}
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md w-full text-left ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  aria-current={isActive ? 'page' : undefined}
                  type="button"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                setIsMobileOpen(false);
                handleLogout();
              }}
              className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 rounded px-2 py-2"
              type="button"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </nav>
        </aside>
      </div>

      {/* MAIN */}
      <main className={`transition-all duration-300 ease-in-out ${mainMarginClass} ml-0 min-h-screen`}>
        <div className="p-4 sm:p-8">{children}</div>
      </main>
    </div>
  );
};