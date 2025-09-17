// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout'; // Importação CORRETA
import Link from 'next/link';
import { Building2, FileText, Clock, CheckCircle, ChevronRight, Settings } from 'lucide-react'; // Removido UserRoundCog duplicado, adicionado Settings
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipagens
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
        const [resStats, resProblemas] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/problemas'),
        ]);

        if (!resStats.ok || !resProblemas.ok) {
          // Se houver um problema de autenticação, o AdminLayout (que encapsula) pode lidar com o redirecionamento globalmente.
          // Aqui, apenas lançamos o erro.
          throw new Error('Falha ao carregar dados do painel.');
        }

        const dataStats = await resStats.json();
        const dataProblemas = await resProblemas.json();
        
        setStats(dataStats);
        setRecentesProblemas(dataProblemas);

      } catch (err) {
        console.error("Erro no dashboard de admin:", err);
        // O handleLogout é chamado apenas em caso de falha de autenticação/sessão,
        // que o AdminLayout deve tentar gerenciar de forma mais centralizada.
        // Se este erro for de dados, apenas exibimos uma mensagem.
        // router.push('/login'); // Removido, AdminLayout pode lidar com isso.
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependências ajustadas

  // Removemos o handleLogout direto daqui, pois ele já está no AdminLayout.
  // Se precisar de um logout específico da página, adapte.

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-700">Carregando Centro de Comando...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout> {/* O Layout admin agora envolve todo o conteúdo */}
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
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Últimas Demandas Registradas</h2>
        <div className="space-y-4">
          {recentesProblemas.length > 0 ? (
            recentesProblemas.slice(0, 5).map((p) => (
              <Link key={p.id} href={`/admin/demandas`} className="block group">
                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 bg-red-50 rounded-full p-2">
                    <FileText className="h-5 w-5 text-red-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.assunto}</p>
                    <p className="text-sm text-gray-500 truncate">{p.empresa.razaoSocial}</p>
                  </div>
                  <div className="flex-shrink-0 text-right space-y-1">
                    <StatusBadge status={p.status} />
                    <p className="text-xs text-gray-400">{formatDistanceToNowStrict(new Date(p.createdAt), { addSuffix: true, locale: ptBR })}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma demanda registrada ainda.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}