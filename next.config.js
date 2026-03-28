// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Headers de segurança + cache de assets estáticos
  async headers() {
    return [
      // Assets estáticos — cache longo (imutáveis via hash de build)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Imagens, fontes e outros assets públicos
      {
        source: '/:path*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Headers de segurança em todas as rotas
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'DENY'                           },
          { key: 'X-Content-Type-Options', value: 'nosniff'                        },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin'},
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on'                             },
        ],
      },
    ]
  },

  // Compressão
  compress: true,

  // Powered-by header off
  poweredByHeader: false,

  // Otimizações de bundle
  experimental: {
    // Reduz overhead de imports do Framer Motion
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig