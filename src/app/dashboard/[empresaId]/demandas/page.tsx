// src/app/dashboard/[empresaId]/demandas/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react'; // Importe useCallback
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

// A tipagem deve corresponder exatamente ao que a API retorna
type Problema = {
  id: string;
  assunto: string;
  areaDemanda: string; // A API retorna como string
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

  // Usamos useCallback para otimizar a função de busca
  const fetchDemandas = useCallback(async () => {
    if (!empresaId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/empresas/${empresaId}/problemas`);
      if (!res.ok) {
        throw new Error('Falha ao buscar as demandas.');
      }
      const data = await res.json();
      setProblemas(data);
    } catch (error) {
      console.error("Erro ao carregar demandas:", error);
      // Em caso de erro (ex: token inválido), redireciona para o seletor
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, router]); // Adicionamos as dependências da função

  // Agora, o useEffect depende da função memorizada
  useEffect(() => {
    fetchDemandas();
  }, [fetchDemandas]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando demandas...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-7xl">
        <Link href={`/dashboard/${empresaId}`} className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o Dashboard da Empresa
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-display">Histórico de Demandas</h1>

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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.areaDemanda}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{p.nivelUrgencia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
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