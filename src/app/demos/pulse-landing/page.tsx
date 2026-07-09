import type { Metadata } from 'next'
import PulseLandingClient from './PulseLandingClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseLandingPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <PulseLandingClient lang={lang} />
}
