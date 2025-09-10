// src/components/home/TestimonialsSection.tsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "A plataforma da ISA transformou nossa gestão. O que levava dias, agora resolvemos em minutos. Essencial para qualquer empresa moderna.",
      name: "Ana Clara",
      title: "CEO, InovaTech",
      avatar: "/images/avatar-1.jpg" // Placeholder
    },
    {
      quote: "O suporte e a clareza nas informações são o grande diferencial. Finalmente temos um parceiro que entende nossas dores administrativas.",
      name: "Marcos Vianna",
      title: "Diretor Financeiro, Construtora Horizonte",
      avatar: "/images/avatar-2.jpg"
    },
    {
      quote: "Desde que implementamos as soluções da ISA, nossa produtividade aumentou em 30%. Recomendo fortemente a todas as empresas que buscam otimização.",
      name: "Juliana Costa",
      title: "Gerente de Operações, LogiFácil",
      avatar: "/images/avatar-3.jpg"
    },
  ];

  return (
    <motion.section 
      id="depoimentos" 
      className="bg-white py-16 md:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold font-display text-gray-800 md:text-4xl">
          O Que Nossos Clientes Dizem
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-lg text-gray-600">
          Empresas que confiam na ISA para otimizar sua gestão.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="rounded-lg bg-gray-50 p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* ===== MUDANÇA AQUI: Estrelas na cor vinho ===== */}
              <div className="flex text-[#b91c1c] mb-4"> 
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-gray-600 text-left italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                {/* Removi o <Image> por padrão para evitar erros se você ainda não tem as imagens */}
                {/* Se tiver as imagens, descomente e ajuste o caminho se necessário */}
                {/* <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full mr-4" /> */}
                <div>
                  <p className="font-semibold text-gray-900 text-left">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 text-left">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}