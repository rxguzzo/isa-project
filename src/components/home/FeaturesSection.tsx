// src/components/FeaturesSection.tsx
'use client';
import { motion, Variants } from 'framer-motion'; // <-- Importe 'Variants'
import { TrendingUp, Rocket, ShieldCheck, PieChart, Clock, Settings } from 'lucide-react';

export function FeaturesSection() {
  const sectionVariants: Variants = { // <-- Adicione a tipagem
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const featureVariants: Variants = { // <-- Adicione a tipagem
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { // Adicionando uma transição suave para cada item
        duration: 0.4,
        ease: "easeOut",
      }
    },
  };

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-[#b91c1c]" />,
      title: "Análise de Dados Avançada",
      description: "Tome decisões estratégicas com base em insights claros e objetivos."
    },
    {
      icon: <Rocket className="h-8 w-8 text-[#b91c1c]" />,
      title: "Automação de Processos",
      description: "Elimine tarefas repetitivas e aumente a produtividade da sua equipe."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#b91c1c]" />,
      title: "Segurança e Conformidade",
      description: "Garanta a proteção dos seus dados e esteja sempre em dia com a legislação."
    },
    {
      icon: <PieChart className="h-8 w-8 text-[#b91c1c]" />,
      title: "Gestão Financeira Integrada",
      description: "Controle suas finanças de ponta a ponta com facilidade e precisão."
    },
    {
      icon: <Clock className="h-8 w-8 text-[#b91c1c]" />,
      title: "Otimização de Tempo",
      description: "Libere tempo para o que realmente importa: o core do seu negócio."
    },
    {
      icon: <Settings className="h-8 w-8 text-[#b91c1c]" />,
      title: "Customização Flexível",
      description: "Adapte a plataforma às necessidades exclusivas da sua empresa."
    },
  ];

  return (
    <motion.section
      id="diferenciais"
      className="bg-[#fef2f2] py-16 md:py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <motion.h2 variants={featureVariants} className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
          Nossos Diferenciais
        </motion.h2>
        <motion.p variants={featureVariants} className="mx-auto mb-12 max-w-3xl text-lg text-gray-600">
          Descubra como a ISA pode transformar a gestão da sua empresa.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          // Este motion.div herda as variantes do pai (section) e aplica o staggerChildren aos seus filhos
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-white p-6 text-left shadow-md"
              variants={featureVariants} // Cada card individualmente usa a variante de item
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}