import type { Metadata } from 'next'
import RomanClient from './RomanClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'Román & Ashford · Abogados — Demo',
  robots: { index: false, follow: false },
}

export default async function RomanAshfordPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <RomanClient lang={lang} />
}
