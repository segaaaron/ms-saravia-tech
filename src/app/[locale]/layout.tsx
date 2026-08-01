import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import Analytics from '@/components/seo/Analytics'

// ÚNICO root layout con <html>/<body> de toda la app navegable. El site vive en el grupo
// (site) y las demos en (demos): dos grupos de chrome bajo ESTE mismo <html>/<body>, así que
// navegar entre ellos es soft-nav (no hay un segundo root layout que fuerce full-reload ni
// rompa la hidratación entre dos <html>). Antes /demos tenía su propio root layout — de ahí el
// hard-nav obligado y los parches `hardNav`/`crossesRootLayout` que ya se eliminaron.

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es'
  const canonical = isEs ? `${siteUrl}/es` : siteUrl
  const title = isEs
    ? 'Desarrollo de SaaS, Apps Móviles y Agentes IA | MS Saravia Tech Stack'
    : 'SaaS, Mobile App & AI Agent Development Agency | MS Saravia Tech Stack'
  const description = isEs
    ? 'Agencia de software en USA. Construimos tu SaaS, app móvil (iOS/Android) y agentes de IA — de la idea a producción. Cotización gratis.'
    : 'US-based software agency. We build your SaaS, mobile app (iOS/Android) and AI agents — from idea to production. Free project estimate.'
  const keywords = isEs
    ? [
        'desarrollo de software',
        'crear una app',
        'desarrollo de SaaS',
        'agencia de desarrollo de apps',
        'desarrollo de apps móviles',
        'agentes de IA',
        'automatización con IA',
        'desarrollar MVP',
        'consultoría tecnológica',
        'CTO fraccional',
        'Next.js',
        'React Native',
      ]
    : [
        'SaaS development company',
        'app development agency',
        'hire app developers',
        'build a SaaS platform',
        'mobile app development USA',
        'AI agent development',
        'AI automation agency',
        'MVP development',
        'custom software development',
        'fractional CTO',
        'Next.js agency',
        'React Native development',
      ]
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        en: siteUrl,
        'en-GB': siteUrl,
        'en-CA': siteUrl,
        es: `${siteUrl}/es`,
        'x-default': siteUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'MS SARAVIA TECH STACK LLC',
      locale: isEs ? 'es_ES' : 'en_US',
      alternateLocale: isEs ? ['en_US', 'en_GB', 'en_CA'] : ['es_ES', 'en_GB', 'en_CA'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
    verification: {
      // Google Search Console. Public token (rendered in HTML). Env overrides default.
      google:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        'ZHMlv0KexhXmR5QdCRqOuUup5_hLdeGAfvBv8i4RmcA',
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${inter.variable}`}>
      {/* Umami (+ GA4 opt-in) una sola vez en el root: cubre tanto (site) como (demos). Antes las
          demos tenían su propio <Analytics/> en su root layout aparte; al unificar, este único
          montaje registra los pageviews de todo el árbol. */}
      <body suppressHydrationWarning>
        <Analytics />
        {/* Provider de next-intl en la RAÍZ compartida: así lo heredan AMBOS grupos, (site) y
            (demos). Los client components de demos (el Link locale-aware de @/i18n/navigation en
            _GalleryCard y pulse-login) llaman useLocale() internamente; sin un provider ancestro
            caían al fallback deprecado (warning de useParams en consola). */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
