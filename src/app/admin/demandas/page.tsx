// src/app/admin/demandas/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout'; // Importação CORRETA
import Link from 'next/link';
// Certifique-se de que todos os ícones necessários estão importados
import { Search, Filter, Eye, X } from 'lucide-react';
// Componentes customizados
import { StatusBadge } from '@/components/ui/StatusBadge';
// Funções de data
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipagem para uma demanda completa
type ProblemaCompleto = {
  id: string;
  assunto: string;
  descricao: string;
  objetivos: string | null;
  areaDemanda: string;
  nivelUrgencia: string;
  orcamento: string | null;
  comoConheceu: string | null;
  consentimentoLGPD: boolean;
  disponibilidadeVisita: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  empresa: {
    id: string;
    razaoSocial: string;
    cnpj: string | null;
  };
};

export default function AdminDemandasPage() {
  const [demandas, setDemandas] = useState<ProblemaCompleto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDemanda, setSelectedDemanda] = useState<ProblemaCompleto | null>(null);
  const router = useRouter();

  // Função para buscar as demandas
  const fetchDemandas = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterStatus && filterStatus !== 'all') queryParams.append('status', filterStatus);

      const res = await fetch(`/api/admin/problemas?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error('Falha ao carregar as demandas.');
      }
      const data = await res.json();
      setDemandas(data);
    } catch (err) {
      console.error("Erro ao buscar demandas:", err);
      if (err instanceof Error) {
        console.error(err.message);
      }
      // Em caso de erro, apenas defina o estado de erro, o AdminLayout já cuidará do redirecionamento se houver um problema de autenticação global.
      // router.push('/login'); // Removido para o AdminLayout gerenciar erros de sessão globalmente
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterStatus]); // Removido 'router' do useCallback pois não é necessário aqui

  // Efeito para carregar as demandas quando o componente monta ou os filtros mudam
  useEffect(() => {
    fetchDemandas();
  }, [fetchDemandas]);

  // Função para mudar o status de uma demanda
  const handleStatusChange = async (problemaId: string, novoStatus: string) => {
    try {
      const response = await fetch(`/api/admin/problemas/${problemaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o status.');
      }

      // Atualiza o estado local para refletir a mudança imediatamente na UI
      setDemandas((demandasAtuais) =>
        demandasAtuais.map((p) =>
          p.id === problemaId ? { ...p, status: novoStatus } : p
        )
      );
      // Se o modal estiver aberto para essa demanda, atualiza o status lá também
      if (selectedDemanda && selectedDemanda.id === problemaId) {
        setSelectedDemanda(prev => prev ? { ...prev, status: novoStatus } : null);
      }
    } catch (error) {
      console.error('Erro ao mudar o status:', error);
      let errorMessage = 'Não foi possível atualizar o status.';
      if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
      }
      alert(errorMessage);
    }
  };

  // Lógica de carregamento e erro agora dentro do AdminLayout
  if (isLoading && !selectedDemanda) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-700">Carregando Demandas...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout> {/* O Layout admin agora envolve todo o conteúdo */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-display">Gerenciar Demandas</h1>
        <p className="text-gray-500">Visualize e controle todas as solicitações das empresas.</p>
      </header>
      
      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por assunto ou empresa..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-600 focus:border-red-600 transition-all" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select 
            title='Filtrar por Status'
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-red-600 focus:border-red-600 transition-all bg-white" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="aberto">Aberto</option>
            <option value="em análise">Em Análise</option>
            <option value="resolvido">Resolvido</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Tabela de Demandas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assunto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {demandas.length > 0 ? (
                demandas.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                          {d.empresa.razaoSocial.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{d.empresa.razaoSocial}</div>
                          <div className="text-sm text-gray-500">{d.empresa.cnpj || 'CNPJ não informado'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.assunto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(d.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <select 
                          title='Mudar Status'
                          value={d.status} 
                          onChange={(e) => handleStatusChange(d.id, e.target.value)} 
                          className="rounded-md border-gray-300 text-sm focus:ring-red-600 focus:border-red-600 transition-all"
                        >
                          <option value="aberto">Aberto</option>
                          <option value="em análise">Em Análise</option>
                          <option value="resolvido">Resolvido</option>
                        </select>
                        <button 
                          onClick={() => setSelectedDemanda(d)} 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors" 
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhuma demanda encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes da Demanda */}
      {selectedDemanda && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scale-in">
            {/* Botão de Fechar no canto */}
            <button 
              onClick={() => setSelectedDemanda(null)} 
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold font-display text-gray-800">{selectedDemanda.assunto}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enviado por <span className="font-semibold text-gray-700">{selectedDemanda.empresa.razaoSocial}</span> em {format(new Date(selectedDemanda.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </p>
              <div className="mt-3"><StatusBadge status={selectedDemanda.status} /></div>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <div>
                <strong className="font-semibold text-gray-800 block mb-1">Descrição Completa:</strong>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedDemanda.descricao}</p>
              </div>
              
              {selectedDemanda.objetivos && (
                <div>
                  <strong className="font-semibold text-gray-800 block mb-1">Objetivos:</strong>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedDemanda.objetivos}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <strong className="font-semibold text-gray-800 block">Área(s) da Demanda:</strong>
                  <p className="text-gray-700">{selectedDemanda.areaDemanda}</p>
                </div>
                <div>
                  <strong className="font-semibold text-gray-800 block">Nível de Urgência:</strong>
                  <p className="text-gray-700 capitalize">{selectedDemanda.nivelUrgencia}</p>
                </div>
                <div>
                  <strong className="font-semibold text-gray-800 block">Orçamento Estimado:</strong>
                  <p className="text-gray-700">{selectedDemanda.orcamento || 'Não definido'}</p>
                </div>
                <div>
                  <strong className="font-semibold text-gray-800 block">Como Conheceu a ISA:</strong>
                  <p className="text-gray-700">{selectedDemanda.comoConheceu || 'Não informado'}</p>
                </div>
                <div>
                  <strong className="font-semibold text-gray-800 block">Disponibilidade para Visita Técnica:</strong>
                  <p className="text-gray-700">{selectedDemanda.disponibilidadeVisita ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <strong className="font-semibold text-gray-800 block">Consentimento LGPD:</strong>
                  <p className="text-gray-700">{selectedDemanda.consentimentoLGPD ? 'Concedido' : 'Não Concedido'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}