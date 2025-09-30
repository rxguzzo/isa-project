'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, PlusCircle, LogOut, Settings } from 'lucide-react'; // 1. Importe o ícone de Configurações
import { motion, Variants } from 'framer-motion';

type Empresa = {
  id: string;
  razaoSocial: string;
  cnpj: string | null;
};

// Variantes de animação para o container e os cards
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Anima os cards um após o outro
    },
  },
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export default function SeletorDeEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Busca as empresas e os dados do usuário em paralelo
      const [resEmpresas, resUser] = await Promise.all([
        fetch('/api/empresas/minhas-empresas'),
        fetch('/api/auth/me'),
      ]);
      
      if (!resEmpresas.ok || !resUser.ok) {
        throw new Error('Falha ao buscar dados. Sua sessão pode ter expirado.');
      }
      
      const dataEmpresas = await resEmpresas.json();
      const dataUser = await resUser.json();
      
      setEmpresas(dataEmpresas);
      setUserName(dataUser.nome || 'Usuário');

    } catch (error) {
      console.error(error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-lg font-semibold animate-pulse">Carregando seu painel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="text-xl font-bold text-gray-800 font-display">ISA</span>
          {/* 2. Adicione um contêiner para os botões */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard/configuracoes" className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Bem-vindo(a), {userName}!</h1>
          <p className="text-lg text-gray-500 mt-1">Selecione uma empresa para gerenciar ou adicione uma nova para começar.</p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Card para cada empresa */}
          {empresas.map((empresa) => (
            <motion.div key={empresa.id} variants={cardVariants}>
              <Link href={`/dashboard/${empresa.id}`} className="block">
                <div className="group flex h-48 flex-col justify-between rounded-lg border bg-white p-6 transition-all duration-300 hover:border-[#b91c1c] hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <Briefcase className="h-8 w-8 text-[#b91c1c] mb-4" />
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#b91c1c] transition-colors">{empresa.razaoSocial}</h2>
                  </div>
                  <p className="text-sm text-gray-500">{empresa.cnpj || 'CNPJ não informado'}</p>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Card para adicionar nova empresa */}
          <motion.div variants={cardVariants}>
            <Link href="/dashboard/nova-empresa" className="block">
              <div className="group flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 text-gray-500 transition-all duration-300 hover:border-[#b91c1c] hover:text-[#b91c1c] hover:shadow-xl hover:bg-white">
                <PlusCircle className="h-10 w-10" />
                <p className="mt-2 font-semibold">Adicionar Nova Empresa</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

