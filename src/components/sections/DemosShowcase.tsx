'use client'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { ArrowUpRight, Sparkles, Smartphone } from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import TiltCard from '@/components/ui/TiltCard'
import CtaButton from '@/components/ui/CtaButton'
import { floatUp3D, staggerContainer } from '@/lib/motion'

type Item = { name: string; tag: string }

// Diseño fijo por card (slug/imagen/acento); nombre + tag vienen de i18n.
// Los thumbs son webp optimizados (~800px, <40KB) generados en public/showcase/thumbs/
// — nunca los masters de 6-8MB. Se sirven vía next/image para lazy + responsive.
const CARDS = [
  { slug: 'pulse-landing', thumb: '/showcase/thumbs/pulse-landing.webp', accent: '#3b5bdb' },
  { slug: 'vesper-store', thumb: '/showcase/thumbs/vesper-store.webp', accent: '#a855f7' },
  { slug: 'aura', thumb: '/showcase/thumbs/aura.webp', accent: '#c2a274' },
  { slug: 'vesper-dashboard', thumb: '/showcase/thumbs/vesper-dashboard.webp', accent: '#00E5FF' },
] as const

export default function DemosShowcase() {
  const t = useTranslations('showcase')
  const locale = useLocale()
  const items = t.raw('items') as Item[]

  return (
    <section id="demos" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div variants={floatUp3D}>
            <SectionLabel color="violet">{t('label')}</SectionLabel>
          </motion.div>
          <motion.h2 variants={floatUp3D} className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
            <GradientText gradient="violet">{t('title')}</GradientText>
          </motion.h2>
          <motion.p variants={floatUp3D} className="text-white/50 text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Demo cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: '1000px' }}
        >
          {CARDS.map((card, i) => {
            const item = items[i]
            return (
              <TiltCard
                key={card.slug}
                variants={floatUp3D}
                max={13}
                className="group relative overflow-hidden transition-shadow duration-300"
                style={{
                  borderRadius: 20,
                  border: '1px solid rgba(120,200,255,0.12)',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                  boxShadow: '0 22px 44px -24px rgba(0,0,0,0.75), 0 2px 8px -2px rgba(0,0,0,0.4)',
                }}
              >
                {/* /demos es OTRO root layout (html/tema/fuentes propios). Cruzar root
                    layouts requiere navegación de documento completo: <a>, no <Link> (el
                    soft-nav rompe el DOM entre los dos <html> → CSS roto / crash). */}
                <a
                  href={`/demos/${card.slug}?lang=${locale}`}
                  className="relative z-[2] block"
                  aria-label={`${t('open')} — ${item.name}`}
                >
                  {/* Image header — next/image (lazy + responsive) debajo, overlay encima */}
                  <div
                    className="relative flex items-end p-4"
                    style={{ height: 150 }}
                  >
                    <Image
                      src={card.thumb}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover brightness-110 contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay más ligero: solo lo justo para legibilidad del tag (que tiene su
                        propio fondo). Antes 0.88 abajo oscurecía demasiado la imagen. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(6,8,16,0) 45%, rgba(6,8,16,0.42) 100%), radial-gradient(70% 120% at 30% 0%, ${card.accent}1c, transparent 60%)`,
                      }}
                    />
                    <span
                      className="font-mono uppercase relative z-[1]"
                      style={{
                        fontSize: 10.5,
                        letterSpacing: '0.16em',
                        color: '#EAF0F7',
                        background: 'rgba(8,12,20,0.55)',
                        border: `1px solid ${card.accent}77`,
                        borderRadius: 999,
                        padding: '4px 10px',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-[19px] font-bold tracking-tight text-white">{item.name}</h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/55 transition-colors duration-200 group-hover:text-[#2FF5E0]">
                      {t('open')}
                      <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              </TiltCard>
            )
          })}
        </motion.div>

        {/* Marketing pitch + CTA */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 relative overflow-hidden"
          style={{
            borderRadius: 20,
            border: '1px solid rgba(120,200,255,0.12)',
            background: 'linear-gradient(120deg, rgba(155,108,255,0.08), rgba(47,245,224,0.05))',
          }}
        >
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <motion.div variants={floatUp3D} className="space-y-5">
              <h3 className="text-2xl sm:text-[28px] font-display font-bold tracking-tight text-white">
                {t('pitchTitle')}
              </h3>
              <div className="space-y-3">
                <p className="flex items-start gap-3 text-[15px] leading-[1.65] text-white/60">
                  <Sparkles size={18} className="mt-0.5 shrink-0 text-violet-400" />
                  {t('pitch')}
                </p>
                <p className="flex items-start gap-3 text-[15px] leading-[1.65] text-white/60">
                  <Smartphone size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                  {t('appsPitch')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={floatUp3D} className="flex lg:justify-end">
              <CtaButton href={`/demos?lang=${locale}`} hardNav>{t('cta')}</CtaButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
