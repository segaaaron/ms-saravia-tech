import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { postsByDate, readingMinutes, type Locale } from '@/content/blog'
import { buildAlternates, buildOpenGraph, localizedUrl } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLdScript from '@/components/seo/JsonLdScript'
import GradientText from '@/components/ui/GradientText'
import BlogCard from '@/components/blog/BlogCard'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blogPage' })
  const title = t('metaTitle')
  const description = t('metaDesc')
  return {
    title,
    description,
    alternates: buildAlternates(locale, '/blog'),
    openGraph: buildOpenGraph(locale, '/blog', title, description),
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BlogHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = (locale === 'es' ? 'es' : 'en') as Locale
  const t = await getTranslations({ locale, namespace: 'blogPage' })
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' })
  const posts = postsByDate()
  const blogBase = locale === 'es' ? '/es/blog' : '/blog'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('metaTitle'),
    description: t('metaDesc'),
    url: localizedUrl(locale, '/blog'),
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p[loc].title,
      datePublished: p.date,
      url: localizedUrl(locale, `/blog/${p.slug}`),
    })),
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Breadcrumbs
        locale={locale}
        ariaLabel={tCrumb('aria')}
        items={[{ name: tCrumb('home'), path: '' }, { name: t('title') }]}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24 pt-4">
        <header className="max-w-2xl space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
            <GradientText gradient="primary">{t('title')}</GradientText>
          </h1>
          <p className="text-lg text-white/55">{t('intro')}</p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2" style={{ perspective: '1200px' }}>
          {posts.map((p) => {
            const c = p[loc]
            return (
              <BlogCard
                key={p.slug}
                href={`${blogBase}/${p.slug}`}
                slug={p.slug}
                cluster={p.cluster}
                dateLabel={new Date(p.date).toLocaleDateString(loc, { year: 'numeric', month: 'short', day: 'numeric' })}
                readingLabel={`${readingMinutes(c)} ${t('minRead')}`}
                title={c.title}
                excerpt={c.excerpt}
                readMore={t('readMore')}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
