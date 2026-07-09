import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  // El lint es un gate separado (`pnpm lint`), no parte del build — evita el fallo del
  // patch de @rushstack/eslint-patch en el runner interno de `next lint`.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Whitelist explícita — nunca '**' (usar el optimizador como proxy abierto es un
    // vector de abuso de ancho de banda / SSRF). Único host remoto real: unsplash (demos).
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
