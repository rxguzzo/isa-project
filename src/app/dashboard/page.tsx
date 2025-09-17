// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, PlusCircle, LogOut } from 'lucide-react';

type Empresa = {
  id: string;
  razaoSocial: string;
  cnpj: string | null;
};

export default function SeletorDeEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch('/api/empresas/minhas-empresas');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setEmpresas(data);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmpresas();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando empresas...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="text-xl font-bold text-gray-800">ISA</span>
          {/* ===== CORREÇÃO AQUI ===== */}
          <button onClick={() => handleLogout()} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>
      <main className="container mx-auto max-w-7xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Selecione ou Crie uma Empresa</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {empresas.map((empresa) => (
            <Link key={empresa.id} href={`/dashboard/${empresa.id}`}>
              <div className="group flex flex-col justify-between h-48 rounded-lg border bg-white p-6 transition-all hover:border-[#b91c1c] hover:shadow-lg cursor-pointer">
                <div>
                  <Briefcase className="h-8 w-8 text-gray-400 group-hover:text-[#b91c1c] mb-4" />
                  <h2 className="text-lg font-semibold text-gray-800">{empresa.razaoSocial}</h2>
                </div>
                <p className="text-sm text-gray-500">{empresa.cnpj || 'CNPJ não informado'}</p>
              </div>
            </Link>
          ))}
          <Link href="/dashboard/nova-empresa">
            <div className="group flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 text-gray-500 transition-all hover:border-[#b91c1c] hover:text-[#b91c1c] hover:shadow-lg cursor-pointer">
              <PlusCircle className="h-10 w-10" />
              <p className="mt-2 font-semibold">Adicionar Nova Empresa</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}