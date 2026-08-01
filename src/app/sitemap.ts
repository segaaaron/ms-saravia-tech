import type { MetadataRoute } from 'next'
import { serviceSlugs, caseStudySlugs, solutionSlugs } from '@/content/seo'
import { postSlugs, getPost, postsByDate } from '@/content/blog'
import { localizedUrl } from '@/lib/seo'

// Sitemap generado desde el contenido (una sola fuente): home + service pillars + work hub
// + case studies + posts. Cada entrada lista sus alternates hreflang recíprocos en/es.
//
// lastModified NO es `new Date()` global: eso marcaría TODAS las URLs con la fecha del build
// (ruido para el crawler + frescura falsa). En su lugar:
//   - posts → `updated ?? date` reales del contenido
//   - /blog → fecha del post más reciente
//   - resto (home, services, solutions, work, case studies) → SITE_CONTENT_UPDATED (bump manual
//     cuando cambie ese contenido estático).
const SITE_CONTENT_UPDATED = new Date('2026-08-01')

export default function sitemap(): MetadataRoute.Sitemap {
  const newestPost = postsByDate()[0]
  const blogHubModified = newestPost ? new Date(newestPost.updated ?? newestPost.date) : SITE_CONTENT_UPDATED

  const routes: {
    path: string
    priority: number
    changeFrequency: 'monthly' | 'weekly'
    lastModified: Date
  }[] = [
    { path: '', priority: 1, changeFrequency: 'monthly', lastModified: SITE_CONTENT_UPDATED },
    { path: '/estimate', priority: 0.85, changeFrequency: 'monthly', lastModified: SITE_CONTENT_UPDATED },
    { path: '/work', priority: 0.8, changeFrequency: 'monthly', lastModified: SITE_CONTENT_UPDATED },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly', lastModified: blogHubModified },
    ...serviceSlugs.map((s) => ({ path: `/services/${s}`, priority: 0.9, changeFrequency: 'monthly' as const, lastModified: SITE_CONTENT_UPDATED })),
    ...solutionSlugs.map((s) => ({ path: `/solutions/${s}`, priority: 0.85, changeFrequency: 'monthly' as const, lastModified: SITE_CONTENT_UPDATED })),
    ...caseStudySlugs.map((s) => ({ path: `/work/${s}`, priority: 0.7, changeFrequency: 'monthly' as const, lastModified: SITE_CONTENT_UPDATED })),
    ...postSlugs.map((s) => {
      const post = getPost(s)
      const iso = post?.updated ?? post?.date
      return {
        path: `/blog/${s}`,
        priority: 0.6,
        changeFrequency: 'monthly' as const,
        lastModified: iso ? new Date(iso) : SITE_CONTENT_UPDATED,
      }
    }),
  ]

  return routes.flatMap((r) => {
    const languages = {
      en: localizedUrl('en', r.path),
      'en-GB': localizedUrl('en', r.path),
      'en-CA': localizedUrl('en', r.path),
      es: localizedUrl('es', r.path),
      'x-default': localizedUrl('en', r.path),
    }
    // Emite ambas URLs (en + es) con alternates recíprocos, como ya hacía la home.
    return (['en', 'es'] as const).map((loc) => ({
      url: localizedUrl(loc, r.path),
      lastModified: r.lastModified,
      changeFrequency: r.changeFrequency,
      priority: loc === 'en' ? r.priority : Math.max(0.5, r.priority - 0.2),
      alternates: { languages },
    }))
  })
}
