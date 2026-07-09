import type { Metadata } from 'next'
import AuraClient from './AuraClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'AURA · Medicina Estética — Demo',
  robots: { index: false, follow: false },
}

export default async function AuraPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <AuraClient lang={lang} />
}
