import type { MetadataRoute } from 'next'
import { serviceSlugs, caseStudySlugs, solutionSlugs } from '@/content/seo'
import { postSlugs } from '@/content/blog'
import { localizedUrl } from '@/lib/seo'

// Sitemap generado desde el contenido (una sola fuente): home + service pillars + work hub
// + case studies. Cada entrada lista sus alternates hreflang recíprocos en/es.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes: { path: string; priority: number; changeFrequency: 'monthly' | 'weekly' }[] = [
    { path: '', priority: 1, changeFrequency: 'monthly' },
    { path: '/estimate', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/work', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    ...serviceSlugs.map((s) => ({ path: `/services/${s}`, priority: 0.9, changeFrequency: 'monthly' as const })),
    ...solutionSlugs.map((s) => ({ path: `/solutions/${s}`, priority: 0.85, changeFrequency: 'monthly' as const })),
    ...caseStudySlugs.map((s) => ({ path: `/work/${s}`, priority: 0.7, changeFrequency: 'monthly' as const })),
    ...postSlugs.map((s) => ({ path: `/blog/${s}`, priority: 0.6, changeFrequency: 'monthly' as const })),
  ]

  return routes.flatMap((r) => {
    const languages = {
      en: localizedUrl('en', r.path),
      'en-GB': localizedUrl('en', r.path),
      'en-CA': localizedUrl('en', r.path),
      es: localizedUrl('es', r.path),
    }
    // Emite ambas URLs (en + es) con alternates recíprocos, como ya hacía la home.
    return (['en', 'es'] as const).map((loc) => ({
      url: localizedUrl(loc, r.path),
      lastModified,
      changeFrequency: r.changeFrequency,
      priority: loc === 'en' ? r.priority : Math.max(0.5, r.priority - 0.2),
      alternates: { languages },
    }))
  })
}
