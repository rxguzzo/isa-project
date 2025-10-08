'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

// Tipagem para os dados completos da empresa, incluindo o usuário dono
type EmpresaDetalhes = {
  id: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  endereco: string | null;
  telefone: string | null;
  emailContato: string | null;
  usuario: {
    id: string;
    nome: string | null;
    email: string;
  };
};

export default function DetalhesEmpresaPage() {
  const params = useParams();
  const router = useRouter();
  const empresaId = params.id as string;

  const [empresa, setEmpresa] = useState<Partial<EmpresaDetalhes>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = useCallback(async () => {
    if (!empresaId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/empresas/${empresaId}`);
      if (!res.ok) throw new Error('Falha ao carregar dados da empresa.');
      const data = await res.json();
      setEmpresa(data);
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : 'Erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch(`/api/admin/empresas/${empresaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar as alterações.');
      }
      setMessage('Alterações salvas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminLayout><div className="flex h-full items-center justify-center">Carregando...</div></AdminLayout>;
  }

  if (!empresa?.id) {
    return <AdminLayout><div className="flex h-full items-center justify-center text-red-500">Erro: {message || 'Empresa não encontrada.'}</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <header className="mb-8">
        <Link href="/admin/empresas" className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Todas as Empresas
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 font-display">Detalhes e Edição da Empresa</h1>
      </header>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700">Razão Social</label><input id="razaoSocial" name="razaoSocial" value={empresa.razaoSocial || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700">Nome Fantasia</label><input id="nomeFantasia" name="nomeFantasia" value={empresa.nomeFantasia || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label><input id="cnpj" name="cnpj" value={empresa.cnpj || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço</label><input id="endereco" name="endereco" value={empresa.endereco || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label><input id="telefone" name="telefone" value={empresa.telefone || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
          <div><label htmlFor="emailContato" className="block text-sm font-medium text-gray-700">Email de Contato</label><input id="emailContato" name="emailContato" value={empresa.emailContato || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
        </div>
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800">Usuário Responsável</h3>
          <p className="text-sm text-gray-600 mt-2"><strong>Nome:</strong> {empresa.usuario?.nome || 'Não informado'}</p>
          <p className="text-sm text-gray-600"><strong>Email:</strong> {empresa.usuario?.email}</p>
        </div>
        <div className="flex justify-end items-center gap-4">
          {message && <p className={`text-sm ${message.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-2 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b] disabled:opacity-50">
            <Save className="h-5 w-5" />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

