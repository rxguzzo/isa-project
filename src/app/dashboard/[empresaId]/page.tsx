"use client";

import {
  FilePlus2,
  Eye,
  ArrowLeft,
  Building2,
  LogOut,
  BarChart2,
  Settings,
  FileText,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
        const res = await fetch(`/api/empresas/${empresaId}`);
        if (!res.ok)
          throw new Error("Empresa não encontrada ou não autorizada");
        const data = await res.json();
        setEmpresa(data);
      } catch (error) {
        console.error("Erro ao carregar dados da empresa:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    if (empresaId) fetchEmpresa();
  }, [empresaId, router]);

  const handleLogout = async () => {
    setIsLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#b91c1c] border-opacity-50"></div>
        <span className="ml-4 text-lg font-semibold text-gray-600">
          Carregando detalhes da empresa...
        </span>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-red-600">
        Empresa não encontrada.
      </div>
    );
  }

  const cardsComplementares = [
    {
      title: "Relatórios e Insights",
      description:
        "Veja métricas sobre suas demandas e áreas mais solicitadas.",
      icon: <BarChart2 className="h-10 w-10 text-gray-400 mb-3" />,
      href: null,
    },
    {
      title: "Configurações da Empresa",
      description: "Atualize dados cadastrais e contatos.",
      icon: <Settings className="h-10 w-10 text-gray-700 mb-3" />,
      href: `/dashboard/${empresaId}/configuracoes`,
    },
    {
      title: "Documentos e Arquivos",
      description: "Envie ou visualize documentos relacionados às demandas.",
      icon: <FileText className="h-10 w-10 text-gray-400 mb-3" />,
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"
      >
        <div>
          <Link
            href="/dashboard"
            className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para seleção de empresas
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            <Building2 className="h-9 w-9 text-[#b91c1c] mr-3" />
            {empresa.razaoSocial}
          </h1>
          <p className="text-gray-500 mt-1">
            {empresa.cnpj ? `CNPJ: ${empresa.cnpj}` : "CNPJ não informado"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${empresaId}/notificacoes`}
            aria-label="Notificações"
          >
            <button className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <Bell className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </motion.header>

      {/* Cards principais lado a lado */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={`/dashboard/${empresaId}/nova-demanda`}
            aria-label="Registrar nova demanda"
          >
            <div
              className="group rounded-xl bg-white p-8 shadow-xl border border-[#b91c1c] transition hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c] cursor-pointer"
              tabIndex={0}
              role="button"
            >
              <FilePlus2 className="h-14 w-14 text-[#b91c1c] mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-[#b91c1c] transition-colors">
                Registrar Nova Demanda
              </h2>
              <p className="text-gray-600 mb-4">
                Abra um novo chamado de consultoria detalhando sua necessidade.
              </p>
              <span className="text-sm text-[#b91c1c] font-semibold group-hover:underline">
                Iniciar
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={`/dashboard/${empresaId}/demandas`}
            aria-label="Acompanhar demandas"
          >
            <div
              className="group rounded-xl bg-white p-8 shadow-xl border border-gray-400 transition hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
              tabIndex={0}
              role="button"
            >
              <Eye className="h-14 w-14 text-gray-700 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-gray-700 transition-colors">
                Acompanhar Demandas
              </h2>
              <p className="text-gray-600 mb-4">
                Visualize o histórico e o status de todas as suas solicitações
                anteriores.
              </p>
              <span className="text-sm text-gray-700 font-semibold group-hover:underline">
                Ver histórico
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.section>

      {/* Cards complementares */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {cardsComplementares.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: card.href ? 1.02 : 1 }}
            whileTap={{ scale: card.href ? 0.98 : 1 }}
          >
            {card.href ? (
              <Link href={card.href} aria-label={card.title}>
                <div
                  className="group rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2  cursor-pointer"
                  tabIndex={0}
                  role="button"
                >
                  {card.icon}
                  <h3 className="text-lg font-semibold text-gray-800 mb-1  group-hover:text-gray-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </Link>
            ) : (
              <div
                className="group rounded-lg bg-gray-100 p-6 shadow-sm border border-gray-200 opacity-60 cursor-not-allowed"
                tabIndex={-1}
                aria-disabled="true"
              >
                {card.icon}
                <h3 className="text-lg font-semibold text-gray-500 mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{card.description}</p>
                <span className="text-xs text-gray-400 italic">
                  Indisponível no momento
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
