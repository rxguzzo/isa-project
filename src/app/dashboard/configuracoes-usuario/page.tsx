'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditarUsuarioPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch('/api/usuario');
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          nome: data.nome,
          email: data.email,
        }));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };
    fetchUsuario();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarSenha = (senha: string) => {
    const regras = [
      /.{8,}/, // mínimo 8 caracteres
      /[A-Z]/, // letra maiúscula
      /[a-z]/, // letra minúscula
      /[0-9]/, // número
      /[^A-Za-z0-9]/, // símbolo
    ];
    return regras.every(regra => regra.test(senha));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('');
    setIsSaving(true);

    if (formData.novaSenha && !validarSenha(formData.novaSenha)) {
      setStatus('A nova senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.');
      setIsSaving(false);
      return;
    }

    if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha) {
      setStatus('A confirmação da senha não corresponde à nova senha.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/usuario', {
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
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
            />
          </div>

          <hr className="my-4" />

          <div>
            <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 mb-1">Senha atual</label>
            <input
              id="senhaAtual"
              name="senhaAtual"
              value={formData.senhaAtual}
              onChange={handleChange}
              type="password"
              placeholder="Digite sua senha atual"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
            />
          </div>

          <div>
            <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
            <input
              id="novaSenha"
              name="novaSenha"
              value={formData.novaSenha}
              onChange={handleChange}
              type="password"
              placeholder="Nova senha segura"
              className="block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
            <input
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              type="password"
              placeholder="Confirme a nova senha"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
            />
          </div>

          <div className="flex justify-end items-center pt-4">
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
