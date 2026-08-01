import type { Metadata } from 'next'
import PulseDashboardClient from './PulseDashboardClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <PulseDashboardClient lang={lang} />
}
