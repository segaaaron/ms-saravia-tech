import type { Metadata } from 'next'
import PulseSocioClient from './PulseSocioClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Socio — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseSocioPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <PulseSocioClient lang={lang} />
}
