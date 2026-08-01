import type { Metadata } from 'next'
import VesperDashboardClient from './VesperDashboardClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'VESPER · Panel de e-commerce — Demo',
  robots: { index: false, follow: false },
}

export default async function VesperDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <VesperDashboardClient lang={lang} />
}
