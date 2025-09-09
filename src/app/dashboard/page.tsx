// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
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
  // adicione outros campos se precisar
};

export default function PaginaDashboard() {
  const isAuth = useAuth();
  const router = useRouter();

  // NOVO ESTADO: para guardar os dados da empresa
  const [empresa, setEmpresa] = useState<Empresa | null>(null);

  // Estados do formulário
  const [categoria, setCategoria] = useState('');
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);

  // Estados da lista de chamados
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isAuth) {
      const token = localStorage.getItem('isa-token');
      const headers = { Authorization: `Bearer ${token}` };

      // Função para buscar os dados da empresa
      const fetchEmpresaData = async () => {
        try {
          const res = await fetch('/api/auth/me', { headers });
          if (res.ok) {
            const data = await res.json();
            setEmpresa(data);
          }
        } catch (error) {
          console.error("Erro ao buscar dados da empresa:", error);
        }
      };

      // Função para buscar os chamados
      const fetchProblemas = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/problemas', { headers });
          if (res.ok) {
            const data = await res.json();
            setProblemas(data);
          } else {
            router.push('/login');
          }
        } catch (error) {
          console.error("Erro ao buscar chamados:", error);
        } finally {
          setIsLoading(false);
        }
      };

      // Chama as duas funções
      fetchEmpresaData();
      fetchProblemas();
    }
  }, [isAuth, router]);

  const handleLogout = () => {
    localStorage.removeItem('isa-token');
    router.push('/login');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleSubmitChamado = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('Enviando chamado...');
    
    const token = localStorage.getItem('isa-token');
    const response = await fetch('/api/problemas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ categoria, assunto, descricao }),
    });

    if (response.ok) {
      const novoProblema = await response.json();
      setProblemas([novoProblema, ...problemas]);
      setStatus('Chamado enviado com sucesso!');
      setCategoria('');
      setAssunto('');
      setDescricao('');
      setArquivo(null);
    } else {
      const data = await response.json();
      setStatus(`Erro: ${data.message}`);
    }
  };

  if (!isAuth) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 flex-shrink-0 bg-white shadow-md">
        {/* ... (código da sidebar continua o mesmo) ... */}
        <div className="flex h-16 items-center justify-center border-b">
          <span className="text-2xl font-bold text-gray-800">ISA</span>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-6 py-3 text-[#b91c1c] bg-[#fef2f2]">
            <LayoutDashboard className="h-5 w-5" />
            <span className="ml-3 font-semibold">Dashboard</span>
          </a>
        </nav>
        <div className="absolute bottom-0 w-64 border-t p-4">
          <button onClick={handleLogout} className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100">
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center">
            {/* ===== MUDANÇA AQUI ===== */}
            <span className="text-sm font-medium text-gray-600">
              {empresa ? empresa.razaoSocial : 'Carregando...'}
            </span>
            <ChevronDown className="ml-1 h-5 w-5 text-gray-500" />
          </div>
        </header>

        {/* ... (código do formulário e da tabela continua o mesmo) ... */}
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
              <label htmlFor="descricao" className="sr-only">Descrição detalhada do problema*</label>
              <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição detalhada do problema*" required rows={5} className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-[#fecaca]"></textarea>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-gray-600 flex items-center hover:text-[#b91c1c]">
                <Paperclip className="h-4 w-4 mr-2" />
                {arquivo ? arquivo.name : 'Anexar arquivo (opcional)'}
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
              <button type="submit" className="px-6 py-2 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b] flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </button>
            </div>
            {status && <p className="text-sm text-center mt-2">{status}</p>}
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Meus Chamados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-4">Carregando chamados...</td></tr>
                ) : (
                  problemas.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.assunto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.categoria}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}