// src/app/admin/empresas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout'; // Importe o AdminLayout
import { PlusCircle, Building2, User2, Mail, Phone } from 'lucide-react';

interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  emailContato: string | null;
  telefoneContato: string | null;
  createdAt: string;
  updatedAt: string;
  usuarios: Array<{ id: string; nome: string }>; 
}

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const response = await fetch('/api/admin/empresas', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

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
        setLoading(false);
      }
    }

    fetchEmpresas();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full"> {/* h-full para centralizar no espaço do layout */}
          <p className="text-gray-700">Carregando empresas...</p>
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
      <div className="container mx-auto max-w-7xl">
        {/* Cabeçalho da Página de Empresas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-display">Gerenciar Empresas</h1>
            <p className="text-gray-500 mt-1">Adicione, edite e visualize todas as empresas cadastradas no sistema.</p>
          </div>
          <Link href="/admin/empresas/nova" className="inline-flex items-center gap-2 mt-4 sm:mt-0 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors transform hover:scale-105">
            <PlusCircle className="h-5 w-5" />
            Cadastrar Nova Empresa
          </Link>
        </div>

        {/* Seção de Listagem de Empresas */}
        {empresas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-700 text-xl font-medium mb-4">Nenhuma empresa registrada no sistema.</p>
            <p className="text-gray-500 mb-8">Comece cadastrando sua primeira empresa para gerenciar demandas e usuários.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {empresas.map((empresa) => (
              <div key={empresa.id} className="bg-white p-7 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-red-600" />
                      {empresa.razaoSocial}
                    </h2>
                  </div>
                  {empresa.nomeFantasia && <p className="text-gray-700 text-sm mb-2"><span className="font-semibold">Nome Fantasia:</span> {empresa.nomeFantasia}</p>}
                  <p className="text-gray-700 text-sm mb-2"><span className="font-semibold">CNPJ:</span> {empresa.cnpj}</p>
                  <div className="flex items-center text-gray-700 text-sm mb-2">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-semibold">Email:</span> {empresa.emailContato || 'N/A'}
                  </div>
                  <div className="flex items-center text-gray-700 text-sm mb-4">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-semibold">Telefone:</span> {empresa.telefoneContato || 'N/A'}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100 mt-4">
                  <div className="flex items-center">
                    <User2 className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{empresa.usuarios.length} Usuário(s)</span>
                  </div>
                  <Link href={`/admin/empresas/${empresa.id}`} className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors flex items-center gap-1">
                    Ver Detalhes 
                    <Building2 className="h-3 w-3" /> {/* Ícone ajustado para detalhes */}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}