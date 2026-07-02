import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MS Saravia Tech Stack LLC',
    short_name: 'MS Tech Stack',
    description:
      'US-based software agency: SaaS, mobile apps and AI agents — idea to production.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05060A',
    theme_color: '#05060A',
    icons: [
      { src: '/icon.png', sizes: 'any', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
