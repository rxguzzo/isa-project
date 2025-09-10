// src/components/home/FeaturesSection.tsx
'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  ClipboardCheck,
  Briefcase,
  Lightbulb,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: BarChart,
      title: 'Análise de Dados Inteligente',
      description: 'Transformamos seus dados brutos em insights acionáveis para decisões mais estratégicas e resultados superiores.',
    },
    {
      icon: ClipboardCheck,
      title: 'Otimização de Processos',
      description: 'Identificamos gargalos e implementamos soluções para tornar seus processos mais eficientes e menos custosos.',
    },
    {
      icon: Briefcase,
      title: 'Gestão de Projetos Simplificada',
      description: 'Gerencie seus projetos com clareza e controle total, do planejamento à execução, garantindo entregas no prazo.',
    },
    {
      icon: Lightbulb,
      title: 'Consultoria Estratégica',
      description: 'Oferecemos orientação especializada para que sua empresa possa inovar e se destacar no mercado.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="diferenciais" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <motion.h2
          className="mb-4 text-3xl font-bold font-display text-gray-800 md:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          Nossos Diferenciais
        </motion.h2>
        <motion.p
          className="mx-auto mb-12 max-w-3xl text-lg text-gray-600"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Soluções personalizadas que impulsionam o crescimento e a eficiência da sua empresa.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-white p-6 text-left shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl" // Adicionado efeito hover
              variants={featureVariants}
            >
              <feature.icon className="mb-4 h-10 w-10 text-[#b91c1c]" /> {/* Ícone na cor vinho */}
              <h3 className="mb-2 text-xl font-semibold font-display text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}