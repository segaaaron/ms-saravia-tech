import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud'

export default function robots(): MetadataRoute.Robots {
  return {
    // /showcase = demos mock (datos ficticios, .html estáticos). No indexar: no compiten en SERP.
    rules: { userAgent: '*', allow: '/', disallow: ['/demos', '/showcase/'] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
