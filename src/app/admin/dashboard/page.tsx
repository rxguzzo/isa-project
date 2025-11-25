// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [recentesProblemas, setRecentesProblemas] = useState<ProblemaRecente[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  
  // Dados formatados para o gráfico
  const chartData = [
    {
      name: "Empresas",
      value: stats?.totalEmpresas ?? 0,
      icon: <Building2 className="w-4 h-4 text-gray-600" />,
    },
    {
      name: "Abertas",
      value: stats?.demandasAbertas ?? 0,
      icon: <FileText className="w-4 h-4 text-gray-600" />,
    },
    {
      name: "Em Análise",
      value: stats?.demandasEmAnalise ?? 0,
      icon: <Clock className="w-4 h-4 text-gray-600" />,
    },
    {
      name: "Resolvidas",
      value: stats?.demandasResolvidas ?? 0,
      icon: <CheckCircle className="w-4 h-4 text-gray-600" />,
    },
  ];

  const maxValue = Math.max(...chartData.map((item) => item.value));

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const [resStats, resProblemas] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/problemas"),
        ]);

        if (!resStats.ok || !resProblemas.ok) {
          // Se houver um problema de autenticação, o AdminLayout (que encapsula) pode lidar com o redirecionamento globalmente.
          // Aqui, apenas lançamos o erro.
          throw new Error("Falha ao carregar dados do painel.");
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
    <AdminLayout>
      {" "}
      {/* O Layout admin agora envolve todo o conteúdo */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-display">
          Centro de Comando
        </h1>
        <p className="text-gray-500">
          Uma visão geral e em tempo real do seu sistema.
        </p>
      </header>
      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total de Empresas"
          value={stats?.totalEmpresas ?? 0}
          icon={Building2}
        />
        <StatCard
          title="Demandas Abertas"
          value={stats?.demandasAbertas ?? 0}
          icon={FileText}
        />
        <StatCard
          title="Em Análise"
          value={stats?.demandasEmAnalise ?? 0}
          icon={Clock}
        />
        <StatCard
          title="Resolvidas"
          value={stats?.demandasResolvidas ?? 0}
          icon={CheckCircle}
        />
      </div>
      {/* Gráfico de Barras */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Resumo Visual de Demandas
        </h2>
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div className="flex items-center w-40 space-x-2">
                {item.icon}
                <span className="text-sm text-gray-700 font-medium">
                  {item.name}
                </span>
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: [
                      "#9C0720",
                      "#f97316",
                      "#3b82f6",
                      "#10b981",
                    ][index % 4],
                  }}
                />
              </div>
              <div className="ml-3 text-sm text-gray-600 font-semibold">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Lista de Atividades Recentes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Últimas Demandas Registradas
        </h2>
        <div className="space-y-4">
          {recentesProblemas.length > 0 ? (
            recentesProblemas.slice(0, 5).map((p) => (
              <Link key={p.id} href={`/admin/demandas`} className="block group">
                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 bg-red-50 rounded-full p-2">
                    <FileText className="h-5 w-5 text-red-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {p.assunto}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {p.empresa.razaoSocial}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right space-y-1">
                    <StatusBadge status={p.status} />
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNowStrict(new Date(p.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
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
