import type { Metadata } from 'next'
import BrasaClient from './BrasaClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'BRASA · Parrilla Cochabambina — Demo',
  robots: { index: false, follow: false },
}

export default async function BrasaPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  // Precios siempre en USD (sin moneda local ni geo por país).
  const lang = await getDemoLang(await searchParams)
  return <BrasaClient lang={lang} />
}
