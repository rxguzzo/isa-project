// src/app/dashboard/[empresaId]/page.tsx
'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, FilePlus2, Eye, FileText, Clock, CheckCircle, Edit, Trash, Mail, Phone, MapPin, X } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard'; // Reutilizando o StatCard do admin
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipagens
type Empresa = {
  id: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  endereco: string | null;
  telefone: string | null;
  emailContato: string | null;
  createdAt: string;
  updatedAt: string;
};
type Stats = { demandasAbertas: number; demandasEmAnalise: number; demandasResolvidas: number; };
type Problema = { id: string; assunto: string; status: string; createdAt: string; };

const initialEmpresaFormState: Partial<Empresa> = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  emailContato: '',
};

export default function PaginaDaEmpresa() {
  const params = useParams();
  const router = useRouter();
  const empresaId = params.empresaId as string;

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Empresa>>(initialEmpresaFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  // Estados para o modal de confirmação de exclusão
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!empresaId) return;
    setIsLoading(true);
    try {
      // Busca todos os dados em paralelo para mais performance
      const [resEmpresa, resStats, resProblemas] = await Promise.all([
        fetch(`/api/empresas/${empresaId}`),
        fetch(`/api/empresas/${empresaId}/stats`),
        fetch(`/api/empresas/${empresaId}/problemas`), // Assumindo que você tem essa API para o cliente também
      ]);

      if (!resEmpresa.ok) {
        // Se a empresa não for encontrada ou acesso negado, redirecionar
        const errorData = await resEmpresa.json();
        throw new Error(errorData.message || 'Falha ao carregar dados da empresa.');
      }
      if (!resStats.ok) throw new Error('Falha ao carregar estatísticas.');
      // if (!resProblemas.ok) throw new Error('Falha ao carregar problemas.'); // Remova ou ajuste esta linha se a API de problemas ainda não existe para o cliente

      const dataEmpresa = await resEmpresa.json();
      const dataStats = await resStats.json();
      const dataProblemas = resProblemas.ok ? await resProblemas.json() : []; // Se a API de problemas falhar, assume array vazio

      setEmpresa(dataEmpresa);
      setStats(dataStats);
      setProblemas(dataProblemas);

      // Preenche o formulário de edição com os dados atuais da empresa
      setEditForm({
        razaoSocial: dataEmpresa.razaoSocial,
        nomeFantasia: dataEmpresa.nomeFantasia,
        cnpj: dataEmpresa.cnpj,
        endereco: dataEmpresa.endereco,
        telefone: dataEmpresa.telefone,
        emailContato: dataEmpresa.emailContato,
      });

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Erro desconhecido ao carregar dashboard.');
      router.push('/dashboard'); // Se falhar, volta para o seletor de empresas
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler para mudança nos campos do formulário de edição
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handler para salvar as edições
  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setEditMessage(''); // Limpa mensagens anteriores

    try {
      const response = await fetch(`/api/empresas/${empresaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok) {
        setEditMessage('Empresa atualizada com sucesso!');
        await fetchData(); // Recarrega os dados da empresa após a edição
        setTimeout(() => setIsEditModalOpen(false), 1500); // Fecha o modal após um pequeno delay
      } else {
        setEditMessage(`Erro: ${data.message || 'Não foi possível atualizar a empresa.'}`);
      }
    } catch (error) {
      setEditMessage('Erro de conexão. Verifique sua rede.');
      console.error("Erro ao salvar edição da empresa:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para deletar a empresa
  const handleDeleteEmpresa = async () => {
    setIsSaving(true); // Reutilizando o estado de saving para o botão
    setEditMessage(''); // Limpa mensagens anteriores
    try {
      const response = await fetch(`/api/empresas/${empresaId}`, { method: 'DELETE' });
      const data = await response.json();

      if (response.ok) {
        alert('Empresa e seus dados deletados com sucesso!');
        router.push('/dashboard'); // Redireciona para o seletor de empresas
      } else {
        setEditMessage(`Erro: ${data.message || 'Não foi possível deletar a empresa.'}`);
        alert(`Erro ao deletar: ${data.message || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      setEditMessage('Erro de conexão. Verifique sua rede.');
      console.error("Erro de conexão ao deletar a empresa:", error);
      alert('Erro de conexão ao deletar a empresa.');
    } finally {
      setIsSaving(false);
      setIsDeleteConfirmOpen(false); // Fecha o modal de confirmação
    }
  };


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg animate-pulse">Carregando Dashboard da Empresa...</p>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">Empresa não encontrada ou acesso negado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <header className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in">
        <Link href="/dashboard" className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para seleção de empresas
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display flex items-center gap-3">
              <Building2 className="h-7 w-7 sm:h-9 sm:w-9 text-[#b91c1c]" />
              {empresa.razaoSocial}
            </h1>
            <p className="text-gray-500 mt-1">{empresa.cnpj ? `CNPJ: ${empresa.cnpj}` : 'CNPJ não informado'}</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 text-red-600 transition-colors"
            >
              <Trash className="h-4 w-4" />
              Deletar
            </button>
          </div>
        </div>
        
        {/* Detalhes da Empresa Integrados (Mais discretos) */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{empresa.emailContato || 'E-mail não informado'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{empresa.telefone || 'Telefone não informado'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{empresa.endereco || 'Endereço não informado'}</span>
          </div>
        </div>
      </header>

      {/* Cards de Estatísticas da Empresa */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <StatCard title="Demandas Abertas" value={stats?.demandasAbertas ?? 0} icon={FileText} />
        <StatCard title="Em Análise" value={stats?.demandasEmAnalise ?? 0} icon={Clock} />
        <StatCard title="Resolvidas" value={stats?.demandasResolvidas ?? 0} icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna de Ações Principais */}
        <div className="lg:col-span-1 space-y-8">
          <Link href={`/dashboard/${empresaId}/nova-demanda`} className="block group animate-fade-in delay-100">
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <FilePlus2 className="h-12 w-12 text-[#b91c1c] mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-display">Registrar Nova Demanda</h2>
              <p className="text-gray-600">Clique aqui para abrir um novo chamado de consultoria para esta empresa.</p>
            </div>
          </Link>
          <Link href={`/dashboard/${empresaId}/demandas`} className="block group animate-fade-in delay-200">
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <Eye className="h-12 w-12 text-gray-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-display">Acompanhar Demandas</h2>
              <p className="text-gray-600">Visualize o histórico e o status de todas as suas solicitações.</p>
            </div>
          </Link>
        </div>
        
        {/* Coluna de Atividades Recentes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md animate-fade-in delay-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {problemas.length > 0 ? (
              problemas.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.assunto}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNowStrict(new Date(p.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex-shrink-0"><StatusBadge status={p.status} /></div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma demanda registrada para esta empresa.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edição de Empresa */}
      {isEditModalOpen && empresa && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-scale-in">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Editar {empresa.razaoSocial}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-1">Razão Social*</label>
                <input
                  id="razaoSocial"
                  name="razaoSocial"
                  value={editForm.razaoSocial || ''}
                  onChange={handleEditFormChange}
                  placeholder="Razão Social"
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                />
              </div>
              <div>
                <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                <input
                  id="nomeFantasia"
                  name="nomeFantasia"
                  value={editForm.nomeFantasia || ''}
                  onChange={handleEditFormChange}
                  placeholder="Nome Fantasia"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                />
              </div>
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ*</label>
                <input
                  id="cnpj"
                  name="cnpj"
                  value={editForm.cnpj || ''}
                  onChange={(e) => {
                    // Máscara de CNPJ no frontend
                    let val = e.target.value.replace(/\D/g, '');
                    val = val.replace(/^(\d{2})(\d)/, '$1.$2');
                    val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                    val = val.replace(/\.(\d{3})(\d)/, '.$1/$2');
                    val = val.replace(/(\d{4})(\d)/, '$1-$2');
                    e.target.value = val;
                    handleEditFormChange(e);
                  }}
                  placeholder="CNPJ"
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                />
              </div>
              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  id="endereco"
                  name="endereco"
                  value={editForm.endereco || ''}
                  onChange={handleEditFormChange}
                  placeholder="Endereço"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  value={editForm.telefone || ''}
                  onChange={handleEditFormChange}
                  placeholder="Telefone"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                />
              </div>
              <div>
                <label htmlFor="emailContato" className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
                <input
                  id="emailContato"
                  name="emailContato"
                  value={editForm.emailContato || ''}
                  onChange={handleEditFormChange}
                  placeholder="Email de Contato"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                />
              </div>
              
              {editMessage && <p className={`mt-4 text-center text-sm ${editMessage.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{editMessage}</p>}

              <div className="flex justify-end gap-4 pt-4 border-t bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#b91c1c] text-white rounded-md hover:bg-[#991b1b] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteConfirmOpen && empresa && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-scale-in">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Confirmar Exclusão</h3>
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700">Você tem certeza que deseja deletar a empresa <strong className="font-semibold">{empresa.razaoSocial}</strong>?</p>
              <p className="text-sm text-red-600 mt-2">Esta ação é irreversível e irá deletar todos os dados relacionados a esta empresa (demandas, etc.). Usuários associados terão sua associação removida.</p>
            </div>
            <div className="flex justify-end gap-4 p-4 border-t bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteEmpresa}
                disabled={isSaving}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Deletando...' : 'Deletar Empresa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}