import type { Metadata } from 'next'
import PulseLoginClient from './PulseLoginClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'PULSE · FITLIFE GYM — Ingresar — Demo',
  robots: { index: false, follow: false },
}

export default async function PulseLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <PulseLoginClient lang={lang} />
}
