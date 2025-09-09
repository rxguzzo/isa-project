// src/components/AboutSection.tsx
'use client';
import { motion, Variants } from 'framer-motion'; // <-- Importe 'Variants'
import { Lightbulb, Users, Handshake } from 'lucide-react';

export function AboutSection() {
  // Container variants - Apenas aqui deve ter staggerChildren
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2, // O staggerChildren vai aqui para os filhos (h2, p, div com os cards)
      },
    },
  };

  // Item variants - Não tem staggerChildren
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Duração da animação individual
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      id="sobre"
      className="bg-white py-16 md:py-24"
      variants={containerVariants} // O container usa containerVariants
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
          Sobre a ISA: Inteligência em Soluções Administrativas
        </motion.h2>
        <motion.p variants={itemVariants} className="mx-auto mb-12 max-w-3xl text-lg text-gray-600">
          A ISA nasceu com a missão de desburocratizar a gestão empresarial,
          oferecendo ferramentas e serviços que impulsionam a eficiência e o crescimento
          sustentável para empresas de todos os portes.
        </motion.p>

        <motion.div // Este div será o pai que usará o staggerChildren
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          // Não precisa de variants aqui diretamente, o staggerChildren do pai já o gerencia
        >
          <motion.div variants={itemVariants} className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <Lightbulb className="mx-auto mb-4 h-12 w-12 text-[#b91c1c]" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Inovação Contínua</h3>
            <p className="text-gray-600">
              Estamos sempre à frente, buscando as melhores tecnologias para otimizar seus processos.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <Users className="mx-auto mb-4 h-12 w-12 text-[#b91c1c]" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Foco no Cliente</h3>
            <p className="text-gray-600">
              Nossas soluções são desenvolvidas pensando nas suas necessidades e desafios.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <Handshake className="mx-auto mb-4 h-12 w-12 text-[#b91c1c]" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Parceria de Sucesso</h3>
            <p className="text-gray-600">
              Construímos relacionamentos duradouros baseados na confiança e nos resultados.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}