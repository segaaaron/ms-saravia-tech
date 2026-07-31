import type { Metadata } from 'next'
import VesperDashboardClient from './VesperDashboardClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'VESPER · Panel de e-commerce — Demo',
  robots: { index: false, follow: false },
}

export default async function VesperDashboardPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <VesperDashboardClient lang={lang} />
}
