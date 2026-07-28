import { FAQ, type Locale } from '@/content/faq'
import { localizedUrl } from '@/lib/seo'

// FAQPage JSON-LD — SOLO en la home, co-ubicado con el <Faq/> visible. Google exige que el
// structured data FAQPage corresponda a una FAQ visible en la MISMA página; por eso NO va en el
// JsonLd global del layout (que se monta en todas las rutas [locale] sin FAQ visible).
export default function FaqJsonLd({ locale }: { locale: string }) {
  const l: Locale = locale === 'es' ? 'es' : 'en'
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${localizedUrl(l)}#faq`,
    mainEntity: FAQ[l].map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
