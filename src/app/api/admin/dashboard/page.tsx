'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PanelTopOpen } from 'lucide-react';

type Empresa = {
  id: string;
  razaoSocial: string;
  email: string;
  cnpj: string;
  createdAt: string;
};

type Problema = {
  id: string;
  assunto: string;
  categoria: string;
  status: string;
  createdAt: string;
  empresa: {
    razaoSocial: string;
  };
};

export default function AdminDashboardPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('isa-admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchAdminData = async () => {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [resEmpresas, resProblemas] = await Promise.all([
          fetch('/api/admin/empresas', { headers }),
          fetch('/api/admin/problemas', { headers }),
        ]);

        if (!resEmpresas.ok || !resProblemas.ok) {
          throw new Error('Falha ao carregar dados do admin');
        }

        const dataEmpresas = await resEmpresas.json();
        const dataProblemas = await resProblemas.json();
        setEmpresas(dataEmpresas);
        setProblemas(dataProblemas);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('isa-admin-token');
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  // Função que chama a API para atualizar o status
  const handleStatusChange = async (problemaId: string, novoStatus: string) => {
    const token = localStorage.getItem('isa-admin-token');

    try {
      const response = await fetch(`/api/admin/problemas/${problemaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o status.');
      }

      // Atualiza a lista de problemas no frontend para refletir a mudança instantaneamente
      setProblemas((problemasAtuais) =>
        problemasAtuais.map((p) =>
          p.id === problemaId ? { ...p, status: novoStatus } : p
        )
      );
      // alert('Status atualizado com sucesso!'); // Opcional
    } catch (error) {
      console.error('Erro ao mudar o status:', error);
      alert('Não foi possível atualizar o status.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isa-admin-token');
    router.push('/admin/login');
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles: { [key: string]: string } = {
      'aberto': 'bg-blue-100 text-blue-800',
      'em análise': 'bg-yellow-100 text-yellow-800',
      'resolvido': 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando dados...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <button onClick={handleLogout} className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-800">
          Sair
        </button>
      </header>
      
      {/* Tabela de Empresas (sem mudanças) */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        {/* ... código da tabela de empresas ... */}
      </section>
      
      {/* Tabela de Chamados */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Todos os Chamados ({problemas.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Assunto</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problemas.length > 0 ? (
                problemas.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-4 text-sm text-gray-800">{p.empresa.razaoSocial}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{p.assunto}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-4 text-sm">
                      {/* ===== SELECT ATUALIZADO PARA CHAMAR A FUNÇÃO REAL ===== */}
                      <select
                        title={`Mudar status do chamado ${p.id}`}
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
                      >
                        <option value="aberto">Aberto</option>
                        <option value="em análise">Em Análise</option>
                        <option value="resolvido">Resolvido</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum chamado registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}