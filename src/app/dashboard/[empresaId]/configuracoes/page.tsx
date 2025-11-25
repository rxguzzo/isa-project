'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function ConfiguracoesEmpresaPage() {
  const { empresaId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    emailContato: '',
    telefone: '',
    endereco: '',
  });

  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch(`/api/empresas/${empresaId}`);
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
      }
    };
    fetchEmpresa();
  }, [empresaId]);

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 14);
    } else {
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cnpj') formattedValue = formatCNPJ(value);
    if (name === 'telefone') formattedValue = formatTelefone(value);

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus('Salvando alterações...');

    try {
      const res = await fetch(`/api/empresas/${empresaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('Alterações salvas com sucesso!');
        router.refresh();
      } else {
        setStatus('Erro ao salvar. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setStatus('Erro de conexão. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <Link
          href={`/dashboard/${empresaId}`}
          className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações da Empresa</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset>
            <legend className="text-lg font-semibold text-gray-700 mb-4">Dados Cadastrais</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="razaoSocial"
                value={formData.razaoSocial}
                onChange={handleChange}
                required
                placeholder="Razão Social"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              />
              <input
                name="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={handleChange}
                placeholder="Nome Fantasia"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              />
              <input
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                required
                placeholder="CNPJ"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              />
              <input
                name="emailContato"
                value={formData.emailContato}
                onChange={handleChange}
                placeholder="E-mail de contato"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              />
              <input
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              />
              <input
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Endereço"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              />
            </div>
          </fieldset>

          <div className="flex justify-end items-center">
            {status && (
              <p className={`text-sm mr-4 ${status.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
                {status}
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#b91c1c] text-white font-semibold rounded-md shadow hover:bg-[#991b1b]"
            >
              <Save className="h-4 w-4" />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
