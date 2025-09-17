// src/app/admin/configuracoes/page.tsx
'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout'; // Importe o AdminLayout
import { Settings, UsersRound, ScrollText, Database, HardDriveDownload, ArrowRight } from 'lucide-react'; // Ícone ArrowRight para os links

export default function AdminConfiguracoesPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl">
        {/* Cabeçalho da Página de Configurações */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-display">Configurações do Sistema</h1>
          <p className="text-gray-500 mt-1">Gerencie aspectos fundamentais e avançados do seu sistema.</p>
        </header>

        {/* Menu de Configurações em Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Gerenciamento de Usuários Admin */}
          <Link href="/admin/configuracoes/usuarios" className="group bg-white p-7 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start">
            <UsersRound className="h-10 w-10 text-red-600 mb-4 group-hover:text-red-700 transition-colors" />
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Gerenciar Usuários Admin</h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">Ajuste permissões, crie e remova usuários com acesso administrativo ao sistema.</p>
            <span className="text-red-600 font-semibold group-hover:text-red-800 transition-colors flex items-center gap-1">
              Acessar <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </Link>

          {/* Card: Log de Auditoria */}
          <Link href="/admin/configuracoes/auditoria" className="group bg-white p-7 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start">
            <ScrollText className="h-10 w-10 text-red-600 mb-4 group-hover:text-red-700 transition-colors" />
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Log de Auditoria</h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">Visualize todas as ações importantes realizadas no sistema para rastreabilidade e segurança.</p>
            <span className="text-red-600 font-semibold group-hover:text-red-800 transition-colors flex items-center gap-1">
              Acessar <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </Link>

          {/* Card: Gerenciamento de Banco de Dados (Exemplo) */}
          <div className="group bg-white p-7 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start">
            <Database className="h-10 w-10 text-gray-500 mb-4 group-hover:text-gray-700 transition-colors" />
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Gerenciar Banco de Dados</h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">Opções para backup, restauração e otimização do banco de dados.</p>
            <span className="text-gray-400 font-semibold flex items-center gap-1">
              Em breve <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </div>

          {/* Card: Exportação de Dados (Exemplo) */}
          <div className="group bg-white p-7 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start">
            <HardDriveDownload className="h-10 w-10 text-gray-500 mb-4 group-hover:text-gray-700 transition-colors" />
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Exportar Dados</h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">Exporte dados do sistema em diferentes formatos para análise externa.</p>
            <span className="text-gray-400 font-semibold flex items-center gap-1">
              Em breve <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </div>
          
          {/* Adicione mais cards conforme necessário */}
        </div>
      </div>
    </AdminLayout>
  );
}