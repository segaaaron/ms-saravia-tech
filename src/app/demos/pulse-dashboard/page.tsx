import type { Metadata } from 'next'
import PulseDashboardClient from './PulseDashboardClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseDashboardPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <PulseDashboardClient lang={lang} />
}
