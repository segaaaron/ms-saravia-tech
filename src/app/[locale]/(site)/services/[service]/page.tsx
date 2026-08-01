import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { getServicePage, caseStudyPages, solutionsForService } from '@/content/seo'
import { buildAlternates, buildOpenGraph, localizedUrl, AREA_SERVED } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'

type ServiceItem = { title: string; desc: string; stack: string[] }
type Capability = { title: string; desc: string }
type ProcessStep = { title: string; desc: string }
type FaqEntry = { q: string; a: string }

// Eyebrow de sección: label mono + regla hairline que se desvanece. Da estructura editorial
// (no decorativa) y unifica todas las secciones de la página.
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
  params: Promise<{ locale: string; service: string }>
}): Promise<Metadata> {
  const { locale, service } = await params
  if (!getServicePage(service)) return {}
  const t = await getTranslations({ locale, namespace: `servicePages.items.${service}` })
  const title = t('metaTitle')
  const description = t('metaDesc')
  const path = `/services/${service}`
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOpenGraph(locale, path, title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>
}) {
  const { locale, service } = await params
  const page = getServicePage(service)
  if (!page) notFound()

  const tSvc = await getTranslations({ locale, namespace: 'services' })
  const tPage = await getTranslations({ locale, namespace: 'servicePages' })
  const tSol = await getTranslations({ locale, namespace: 'solutionPages' })
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })
  const item = (tSvc.raw('items') as ServiceItem[])[page.itemIndex]
  const industries = solutionsForService(service)

  const capabilities = tPage.raw(`items.${service}.capabilities`) as Capability[]
  const steps = tPage.raw(`items.${service}.process`) as ProcessStep[]
  const deliverables = tPage.raw(`items.${service}.deliverables`) as string[]
  const faq = tPage.raw(`items.${service}.faq`) as FaqEntry[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: item.title,
    description: tPage(`items.${service}.metaDesc`),
    serviceType: item.title,
    provider: { '@type': 'Organization', name: 'MS SARAVIA TECH STACK LLC', url: localizedUrl('en') },
    areaServed: AREA_SERVED,
    url: localizedUrl(locale, `/services/${service}`),
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

  const relatedCases = caseStudyPages.filter((c) => page.relatedCaseStudies.includes(c.slug))

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={faqJsonLd} />
      <Breadcrumbs
        locale={locale}
        ariaLabel={tCrumb('aria')}
        items={[
          { name: tCrumb('home'), path: '' },
          { name: tCrumb('services'), path: '/#services' },
          { name: item.title },
        ]}
      />

      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        <header className="max-w-3xl space-y-5">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
            <GradientText gradient="primary">{item.title}</GradientText>
          </h1>
          <p className="text-lg leading-[1.7] text-white/60">{tPage(`items.${service}.intro`)}</p>
        </header>

        {/* Capabilities — ficha técnica: celdas con hairlines, no cards flotantes */}
        <section className="mt-16">
          <SectionLabel>{tPage('capabilitiesLabel')}</SectionLabel>
          <div
            className="mt-8 grid gap-px overflow-hidden sm:grid-cols-2"
            style={{ background: 'rgba(120,200,255,0.10)', border: '1px solid rgba(120,200,255,0.10)', borderRadius: 16 }}
          >
            {capabilities.map((cap, i) => (
              <div key={cap.title} className="group relative p-6 sm:p-7 transition-colors duration-300 hover:bg-white/[0.015]" style={{ background: '#0A0F17' }}>
                <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(180deg, #2FF5E0, #9B6CFF)' }} />
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#2FF5E0]/70">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-white">{cap.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-[1.7] text-white/55">{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process — timeline conectada (el orden importa → numeración justificada) */}
        <section className="mt-16">
          <SectionLabel>{tPage('processLabel')}</SectionLabel>
          <ol className="relative mt-8 grid gap-8 sm:grid-cols-4 sm:gap-6">
            <span aria-hidden className="absolute left-4 right-4 top-[18px] hidden h-px sm:block" style={{ background: 'linear-gradient(90deg, transparent, rgba(120,200,255,0.28), transparent)' }} />
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-semibold text-[#2FF5E0]" style={{ background: '#0A0F17', border: '1px solid rgba(47,245,224,0.35)', boxShadow: '0 0 0 4px #070B12' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.65] text-white/55">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tech stack — agrupado por capa (amplio, senior) */}
        <section className="mt-16">
          <SectionLabel>{tPage('stackLabel')}</SectionLabel>
          <dl className="mt-6">
            {page.techStack.map((g, i) => (
              <div
                key={g.en}
                className="grid gap-3 py-5 sm:grid-cols-[176px_1fr] sm:gap-8"
                style={{ borderTop: i > 0 ? '1px solid rgba(120,200,255,0.10)' : 'none' }}
              >
                <dt className="pt-1 font-mono text-xs uppercase tracking-[0.14em] text-white/40">{locale === 'es' ? g.es : g.en}</dt>
                <dd className="flex flex-wrap gap-2">
                  {g.items.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[12.5px] text-white/70 transition-colors duration-200 hover:border-[#2FF5E0]/40 hover:text-[#2FF5E0]"
                      style={{ padding: '5px 11px', border: '1px solid rgba(120,200,255,0.14)', borderRadius: 8, background: 'rgba(120,200,255,0.03)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Deliverables — qué recibes */}
        <section className="mt-16">
          <SectionLabel>{tPage('deliverablesLabel')}</SectionLabel>
          <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(47,245,224,0.12)', border: '1px solid rgba(47,245,224,0.35)' }}>
                  <Check size={12} className="text-[#2FF5E0]" aria-hidden="true" />
                </span>
                <span className="text-sm leading-[1.6] text-white/70">{d}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Related demos (prueba viva) */}
        {page.relatedDemos.length > 0 && (
          <section className="mt-14">
            <SectionLabel>{tPage('relatedDemosLabel')}</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-3">
              {page.relatedDemos.map((slug) => (
                <Link
                  key={slug}
                  href={`${locale === 'es' ? '/es' : ''}/demos/${slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#2FF5E0]/40 hover:text-[#2FF5E0]"
                >
                  {slug}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related work */}
        {relatedCases.length > 0 && (
          <section className="mt-14">
            <SectionLabel>{tPage('relatedWorkLabel')}</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedCases.map((c) => (
                <Link
                  key={c.slug}
                  href={locale === 'es' ? `/es/work/${c.slug}` : `/work/${c.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#9B6CFF]/50 hover:text-white"
                >
                  {c.slug}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Industries (solutions) */}
        {industries.length > 0 && (
          <section className="mt-14">
            <SectionLabel>{tPage('industriesLabel')}</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-3">
              {industries.map((sol) => (
                <Link
                  key={sol.slug}
                  href={`${locale === 'es' ? '/es' : ''}/solutions/${sol.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#2FF5E0]/40 hover:text-[#2FF5E0]"
                >
                  {tSol(`items.${sol.slug}.h1`)}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ — filas hairline, visible y crawlable (respalda el FAQPage JSON-LD) */}
        <section className="mt-16">
          <SectionLabel>{tPage('faqLabel')}</SectionLabel>
          <div className="mt-6" style={{ borderTop: '1px solid rgba(120,200,255,0.10)' }}>
            {faq.map((f) => (
              <details key={f.q} className="group px-1 py-5" style={{ borderBottom: '1px solid rgba(120,200,255,0.10)' }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-base font-medium tracking-tight text-white/90 transition-colors group-hover:text-white">
                    {f.q}
                  </h3>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-white/35 transition-transform duration-300 group-open:rotate-180 group-open:text-[#2FF5E0]"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-[1.7] text-white/55">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-16 overflow-hidden rounded-2xl p-8 sm:p-10"
          style={{
            border: '1px solid rgba(120,200,255,0.12)',
            background: 'linear-gradient(120deg, rgba(155,108,255,0.08), rgba(47,245,224,0.05))',
          }}
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-white">{tPage('ctaTitle')}</h2>
          <p className="mt-2 text-white/55">{tPage('ctaSubtitle')}</p>
          <CtaButton href={locale === 'es' ? '/es#contact' : '/#contact'} className="mt-6">
            {tPage('ctaButton')}
          </CtaButton>
        </section>
      </article>
    </>
  )
}
