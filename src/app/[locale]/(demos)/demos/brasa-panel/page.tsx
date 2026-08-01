import type { Metadata } from 'next'
import BrasaPanelClient from './BrasaPanelClient'
import type { DemoLang } from '../types'

export const metadata: Metadata = {
  title: 'BRASA · Panel operativo — Demo',
  robots: { index: false, follow: false },
}

export default async function BrasaPanelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lang = locale as DemoLang
  return <BrasaPanelClient lang={lang} />
}
