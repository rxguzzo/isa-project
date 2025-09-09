// src/components/ContactForm.tsx
'use client';
import { motion, Variants } from 'framer-motion'; // <-- Importe 'Variants'
import { useState, FormEvent } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('Enviando...');

    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('Mensagem enviada com sucesso! Em breve entraremos em contato.');
    setName(''); setEmail(''); setMessage('');
  };

  const formVariants: Variants = { // <-- Adicione a tipagem
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <motion.section
      id="contato"
      className="bg-white py-16 md:py-24"
      variants={formVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Fale Conosco</h2>
        <p className="mx-auto mb-12 text-lg text-gray-600">
          Envie-nos uma mensagem e descubra como a ISA pode ajudar sua empresa.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6 text-left">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Sua Mensagem
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#b91c1c] focus:ring-[#b91c1c]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#b91c1c] py-2 px-4 text-white font-medium shadow-sm hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-2"
            disabled={status === 'Enviando...'}
          >
            {status === 'Enviando...' ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
          {status && (
            <p className="mt-4 text-center text-sm font-medium text-gray-600">
              {status}
            </p>
          )}
        </form>
      </div>
    </motion.section>
  );
}