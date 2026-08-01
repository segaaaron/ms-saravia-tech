import type { Metadata } from 'next'
import PulseSocioClient from './PulseSocioClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Socio — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseSocioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <PulseSocioClient lang={lang} />
}
