import type { Metadata } from 'next'
import SaveraClient from './SaveraClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'SAVERA GT · Superdeportivo — Demo',
  robots: { index: false, follow: false },
}

export default async function SaveraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <SaveraClient lang={lang} />
}
