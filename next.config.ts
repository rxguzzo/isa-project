import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Configurações para reduzir logs em desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      buildActivity: false, // Remove indicador de build
    },
  }),
};

// Configuração PWA será adicionada em produção
const createConfig = async (): Promise<NextConfig> => {
  let configWithPWA = nextConfig;

  if (process.env.NODE_ENV === 'production') {
    const withPWA = (await import('next-pwa')).default as unknown as (
      options: Record<string, unknown>
    ) => (config: NextConfig) => NextConfig;
    configWithPWA = withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: false,
      sw: 'sw.js',
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'offlineCache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24, // 24 horas
            },
          },
        },
      ],
    })(nextConfig);
  }

  return configWithPWA;
};

export default createConfig();
