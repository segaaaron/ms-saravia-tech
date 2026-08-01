import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Check } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { buildAlternates, buildOpenGraph, localizedUrl, AREA_SERVED } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'

type WhyCard = { title: string; desc: string }
type CompareRow = { label: string; nearshore: string; offshore: string; inhouse: string }
type CompareColumns = { model: string; nearshore: string; offshore: string; inhouse: string }
type FaqEntry = { q: string; a: string }

// Eyebrow de sección: label mono + regla hairline que se desvanece. Mismo idiom editorial que
// las páginas de servicio/solución — unifica todas las secciones sin cards decorativas.
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="shrink-0 font-mono text-xs uppercase tracking-[0.22em] text-white/40">{children}</h2>
      <span aria-hidden className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(120,200,255,0.20), transparent)' }} />
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nearshore' })
  const title = t('metaTitle')
  const description = t('metaDesc')
  const path = '/nearshore'
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOpenGraph(locale, path, title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function NearshorePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nearshore' })
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })

  const whatBody = t.raw('whatBody') as string[]
  const cols = t.raw('compare.columns') as CompareColumns
  const rows = t.raw('compare.rows') as CompareRow[]
  const why = t.raw('why') as WhyCard[]
  const trust = t.raw('trust') as WhyCard[]
  const faq = t.raw('faq') as FaqEntry[]

  const estimateHref = locale === 'es' ? '/es/estimate' : '/estimate'
  const contactHref = locale === 'es' ? '/es/#contact' : '/#contact'

  // JSON-LD Service — mismo patrón que /services y /solutions. areaServed centralizado.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('jsonLdName'),
    description: t('metaDesc'),
    serviceType: t('jsonLdName'),
    provider: { '@type': 'Organization', name: 'MS SARAVIA TECH STACK LLC', url: localizedUrl('en') },
    areaServed: AREA_SERVED,
    url: localizedUrl(locale, '/nearshore'),
  }

  // FAQPage JSON-LD — respaldado por la FAQ visible y crawlable de más abajo.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={faqJsonLd} />
      <Breadcrumbs
        locale={locale}
        ariaLabel={tCrumb('aria')}
        items={[
          { name: tCrumb('home'), path: '' },
          { name: tCrumb('nearshore') },
        ]}
      />

      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        {/* Hero — LCP es texto, sin media pesada */}
        <header className="max-w-3xl space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#2FF5E0]/70">{t('hero.eyebrow')}</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-[1.08]">
            <GradientText gradient="primary">{t('hero.h1')}</GradientText>
          </h1>
          <p className="text-lg leading-[1.7] text-white/60">{t('hero.sub')}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <CtaButton href={estimateHref}>{t('hero.ctaPrimary')}</CtaButton>
            <a
              href={contactHref}
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]"
              style={{ border: '1px solid rgba(120,200,255,0.22)' }}
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </header>

        {/* What is nearshore — bloque educativo (keyword MOFU) */}
        <section className="mt-16">
          <SectionLabel>{t('whatLabel')}</SectionLabel>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">{t('whatTitle')}</h2>
          <div className="mt-5 max-w-3xl space-y-4">
            {whatBody.map((p) => (
              <p key={p} className="text-base leading-[1.75] text-white/60">{p}</p>
            ))}
          </div>
        </section>

        {/* Nearshore vs Offshore vs In-house — bloque BOFU de alta intención */}
        <section className="mt-16">
          <SectionLabel>{t('compareLabel')}</SectionLabel>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">{t('compareTitle')}</h2>
          <p className="mt-3 max-w-3xl text-base leading-[1.7] text-white/55">{t('compareIntro')}</p>

          <div
            className="mt-8 overflow-x-auto rounded-2xl"
            style={{ border: '1px solid rgba(120,200,255,0.12)' }}
          >
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">{t('compareTitle')}</caption>
              <thead>
                <tr style={{ background: 'rgba(120,200,255,0.04)' }}>
                  <th scope="col" className="p-4 font-mono text-xs uppercase tracking-[0.14em] text-white/40">
                    {cols.model}
                  </th>
                  <th
                    scope="col"
                    className="p-4 font-display text-sm font-semibold text-[#2FF5E0]"
                    style={{ background: 'rgba(47,245,224,0.06)', borderLeft: '1px solid rgba(47,245,224,0.20)', borderRight: '1px solid rgba(47,245,224,0.20)' }}
                  >
                    {cols.nearshore}
                  </th>
                  <th scope="col" className="p-4 font-display text-sm font-semibold text-white/75">{cols.offshore}</th>
                  <th scope="col" className="p-4 font-display text-sm font-semibold text-white/75">{cols.inhouse}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} style={{ borderTop: '1px solid rgba(120,200,255,0.08)' }}>
                    <th scope="row" className="p-4 align-top font-medium text-white/70">{row.label}</th>
                    <td
                      className="p-4 align-top text-white/85"
                      style={{ background: 'rgba(47,245,224,0.05)', borderLeft: '1px solid rgba(47,245,224,0.20)', borderRight: '1px solid rgba(47,245,224,0.20)' }}
                    >
                      {row.nearshore}
                    </td>
                    <td className="p-4 align-top text-white/55">{row.offshore}</td>
                    <td className="p-4 align-top text-white/55">{row.inhouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Why US/CA buyers — celdas hairline, no cards flotantes */}
        <section className="mt-16">
          <SectionLabel>{t('whyLabel')}</SectionLabel>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">{t('whyTitle')}</h2>
          <div
            className="mt-8 grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: 'rgba(120,200,255,0.10)', border: '1px solid rgba(120,200,255,0.10)', borderRadius: 16 }}
          >
            {why.map((card, i) => (
              <div key={card.title} className="group relative p-6 sm:p-7 transition-colors duration-300 hover:bg-white/[0.015]" style={{ background: '#0A0F17' }}>
                <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(180deg, #2FF5E0, #9B6CFF)' }} />
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#2FF5E0]/70">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-white">{card.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-[1.7] text-white/55">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust / objeciones — lista con checks */}
        <section className="mt-16">
          <SectionLabel>{t('trustLabel')}</SectionLabel>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">{t('trustTitle')}</h2>
          <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {trust.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(47,245,224,0.12)', border: '1px solid rgba(47,245,224,0.35)' }}>
                  <Check size={12} className="text-[#2FF5E0]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-[1.65] text-white/55">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ — filas hairline, visible y crawlable (respalda el FAQPage JSON-LD) */}
        <section className="mt-16">
          <SectionLabel>{t('faqLabel')}</SectionLabel>
          <div className="mt-6" style={{ borderTop: '1px solid rgba(120,200,255,0.10)' }}>
            {faq.map((f) => (
              <details key={f.q} className="group px-1 py-5" style={{ borderBottom: '1px solid rgba(120,200,255,0.10)' }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-base font-medium tracking-tight text-white/90 transition-colors group-hover:text-white">
                    {f.q}
                  </h3>
                  <span aria-hidden className="shrink-0 font-mono text-lg text-white/35 transition-transform duration-300 group-open:rotate-45 group-open:text-[#2FF5E0]">+</span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-[1.7] text-white/55">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final → estimador + contacto */}
        <section
          className="mt-16 overflow-hidden rounded-2xl p-8 sm:p-10"
          style={{
            border: '1px solid rgba(120,200,255,0.12)',
            background: 'linear-gradient(120deg, rgba(155,108,255,0.08), rgba(47,245,224,0.05))',
          }}
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-white">{t('ctaTitle')}</h2>
          <p className="mt-2 max-w-2xl text-white/55">{t('ctaSubtitle')}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CtaButton href={estimateHref}>{t('ctaButton')}</CtaButton>
            <a
              href={contactHref}
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]"
              style={{ border: '1px solid rgba(120,200,255,0.22)' }}
            >
              {t('ctaSecondary')}
            </a>
          </div>
        </section>
      </article>
    </>
  )
}
