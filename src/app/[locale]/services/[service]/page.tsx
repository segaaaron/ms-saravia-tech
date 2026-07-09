import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { getServicePage, caseStudyPages, solutionsForService } from '@/content/seo'
import { buildAlternates, buildOpenGraph, localizedUrl } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'

type ServiceItem = { title: string; desc: string; stack: string[] }

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: item.title,
    description: tPage(`items.${service}.metaDesc`),
    serviceType: item.title,
    provider: { '@type': 'Organization', name: 'MS SARAVIA TECH STACK LLC', url: localizedUrl('en') },
    areaServed: 'US',
    url: localizedUrl(locale, `/services/${service}`),
  }

  const relatedCases = caseStudyPages.filter((c) => page.relatedCaseStudies.includes(c.slug))

  return (
    <>
      <JsonLdScript data={jsonLd} />
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

        {/* Tech stack */}
        <section className="mt-12">
          <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">
            {tPage('stackLabel')}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {item.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[13px] text-white/70"
                style={{
                  padding: '7px 14px',
                  border: '1px solid rgba(120,200,255,0.14)',
                  borderRadius: 10,
                  background: 'rgba(120,200,255,0.04)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Related demos (prueba viva) */}
        {page.relatedDemos.length > 0 && (
          <section className="mt-14">
            <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">
              {tPage('relatedDemosLabel')}
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {page.relatedDemos.map((slug) => (
                <a
                  key={slug}
                  href={`/demos/${slug}?lang=${locale}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#2FF5E0]/40 hover:text-[#2FF5E0]"
                >
                  {slug}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related work */}
        {relatedCases.length > 0 && (
          <section className="mt-14">
            <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">
              {tPage('relatedWorkLabel')}
            </h2>
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
            <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">
              {tPage('industriesLabel')}
            </h2>
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
