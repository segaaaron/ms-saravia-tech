import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    {
      url: base,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: { en: base, es: `${base}/es` } },
    },
    {
      url: `${base}/es`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { en: base, es: `${base}/es` } },
    },
  ]
}
