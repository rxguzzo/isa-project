// src/app/dashboard/[empresaId]/nova-demanda/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

// Estado inicial para o formulário
const initialState = {
  areaDemanda: [] as string[],
  assunto: '',
  descricao: '',
  objetivos: '',
  nivelUrgencia: 'media', // Valor padrão
  orcamento: '',
  comoConheceu: '',
  consentimentoLGPD: false,
  disponibilidadeVisita: false,
};

export default function NovaDemandaPage() {
  const router = useRouter();
  const params = useParams();
  const empresaId = params.empresaId as string; // Empresa ID obtido da URL

  const [formState, setFormState] = useState(initialState);
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Funções para manipular as mudanças no formulário
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

  // Função para enviar o formulário
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validações no frontend antes de enviar
    if (!formState.consentimentoLGPD) {
      setFormStatus('Erro: O consentimento de dados (LGPD) é obrigatório.');
      return;
    }
    if (formState.areaDemanda.length === 0) {
      setFormStatus('Erro: Selecione pelo menos uma Área da Demanda.');
      return;
    }
    if (!formState.assunto.trim() || !formState.descricao.trim()) {
      setFormStatus('Erro: Assunto e Descrição são obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setFormStatus('Enviando solicitação...');
    
    try {
      const response = await fetch('/api/problemas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-empresa-id': empresaId, // <--- AQUI ESTÁ A CORREÇÃO PRINCIPAL!
        },
        // O body agora NÃO PRECISA mais do empresaId, pois ele já foi para o header
        body: JSON.stringify(formState), 
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus('Solicitação enviada com sucesso! Redirecionando...');
        router.refresh(); // Diz ao Next.js para buscar os dados novamente na próxima página
        setTimeout(() => {
          router.push(`/dashboard/${empresaId}/demandas`); // Redireciona para a lista de demandas
        }, 2000);
      } else {
        setFormStatus(`Erro: ${data.message || 'Tente novamente.'}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erro de rede ou servidor:", error);
      setFormStatus("Erro de conexão. Verifique sua rede e tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <Link href={`/dashboard/${empresaId}`} className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o Dashboard da Empresa
        </Link>
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold font-display text-gray-800 mb-2">Formulário de Nova Demanda</h1>
          <p className="text-gray-600 mb-8">Por favor, preencha as informações abaixo com o máximo de detalhes possível.</p>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Seção: Entendimento da Demanda */}
            <fieldset>
              <legend className="text-xl font-semibold font-display text-gray-700 border-b pb-2 mb-4">Entendimento da Demanda</legend>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área da Demanda* (selecione uma ou mais)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                    {['Estratégia e Planejamento', 'Gestão Financeira', 'Marketing e Vendas', 'Processos e Operações', 'Recursos Humanos', 'Outras'].map(area => (
                      <label key={area} className="flex items-center space-x-2 text-gray-800">
                        <input type="checkbox" name="areaDemanda" value={area} onChange={handleAreaDemandaChange} checked={formState.areaDemanda.includes(area)} className="h-4 w-4 rounded border-gray-300 text-[#b91c1c] focus:ring-[#991b1b]" />
                        <span>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-gray-700">Assunto*</label>
                  <input id="assunto" name="assunto" type="text" value={formState.assunto} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]" />
                </div>
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição do Problema ou Necessidade*</label>
                  <textarea id="descricao" name="descricao" value={formState.descricao} onChange={handleFormChange} required rows={6} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"></textarea>
                </div>
                <div>
                  <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700">Objetivos Esperados com a Consultoria</label>
                  <input id="objetivos" name="objetivos" type="text" value={formState.objetivos} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Urgência*</label>
                  <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                    {['Baixa', 'Média', 'Alta'].map(urgencia => (
                      <label key={urgencia} className="flex items-center space-x-2">
                        <input type="radio" name="nivelUrgencia" value={urgencia.toLowerCase()} checked={formState.nivelUrgencia === urgencia.toLowerCase()} onChange={handleFormChange} required className="h-4 w-4 text-[#b91c1c] focus:ring-[#991b1b]" />
                        <span>{urgencia}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Seção: Informações Complementares */}
            <fieldset>
              <legend className="text-xl font-semibold font-display text-gray-700 border-b pb-2 mb-4">Informações Complementares</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orcamento" className="block text-sm font-medium text-gray-700">Orçamento Disponível</label>
                  <select id="orcamento" name="orcamento" value={formState.orcamento} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]">
                    <option value="">A definir</option>
                    <option value="ate-5k">Até R$ 5.000</option>
                    <option value="5k-10k">R$ 5.000 - R$ 10.000</option>
                    <option value="acima-10k">Acima de R$ 10.000</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comoConheceu" className="block text-sm font-medium text-gray-700">Como conheceu a ISA?</label>
                  <input id="comoConheceu" name="comoConheceu" type="text" value={formState.comoConheceu} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]" />
                </div>
              </div>
            </fieldset>

            {/* Seção: Consentimento */}
            <fieldset className="space-y-4 pt-4 border-t">
              <label className="flex items-start space-x-3">
                <input type="checkbox" name="consentimentoLGPD" checked={formState.consentimentoLGPD} onChange={handleCheckboxChange} required className="h-5 w-5 rounded border-gray-300 text-[#b91c1c] focus:ring-[#991b1b]" />
                <div>
                  <span className="font-medium text-gray-800">Consentimento de Dados (LGPD)*</span>
                  <p className="text-sm text-gray-500">Autorizo o uso dos meus dados para contato e propostas de consultoria, conforme a Lei Geral de Proteção de Dados.</p>
                </div>
              </label>
              <label className="flex items-start space-x-3">
                <input type="checkbox" name="disponibilidadeVisita" checked={formState.disponibilidadeVisita} onChange={handleCheckboxChange} className="h-5 w-5 rounded border-gray-300 text-[#b91c1c] focus:ring-[#991b1b]" />
                <div>
                  <span className="font-medium text-gray-800">Disponibilidade de Visita Técnica</span>
                   <p className="text-sm text-gray-500">Possuo disponibilidade para uma eventual visita técnica da equipe da empresa ISA.</p>
                </div>
              </label>
            </fieldset>

            <div className="flex justify-end items-center">
              {formStatus && <p className={`text-sm mr-4 ${formStatus.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{formStatus}</p>}
              <button type="submit" className="inline-flex items-center gap-2 px-8 py-3 bg-[#b91c1c] text-white font-semibold rounded-md shadow-sm hover:bg-[#991b1b]" disabled={isSubmitting}>
                <Send className="h-5 w-5" />
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}