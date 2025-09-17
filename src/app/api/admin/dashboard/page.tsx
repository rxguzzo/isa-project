// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Building2, FileText, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

// Tipagens para os dados que vamos buscar
type Stats = {
  totalEmpresas: number;
  demandasAbertas: number;
  demandasEmAnalise: number;
  demandasResolvidas: number;
};

type ProblemaRecente = {
  id: string;
  assunto: string;
  status: string;
  createdAt: string;
  empresa: {
    razaoSocial: string;
  };
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentesProblemas, setRecentesProblemas] = useState<ProblemaRecente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // O cookie de autenticação é enviado automaticamente pelo navegador
        const [resStats, resProblemas] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/problemas'), // Busca a lista completa de problemas
        ]);

        if (!resStats.ok || !resProblemas.ok) {
          throw new Error('Falha ao carregar dados do painel.');
        }

        const dataStats = await resStats.json();
        const dataProblemas = await resProblemas.json();
        
        setStats(dataStats);
        setRecentesProblemas(dataProblemas);

      } catch (err) {
        console.error("Erro no dashboard de admin:", err);
        // Se qualquer chamada falhar, redireciona para o login
        handleLogout(true); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async (isErrorFlow = false) => {
    if (!isErrorFlow) {
      await fetch('/api/auth/logout', { method: 'POST' });
    }
    router.push('/login');
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-100 text-lg font-semibold">Carregando Centro de Comando...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar de Navegação (para o futuro) */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-md hidden lg:flex flex-col">
          <div className="flex h-16 items-center justify-center border-b">
              <span className="text-2xl font-bold text-gray-800">ISA Admin</span>
          </div>
          <nav className="mt-6 flex-1 px-4 space-y-2">
              <Link href="/admin/dashboard" className="flex items-center rounded-md bg-[#fef2f2] px-4 py-2 font-semibold text-[#b91c1c]">
                  Dashboard
              </Link>
              <Link href="/admin/demandas" className="flex items-center rounded-md px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
                  Demandas
              </Link>
              <Link href="/admin/empresas" className="flex items-center rounded-md px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
                  Empresas
              </Link>
              <Link href="/admin/configuracoes" className="flex items-center rounded-md px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
                  Configurações
              </Link>
          </nav>
          <div className="border-t p-4">
              <button onClick={() => handleLogout()} className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
              </button>
          </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 min-h-screen bg-gray-100 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-display">Centro de Comando</h1>
          <p className="text-gray-500">Uma visão geral e em tempo real do seu sistema.</p>
        </header>
        
        {/* Grid de Cards de Estatísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total de Empresas" value={stats?.totalEmpresas ?? 0} icon={Building2} />
          <StatCard title="Demandas Abertas" value={stats?.demandasAbertas ?? 0} icon={FileText} />
          <StatCard title="Em Análise" value={stats?.demandasEmAnalise ?? 0} icon={Clock} />
          <StatCard title="Resolvidas" value={stats?.demandasResolvidas ?? 0} icon={CheckCircle} />
        </div>

        {/* Lista de Atividades Recentes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Últimas Demandas Registradas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {recentesProblemas.length > 0 ? (
                  recentesProblemas.slice(0, 5).map((p) => ( // Mostra apenas os 5 mais recentes
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.assunto}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{p.empresa.razaoSocial}</td>
                      <td className="px-4 py-3 text-sm"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">Nenhuma demanda registrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}