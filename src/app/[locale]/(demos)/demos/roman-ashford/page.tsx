import type { Metadata } from 'next'
import RomanClient from './RomanClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'Román & Ashford · Abogados — Demo',
  robots: { index: false, follow: false },
}

export default async function RomanAshfordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <RomanClient lang={lang} />
}
