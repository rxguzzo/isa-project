// src/app/dashboard/nova-empresa/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Fingerprint } from 'lucide-react';

export default function NovaEmpresaPage() {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('Salvando...');

    try {
      const response = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ razaoSocial, cnpj }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Empresa cadastrada com sucesso! Redirecionando...');
        // router.refresh() informa ao Next.js para recarregar os dados na próxima página
        router.refresh(); 
        router.push('/dashboard');
      } else {
        setStatus(`Erro: ${data.message || 'Não foi possível cadastrar a empresa.'}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      setStatus('Erro de conexão. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o seletor de empresas
        </Link>
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Cadastrar Nova Empresa</h1>
          <p className="mb-6 text-gray-500">Preencha os dados da sua nova empresa.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label htmlFor="razaoSocial" className="sr-only">Razão Social</label>
              <Building2 className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="razaoSocial"
                name="razaoSocial"
                type="text"
                placeholder="Razão Social*"
                required
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3"
              />
            </div>
            <div className="relative">
              <label htmlFor="cnpj" className="sr-only">CNPJ</label>
              <Fingerprint className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="cnpj"
                name="cnpj"
                type="text"
                placeholder="CNPJ (opcional)"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-[#b91c1c] py-3 px-4 text-white font-semibold shadow-lg transition-all hover:bg-[#991b1b] disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Empresa'}
            </button>
          </form>
          {status && <p className="mt-4 text-center text-sm">{status}</p>}
        </div>
      </div>
    </div>
  );
}