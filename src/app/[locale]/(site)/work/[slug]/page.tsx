import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { getCaseStudyPage, getProjectForCaseStudy } from '@/content/seo'
import { buildAlternates, buildOpenGraph, localizedUrl } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'

type Project = { title: string; category: string; desc: string; url: string | null; status: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!getCaseStudyPage(slug)) return {}
  const t = await getTranslations({ locale, namespace: `caseStudy.items.${slug}` })
  const title = t('metaTitle')
  const description = t('metaDesc')
  const path = `/work/${slug}`
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOpenGraph(locale, path, title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const page = getCaseStudyPage(slug)
  if (!page) notFound()

  const tWork = await getTranslations({ locale, namespace: 'work' })
  const tCase = await getTranslations({ locale, namespace: 'caseStudy' })
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })
  const project = (tWork.raw('projects') as Project[])[page.projectIndex]
  const meta = getProjectForCaseStudy(page)

  // Contenido profundo: solo se renderiza si el usuario ya proveyó copy real (i18n no vacío).
  const item = (key: string) => tCase(`items.${slug}.${key}`)
  const sections = (['challenge', 'solution', 'results'] as const)
    .map((key) => ({ key, label: tCase(`${key}Label`), body: item(key) }))
    .filter((s) => s.body.trim().length > 0)
  const testimonial = item('testimonial').trim()
  const testimonialAuthor = item('testimonialAuthor').trim()

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    about: project.category,
    description: project.desc,
    url: localizedUrl(locale, `/work/${slug}`),
    creator: { '@type': 'Organization', name: 'MS SARAVIA TECH STACK LLC', url: localizedUrl('en') },
    ...(meta.url ? { sameAs: meta.url } : {}),
  }
  if (testimonial) {
    jsonLd.review = {
      '@type': 'Review',
      reviewBody: testimonial,
      ...(testimonialAuthor ? { author: { '@type': 'Person', name: testimonialAuthor } } : {}),
    }
  }

  const workBase = locale === 'es' ? '/es/work' : '/work'

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Breadcrumbs
        locale={locale}
        ariaLabel={tCrumb('aria')}
        items={[
          { name: tCrumb('home'), path: '' },
          { name: tCrumb('work'), path: '/work' },
          { name: project.title },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        <header className="space-y-5">
          <span className="font-mono text-[12px] text-[#2FF5E0]" style={{ letterSpacing: '0.04em' }}>
            {project.category}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
            <GradientText gradient="magenta">{project.title}</GradientText>
          </h1>
          <p className="text-lg leading-[1.7] text-white/60">{project.desc}</p>

          {meta.url && (
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-[#2FF5E0]"
            >
              {tCase('visitSite')}
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </header>

        {/* Secciones narrativas (solo si hay copy real) */}
        {sections.map((s) => (
          <section key={s.key} className="mt-12">
            <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-white/40">{s.label}</h2>
            <p className="mt-3 text-[16px] leading-[1.75] text-white/70 whitespace-pre-line">{s.body}</p>
          </section>
        ))}

        {testimonial && (
          <figure className="mt-12 rounded-2xl p-7" style={{ border: '1px solid rgba(120,200,255,0.12)', background: 'rgba(120,200,255,0.03)' }}>
            <blockquote className="text-[17px] leading-[1.7] text-white/80">“{testimonial}”</blockquote>
            {testimonialAuthor && <figcaption className="mt-3 text-sm text-white/45">— {testimonialAuthor}</figcaption>}
          </figure>
        )}

        {/* CTA + back */}
        <section
          className="mt-16 overflow-hidden rounded-2xl p-8"
          style={{ border: '1px solid rgba(120,200,255,0.12)', background: 'linear-gradient(120deg, rgba(155,108,255,0.08), rgba(47,245,224,0.05))' }}
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-white">{tCase('ctaTitle')}</h2>
          <CtaButton href={locale === 'es' ? '/es#contact' : '/#contact'} className="mt-5">
            {tCase('ctaButton')}
          </CtaButton>
        </section>

        <Link href={workBase} className="mt-10 inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70">
          <ArrowLeft size={14} />
          {tCase('backToWork')}
        </Link>
      </article>
    </>
  )
}
