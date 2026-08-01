import type { Metadata } from 'next'
import BrasaClient from './BrasaClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'BRASA · Parrilla Cochabambina — Demo',
  robots: { index: false, follow: false },
}

export default async function BrasaPage({ params }: { params: Promise<{ locale: string }> }) {
  // Precios siempre en USD (sin moneda local ni geo por país).
  const { locale } = await params
  const lang = locale as DemoLang
  return <BrasaClient lang={lang} />
}
