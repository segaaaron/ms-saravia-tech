import type { Metadata } from 'next'
import BrasaPanelClient from './BrasaPanelClient'
import { getDemoLang } from '../lang'

export const metadata: Metadata = {
  title: 'BRASA · Panel operativo — Demo',
  robots: { index: false, follow: false },
}

export default async function BrasaPanelPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  return <BrasaPanelClient lang={lang} />
}
