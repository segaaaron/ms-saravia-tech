import { FAQ, type Locale } from '@/content/faq'
import { SAME_AS } from '@/content/socials'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud'

const CONTACT_EMAIL = 'contact@ms-tech-stack.cloud'

const SERVICES: Record<Locale, { name: string; desc: string }[]> = {
  en: [
    {
      name: 'SaaS Development',
      desc: 'Scalable cloud SaaS platforms built from MVP to enterprise-grade systems.',
    },
    {
      name: 'Mobile App Development',
      desc: 'Native and cross-platform iOS & Android apps (React Native, Swift, Kotlin).',
    },
    {
      name: 'AI Agents & Automation',
      desc: 'Custom AI agents and intelligent automation powered by LLMs.',
    },
    {
      name: 'Tech Consulting & Fractional CTO',
      desc: 'Architecture review, stack modernization and technical leadership.',
    },
  ],
  es: [
    {
      name: 'Desarrollo de SaaS',
      desc: 'Plataformas SaaS en la nube escalables, del MVP a sistemas empresariales.',
    },
    {
      name: 'Desarrollo de Apps Móviles',
      desc: 'Apps nativas y multiplataforma iOS y Android (React Native, Swift, Kotlin).',
    },
    {
      name: 'Agentes de IA y Automatización',
      desc: 'Agentes de IA a medida y automatización inteligente con LLMs.',
    },
    {
      name: 'Consultoría Tecnológica y CTO Fraccional',
      desc: 'Revisión de arquitectura, modernización de stack y liderazgo técnico.',
    },
  ],
}

export default function JsonLd({ locale }: { locale: string }) {
  const l: Locale = locale === 'es' ? 'es' : 'en'
  const canonical = l === 'es' ? `${SITE_URL}/es` : SITE_URL

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'MS Saravia Tech Stack LLC',
        legalName: 'MS SARAVIA TECH STACK LLC',
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        image: `${SITE_URL}/opengraph-image`,
        description:
          l === 'es'
            ? 'Agencia de software en USA: desarrollo de SaaS, apps móviles y agentes de IA.'
            : 'US-based software agency: SaaS development, mobile apps and AI agents.',
        email: CONTACT_EMAIL,
        foundingLocation: { '@type': 'Country', name: 'United States' },
        areaServed: [
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Place', name: 'Latin America' },
        ],
        ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: CONTACT_EMAIL,
          availableLanguage: ['English', 'Spanish'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'MS Saravia Tech Stack LLC',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: ['en', 'es'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#service`,
        name: 'MS Saravia Tech Stack LLC',
        url: canonical,
        image: `${SITE_URL}/opengraph-image`,
        priceRange: '$$$',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: ['United States', 'Canada', 'United Kingdom', 'Latin America'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name:
            l === 'es' ? 'Servicios de software' : 'Software services',
          itemListElement: SERVICES[l].map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.name,
              description: s.desc,
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: FAQ[l].map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
