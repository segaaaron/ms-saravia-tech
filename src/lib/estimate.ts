// Calculadora de costo aproximado de apps. Lógica pura (sin UI, sin i18n).
// Tarifas alineadas a benchmarks 2026 (Curotec, ProLatamWork, Netguru) pero en el lado
// ACCESIBLE del rango, para dar un punto de entrada atractivo (es un lead magnet, no una
// cotización vinculante). Estimación orientativa en USD.

export type Region = 'latam' | 'us'

// Tarifa efectiva blended por hora (USD) por región (lado accesible del mercado).
const REGION_RATE: Record<Region, number> = {
  latam: 30,
  us: 65,
}

// Categoría/tipo de app → multiplicador sobre las horas BASE (refleja el alcance típico del
// arquetipo). Calibrado con benchmarks 2026 (Topflight, Bolder Apps, Business of Apps,
// Appinventiv) + LATAM (ab4cus, tooldata). Las features siguen sumándose aparte.
export const CATEGORIES = [
  { key: 'saas', mult: 0.4 }, // SaaS/productividad — precio de entrada muy accesible (lead magnet)
  { key: 'other', mult: 1.0 },
  { key: 'booking', mult: 1.05 },
  { key: 'fitness', mult: 1.1 },
  { key: 'education', mult: 1.1 },
  { key: 'ecommerce', mult: 1.2 },
  { key: 'social', mult: 1.25 },
  { key: 'healthcare', mult: 1.3 },
  { key: 'fintech', mult: 1.35 },
  { key: 'marketplace', mult: 1.4 },
  { key: 'ondemand', mult: 1.45 },
] as const
export type CategoryKey = (typeof CATEGORIES)[number]['key']

// Plataforma → multiplicador de esfuerzo relativo a híbrida (React Native/Flutter = base).
export const PLATFORMS = [
  { key: 'landing', mult: 0.15 }, // landing/website — LATAM ~$700-1200, US ~$1500-2500
  { key: 'webapp', mult: 0.7 }, // web/PWA ~30% más barato que móvil (sin stores/módulos nativos)
  { key: 'hybrid', mult: 1.0 }, // React Native/Flutter — base
  { key: 'ios', mult: 1.1 },
  { key: 'android', mult: 1.1 },
  { key: 'native', mult: 1.75 },
  { key: 'aiagent', mult: 0.28 }, // agente IA / asistente — LATAM ~$1.2-2.5k, US ~$3.5-10k (básico→intermedio)
] as const
export type PlatformKey = (typeof PLATFORMS)[number]['key']

// Complejidad → horas base del build.
export const TIERS = [
  { key: 'mvp', hours: 240 },
  { key: 'standard', hours: 560 },
  { key: 'complex', hours: 1150 },
] as const
export type TierKey = (typeof TIERS)[number]['key']

// Nivel de diseño → multiplicador (driver de costo real: UI a medida cuesta más).
export const DESIGNS = [
  { key: 'template', mult: 0.9 },
  { key: 'standard', mult: 1.0 },
  { key: 'premium', mult: 1.2 },
] as const
export type DesignKey = (typeof DESIGNS)[number]['key']

// Seguridad/compliance → horas de overhead (auditorías, cifrado, docs). Los foros lo marcan
// como driver mayor: apps reguladas (HIPAA/PCI/finanzas) cargan sobrecosto significativo.
export const COMPLIANCES = [
  { key: 'none', hours: 0 },
  { key: 'standard', hours: 70 },
  { key: 'regulated', hours: 320 },
] as const
export type ComplianceKey = (typeof COMPLIANCES)[number]['key']

// Features opcionales → horas adicionales cada una.
export const FEATURES = [
  { key: 'auth', hours: 40 },
  { key: 'social', hours: 35 },
  { key: 'payments', hours: 85 },
  { key: 'realtime', hours: 100 },
  { key: 'maps', hours: 65 },
  { key: 'push', hours: 30 },
  { key: 'media', hours: 70 },
  { key: 'backend', hours: 150 },
  { key: 'analytics', hours: 30 },
  { key: 'ai', hours: 130 },
  { key: 'iot', hours: 115 },
  { key: 'offline', hours: 75 },
] as const
export type FeatureKey = (typeof FEATURES)[number]['key']

export type EstimateInput = {
  region: Region
  category: CategoryKey
  platform: PlatformKey
  tier: TierKey
  design: DesignKey
  compliance: ComplianceKey
  features: FeatureKey[]
}

export type EstimateResult = {
  low: number
  high: number
  hours: number
  /** timeline aproximado en semanas (equipo pequeño ~2-3 devs). */
  weeks: number
  /** mantenimiento estimado al año (USD). */
  maintenance: number
}

const round = (n: number, step: number) => Math.round(n / step) * step

export function estimate({ region, category, platform, tier, design, compliance, features }: EstimateInput): EstimateResult {
  const rate = REGION_RATE[region]
  const catMult = CATEGORIES.find((c) => c.key === category)?.mult ?? 1
  const pMult = PLATFORMS.find((p) => p.key === platform)?.mult ?? 1
  const dMult = DESIGNS.find((d) => d.key === design)?.mult ?? 1
  const base = TIERS.find((t) => t.key === tier)?.hours ?? 0
  const featHours = features.reduce(
    (sum, k) => sum + (FEATURES.find((f) => f.key === k)?.hours ?? 0),
    0,
  )
  const compHours = COMPLIANCES.find((c) => c.key === compliance)?.hours ?? 0
  // Categoría escala el alcance base del arquetipo; diseño y plataforma escalan todo; compliance
  // es overhead sumado. Las features se suman antes de plataforma/diseño.
  const hours = Math.round((base * catMult + featHours) * pMult * dMult + compHours)
  const mid = hours * rate
  // Redondeo adaptativo: montos chicos (landing) en pasos de $100, medios $500, grandes $1000.
  // Así una landing muestra $700-$1,200 en vez de colapsar al redondear a $1000.
  const step = mid < 3000 ? 100 : mid < 15000 ? 500 : 1000
  const low = round(mid * 0.78, step)
  let high = round(mid * 1.12, step)
  if (high <= low) high = low + step // garantiza spread visible
  return {
    low,
    high,
    hours,
    weeks: Math.max(3, Math.ceil(hours / 110)),
    maintenance: round(mid * 0.18, Math.min(step, 500)),
  }
}

// Región de precios determinada por PAÍS (geo por IP en el server). USA/Canadá (y territorios
// USD) → 'us'; países de LATAM → 'latam'; fuera de esas regiones o desconocido → fallback por
// locale. Así un usuario de USA/Canadá NO puede ver los precios de LATAM.
const US_COUNTRIES = new Set(['US', 'CA', 'PR', 'GU', 'VI', 'AS', 'MP'])
const LATAM_COUNTRIES = new Set([
  'MX', 'GT', 'HN', 'SV', 'NI', 'CR', 'PA', 'CO', 'VE', 'EC',
  'PE', 'BO', 'CL', 'AR', 'UY', 'PY', 'DO', 'CU',
])

export function regionFromCountry(country?: string | null, locale?: string): Region {
  const c = (country || '').toUpperCase()
  if (US_COUNTRIES.has(c)) return 'us'
  if (LATAM_COUNTRIES.has(c)) return 'latam'
  return locale === 'es' ? 'latam' : 'us'
}

/** Formatea USD sin decimales: 45000 → "$45,000". */
export function formatUsd(n: number): string {
  return '$' + n.toLocaleString('en-US')
}
