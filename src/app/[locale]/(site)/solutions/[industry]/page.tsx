import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { getSolutionPage, getServicePage } from '@/content/seo'
import { buildAlternates, buildOpenGraph, localizedUrl, AREA_SERVED } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>
}): Promise<Metadata> {
  const { locale, industry } = await params
  if (!getSolutionPage(industry)) return {}
  const t = await getTranslations({ locale, namespace: `solutionPages.items.${industry}` })
  const title = t('metaTitle')
  const description = t('metaDesc')
  const path = `/solutions/${industry}`
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOpenGraph(locale, path, title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>
}) {
  const { locale, industry } = await params
  const page = getSolutionPage(industry)
  if (!page) notFound()

  const t = await getTranslations({ locale, namespace: 'solutionPages' })
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })
  const tSvc = await getTranslations({ locale, namespace: 'services' })
  const h1 = t(`items.${industry}.h1`)
  const intro = t(`items.${industry}.intro`)
  const bullets = t.raw(`items.${industry}.bullets`) as string[]
  const faq = (t.raw(`items.${industry}.faq`) as { q: string; a: string }[]) ?? []
  const service = getServicePage(page.service)
  const serviceTitle = service ? (tSvc.raw('items') as { title: string }[])[service.itemIndex].title : ''
  // CTA con tracking de origen: el form de contacto lee ?source= y lo persiste en el Lead.
  const contactHref = `${locale === 'es' ? '/es' : ''}/?source=solution_${industry}#contact`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: h1,
    serviceType: t(`items.${industry}.metaTitle`),
    description: t(`items.${industry}.metaDesc`),
    provider: { '@type': 'Organization', name: 'MS SARAVIA TECH STACK LLC', url: localizedUrl('en') },
    areaServed: AREA_SERVED,
    url: localizedUrl(locale, `/solutions/${industry}`),
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
      {faq.length > 0 && <JsonLdScript data={faqJsonLd} />}
      <Breadcrumbs
        locale={locale}
        ariaLabel={tCrumb('aria')}
        items={[
          { name: tCrumb('home'), path: '' },
          ...(service ? [{ name: serviceTitle, path: `/services/${service.slug}` }] : []),
          { name: h1 },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        <header className="max-w-3xl space-y-5">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-[1.1]">
            <GradientText gradient="primary">{h1}</GradientText>
          </h1>
          <p className="text-lg leading-[1.7] text-white/60">{intro}</p>
          <CtaButton href={contactHref}>{t('ctaButton')}</CtaButton>
        </header>

        {/* Features */}
        <section className="mt-14">
          <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">{t('featuresLabel')}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] leading-[1.55] text-white/70">
                <Check size={18} className="mt-0.5 shrink-0 text-[#2FF5E0]" />
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* Live demos (prueba viva) */}
        {page.demos.length > 0 && (
          <section className="mt-14">
            <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">{t('seeDemoLabel')}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {page.demos.map((d) => (
                <Link
                  key={d}
                  href={`${locale === 'es' ? '/es' : ''}/demos/${d}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#2FF5E0]/40 hover:text-[#2FF5E0]"
                >
                  {d}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ — visible y crawlable (respalda el FAQPage JSON-LD) */}
        {faq.length > 0 && (
          <section className="mt-14">
            <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">{t('faqLabel')}</h2>
            <div className="mt-6" style={{ borderTop: '1px solid rgba(120,200,255,0.10)' }}>
              {faq.map((f) => (
                <details key={f.q} className="group px-1 py-5" style={{ borderBottom: '1px solid rgba(120,200,255,0.10)' }}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-display text-base font-medium tracking-tight text-white/90 transition-colors group-hover:text-white">{f.q}</h3>
                    <ChevronDown size={18} className="shrink-0 text-white/35 transition-transform duration-300 group-open:rotate-180 group-open:text-[#2FF5E0]" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-[1.7] text-white/55">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related service + CTA */}
        <section
          className="mt-16 overflow-hidden rounded-2xl p-8 sm:p-10"
          style={{ border: '1px solid rgba(120,200,255,0.12)', background: 'linear-gradient(120deg, rgba(155,108,255,0.08), rgba(47,245,224,0.05))' }}
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-white">{t('ctaTitle')}</h2>
          <p className="mt-2 text-white/55">{t('ctaSubtitle')}</p>
          {service && (
            <p className="mt-3 text-sm text-white/45">
              {t('relatedServiceLabel')}:{' '}
              <Link
                href={`${locale === 'es' ? '/es' : ''}/services/${service.slug}`}
                className="font-semibold text-white/75 underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#2FF5E0]"
              >
                {serviceTitle}
              </Link>
            </p>
          )}
          <CtaButton href={contactHref} className="mt-6">{t('ctaButton')}</CtaButton>
        </section>
      </article>
    </>
  )
}
