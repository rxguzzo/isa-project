// src/app/dashboard/[empresaId]/demandas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge'; // Importando nosso novo componente

type Problema = {
  id: string;
  assunto: string;
  areaDemanda: string;
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

  useEffect(() => {
    if (!empresaId) return;

    const fetchDemandas = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/empresas/${empresaId}/problemas`);
        if (!res.ok) {
          throw new Error('Falha ao buscar as demandas.');
        }
        const data = await res.json();
        setProblemas(data);
      } catch (error) {
        console.error(error);
        // Poderia adicionar um estado de erro para mostrar na tela
      } finally {
        setIsLoading(false);
      }
    };
    fetchDemandas();
  }, [empresaId]);

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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Acompanhar Demandas</h1>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área(s)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgência</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data de Abertura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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