// src/app/dashboard/[empresaId]/page.tsx
'use client';

import { FilePlus2, Eye, ArrowLeft, Building2, LogOut } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

type Empresa = {
    id: string;
    razaoSocial: string;
    cnpj: string | null;
};

export default function PaginaDaEmpresa() {
    const params = useParams();
    const empresaId = params.empresaId as string;
    const router = useRouter();
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                const res = await fetch(`/api/empresas/${empresaId}`); // Precisaremos criar esta API
                if (!res.ok) {
                    throw new Error('Empresa não encontrada ou não autorizada');
                }
                const data = await res.json();
                setEmpresa(data);
            } catch (error) {
                console.error("Erro ao carregar dados da empresa:", error);
                router.push('/dashboard'); // Redireciona de volta para a seleção se houver erro
            } finally {
                setIsLoading(false);
            }
        };
        if (empresaId) {
            fetchEmpresa();
        }
    }, [empresaId, router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center text-lg font-semibold">Carregando detalhes da empresa...</div>;
    }

    if (!empresa) {
        return <div className="flex h-screen items-center justify-center text-lg font-semibold text-red-600">Empresa não encontrada.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8 bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                    <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para seleção de empresas
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                        <Building2 className="h-9 w-9 text-gray-700 mr-3" />
                        {empresa.razaoSocial}
                    </h1>
                    <p className="text-gray-500 mt-1">{empresa.cnpj ? `CNPJ: ${empresa.cnpj}` : 'CNPJ não informado'}</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                    <LogOut className="h-4 w-4" />
                    Sair
                </button>
            </header>

            <main className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Card para Registrar Nova Demanda */}
                <Link href={`/dashboard/${empresaId}/nova-demanda`}>
                    <div className="group rounded-lg bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                        <FilePlus2 className="h-12 w-12 text-[#b91c1c] mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registrar Nova Demanda</h2>
                        <p className="text-gray-600">Clique aqui para abrir um novo chamado de consultoria, detalhando sua necessidade.</p>
                    </div>
                </Link>

                {/* Card para Acompanhar Demandas (Esta página ainda será criada) */}
                <Link href={`/dashboard/${empresaId}/demandas`}>
                    <div className="group rounded-lg bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                        <Eye className="h-12 w-12 text-gray-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Acompanhar Demandas</h2>
                        <p className="text-gray-600">Visualize o histórico e o status de todas as suas solicitações anteriores para esta empresa.</p>
                    </div>
                </Link>
            </main>
        </div>
    );
}