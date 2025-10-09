'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

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

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'cnpj') maskedValue = formatCNPJ(value);
    if (name === 'telefone') maskedValue = formatTelefone(value);
    setEmpresa({ ...empresa, [name]: maskedValue });
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
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center text-gray-600 text-lg">Carregando...</div>
      </AdminLayout>
    );
  }

  if (!empresa?.id) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center text-red-600 text-lg">
          Erro: {message || 'Empresa não encontrada.'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <Link href="/admin/empresas" className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Todas as Empresas
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 font-display">Detalhes da Empresa</h1>
        </header>

        <form onSubmit={handleSave} className="bg-white p-10 rounded-xl shadow-lg space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { id: 'razaoSocial', label: 'Razão Social', value: empresa.razaoSocial },
              { id: 'nomeFantasia', label: 'Nome Fantasia', value: empresa.nomeFantasia },
              { id: 'endereco', label: 'Endereço', value: empresa.endereco },
              { id: 'emailContato', label: 'Email de Contato', value: empresa.emailContato },
            ].map(({ id, label, value }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  id={id}
                  name={id}
                  value={value || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  placeholder={`Digite ${label.toLowerCase()}`}
                />
              </div>
            ))}

            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input
                id="cnpj"
                name="cnpj"
                value={empresa.cnpj || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                inputMode="numeric"
                maxLength={18}
                placeholder="99.999.999/9999-99"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                value={empresa.telefone || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                inputMode="numeric"
                maxLength={15}
                placeholder="(99) 99999-9999"
              />
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Usuário Responsável</h3>
            <p className="text-sm text-gray-600"><strong>Nome:</strong> {empresa.usuario?.nome || 'Não informado'}</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {empresa.usuario?.email}</p>
          </div>

          <div className="flex justify-between items-center">
            {message && (
              <div role="alert" className={`text-sm px-4 py-2 rounded-md ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 transition disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
