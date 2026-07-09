// Datos ESTRUCTURALES (no traducibles) de las rutas SEO nuevas. El copy visible vive en
// i18n (`servicePages`, `caseStudy`); aquí solo slugs, índices y relaciones. Fuente única
// para las rutas [locale]/services y [locale]/work y para sitemap.ts.
import { projects } from './projects'

// --- Service pillar pages -------------------------------------------------
// `itemIndex` mapea al array `services.items` de i18n (mismo orden en en/es).
export type ServicePage = {
  slug: string
  itemIndex: number
  /** slugs de demos de /demos relacionados (prueba viva, enlace interno). */
  relatedDemos: string[]
  /** slugs de case studies de /work relacionados. */
  relatedCaseStudies: string[]
}

export const servicePages: ServicePage[] = [
  {
    slug: 'saas',
    itemIndex: 0,
    relatedDemos: ['pulse-landing', 'pulse-dashboard', 'vesper-store', 'vesper-dashboard'],
    relatedCaseStudies: ['readycv'],
  },
  {
    slug: 'mobile-apps',
    itemIndex: 1,
    relatedDemos: [],
    relatedCaseStudies: ['nova-nutrition'],
  },
  {
    slug: 'ai-agents',
    itemIndex: 2,
    relatedDemos: [],
    relatedCaseStudies: ['readycv', 'nova-nutrition'],
  },
  {
    slug: 'tech-consulting',
    itemIndex: 3,
    relatedDemos: [],
    relatedCaseStudies: [],
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

export const solutionPages: SolutionPage[] = [
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
}

export const caseStudyPages: CaseStudyPage[] = [
  { slug: 'yasmin-medrano', projectId: 'yasmin', projectIndex: 0 },
  { slug: 'readycv', projectId: 'readycv', projectIndex: 1 },
  { slug: 'nova-nutrition', projectId: 'nova', projectIndex: 2 },
]

export const caseStudySlugs = caseStudyPages.map((c) => c.slug)
export const getCaseStudyPage = (slug: string) => caseStudyPages.find((c) => c.slug === slug)
export const getProjectForCaseStudy = (page: CaseStudyPage) =>
  projects.find((p) => p.id === page.projectId)!
