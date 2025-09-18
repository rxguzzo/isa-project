// src/app/dashboard/nova-empresa/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Fingerprint, MapPin, Phone, Mail, PanelTopOpen } from 'lucide-react';

// Componente InputField (mantido para consistência)
type InputFieldProps = {
  icon: React.ElementType;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  mask?: 'cnpj' | null; // Adicionado para máscaras
};

const InputField = ({ icon: Icon, name, type, placeholder, value, onChange, required = false, mask = null }: InputFieldProps) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      id={name} // Adiciona id para label HTML for
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={(e) => {
        if (mask === 'cnpj') {
          // Máscara de CNPJ: XX.XXX.XXX/YYYY-ZZ
          let val = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
          val = val.replace(/^(\d{2})(\d)/, '$1.$2');
          val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
          val = val.replace(/\.(\d{3})(\d)/, '.$1/$2');
          val = val.replace(/(\d{4})(\d)/, '$1-$2');
          e.target.value = val;
        }
        onChange(e);
      }}
      className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-gray-800 transition-colors focus:border-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-[#fecaca]"
    />
  </div>
);


export default function NovaEmpresaPage() {
  const [form, setForm] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    emailContato: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('Cadastrando empresa...');

    try {
      const response = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Empresa cadastrada com sucesso! Redirecionando...');
        // router.refresh() para recarregar o layout do dashboard e mostrar a nova empresa
        router.refresh(); 
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500); // Pequeno delay para a mensagem de sucesso
      } else {
        setMessage(`Erro: ${data.message || 'Não foi possível cadastrar a empresa.'}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      setMessage('Erro de conexão. Verifique sua rede.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Painel Esquerdo de Branding (igual ao login/cadastro) */}
      <div
        className="relative hidden lg:flex flex-col items-center justify-center bg-gray-50 p-8 text-center animate-fade-in"
        style={{
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '1.5rem 1.5rem',
        }}
      >
        <div className="relative z-10">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <PanelTopOpen className="h-8 w-8 text-[#b91c1c]" />
            <span className="text-3xl font-bold text-gray-800 font-display">ISA</span>
          </Link>
          <h1 className="text-5xl font-bold leading-tight text-gray-900 font-display">
            Nova Empresa na Plataforma
          </h1>
          <p className="mt-4 max-w-sm text-lg text-gray-600">
            Adicione uma nova empresa para gerenciar suas demandas e otimizar processos.
          </p>
        </div>
      </div>
      
      {/* Painel Direito com Formulário */}
      <div className="flex items-center justify-center bg-white p-6 sm:p-12 animate-slide-in-right">
        <div className="w-full max-w-md">
          <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-[#b91c1c]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o seletor de empresas
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-gray-800 font-display">Cadastrar Empresa</h1>
          <p className="mb-6 text-gray-500">Preencha os dados da nova empresa.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-1">Razão Social*</label>
              <InputField 
                icon={Building2} 
                name="razaoSocial" 
                type="text" 
                placeholder="Ex: ISA Soluções Administrativas Ltda" 
                value={form.razaoSocial} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
              <InputField 
                icon={Building2} 
                name="nomeFantasia" 
                type="text" 
                placeholder="Ex: ISA Tech" 
                value={form.nomeFantasia} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ*</label>
              <InputField 
                icon={Fingerprint} 
                name="cnpj" 
                type="text" 
                placeholder="Ex: 00.000.000/0000-00" 
                value={form.cnpj} 
                onChange={handleChange} 
                required 
                mask="cnpj" // Aplica a máscara de CNPJ
              />
            </div>
            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <InputField 
                icon={MapPin} 
                name="endereco" 
                type="text" 
                placeholder="Ex: Rua Exemplo, 123, Bairro" 
                value={form.endereco} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <InputField 
                icon={Phone} 
                name="telefone" 
                type="tel" 
                placeholder="Ex: (XX) XXXX-XXXX" 
                value={form.telefone} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label htmlFor="emailContato" className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
              <InputField 
                icon={Mail} 
                name="emailContato" 
                type="email" 
                placeholder="Ex: contato@empresa.com" 
                value={form.emailContato} 
                onChange={handleChange} 
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

          {message && <p className={`mt-4 text-center text-sm ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          
        </div>
      </div>
    </div>
  );
}