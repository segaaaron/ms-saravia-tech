import type { Metadata } from 'next'
import PulseLoginClient from './PulseLoginClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Ingresar — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseLoginPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <PulseLoginClient lang={lang} />
}
