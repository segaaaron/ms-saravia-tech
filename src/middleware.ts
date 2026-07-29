import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Canonical host: apex (no-www) -> www, 308 permanent. Keeps path + query.
const CANONICAL_HOST = 'www.ms-tech-stack.cloud'

// Params de tracking de redes que ensucian la URL (Facebook/Instagram los agregan al clickear).
// No los usa el sitio → se limpian con un redirect a la URL sin ellos. NO tocar utm_* ni gclid
// (esos sí sirven para atribución de analytics/ads).
const TRACKING_PARAMS = ['fbclid', 'igshid', 'mibextid']

export default function middleware(request: NextRequest) {
  const host = (
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    ''
  ).toLowerCase()
  // Canónico apex -> www SOLO para requests de documento. Un request RSC (soft-nav de Next:
  // header 'RSC' o query '_rsc') NO se redirige: si un documento del apex quedó abierto/cacheado
  // en un navegador, su soft-nav hace fetch RSC same-origin al apex; redirigirlo a www (otro
  // origen) lo bloquea CORS → crash ("Something went wrong"). Sirviéndolo same-origin no cruza
  // de origen y no crashea. El documento completo sí redirige, así que el canónico se mantiene.
  const isRsc =
    request.headers.get('rsc') !== null ||
    request.headers.get('next-router-prefetch') !== null ||
    request.nextUrl.searchParams.has('_rsc')
  if (host === 'ms-tech-stack.cloud' && !isRsc) {
    const url = request.nextUrl.clone()
    url.host = CANONICAL_HOST
    url.protocol = 'https:'
    url.port = ''
    return NextResponse.redirect(url, 308)
  }

  // Limpia params de tracking social (fbclid…) → 307 a la URL limpia (temporal: cada id es único,
  // no conviene cachear el redirect en WebViews). Preserva el resto de la query.
  const hasTracking = TRACKING_PARAMS.some((p) => request.nextUrl.searchParams.has(p))
  if (hasTracking) {
    const url = request.nextUrl.clone()
    for (const p of TRACKING_PARAMS) url.searchParams.delete(p)
    return NextResponse.redirect(url, 307)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/(en|es)/:path*',
    '/((?!api|_next|_vercel|demos|opengraph-image|apple-icon|icon|manifest.webmanifest|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
