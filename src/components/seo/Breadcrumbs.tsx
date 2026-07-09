import Link from 'next/link'
import { localizedUrl } from '@/lib/seo'
import JsonLdScript from './JsonLdScript'

export type Crumb = {
  name: string
  /**
   * path SIN locale de la página del crumb. '' = home. `undefined` = página actual
   * (último crumb, sin enlace). Ojo: '' es un path válido (home), NO ausencia de path.
   */
  path?: string
}

/** href visible localizado. undefined → no enlazable. '' → raíz del locale. */
function crumbHref(locale: string, path?: string): string | undefined {
  if (path === undefined) return undefined
  const prefix = locale === 'es' ? '/es' : ''
  return `${prefix}${path}` || '/'
}

// Breadcrumbs visibles + accesibles + JSON-LD BreadcrumbList (posiciones absolutas por locale).
export default function Breadcrumbs({
  items,
  locale,
  ariaLabel = 'Breadcrumb',
}: {
  items: Crumb[]
  locale: string
  ariaLabel?: string
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      // Todo crump con path definido (incluida la home '') lleva su URL absoluta.
      ...(c.path !== undefined ? { item: localizedUrl(locale, c.path) } : {}),
    })),
  }

  return (
    <nav aria-label={ariaLabel} className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24">
      <JsonLdScript data={jsonLd} />
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/40">
        {items.map((c, i) => {
          const last = i === items.length - 1
          const href = crumbHref(locale, c.path)
          return (
            <li key={c.name} className="flex items-center gap-2">
              {href && !last ? (
                <Link href={href} className="rounded-sm transition-colors hover:text-[#2FF5E0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2FF5E0]">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-white/70' : ''}>
                  {c.name}
                </span>
              )}
              {!last && <span aria-hidden className="text-white/20">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
