import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '@/lib/seo'
import { regionFromCountry } from '@/lib/estimate'
import { clientIpFromHeaders, countryFromIp } from '@/lib/geo'
import AppCostEstimator from '@/components/sections/AppCostEstimator'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'estimatePage' })
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/estimate'),
    openGraph: buildOpenGraph(locale, '/estimate', title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function EstimatePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })
  const home = locale === 'es' ? '/es' : '/'

  // Región FIJA por geolocalización — USA/Canadá no ven precios LATAM.
  // 1) Header de país del proxy/CDN si existe (Cloudflare/nginx GeoIP) — sin llamada externa.
  // 2) Si no, lookup por IP del cliente vía country.is (0 RAM, gratis, HTTPS, cacheado 1h).
  // 3) Si nada resuelve (IP local/privada), fallback por idioma.
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
  const region = regionFromCountry(country, locale)
  // Nombre del país localizado (Bolivia, México, Estados Unidos…) para mostrar en solo lectura.
  let countryLabel: string | null = null
  try {
    if (country) countryLabel = new Intl.DisplayNames([locale], { type: 'region' }).of(country) ?? null
  } catch {
    countryLabel = null
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24">
        <Link
          href={home}
          className="inline-flex items-center gap-1.5 rounded-sm text-sm text-white/45 transition-colors hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6366F1]"
        >
          <ArrowLeft size={15} />
          {tCrumb('home')}
        </Link>
      </div>
      <AppCostEstimator region={region} countryLabel={countryLabel} />
    </>
  )
}
