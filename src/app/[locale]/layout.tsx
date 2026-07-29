import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'
import dynamic from 'next/dynamic'
import './globals.css'
// Navbar and Footer are imported from components (written by other agents)
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/sections/Footer'
import JsonLd from '@/components/seo/JsonLd'
import Analytics from '@/components/seo/Analytics'

// Decorative-only WebGL particles: defer to client, keep out of SSR/LCP path.
const InteractiveParticles = dynamic(
  () => import('@/components/fx/InteractiveParticles'),
)

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
      <body suppressHydrationWarning>
        {/*
          apex→www: el redirect canónico vive en el edge (Traefik, 308) y cubre toda carga
          NUEVA. Este guard cubre el caso que el edge no puede: un documento del apex que ya
          quedó abierto/cacheado/bookmarkeado en un navegador. Ahí la soft-nav haría fetch RSC
          same-origin al apex → 308 a www (otro origen) → CORS lo bloquea → crash. El script
          hard-redirige a www apenas bootea el documento apex, antes de que exista cualquier
          <Link>, evacuando esas sesiones. Defensa en profundidad, no reemplazo del edge.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(location.hostname==='ms-tech-stack.cloud'){location.replace('https://www.ms-tech-stack.cloud'+location.pathname+location.search+location.hash)}}catch(e){}})()",
          }}
        />
        <JsonLd locale={locale} />
        <Analytics />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <InteractiveParticles />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0d0f14',
                border: '1px solid rgba(0,229,255,0.2)',
                color: 'white',
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
