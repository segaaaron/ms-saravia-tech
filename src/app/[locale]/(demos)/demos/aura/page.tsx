import type { Metadata } from 'next'
import AuraClient from './AuraClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'AURA · Medicina Estética — Demo',
  robots: { index: false, follow: false },
}

export default async function AuraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <AuraClient lang={lang} />
}
