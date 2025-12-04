// src/components/Hero.tsx
'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-white to-[#fef2f2] py-20 md:py-32">
      <div className="container mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2">
        {/* Coluna de Texto com Animações */}
        <motion.div
          className="space-y-6 text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-bold tracking-tighter text-gray-800 md:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            Inteligência e Eficiência para a Gestão da Sua Empresa
          </motion.h1>
          <motion.p
            className="max-w-xl text-lg text-gray-600"
            variants={itemVariants}
          >
            Simplifique a burocracia, resolva problemas administrativos e foque
            no que realmente importa: o crescimento do seu negócio.
          </motion.p>
          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start"
            variants={itemVariants}
          >
            <Link
              href="/cadastro"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#b91c1c] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#991b1b]"
            >
              Comece Agora
            </Link>
            <Link
              href="#sobre"
              className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white  text-black px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100"
            >
            Saiba Mais
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Coluna da Imagem/Visual com Animação */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          <div className="relative h-96 w-full max-w-sm rounded-xl bg-gradient-to-br from-[#fee2e2] to-[#fecaca] p-6 shadow-2xl">
            <Image
              src="/images/95094.jpg"
              alt="Ilustração Abstrata da ISA"
              fill={true}
              style={{ objectFit: 'contain' }}
              className="p-4"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}