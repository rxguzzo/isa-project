// src/app/cadastro/page.tsx
'use client';

import { useState, FormEvent, ChangeEventHandler, ElementType } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PanelTopOpen,
  Building2,
  Fingerprint,
  User,
  Mail,
  Phone,
  Lock,
} from 'lucide-react';

// ===================================================================
// ===== MUDANÇA CRÍTICA: Componente e seu tipo movidos para FORA =====
// ===================================================================

type InputFieldProps = {
  icon: ElementType;
  name: string;
  type: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const InputField = ({ icon: Icon, name, type, placeholder, onChange }: InputFieldProps) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required
      onChange={onChange}
      // Adicionando o 'value' aqui também para consistência, embora não estivesse causando o bug de foco
      // value={value} 
      className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-gray-800 transition-colors focus:border-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-[#fecaca]"
    />
  </div>
);

export default function PaginaCadastro() {
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpj: '',
    nomeResponsavel: '',
    email: '',
    telefone: '',
    senha: '',
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Tivemos que ajustar o handleChange para passar o value para o InputField
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('Cadastrando...');

    const response = await fetch('/api/empresas/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setStatus('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setStatus(`Erro: ${data.message || 'Não foi possível realizar o cadastro.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* LADO ESQUERDO */}
      <div
        className="relative hidden lg:flex flex-col items-center justify-center bg-gray-50 p-8 text-center"
        style={{
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '1.5rem 1.5rem',
        }}
      >
        <div className="relative z-10">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <PanelTopOpen className="h-8 w-8 text-[#b91c1c]" />
            <span className="text-3xl font-bold text-gray-800">ISA</span>
          </Link>
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            Bem-vindo à ISA
          </h1>
          <p className="mt-4 max-w-sm text-lg text-gray-600">
            Inteligência e Eficiência para a Gestão da Sua Empresa.
          </p>
        </div>
      </div>
      
      {/* LADO DIREITO */}
      <div className="flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Crie sua Conta</h1>
          <p className="mb-6 text-gray-500">Preencha os campos para começar.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField icon={Building2} name="razaoSocial" type="text" placeholder="Razão Social" onChange={handleChange} />
            <InputField icon={Fingerprint} name="cnpj" type="text" placeholder="CNPJ" onChange={handleChange} />
            <InputField icon={User} name="nomeResponsavel" type="text" placeholder="Nome do Responsável" onChange={handleChange} />
            <InputField icon={Mail} name="email" type="email" placeholder="Email Corporativo" onChange={handleChange} />
            <InputField icon={Phone} name="telefone" type="tel" placeholder="Telefone" onChange={handleChange} />
            <InputField icon={Lock} name="senha" type="password" placeholder="Senha" onChange={handleChange} />
            
            <button
              type="submit"
              className="w-full rounded-md bg-[#b91c1c] py-3 px-4 text-white font-semibold shadow-lg transition-all hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-2 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Criar Conta'}
            </button>
          </form>

          {status && <p className={`mt-4 text-center text-sm ${status.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>}

          <p className="mt-8 text-center text-sm text-gray-600">
            Já possui uma conta?{' '}
            <Link href="/login" className="font-semibold text-[#b91c1c] hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}