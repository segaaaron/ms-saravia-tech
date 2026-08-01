import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight, ArrowLeft, Check } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { getCaseStudyPage, getProjectForCaseStudy } from '@/content/seo'
import { buildAlternates, buildOpenGraph, localizedUrl } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'

type Project = { title: string; category: string; desc: string; url: string | null; status: string; color: string }

// Eyebrow de sección: label mono + hairline que se desvanece.
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
  const accent = meta.color

  const item = (key: string) => tCase(`items.${slug}.${key}`)
  const sections = (['challenge', 'solution', 'results'] as const)
    .map((key) => ({ key, label: tCase(`${key}Label`), body: item(key) }))
    .filter((s) => s.body.trim().length > 0)
  const highlights = (tCase.raw(`items.${slug}.highlights`) as string[]) ?? []
  const testimonial = item('testimonial').trim()
  const testimonialAuthor = item('testimonialAuthor').trim()

  const isLive = meta.status === 'live'
  const statusLabel = isLive ? tWork('live') : tWork('soon')
  const domain = meta.url ? meta.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : null

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

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        {/* ---------------- HERO ---------------- */}
        <header className="space-y-5">
          <span className="font-mono text-[12px] text-[#2FF5E0]" style={{ letterSpacing: '0.04em' }}>
            {project.category}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
            <GradientText gradient="magenta">{project.title}</GradientText>
          </h1>
          <p className="max-w-2xl text-lg leading-[1.7] text-white/60">{project.desc}</p>

          {/* Meta strip: alcance · año · estado */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 font-mono text-xs text-white/45">
            <span className="uppercase tracking-[0.12em] text-white/35">{tCase('scopeLabel')}</span>
            <span className="text-white/70">{locale === 'es' ? page.scope.es : page.scope.en}</span>
            <span aria-hidden className="text-white/20">/</span>
            <span className="uppercase tracking-[0.12em] text-white/35">{tCase('yearLabel')}</span>
            <span className="text-white/70">{page.year}</span>
            <span aria-hidden className="text-white/20">/</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: `${accent}1a`, border: `1px solid ${accent}55`, color: '#EAF0F7' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: isLive ? `0 0 8px ${accent}` : 'none' }} />
              {statusLabel}
            </span>
          </div>
        </header>

        {/* ---------------- SITE PREVIEW (visitar sitio, elegante) ---------------- */}
        <div className="mt-10">
          {meta.url ? (
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
              style={{ border: `1px solid ${accent}33`, boxShadow: `0 30px 80px -50px ${accent}` }}
              aria-label={`${tCase('visitSite')} — ${domain}`}
            >
              {/* barra de navegador */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
                </span>
                <span className="ml-3 truncate rounded-md px-3 py-1 font-mono text-[12px] text-white/55" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {domain}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors group-hover:text-white">
                  {tCase('visitSite')}
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
              {/* lienzo con el color de marca del proyecto */}
              <div
                className="relative flex h-48 items-center justify-center sm:h-60"
                style={{ background: `radial-gradient(120% 130% at 28% 0%, ${accent}33, transparent 58%), linear-gradient(160deg, #0b1220, #070b12)` }}
              >
                <span className="font-display text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">{project.title}</span>
                <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.35), transparent 60%)' }} />
              </div>
            </a>
          ) : (
            <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${accent}33` }}>
              <div
                className="relative flex h-48 flex-col items-center justify-center gap-3 sm:h-60"
                style={{ background: `radial-gradient(120% 130% at 28% 0%, ${accent}33, transparent 58%), linear-gradient(160deg, #0b1220, #070b12)` }}
              >
                <span className="font-display text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">{project.title}</span>
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs"
                  style={{ background: `${accent}1a`, border: `1px solid ${accent}55`, color: '#EAF0F7' }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                  {statusLabel}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- EXPERIENCIA (highlights, orientado a resultado, sin exponer el cómo) ---------------- */}
        {highlights.length > 0 && (
          <section className="mt-14">
            <SectionLabel>{tCase('highlightsLabel')}</SectionLabel>
            <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: `${accent}1f`, border: `1px solid ${accent}66` }}>
                    <Check size={12} style={{ color: accent }} aria-hidden="true" />
                  </span>
                  <span className="text-[15px] leading-[1.6] text-white/75">{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------------- NARRATIVA (reto / solución / resultado) ---------------- */}
        {sections.map((s) => (
          <section key={s.key} className="mt-14">
            <SectionLabel>{s.label}</SectionLabel>
            <p className="mt-5 max-w-3xl text-[16px] leading-[1.8] text-white/70 whitespace-pre-line">{s.body}</p>
          </section>
        ))}

        {testimonial && (
          <figure className="mt-14 rounded-2xl p-7" style={{ border: `1px solid ${accent}33`, background: `${accent}0d` }}>
            <blockquote className="text-[17px] leading-[1.7] text-white/85">“{testimonial}”</blockquote>
            {testimonialAuthor && <figcaption className="mt-3 text-sm text-white/45">— {testimonialAuthor}</figcaption>}
          </figure>
        )}

        {/* ---------------- CTA + back ---------------- */}
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
