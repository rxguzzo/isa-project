// src/components/Hero.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    // Cor manual para o gradiente (tom mais claro do vinho)
    <section className="bg-gradient-to-br from-white to-[#eccfcf] py-20 md:py-32">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
        {/* Coluna de Texto */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-800 md:text-5xl lg:text-6xl">
            Inteligência e Eficiência para a Gestão da Sua Empresa
          </h1>
          <p className="max-w-xl text-lg text-gray-600">
            Simplifique a burocracia, resolva problemas administrativos e foque
            no que realmente importa: o crescimento do seu negócio.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/cadastro"
              // Cores manuais para background e hover
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#b91c1c] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#991b1b]"
            >
              Comece Agora
            </Link>
            <Link
              href="#sobre"
              className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100"
            >
              Saiba Mais
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Coluna da Imagem/Visual */}
        <div className="flex items-center justify-center">
          {/* Cores manuais para gradiente */}
          <div className="relative h-96 w-full max-w-sm rounded-xl bg-gradient-to-br from-[#fee2e2] to-[#fecaca] p-6 shadow-2xl">
            {/* Cor manual para a borda */}
            <div className="h-full w-full rounded-md border-2 border-dashed border-[#fca5a5] flex items-center justify-center">
              {/* Cor manual para o texto */}
              <span className="font-medium text-[#b91c1c]">Sua Ilustração Aqui</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}