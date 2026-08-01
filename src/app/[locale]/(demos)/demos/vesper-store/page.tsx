import type { Metadata } from 'next'
import VesperStoreClient from './VesperStoreClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'VESPER · Tienda — Demo',
  robots: { index: false, follow: false },
}

export default async function VesperStorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <VesperStoreClient lang={lang} />
}
