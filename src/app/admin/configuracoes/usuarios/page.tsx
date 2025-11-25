'use client';

import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PlusCircle, Edit, Trash } from 'lucide-react';

// Tipo para os dados do usuário que vem da API de listagem
type Usuario = {
  id: string;
  nome: string;
  email: string;
  role: string;
  createdAt: string;
};

// Tipo para a resposta padrão com mensagem
type ApiMessage = { message?: string };

// NOVO TIPO: Para o estado do formulário de criação/edição
// Inclui a 'senha' que é opcional e não vem da API de listagem
type UsuarioFormState = Partial<Usuario> & {
  senha?: string;
};

const initialUserState: UsuarioFormState = { id: '', nome: '', email: '', senha: '', role: 'USER' };

export default function GerenciarUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UsuarioFormState>(initialUserState);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const deleteModalRef = useRef<HTMLDivElement | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios');
      if (!res.ok) throw new Error('Falha ao carregar usuários.');
      const data: Usuario[] = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Bloqueia o scroll do body quando modais abertos
  useEffect(() => {
    const prev = typeof document !== 'undefined' ? document.body.style.overflow : '';
    const anyOpen = isModalOpen || isDeleteConfirmOpen;
    if (typeof document !== 'undefined') document.body.style.overflow = anyOpen ? 'hidden' : prev;
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = prev;
    };
  }, [isModalOpen, isDeleteConfirmOpen]);

  // Foco inicial e Escape para fechar modais
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (isDeleteConfirmOpen) setIsDeleteConfirmOpen(false);
      }
    }
    if (isModalOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isModalOpen, isDeleteConfirmOpen]);

  type SavePayload = {
    nome?: string;
    email?: string;
    role?: string;
    senha?: string;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const method = currentUser.id ? 'PUT' : 'POST';
    const url = currentUser.id ? `/api/admin/usuarios/${currentUser.id}` : '/api/admin/usuarios';

    // Envia apenas os campos relevantes (não mandar senha vazia em edição)
    const payload: SavePayload = {
      nome: currentUser.nome,
      email: currentUser.email,
      role: currentUser.role,
    };
    if (currentUser.senha) payload.senha = currentUser.senha;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: ApiMessage = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao salvar usuário.');

      setIsModalOpen(false);
      setCurrentUser(initialUserState);
      await fetchUsuarios(); // Recarrega a lista de usuários
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro desconhecido.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser.id) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/usuarios/${currentUser.id}`, { method: 'DELETE' });
      const data: ApiMessage = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao deletar usuário.');

      setIsDeleteConfirmOpen(false);
      setCurrentUser(initialUserState);
      await fetchUsuarios(); // Recarrega a lista de usuários
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao deletar.');
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateModal = () => {
    setMessage('');
    setCurrentUser(initialUserState);
    setIsModalOpen(true);
  };

  const openEditModal = (user: Usuario) => {
    setMessage('');
    setCurrentUser({ ...user, senha: '' });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">Carregando usuários...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-display">Gerenciar Usuários</h1>
          <p className="text-gray-500 mt-1">Adicione, edite e remova usuários do sistema.</p>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b]"
            aria-label="Novo usuário"
          >
            <PlusCircle className="h-5 w-5" />
            Novo Usuário
          </button>
        </div>
      </header>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {/* Versão em tabela para telas >= sm */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-[700px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Perfil</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-4 font-medium">{user.nome}</td>
                  <td className="px-4 py-4 text-gray-600">{user.email}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title={`Editar ${user.nome}`}
                      aria-label={`Editar ${user.nome}`}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => { setCurrentUser(user); setIsDeleteConfirmOpen(true); }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title={`Deletar ${user.nome}`}
                      aria-label={`Deletar ${user.nome}`}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Versão em cards para telas pequenas */}
        <div className="sm:hidden space-y-3">
          {usuarios.map(user => (
            <div key={user.id} className="border rounded-md p-3 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-800">{user.nome}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded hover:bg-blue-50"
                  aria-label={`Editar ${user.nome}`}
                >
                  <Edit className="h-4 w-4" /> Editar
                </button>
                <button
                  onClick={() => { setCurrentUser(user); setIsDeleteConfirmOpen(true); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded hover:bg-red-50 text-red-600"
                  aria-label={`Deletar ${user.nome}`}
                >
                  <Trash className="h-4 w-4" /> Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criar/Editar Usuário */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={(e) => {
            // fechar ao clicar no backdrop (mas não quando clicar no conteúdo)
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-lg shadow-xl w-full max-w-lg relative z-10"
          >
            <h3 id="modal-title" className="text-lg font-semibold p-4 border-b">
              {currentUser.id ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Nome completo*</span>
                <input
                  ref={firstInputRef}
                  name="nome"
                  value={currentUser.nome || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, nome: e.target.value })}
                  placeholder="Nome Completo"
                  required
                  className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">E-mail*</span>
                <input
                  name="email"
                  type="email"
                  value={currentUser.email || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  placeholder="E-mail"
                  required
                  className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.id ? 'Nova senha (opcional)' : 'Senha*'}
                </span>
                <input
                  name="senha"
                  type="password"
                  onChange={(e) => setCurrentUser({ ...currentUser, senha: e.target.value })}
                  placeholder={currentUser.id ? 'Deixe em branco para não alterar' : 'Senha'}
                  required={!currentUser.id}
                  className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Perfil</span>
                <select
                  title="typeuser"
                  name="role"
                  value={currentUser.role || 'USER'}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                  className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option value="USER">Usuário Padrão</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </label>

              {message && <p className="text-sm text-red-600" role="alert">{message}</p>}
            </form>

            <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setCurrentUser(initialUserState); }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[#b91c1c] text-white rounded disabled:opacity-60"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDeleteConfirmOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
          <div
            ref={deleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10"
          >
            <h3 id="delete-modal-title" className="text-lg font-semibold p-4 border-b">Confirmar Exclusão</h3>
            <div className="p-6">
              <p>Você tem certeza que deseja deletar o usuário <strong>{currentUser.nome}</strong>?</p>
            </div>
            <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60"
              >
                {isSaving ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}