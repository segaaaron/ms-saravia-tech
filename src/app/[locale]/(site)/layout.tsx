import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'
import dynamic from 'next/dynamic'
// Navbar and Footer are imported from components (written by other agents)
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/sections/Footer'
import JsonLd from '@/components/seo/JsonLd'

// Chrome del SITIO de marketing. Es un layout de segmento (NO renderiza <html>/<body>: eso vive
// en el root [locale]/layout.tsx). Vive en el grupo (site) para NO envolver a las demos, que
// tienen su propio chrome en (demos). El <html>/<body> es compartido → soft-nav site↔demo.

// Decorative-only WebGL particles: defer to client, keep out of SSR/LCP path.
const InteractiveParticles = dynamic(
  () => import('@/components/fx/InteractiveParticles'),
)

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd locale={locale} />
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
  )
}
