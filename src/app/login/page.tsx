// src/app/login/page.tsx
'use client';

import { useState, FormEvent, ChangeEventHandler, ElementType } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PanelTopOpen, Mail, Lock } from 'lucide-react';

// ===================================================================
// ===== MUDANÇA CRÍTICA: Componente e seu tipo movidos para FORA =====
// ===================================================================

type InputFieldProps = {
  icon: ElementType;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const InputField = ({ icon: Icon, name, type, placeholder, value, onChange }: InputFieldProps) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-gray-800 transition-colors focus:border-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-[#fecaca]"
    />
  </div>
);


export default function PaginaLogin() {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('Autenticando...');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Login bem-sucedido! Redirecionando...');
        localStorage.setItem('isa-token', data.token);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setStatus(`Erro: ${data.message || 'Credenciais inválidas.'}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      setStatus('Erro de conexão. Tente novamente.');
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
            Acesse sua Conta
          </h1>
          <p className="mt-4 max-w-sm text-lg text-gray-600">
            Gerencie seus chamados e acompanhe o status das suas solicitações.
          </p>
        </div>
      </div>
      
      {/* LADO DIREITO */}
      <div className="flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Login</h1>
          <p className="mb-6 text-gray-500">Bem-vindo de volta!</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField icon={Mail} name="email" type="email" placeholder="Email Corporativo" value={formData.email} onChange={handleChange} />
            <InputField icon={Lock} name="senha" type="password" placeholder="Senha" value={formData.senha} onChange={handleChange} />
            
            <button
              type="submit"
              className="w-full rounded-md bg-[#b91c1c] py-3 px-4 text-white font-semibold shadow-lg transition-all hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-2 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {status && <p className={`mt-4 text-center text-sm ${status.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>}

          <p className="mt-8 text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="font-semibold text-[#b91c1c] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}