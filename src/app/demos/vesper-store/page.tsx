import type { Metadata } from 'next'
import VesperStoreClient from './VesperStoreClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'VESPER · Tienda — Demo',
  robots: { index: false, follow: false },
}

export default async function VesperStorePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <VesperStoreClient lang={lang} />
}
