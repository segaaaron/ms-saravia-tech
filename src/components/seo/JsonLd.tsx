const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud'

const CONTACT_EMAIL = 'contact@ms-tech-stack.cloud'

type Locale = 'en' | 'es'

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

const FAQ: Record<Locale, { q: string; a: string }[]> = {
  en: [
    {
      q: 'What does MS Saravia Tech Stack build?',
      a: 'We build SaaS platforms, mobile apps (iOS & Android), and AI agents, plus offer technical consulting. We take products from idea to production with a modern stack.',
    },
    {
      q: 'Can you build a SaaS platform from scratch?',
      a: 'Yes. We design and develop full SaaS products end to end — from MVP to enterprise-grade systems — using Next.js, Node.js, PostgreSQL and Stripe.',
    },
    {
      q: 'Do you develop mobile apps for iOS and Android?',
      a: 'Yes. We build native and cross-platform mobile apps with React Native, Swift and Kotlin, published to the App Store and Google Play.',
    },
    {
      q: 'What are AI agents and how can they help my business?',
      a: 'AI agents are autonomous software that automate workflows and decisions using LLMs like Claude and GPT. They reduce manual work and unlock new product capabilities.',
    },
    {
      q: 'How much does it cost to build an app or SaaS?',
      a: 'Cost depends on scope. MVPs typically start in the low five figures; larger platforms scale from there. Contact us for a free scoped estimate.',
    },
    {
      q: 'Where are you based?',
      a: 'MS Saravia Tech Stack LLC is a US-based software agency serving clients across the USA and Latin America, working remotely worldwide.',
    },
  ],
  es: [
    {
      q: '¿Qué construye MS Saravia Tech Stack?',
      a: 'Construimos plataformas SaaS, apps móviles (iOS y Android) y agentes de IA, además de consultoría técnica. Llevamos productos de la idea a producción con un stack moderno.',
    },
    {
      q: '¿Pueden construir un SaaS desde cero?',
      a: 'Sí. Diseñamos y desarrollamos productos SaaS completos — del MVP a sistemas empresariales — con Next.js, Node.js, PostgreSQL y Stripe.',
    },
    {
      q: '¿Desarrollan apps móviles para iOS y Android?',
      a: 'Sí. Creamos apps nativas y multiplataforma con React Native, Swift y Kotlin, publicadas en App Store y Google Play.',
    },
    {
      q: '¿Qué son los agentes de IA y cómo ayudan a mi negocio?',
      a: 'Los agentes de IA son software autónomo que automatiza flujos y decisiones usando LLMs como Claude y GPT. Reducen trabajo manual y habilitan nuevas capacidades.',
    },
    {
      q: '¿Cuánto cuesta construir una app o un SaaS?',
      a: 'El costo depende del alcance. Los MVPs suelen empezar en cifras bajas de cinco dígitos; las plataformas grandes escalan desde ahí. Escríbenos para una estimación gratis.',
    },
    {
      q: '¿Dónde están ubicados?',
      a: 'MS Saravia Tech Stack LLC es una agencia de software con base en USA que atiende clientes en Estados Unidos y Latinoamérica, trabajando en remoto a nivel global.',
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
          { '@type': 'Place', name: 'Latin America' },
        ],
        sameAs: ['https://github.com', 'https://linkedin.com'],
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
        areaServed: ['United States', 'Latin America'],
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
