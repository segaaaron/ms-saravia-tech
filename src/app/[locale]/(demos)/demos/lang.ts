import { cookies } from 'next/headers'

export type DemoLang = 'en' | 'es'

/**
 * Resuelve el idioma de los demos siguiendo la elección del sitio principal.
 * Prioridad: ?lang= (query explícito) → cookie NEXT_LOCALE (que fija next-intl) → 'en' (default del sitio).
 * Los demos viven fuera del árbol [locale], por eso leemos el locale de forma manual.
 */
export async function getDemoLang(searchParams?: { lang?: string | string[] }): Promise<DemoLang> {
  const q = Array.isArray(searchParams?.lang) ? searchParams?.lang[0] : searchParams?.lang
  if (q === 'en' || q === 'es') return q
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value
  return cookieLocale === 'es' ? 'es' : 'en'
}
