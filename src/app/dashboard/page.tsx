// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// O hook useAuth não é mais necessário aqui
import {
  LayoutDashboard,
  FilePlus2,
  LogOut,
  ChevronDown,
  Paperclip,
  Send,
} from 'lucide-react';

// Tipagem para os dados do problema/chamado
type Problema = {
  id: string;
  assunto: string;
  categoria: string;
  status: string;
  createdAt: string;
};

// Tipagem para os dados da empresa
type Empresa = {
  razaoSocial: string;
  email: string;
};

export default function PaginaDashboard() {
  const router = useRouter();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o formulário
  const [categoria, setCategoria] = useState('');
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    // Como o middleware protege esta rota, podemos assumir que o usuário
    // está autenticado e buscar os dados diretamente.
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // O navegador envia o cookie 'auth_token' automaticamente
        const [resEmpresa, resProblemas] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/problemas'),
        ]);

        if (!resEmpresa.ok || !resProblemas.ok) {
          // Se alguma API falhar (ex: token expirado), o middleware já deve ter agido,
          // mas como fallback, redirecionamos para o login.
          throw new Error('Falha na autenticação ou na busca de dados.');
        }

        const dataEmpresa = await resEmpresa.json();
        const dataProblemas = await resProblemas.json();
        setEmpresa(dataEmpresa);
        setProblemas(dataProblemas);
        
      } catch (err: any) {
        console.error("Erro no dashboard:", err);
        // Em caso de qualquer erro de fetch, o melhor a fazer é deslogar e ir para o login.
        handleLogout(true); // O 'true' evita uma chamada dupla de logout
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // O array de dependências pode ser vazio aqui

  const handleLogout = async (isErrorFlow = false) => {
    if (!isErrorFlow) {
        await fetch('/api/auth/logout', { method: 'POST' });
    }
    router.push('/login');
  };
  
  const handleSubmitChamado = async (event: FormEvent) => {
    event.preventDefault();
    setFormStatus('Enviando...');
    
    // O cookie é enviado automaticamente pelo navegador
    const response = await fetch('/api/problemas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, assunto, descricao }),
    });

    if (response.ok) {
      const novoProblema = await response.json();
      setProblemas([novoProblema, ...problemas]);
      setFormStatus('Chamado enviado com sucesso!');
      setCategoria('');
      setAssunto('');
      setDescricao('');
    } else {
      const data = await response.json();
      setFormStatus(`Erro: ${data.message || 'Tente novamente.'}`);
    }
  };

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

  // Enquanto os dados são carregados, exibe uma tela de loading
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

        {/* Seção de Formulário */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FilePlus2 className="h-6 w-6 mr-2 text-[#b91c1c]" />
            Relatar um Novo Problema
          </h2>
          <form onSubmit={handleSubmitChamado} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoria" className="sr-only">Categoria*</label>
                <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#fecaca]">
                  <option value="" disabled>Selecione uma categoria*</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Jurídico">Jurídico</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <input type="text" value={assunto} onChange={(e) => setAssunto(e.target.value)} placeholder="Assunto*" required className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#fecaca]" />
            </div>
            <div>
              <label htmlFor="descricao" className="sr-only">Descrição detalhada*</label>
              <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição detalhada do problema*" required rows={5} className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#fecaca]"></textarea>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">O upload de arquivos será implementado em breve.</span>
              <button type="submit" className="px-6 py-2 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b] flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </button>
            </div>
            {formStatus && <p className="text-sm text-center mt-2">{formStatus}</p>}
          </form>
        </section>

        {/* Seção de Lista de Chamados */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Meus Chamados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {problemas.length > 0 ? (
                  problemas.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.assunto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">
                      Nenhum chamado registrado ainda.
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