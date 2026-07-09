import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localeDetection: true,
  localePrefix: 'as-needed',
})

// Canonical host: apex (no-www) -> www, 308 permanent. Keeps path + query.
const CANONICAL_HOST = 'www.ms-tech-stack.cloud'

export default function middleware(request: NextRequest) {
  const host = (
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    ''
  ).toLowerCase()
  if (host === 'ms-tech-stack.cloud') {
    const url = request.nextUrl.clone()
    url.host = CANONICAL_HOST
    url.protocol = 'https:'
    url.port = ''
    return NextResponse.redirect(url, 308)
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
