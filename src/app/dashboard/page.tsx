// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FilePlus2,
  LogOut,
  ChevronDown,
  Send,
  Star,
} from 'lucide-react';

// ==========================================================
// ===== TIPAGENS ATUALIZADAS PARA O NOVO FORMULÁRIO =====
// ==========================================================
type Problema = {
  id: string;
  areaDemanda: string; // Vindo do BD como string (ex: "Estratégia, Marketing")
  assunto: string;
  descricao: string;
  objetivos?: string;
  nivelUrgencia: string;
  orcamento?: string;
  comoConheceu?: string;
  consentimentoLGPD: boolean;
  disponibilidadeVisita: boolean;
  status: string;
  createdAt: string;
};

type Empresa = {
  razaoSocial: string;
  email: string;
};

// ============================================================
// ===== ESTADO INICIAL PARA O NOVO FORMULÁRIO DETALHADO =====
// ============================================================
const initialState = {
  areaDemanda: [] as string[], // Frontend lida como array para checkboxes
  assunto: '',
  descricao: '',
  objetivos: '',
  nivelUrgencia: 'baixa', // Padrão
  orcamento: '',
  comoConheceu: '',
  consentimentoLGPD: false,
  disponibilidadeVisita: false,
};

export default function PaginaDashboard() {
  const router = useRouter();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formState, setFormState] = useState(initialState);
  const [formStatus, setFormStatus] = useState('');

  // ===================================================
  // ===== useEffect para carregar dados da empresa e problemas =====
  // ===================================================
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resEmpresa, resProblemas] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/problemas'),
        ]);

        if (!resEmpresa.ok || !resProblemas.ok) {
          throw new Error('Falha na autenticação ou na busca de dados.');
        }

        const dataEmpresa = await resEmpresa.json();
        const dataProblemas = await resProblemas.json();
        setEmpresa(dataEmpresa);
        setProblemas(dataProblemas);
        
      } catch (err) { // <-- MUDANÇA AQUI: REMOVIDO ': any'
        console.error("Erro no dashboard:", err);
        // Verificamos se o erro é uma instância de Error para acessar a propriedade 'message'
        if (err instanceof Error) {
          console.error(err.message); 
        }
        handleLogout(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]); // Adicione router como dependência se você for usá-lo dentro do useEffect

  // ===================================================
  // ===== Funções de Manipulação do Formulário =====
  // ===================================================
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAreaDemandaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormState(prev => {
      const areas = checked
        ? [...prev.areaDemanda, value]
        : prev.areaDemanda.filter(area => area !== value);
      return { ...prev, areaDemanda: areas };
    });
  };

  const handleSubmitChamado = async (event: FormEvent) => {
    event.preventDefault();
    if (!formState.consentimentoLGPD) {
      setFormStatus('Erro: Você precisa aceitar os termos da LGPD.');
      return;
    }
    // Adicione uma validação mínima para areaDemanda
    if (formState.areaDemanda.length === 0) {
      setFormStatus('Erro: Selecione pelo menos uma Área da Demanda.');
      return;
    }
    if (!formState.assunto.trim() || !formState.descricao.trim()) {
      setFormStatus('Erro: Assunto e Descrição são obrigatórios.');
      return;
    }


    setFormStatus('Enviando solicitação...');
    
    // O cookie é enviado automaticamente pelo navegador
    const response = await fetch('/api/problemas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState), // Envia o estado completo, com areaDemanda como array
    });

    if (response.ok) {
      const novoProblema = await response.json();
      setProblemas([novoProblema, ...problemas]);
      setFormStatus('Solicitação enviada com sucesso!');
      setFormState(initialState); // Limpa o formulário
    } else {
      const data = await response.json();
      setFormStatus(`Erro: ${data.message || 'Tente novamente.'}`);
    }
  };

  const handleLogout = async (isErrorFlow = false) => {
    if (!isErrorFlow) {
        await fetch('/api/auth/logout', { method: 'POST' });
    }
    router.push('/login');
  };
  
  // ===================================================
  // ===== Componente de StatusBadge (mesmo de antes) =====
  // ===================================================
  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles: { [key: string]: string } = {
      'aberto': 'bg-blue-100 text-blue-800',
      'em análise': 'bg-yellow-100 text-yellow-800',
      'resolvido': 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-lg font-semibold">Carregando Dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar de Navegação */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-md hidden lg:flex flex-col">
        <div className="flex h-16 items-center justify-center border-b">
          <span className="text-2xl font-bold text-gray-800">ISA</span>
        </div>
        <nav className="mt-6 flex-1">
          <a href="#" className="flex items-center px-6 py-3 text-[#b91c1c] bg-[#fef2f2]">
            <LayoutDashboard className="h-5 w-5" />
            <span className="ml-3 font-semibold">Dashboard</span>
          </a>
        </nav>
        <div className="border-t p-4">
          <button onClick={() => handleLogout()} className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100">
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600">
              {empresa ? empresa.razaoSocial : 'Empresa'}
            </span>
            <ChevronDown className="ml-1 h-5 w-5 text-gray-500" />
          </div>
        </header>

        {/* ============================================== */}
        {/* ===== Seção do NOVO Formulário Aprimorado ===== */}
        {/* ============================================== */}
        <section className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Relatar Nova Demanda</h2>
          <form onSubmit={handleSubmitChamado} className="space-y-8">
            {/* Seção: Entendimento da Demanda */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-700 mb-4">Entendimento da Demanda</legend>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Área da Demanda* (selecione uma ou mais)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Estratégia e Planejamento', 'Gestão Financeira', 'Marketing e Vendas', 'Processos e Operações', 'Recursos Humanos', 'Outras'].map(area => (
                      <label key={area} className="flex items-center space-x-2">
                        <input type="checkbox" name="areaDemanda" value={area} onChange={handleAreaDemandaChange} checked={formState.areaDemanda.includes(area)} className="rounded text-[#b91c1c] focus:ring-[#991b1b]" />
                        <span>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-gray-600 mb-1">Assunto*</label>
                  <input id="assunto" name="assunto" type="text" value={formState.assunto} onChange={handleFormChange} required className="w-full p-2 border rounded-md bg-gray-50"/>
                </div>

                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-600 mb-1">Descrição do Problema ou Necessidade*</label>
                  <textarea id="descricao" name="descricao" value={formState.descricao} onChange={handleFormChange} required rows={5} className="w-full p-2 border rounded-md bg-gray-50"></textarea>
                </div>

                <div>
                  <label htmlFor="objetivos" className="block text-sm font-medium text-gray-600 mb-1">Objetivos Esperados com a Consultoria (opcional)</label>
                  <input id="objetivos" name="objetivos" type="text" value={formState.objetivos} onChange={handleFormChange} className="w-full p-2 border rounded-md bg-gray-50"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Nível de Urgência*</label>
                  <div className="flex space-x-6">
                    {['Baixa', 'Média', 'Alta'].map(urgencia => (
                      <label key={urgencia} className="flex items-center space-x-2">
                        <input type="radio" name="nivelUrgencia" value={urgencia.toLowerCase()} checked={formState.nivelUrgencia === urgencia.toLowerCase()} onChange={handleFormChange} required className="text-[#b91c1c] focus:ring-[#991b1b]" />
                        <span>{urgencia}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Seção: Informações Complementares */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-700 mb-4">Informações Complementares</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orcamento" className="block text-sm font-medium text-gray-600 mb-1">Orçamento Disponível (opcional)</label>
                  <select id="orcamento" name="orcamento" value={formState.orcamento} onChange={handleFormChange} className="w-full p-2 border rounded-md bg-gray-50">
                    <option value="">A definir</option>
                    <option value="ate-5k">Até R$ 5.000</option>
                    <option value="5k-10k">R$ 5.000 - R$ 10.000</option>
                    <option value="acima-10k">Acima de R$ 10.000</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comoConheceu" className="block text-sm font-medium text-gray-600 mb-1">Como conheceu a ISA? (opcional)</label>
                  <input id="comoConheceu" name="comoConheceu" type="text" value={formState.comoConheceu} onChange={handleFormChange} className="w-full p-2 border rounded-md bg-gray-50"/>
                </div>
              </div>
            </fieldset>

            {/* Seção: Consentimento */}
            <fieldset className="space-y-4">
              <label className="flex items-start space-x-2">
                <input type="checkbox" name="consentimentoLGPD" checked={formState.consentimentoLGPD} onChange={handleCheckboxChange} required className="mt-1 rounded text-[#b91c1c] focus:ring-[#991b1b]" />
                <span className="text-sm text-gray-600">Autorizo o uso dos meus dados para contato e propostas de consultoria, conforme a Lei Geral de Proteção de Dados (LGPD).*</span>
              </label>
              <label className="flex items-start space-x-2">
                <input type="checkbox" name="disponibilidadeVisita" checked={formState.disponibilidadeVisita} onChange={handleCheckboxChange} className="mt-1 rounded text-[#b91c1c] focus:ring-[#991b1b]" />
                <span className="text-sm text-gray-600">Possuo disponibilidade para uma eventual visita técnica da equipe da empresa ISA.</span>
              </label>
            </fieldset>

            <div className="flex justify-end">
              <button type="submit" className="px-8 py-3 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b]">
                Enviar Solicitação
              </button>
            </div>
            {formStatus && <p className="text-sm text-center mt-2">{formStatus}</p>}
          </form>
        </section>

        {/* ================================================== */}
        {/* ===== Seção de Lista de Chamados (atualizada) ===== */}
        {/* ================================================== */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Minhas Solicitações de Consultoria</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Áreas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgência</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {problemas.length > 0 ? (
                  problemas.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.assunto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Exibindo as áreas da demanda, separadas por vírgula */}
                        {p.areaDemanda.split(', ').map((area, index) => (
                          <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 mr-1 mb-1">
                            {area}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{p.nivelUrgencia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhuma solicitação de consultoria registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}