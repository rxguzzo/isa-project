'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipagem corrigida para 'Problema', com areaDemanda como array
type Problema = {
  id: string;
  assunto: string;
  areaDemanda: string[]; // <-- Corrigido para array
  nivelUrgencia: string;
  status: string;
  createdAt: string;
};

export default function AcompanharDemandasPage() {
  const params = useParams();
  const router = useRouter();
  const empresaId = params.empresaId as string;

  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função otimizada para buscar as demandas
  const fetchDemandas = useCallback(async () => {
    if (!empresaId) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/empresas/${empresaId}/problemas`);
      
      if (!res.ok) {
        let errorMessage = 'Falha ao buscar as demandas. Verifique suas permissões.';
        try {
          // Tenta ler a mensagem de erro específica da API
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Mantém a mensagem padrão se a resposta não for JSON
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setProblemas(data);
    } catch (err) {
      console.error("Erro ao carregar demandas:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    fetchDemandas();
  }, [fetchDemandas]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-lg font-semibold">Carregando demandas...</div>;
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <p className="text-red-600 text-lg font-semibold">Ocorreu um erro:</p>
          <p className="text-gray-700 mt-2">{error}</p>
          <Link href={`/dashboard`} className="mt-4 inline-block text-blue-600 hover:underline">
            Voltar para a seleção de empresas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-7xl">
        <Link href={`/dashboard/${empresaId}`} className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o Dashboard da Empresa
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-display">Histórico de Demandas</h1>
            <p className="text-gray-500 mt-1">Acompanhe o status de todas as suas solicitações.</p>
          </div>
          <Link href={`/dashboard/${empresaId}/nova-demanda`} className="inline-flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b]">
            <PlusCircle className="h-5 w-5" />
            Registrar Nova Demanda
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assunto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Área(s)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Urgência</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data de Abertura</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {problemas.length > 0 ? (
                  problemas.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.assunto}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {/* Exibe 'areaDemanda' como tags visuais */}
                        <div className="flex flex-wrap gap-1">
                          {p.areaDemanda.map(area => (
                            <span key={area} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              {area}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{p.nivelUrgencia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(p.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      Nenhuma demanda registrada para esta empresa.
                    </td>
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

