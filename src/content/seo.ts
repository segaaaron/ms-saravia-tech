// Datos ESTRUCTURALES (no traducibles) de las rutas SEO nuevas. El copy visible vive en
// i18n (`servicePages`, `caseStudy`); aquí solo slugs, índices y relaciones. Fuente única
// para las rutas [locale]/services y [locale]/work y para sitemap.ts.
import { projects } from './projects'

// --- Service pillar pages -------------------------------------------------
// `itemIndex` mapea al array `services.items` de i18n (mismo orden en en/es).
// Stack técnico agrupado por capa. Los nombres de tecnología son neutros (no se traducen);
// solo la etiqueta de grupo es bilingüe. Vive aquí (no en i18n) para no duplicar nombres.
export type TechGroup = { en: string; es: string; items: string[] }

export type ServicePage = {
  slug: string
  itemIndex: number
  /** slugs de demos de /demos relacionados (prueba viva, enlace interno). */
  relatedDemos: string[]
  /** slugs de case studies de /work relacionados. */
  relatedCaseStudies: string[]
  /** stack técnico agrupado por capa (amplio, nivel senior). */
  techStack: TechGroup[]
}

const servicePages: ServicePage[] = [
  {
    slug: 'saas',
    itemIndex: 0,
    relatedDemos: ['pulse-landing', 'pulse-dashboard', 'vesper-store', 'vesper-dashboard'],
    relatedCaseStudies: ['valhalla-resume'],
    techStack: [
      { en: 'Frontend', es: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'React Query', 'Zustand', 'Server Components', 'Radix UI', 'Framer Motion'] },
      { en: 'Backend & API', es: 'Backend y API', items: ['Node.js', 'tRPC', 'GraphQL', 'REST / OpenAPI', 'Prisma', 'Drizzle', 'Zod', 'BullMQ'] },
      { en: 'Architecture & patterns', es: 'Arquitectura y patrones', items: ['Multi-tenant', 'DDD', 'Hexagonal', 'Clean Architecture', 'CQRS', 'Event-driven', 'Modular monolith', 'Repository', 'Dependency Injection'] },
      { en: 'Data', es: 'Datos', items: ['PostgreSQL', 'Redis', 'PgBouncer', 'Row-Level Security', 'Elasticsearch', 'ClickHouse', 'Kafka', 'S3'] },
      { en: 'Auth & security', es: 'Auth y seguridad', items: ['OAuth 2.0 / OIDC', 'JWT', 'RBAC / ABAC', 'SSO / SAML', 'Rate limiting', 'OWASP'] },
      { en: 'Payments & billing', es: 'Pagos y facturación', items: ['Stripe Billing', 'Usage-based billing', 'Webhooks idempotentes', 'Tax / invoicing', 'Dunning'] },
      { en: 'Infra & DevOps', es: 'Infra y DevOps', items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Nginx', 'Cloudflare', 'Blue-green deploys'] },
      { en: 'Observability & quality', es: 'Observabilidad y calidad', items: ['OpenTelemetry', 'Sentry', 'Grafana', 'Prometheus', 'Structured logging', 'k6', 'Playwright', 'Vitest'] },
    ],
  },
  {
    slug: 'mobile-apps',
    itemIndex: 1,
    relatedDemos: [],
    relatedCaseStudies: ['nova-nutrition'],
    techStack: [
      { en: 'iOS · languages & UI', es: 'iOS · lenguajes y UI', items: ['Swift', 'Objective-C', 'SwiftUI', 'UIKit', 'Swift Concurrency', 'async/await', 'GCD', 'Combine', 'RxSwift'] },
      { en: 'Apple frameworks', es: 'Frameworks de Apple', items: ['Core Data', 'SwiftData', 'Core ML', 'ARKit', 'MapKit', 'AVFoundation', 'StoreKit', 'Keychain', 'Core Animation'] },
      { en: 'Android · native', es: 'Android · nativo', items: ['Kotlin', 'Java', 'Jetpack Compose', 'Coroutines', 'Flow', 'Room', 'Hilt / Dagger', 'Retrofit', 'WorkManager', 'KMP'] },
      { en: 'Cross-platform', es: 'Multiplataforma', items: ['React Native', 'Expo', 'EAS', 'TypeScript', 'Reanimated', 'Flutter', 'Dart', 'Capacitor'] },
      { en: 'Architecture & patterns', es: 'Arquitectura y patrones', items: ['MVVM', 'MVI', 'VIPER', 'Clean Architecture', 'TCA', 'Coordinator', 'Repository', 'Dependency Injection', 'Modularization'] },
      { en: 'Data & state', es: 'Datos y estado', items: ['Core Data', 'SQLite', 'Realm', 'GRDB', 'Redux Toolkit', 'Zustand', 'Offline-first sync'] },
      { en: 'Dependencies & tooling', es: 'Dependencias y tooling', items: ['Swift Package Manager', 'CocoaPods', 'Carthage', 'Gradle', 'Xcode', 'Instruments', 'SwiftLint'] },
      { en: 'Networking & realtime', es: 'Networking y realtime', items: ['REST', 'GraphQL', 'gRPC', 'WebSockets', 'URLSession', 'Alamofire', 'Ktor'] },
      { en: 'Quality & delivery', es: 'Calidad y entrega', items: ['XCTest', 'JUnit', 'Detox', 'Maestro', 'Fastlane', 'TestFlight', 'Play Console', 'Sentry', 'Firebase'] },
    ],
  },
  {
    slug: 'ai-agents',
    itemIndex: 2,
    relatedDemos: [],
    relatedCaseStudies: ['valhalla-resume', 'nova-nutrition'],
    techStack: [
      { en: 'Models', es: 'Modelos', items: ['OpenAI', 'Claude', 'Gemini', 'Llama', 'Mistral', 'DeepSeek'] },
      { en: 'Orchestration', es: 'Orquestación', items: ['LangChain', 'LangGraph', 'LlamaIndex', 'MCP', 'Function calling', 'Multi-agent'] },
      { en: 'Retrieval (RAG)', es: 'Recuperación (RAG)', items: ['pgvector', 'Pinecone', 'Weaviate', 'Qdrant', 'Embeddings', 'Rerankers', 'Hybrid search', 'Chunking'] },
      { en: 'Patterns & prompting', es: 'Patrones y prompting', items: ['ReAct', 'Tool-use', 'Structured output', 'Few-shot', 'Chain-of-thought', 'Human-in-the-loop'] },
      { en: 'Runtime & serving', es: 'Runtime y serving', items: ['Python', 'FastAPI', 'Node.js', 'vLLM', 'Durable jobs', 'Queues', 'Streaming (SSE)'] },
      { en: 'Data & tuning', es: 'Datos y tuning', items: ['Fine-tuning', 'LoRA', 'Distillation', 'Synthetic data', 'Vector ETL'] },
      { en: 'Evals & safety', es: 'Evals y seguridad', items: ['Evals en CI', 'LLM-as-judge', 'Red-teaming', 'Guardrails', 'PII redaction', 'Prompt-injection defense'] },
      { en: 'Ops & cost', es: 'Ops y costo', items: ['LangSmith', 'Tracing', 'Token accounting', 'Model routing', 'Semantic caching', 'Rate limiting'] },
    ],
  },
  {
    slug: 'tech-consulting',
    itemIndex: 3,
    relatedDemos: [],
    relatedCaseStudies: [],
    techStack: [
      { en: 'Architecture', es: 'Arquitectura', items: ['System design', 'DDD', 'Hexagonal', 'Event-driven', 'Microservices', 'C4 model', 'ADRs', 'API design'] },
      { en: 'Performance', es: 'Rendimiento', items: ['Core Web Vitals', 'Profiling', 'Flamegraphs', 'k6', 'Lighthouse CI', 'Bundle analysis', 'DB query tuning'] },
      { en: 'Cloud & infra', es: 'Cloud e infra', items: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Serverless', 'CDN'] },
      { en: 'DevOps & CI/CD', es: 'DevOps y CI/CD', items: ['GitHub Actions', 'Pipelines', 'Blue-green / canary', 'Feature flags', 'IaC', 'Secrets management'] },
      { en: 'Quality & testing', es: 'Calidad y testing', items: ['Testing strategy', 'TDD', 'Unit / integration / e2e', 'Code review', 'Static analysis', 'SLOs / SLIs'] },
      { en: 'Security', es: 'Seguridad', items: ['Threat modeling', 'OWASP', 'Dependency audits', 'Secrets management', 'SOC 2 readiness'] },
      { en: 'Data & scale', es: 'Datos y escala', items: ['PostgreSQL tuning', 'Caching strategy', 'Sharding', 'Connection pooling', 'Queue design'] },
      { en: 'Leadership', es: 'Liderazgo', items: ['Fractional CTO', 'Technical due diligence', 'Team enablement', 'Hiring / interviews', 'Roadmapping', 'Mentoring'] },
    ],
  },
]

export const serviceSlugs = servicePages.map((s) => s.slug)
export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug)

// --- Solution / industry landings ----------------------------------------
// Reencuadran los demos (noindex) como landings INDEXABLES de intención comercial por
// industria. La landing rankea; el demo interactivo vive como prueba viva enlazada.
export type SolutionPage = {
  slug: string
  /** service pillar relacionado (link + contexto). */
  service: string
  /** slugs de demos de /demos que ejemplifican esta solución. */
  demos: string[]
}

const solutionPages: SolutionPage[] = [
  { slug: 'gym-software', service: 'saas', demos: ['pulse-landing', 'pulse-dashboard', 'pulse-socio'] },
  { slug: 'clinic-website', service: 'saas', demos: ['aura'] },
  { slug: 'restaurant-website', service: 'saas', demos: ['brasa', 'brasa-panel'] },
  { slug: 'ecommerce-store', service: 'saas', demos: ['vesper-store', 'vesper-dashboard'] },
]

export const solutionSlugs = solutionPages.map((s) => s.slug)
export const getSolutionPage = (slug: string) => solutionPages.find((s) => s.slug === slug)
/** solutions cuyo pillar es este servicio (para internal linking desde la service page). */
export const solutionsForService = (serviceSlug: string) =>
  solutionPages.filter((s) => s.service === serviceSlug)

// --- Case study pages -----------------------------------------------------
// Alinea slug SEO-friendly con el `id` de content/projects.ts (mismo orden que i18n work.projects).
export type CaseStudyPage = {
  slug: string
  projectId: (typeof projects)[number]['id']
  projectIndex: number
  /** alcance del trabajo (bilingüe, corto). */
  scope: { en: string; es: string }
  /** año (o "En curso"). */
  year: string
}

export const caseStudyPages: CaseStudyPage[] = [
  {
    slug: 'yasmin-medrano',
    projectId: 'yasmin',
    projectIndex: 0,
    scope: { en: 'Design + Build · Web', es: 'Diseño + Build · Web' },
    year: '2025',
  },
  {
    slug: 'valhalla-resume',
    projectId: 'readycv',
    projectIndex: 1,
    scope: { en: 'Product · Web + AI', es: 'Producto · Web + IA' },
    year: '2025',
  },
  {
    slug: 'nova-nutrition',
    projectId: 'nova',
    projectIndex: 2,
    scope: { en: 'Product · Mobile', es: 'Producto · Móvil' },
    year: '2026',
  },
]

export const caseStudySlugs = caseStudyPages.map((c) => c.slug)
export const getCaseStudyPage = (slug: string) => caseStudyPages.find((c) => c.slug === slug)
export const getProjectForCaseStudy = (page: CaseStudyPage) =>
  projects.find((p) => p.id === page.projectId)!
