'use client'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import {
  Check, MapPin, Smartphone, Gauge, Palette, Puzzle, ShieldCheck, LayoutGrid,
  Lock, CreditCard, MessageSquare, Map as MapIcon, Bell, Server, Sparkles, WifiOff,
  UsersRound, Image as ImageIcon, BarChart3, Watch,
} from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import CtaButton from '@/components/ui/CtaButton'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import {
  estimate, formatUsd,
  CATEGORIES, PLATFORMS, TIERS, DESIGNS, COMPLIANCES, FEATURES,
  type Region, type CategoryKey, type PlatformKey, type TierKey, type DesignKey, type ComplianceKey, type FeatureKey,
} from '@/lib/estimate'

const FEATURE_ICON: Record<FeatureKey, typeof Lock> = {
  auth: Lock, social: UsersRound, payments: CreditCard, realtime: MessageSquare,
  maps: MapIcon, push: Bell, media: ImageIcon, backend: Server,
  analytics: BarChart3, ai: Sparkles, iot: Watch, offline: WifiOff,
}

// Botón segmentado accesible (aria-pressed, foco visible, ≥44px táctil).
function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="min-h-[44px] rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2FF5E0]"
      style={{
        border: active ? '1px solid rgba(47,245,224,0.5)' : '1px solid rgba(120,200,255,0.12)',
        background: active ? 'rgba(47,245,224,0.09)' : 'rgba(255,255,255,0.02)',
        color: active ? '#EAF0F7' : 'rgba(255,255,255,0.6)',
        boxShadow: active ? '0 0 0 3px rgba(47,245,224,0.06)' : 'none',
      }}
    >
      {children}
    </button>
  )
}

// Encabezado de grupo con icono (estructura + escaneo rápido).
function GroupHead({ icon: Icon, children }: { icon: typeof Lock; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-[#2FF5E0]" />
      <h3 className="text-sm font-semibold text-white/80">{children}</h3>
    </div>
  )
}

export default function AppCostEstimator({
  region,
  countryLabel,
}: {
  region: Region
  countryLabel?: string | null
}) {
  const t = useTranslations('estimator')
  const locale = useLocale()

  // La región viene FIJA del server (geo por IP) — no editable. Un usuario de USA/Canadá
  // no puede cambiar a LATAM para ver precios más bajos.
  const [category, setCategory] = useState<CategoryKey>('other')
  const [platform, setPlatform] = useState<PlatformKey>('hybrid')
  const [tier, setTier] = useState<TierKey>('standard')
  const [design, setDesign] = useState<DesignKey>('standard')
  const [compliance, setCompliance] = useState<ComplianceKey>('none')
  const [features, setFeatures] = useState<FeatureKey[]>(['auth', 'push'])

  const result = useMemo(
    () => estimate({ region, category, platform, tier, design, compliance, features }),
    [region, category, platform, tier, design, compliance, features],
  )

  const toggleFeature = (k: FeatureKey) =>
    setFeatures((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))

  const contactHref = `${locale === 'es' ? '/es' : ''}/?source=estimator#contact`
  const range = `${formatUsd(result.low)} – ${formatUsd(result.high)}`

  return (
    <section id="estimate" className="relative pt-6 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 75% 40%, rgba(47,245,224,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-14 space-y-4"
        >
          <motion.div variants={fadeInUp}>
            <SectionLabel color="cyan">{t('label')}</SectionLabel>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
            <GradientText gradient="primary">{t('title')}</GradientText>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-6 lg:grid-cols-[1.45fr_1fr]"
        >
          {/* ── Controls ── */}
          <div
            className="rounded-2xl p-6 sm:p-8 space-y-7"
            style={{
              border: '1px solid rgba(120,200,255,0.10)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            }}
          >
            {/* Region — FIJA por geolocalización (server), no editable */}
            <div className="space-y-2">
              <GroupHead icon={MapPin}>{t('regionLabel')}</GroupHead>
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ border: '1px solid rgba(120,200,255,0.14)', background: 'rgba(120,200,255,0.04)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#2FF5E0]" />
                <span className="text-sm font-medium text-white/85">{countryLabel || t(`region.${region}`)}</span>
              </div>
              <p className="text-xs text-white/35">{t('regionAuto')}</p>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <GroupHead icon={LayoutGrid}>{t('categoryLabel')}</GroupHead>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map((c) => (
                  <SegBtn key={c.key} active={category === c.key} onClick={() => setCategory(c.key)}>{t(`category.${c.key}`)}</SegBtn>
                ))}
              </div>
              <p className="text-xs text-white/40 leading-relaxed">{t('categoryHint')}</p>
            </div>

            {/* Platform */}
            <div className="space-y-3">
              <GroupHead icon={Smartphone}>{t('platformLabel')}</GroupHead>
              <div className="grid grid-cols-2 gap-2.5">
                {PLATFORMS.map((p) => (
                  <SegBtn key={p.key} active={platform === p.key} onClick={() => setPlatform(p.key)}>{t(`platform.${p.key}`)}</SegBtn>
                ))}
              </div>
              <p className="text-xs text-white/40 leading-relaxed">{t(`platformHint.${platform}`)}</p>
            </div>

            {/* Scope */}
            <div className="space-y-3">
              <GroupHead icon={Gauge}>{t('tierLabel')}</GroupHead>
              <div className="grid grid-cols-3 gap-2.5">
                {TIERS.map((tr) => (
                  <SegBtn key={tr.key} active={tier === tr.key} onClick={() => setTier(tr.key)}>{t(`tier.${tr.key}`)}</SegBtn>
                ))}
              </div>
              <p className="text-xs text-white/40 leading-relaxed">{t(`tierHint.${tier}`)}</p>
            </div>

            {/* Design */}
            <div className="space-y-3">
              <GroupHead icon={Palette}>{t('designLabel')}</GroupHead>
              <div className="grid grid-cols-3 gap-2.5">
                {DESIGNS.map((d) => (
                  <SegBtn key={d.key} active={design === d.key} onClick={() => setDesign(d.key)}>{t(`design.${d.key}`)}</SegBtn>
                ))}
              </div>
              <p className="text-xs text-white/40 leading-relaxed">{t(`designHint.${design}`)}</p>
            </div>

            {/* Security & compliance */}
            <div className="space-y-3">
              <GroupHead icon={ShieldCheck}>{t('complianceLabel')}</GroupHead>
              <div className="grid grid-cols-3 gap-2.5">
                {COMPLIANCES.map((c) => (
                  <SegBtn key={c.key} active={compliance === c.key} onClick={() => setCompliance(c.key)}>{t(`compliance.${c.key}`)}</SegBtn>
                ))}
              </div>
              <p className="text-xs text-white/40 leading-relaxed">{t(`complianceHint.${compliance}`)}</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <GroupHead icon={Puzzle}>{t('featuresLabel')}</GroupHead>
              <div className="flex flex-wrap gap-2">
                {FEATURES.map((f) => {
                  const on = features.includes(f.key)
                  const Icon = on ? Check : FEATURE_ICON[f.key]
                  return (
                    <button
                      key={f.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleFeature(f.key)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2FF5E0]"
                      style={{
                        border: on ? '1px solid rgba(47,245,224,0.5)' : '1px solid rgba(120,200,255,0.12)',
                        background: on ? 'rgba(47,245,224,0.09)' : 'rgba(255,255,255,0.02)',
                        color: on ? '#EAF0F7' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      <Icon size={13} className={on ? 'text-[#2FF5E0]' : 'text-white/40'} />
                      {t(`features.${f.key}`)}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Result ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="relative overflow-hidden rounded-2xl p-7"
              style={{
                border: '1px solid rgba(120,200,255,0.14)',
                background: 'linear-gradient(160deg, rgba(155,108,255,0.10), rgba(47,245,224,0.05))',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(47,245,224,0.14), transparent 70%)' }}
              />
              <div className="relative">
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-white/45">{t('resultLabel')}</p>
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`${t('resultLabel')}: ${range} ${t('resultRange')}`}
                  className="mt-2 font-display text-[32px] sm:text-[38px] font-black leading-[1.05] tabular-nums"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={range}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      <GradientText gradient="primary">{range}</GradientText>
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-1 text-xs text-white/40">{t('resultRange')}</p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">{t('timelineLabel')}</p>
                    <p className="mt-1 text-lg font-semibold text-white/85 tabular-nums">~{result.weeks} {t('weeks')}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">{t('effortLabel')}</p>
                    <p className="mt-1 text-lg font-semibold text-white/85 tabular-nums">~{result.hours.toLocaleString('en-US')} {t('hours')}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(120,200,255,0.08)' }}>
                  <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">{t('maintenanceLabel')}</span>
                  <span className="text-sm font-semibold text-white/75 tabular-nums">{formatUsd(result.maintenance)} <span className="text-white/40 font-normal">{t('perYear')}</span></span>
                </div>

                <p className="mt-5 flex items-start gap-2 text-[12px] leading-[1.6] text-white/50">
                  <Check size={13} className="mt-0.5 shrink-0 text-[#2FF5E0]" />
                  {t('includedNote')}
                </p>
                <p className="mt-2 text-[12px] leading-[1.6] text-white/40">{t('disclaimer')}</p>

                <div className="mt-6 border-t border-white/[0.08] pt-6">
                  <p className="text-sm font-semibold text-white/85">{t('ctaTitle')}</p>
                  <CtaButton href={contactHref} className="mt-4 w-full">{t('ctaButton')}</CtaButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
