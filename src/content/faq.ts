export type Locale = 'en' | 'es'

export type FaqItem = { q: string; a: string }

// Shared FAQ source of truth: rendered visibly by <Faq /> AND emitted as
// FAQPage JSON-LD by <FaqJsonLd /> — both ONLY on the home page (schema must match visible FAQ).
// Keep both in sync by importing from here.
export const FAQ: Record<Locale, FaqItem[]> = {
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
