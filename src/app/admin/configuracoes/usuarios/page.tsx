'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
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
  // CORREÇÃO AQUI: Trocamos 'any' pelo nosso novo tipo 'UsuarioFormState'
  const [currentUser, setCurrentUser] = useState<UsuarioFormState>(initialUserState);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios');
      if (!res.ok) throw new Error('Falha ao carregar usuários.');
      const data = await res.json();
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

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const method = currentUser.id ? 'PUT' : 'POST';
    const url = currentUser.id ? `/api/admin/usuarios/${currentUser.id}` : '/api/admin/usuarios';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao salvar usuário.');
      
      setIsModalOpen(false);
      fetchUsuarios(); // Recarrega a lista de usuários
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao deletar usuário.');
      
      setIsDeleteConfirmOpen(false);
      fetchUsuarios(); // Recarrega a lista de usuários
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao deletar.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminLayout><div className="flex h-full items-center justify-center">Carregando usuários...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">Gerenciar Usuários</h1>
          <p className="text-gray-500 mt-1">Adicione, edite e remova usuários do sistema.</p>
        </div>
        <button onClick={() => { setCurrentUser(initialUserState); setIsModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b]">
          <PlusCircle className="h-5 w-5" />
          Novo Usuário
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
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
                <td className="px-4 py-4"><span className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></td>
                <td className="px-4 py-4 flex gap-2">
                  <button onClick={() => { setCurrentUser(user); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Editar"><Edit className="h-5 w-5" /></button>
                  <button onClick={() => { setCurrentUser(user); setIsDeleteConfirmOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Deletar"><Trash className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Criar/Editar Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-scale-in">
            <h3 className="text-lg font-semibold p-4 border-b">{currentUser.id ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input name="nome" value={currentUser.nome || ''} onChange={(e) => setCurrentUser({...currentUser, nome: e.target.value})} placeholder="Nome Completo*" required className="w-full p-2 border rounded" />
              <input name="email" type="email" value={currentUser.email || ''} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} placeholder="E-mail*" required className="w-full p-2 border rounded" />
              <input name="senha" type="password" onChange={(e) => setCurrentUser({...currentUser, senha: e.target.value})} placeholder={currentUser.id ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha*'} required={!currentUser.id} className="w-full p-2 border rounded" />
              <select  title ="typeuser" name="role" value={currentUser.role || 'USER'} onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})} className="w-full p-2 border rounded">
                <option value="USER">Usuário Padrão</option>
                <option value="ADMIN">Administrador</option>
              </select>
              {message && <p className="text-sm text-red-600">{message}</p>}
            </form>
            <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
              <button type="submit" onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-[#b91c1c] text-white rounded">{isSaving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteConfirmOpen && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-scale-in">
             <h3 className="text-lg font-semibold p-4 border-b">Confirmar Exclusão</h3>
             <div className="p-6">
               <p>Você tem certeza que deseja deletar o usuário <strong>{currentUser.nome}</strong>?</p>
             </div>
             <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
               <button type="button" onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
               <button onClick={handleDelete} disabled={isSaving} className="px-4 py-2 bg-red-600 text-white rounded">{isSaving ? 'Deletando...' : 'Deletar'}</button>
             </div>
           </div>
         </div>
      )}
    </AdminLayout>
  );
}

