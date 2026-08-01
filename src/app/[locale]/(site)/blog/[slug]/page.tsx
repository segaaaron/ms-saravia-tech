import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { getPost, readingMinutes, type Locale } from '@/content/blog'
import { getServicePage } from '@/content/seo'
import { buildAlternates, buildOpenGraph, localizedUrl } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import PostBody from '@/components/blog/PostBody'
import GradientText from '@/components/ui/GradientText'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const loc = (locale === 'es' ? 'es' : 'en') as Locale
  const { title, excerpt } = post[loc]
  const path = `/blog/${slug}`
  return {
    title: `${title} | MS Saravia Tech Stack`,
    description: excerpt,
    alternates: buildAlternates(locale, path),
    openGraph: { ...buildOpenGraph(locale, path, title, excerpt), type: 'article' },
    twitter: { card: 'summary_large_image', title, description: excerpt },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const loc = (locale === 'es' ? 'es' : 'en') as Locale
  const c = post[loc]

  const t = await getTranslations({ locale, namespace: 'blogPage' })
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })
  const tSvc = await getTranslations({ locale, namespace: 'services' })
  const service = getServicePage(post.cluster)
  const serviceItems = tSvc.raw('items') as { title: string }[]
  const blogBase = locale === 'es' ? '/es/blog' : '/blog'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: c.title,
    description: c.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: loc,
    url: localizedUrl(locale, `/blog/${slug}`),
    mainEntityOfPage: localizedUrl(locale, `/blog/${slug}`),
    author: { '@type': 'Organization', name: 'MS SARAVIA TECH STACK LLC', url: localizedUrl('en') },
    publisher: {
      '@type': 'Organization',
      name: 'MS SARAVIA TECH STACK LLC',
      logo: { '@type': 'ImageObject', url: `${localizedUrl('en')}/icon.png` },
    },
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Breadcrumbs
        locale={locale}
        ariaLabel={tCrumb('aria')}
        items={[
          { name: tCrumb('home'), path: '' },
          { name: t('title'), path: '/blog' },
          { name: c.title },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        <header className="space-y-5">
          <div className="flex items-center gap-3 text-[13px] text-white/40">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span aria-hidden>·</span>
            <span>{readingMinutes(c)} {t('minRead')}</span>
          </div>
          <h1 className="text-4xl sm:text-[44px] font-display font-bold leading-[1.1] tracking-tight">
            <GradientText gradient="primary">{c.title}</GradientText>
          </h1>
          <p className="text-lg leading-[1.7] text-white/60">{c.excerpt}</p>
        </header>

        <PostBody body={c.body} />

        {/* CTA hacia el service pillar relacionado (internal linking + funnel) */}
        <section
          className="mt-16 overflow-hidden rounded-2xl p-8"
          style={{ border: '1px solid rgba(120,200,255,0.12)', background: 'linear-gradient(120deg, rgba(155,108,255,0.08), rgba(47,245,224,0.05))' }}
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-white">{t('ctaTitle')}</h2>
          {service && (
            <p className="mt-2 text-sm text-white/50">
              {t('relatedServiceLabel')}:{' '}
              <Link
                href={locale === 'es' ? `/es/services/${service.slug}` : `/services/${service.slug}`}
                className="font-semibold text-white/75 underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#2FF5E0]"
              >
                {serviceItems[service.itemIndex].title}
              </Link>
            </p>
          )}
          <CtaButton href={locale === 'es' ? '/es#contact' : '/#contact'} size="lg" className="mt-6">
            {t('ctaButton')}
          </CtaButton>
        </section>

        <Link href={blogBase} className="mt-10 inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70">
          <ArrowLeft size={14} />
          {t('backToBlog')}
        </Link>

        {/* Ver el servicio en acción (si el pillar tiene demos) */}
        {service && service.relatedDemos.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {service.relatedDemos.slice(0, 3).map((d) => (
              <Link
                key={d}
                href={`${locale === 'es' ? '/es' : ''}/demos/${d}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition-colors hover:border-[#2FF5E0]/40 hover:text-[#2FF5E0]"
              >
                {d}
                <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        )}
      </article>
    </>
  )
}
