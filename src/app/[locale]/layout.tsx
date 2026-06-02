import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'
import './globals.css'
// Navbar and Footer are imported from components (written by other agents)
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/sections/Footer'
import InteractiveParticles from '@/components/fx/InteractiveParticles'

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

export const metadata: Metadata = {
  title: 'MS SARAVIA TECH STACK LLC | Premium Software Agency',
  description:
    'Elite SaaS development, mobile apps, AI agents & tech consulting. We build the future of software. Based in the USA.',
  keywords: [
    'SaaS development',
    'mobile apps',
    'AI agents',
    'tech consulting',
    'software agency',
    'React',
    'Next.js',
  ],
  openGraph: {
    title: 'MS SARAVIA TECH STACK LLC',
    description: 'Elite software agency. SaaS · Mobile · AI · Consulting.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mssaraviatechstack.com',
    siteName: 'MS SARAVIA TECH STACK LLC',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
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
