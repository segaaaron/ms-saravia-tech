import type { Metadata } from 'next'

// Fuente única de host + construcción de canonical/hreflang para TODAS las rutas nuevas.
// localePrefix: 'as-needed' → en sin prefijo, es bajo /es. Cada ruta indexable debe emitir
// canonical self-ref por locale + hreflang recíproco en/es/x-default (mismo patrón que la home).
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud'

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

/** URL absoluta de un path (sin locale) para un locale dado. path empieza con '/', o '' para la home. */
export function localizedUrl(locale: string, path = ''): string {
  const prefix = locale === 'es' ? '/es' : ''
  return `${siteUrl}${prefix}${path}`
}

/** Bloque `alternates` de Metadata: canonical self-ref + languages recíprocos. */
export function buildAlternates(locale: string, path = ''): Metadata['alternates'] {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      en: localizedUrl('en', path),
      'en-GB': localizedUrl('en', path),
      'en-CA': localizedUrl('en', path),
      es: localizedUrl('es', path),
      'x-default': localizedUrl('en', path),
    },
  }
}

/** openGraph mínimo consistente con la home. */
export function buildOpenGraph(
  locale: string,
  path: string,
  title: string,
  description: string,
): Metadata['openGraph'] {
  return {
    title,
    description,
    url: localizedUrl(locale, path),
    siteName: 'MS SARAVIA TECH STACK LLC',
    locale: locale === 'es' ? 'es_ES' : 'en_US',
    alternateLocale: locale === 'es' ? ['en_US', 'en_GB', 'en_CA'] : ['es_ES', 'en_GB', 'en_CA'],
    type: 'website',
  }
}
