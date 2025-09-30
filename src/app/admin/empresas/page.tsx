'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PlusCircle, Building2, User2, Mail, Phone, ArrowRight } from 'lucide-react';

// 1. CORREÇÃO NA TIPAGEM: Trocado 'usuarios' por 'usuario'
interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  emailContato: string | null;
  telefone: string | null;
  createdAt: string;
  usuario: {
    id: string;
    nome: string | null;
    email: string;
  }; 
}

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/empresas');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao buscar as empresas.');
      }
      const data = await response.json();
      setEmpresas(data);
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
      let errorMessage = 'Erro desconhecido ao carregar empresas.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-700 animate-pulse">Carregando empresas...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full text-red-600">
          <p>Erro: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">Gerenciar Empresas</h1>
          <p className="text-gray-500 mt-1">Adicione, edite e visualize as empresas cadastradas.</p>
        </div>
        <Link href="/admin/empresas/nova" className="inline-flex items-center gap-2 mt-4 sm:mt-0 px-6 py-3 bg-[#b91c1c] text-white font-semibold rounded-lg shadow-md hover:bg-[#991b1b] transition-colors">
          <PlusCircle className="h-5 w-5" />
          Nova Empresa
        </Link>
      </div>

      {empresas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border">
          <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <p className="text-gray-700 text-xl font-medium mb-4">Nenhuma empresa registrada.</p>
          <p className="text-gray-500 mb-8">Comece cadastrando a primeira empresa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <div key={empresa.id} className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-red-600" />
                    {empresa.razaoSocial}
                  </h2>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600"><span className="font-semibold">CNPJ:</span> {empresa.cnpj}</p>
                  <p className="flex items-center text-gray-600"><Mail className="h-4 w-4 mr-2 text-gray-400" /> {empresa.emailContato || 'N/A'}</p>
                  {/* <p className="flex items-center text-gray-600"><Phone className="h-4 w-4 mr-2 text-gray-400" /> {empresa.telefoneContato || 'N/A'}</p> */}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t mt-4">
                <div className="flex items-center">
                  <User2 className="h-5 w-5 mr-2 text-gray-400" />
                  {/* 2. CORREÇÃO NA EXIBIÇÃO: Mostra o nome/email do único usuário dono */}
                  <span>Dono: {empresa.usuario?.nome || empresa.usuario?.email || 'Não associado'}</span>
                </div>
                <Link href={`/admin/empresas/${empresa.id}`} className="font-semibold text-red-600 hover:text-red-800 flex items-center gap-1">
                  Ver Detalhes <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

