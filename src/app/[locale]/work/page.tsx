import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight } from 'lucide-react'
import { caseStudyPages } from '@/content/seo'
import { buildAlternates, buildOpenGraph, localizedUrl } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'

type Project = { title: string; category: string; desc: string; status: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'workPage' })
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/work'),
    openGraph: buildOpenGraph(locale, '/work', title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function WorkHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tWork = await getTranslations({ locale, namespace: 'work' })
  const tPage = await getTranslations({ locale, namespace: 'workPage' })
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })
  const projects = tWork.raw('projects') as Project[]
  const workBase = locale === 'es' ? '/es/work' : '/work'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: tPage('metaTitle'),
    description: tPage('metaDesc'),
    url: localizedUrl(locale, '/work'),
    hasPart: caseStudyPages.map((c) => ({
      '@type': 'CreativeWork',
      name: projects[c.projectIndex].title,
      url: localizedUrl(locale, `/work/${c.slug}`),
    })),
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Breadcrumbs
        locale={locale}
        ariaLabel={tCrumb('aria')}
        items={[{ name: tCrumb('home'), path: '' }, { name: tCrumb('work') }]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        <header className="max-w-2xl space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
            <GradientText gradient="magenta">{tWork('title')}</GradientText>
          </h1>
          <p className="text-lg text-white/55">{tPage('intro')}</p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {caseStudyPages.map((c) => {
            const p = projects[c.projectIndex]
            return (
              <Link
                key={c.slug}
                href={`${workBase}/${c.slug}`}
                className="group relative flex h-full flex-col overflow-hidden p-7 transition-colors"
                style={{
                  borderRadius: 20,
                  border: '1px solid rgba(120,200,255,0.10)',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                }}
              >
                <span className="self-start font-mono text-[11px] text-[#2FF5E0]" style={{ letterSpacing: '0.04em' }}>
                  {p.category}
                </span>
                <h2 className="mt-4 text-[22px] font-bold tracking-tight text-white">{p.title}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-white/55">{p.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors group-hover:text-[#2FF5E0]">
                  {tWork('view')}
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
