import type { Metadata } from 'next'
import { headers } from 'next/headers'
import BrasaClient from './BrasaClient'
import { getDemoLang } from '../lang'
import { clientIpFromHeaders, countryFromIp } from '@/lib/geo'

export const metadata: Metadata = {
  title: 'BRASA · Parrilla Cochabambina — Demo',
  robots: { index: false, follow: false },
}

export default async function BrasaPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)

  // Moneda por país (mismo patrón geo que /estimate): SOLO Bolivia ve Bs; el resto ve USD.
  // 1) header de país del proxy/CDN → 2) lookup por IP (country.is) → 3) si nada resuelve,
  // fallback por idioma (es → Bs, en → USD).
  const h = await headers()
  const get = (k: string) => h.get(k)
  let country =
    get('cf-ipcountry') ||
    get('x-country-code') ||
    get('x-geo-country') ||
    get('x-country') ||
    get('x-vercel-ip-country') ||
    ''
  if (!country) country = await countryFromIp(clientIpFromHeaders(get))
  const currency: 'BOB' | 'USD' = country
    ? country.toUpperCase() === 'BO'
      ? 'BOB'
      : 'USD'
    : lang === 'es'
      ? 'BOB'
      : 'USD'

  return <BrasaClient lang={lang} currency={currency} />
}
