import type { Metadata } from 'next'
import PulseLandingClient from './PulseLandingClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <PulseLandingClient lang={lang} />
}
