'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { MapPin, Shield, Zap, Globe, UserRoundCheck } from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import TiltCard from '@/components/ui/TiltCard'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/motion'

const STAT_ICONS = [Zap, Globe, Shield, MapPin]

const TECH_STACK = [
  { label: 'React', color: 'hover:text-cyan-300 hover:border-cyan-400/40' },
  { label: 'React Native', color: 'hover:text-cyan-300 hover:border-cyan-400/40' },
  { label: 'Next.js', color: 'hover:text-white hover:border-white/30' },
  { label: 'Node.js', color: 'hover:text-emerald-300 hover:border-emerald-400/40' },
  { label: 'TypeScript', color: 'hover:text-blue-300 hover:border-blue-400/40' },
  { label: 'Swift', color: 'hover:text-orange-300 hover:border-orange-400/40' },
  { label: 'SwiftUI', color: 'hover:text-orange-300 hover:border-orange-400/40' },
  { label: 'RxSwift', color: 'hover:text-orange-300 hover:border-orange-400/40' },
  { label: 'Kotlin', color: 'hover:text-purple-300 hover:border-purple-400/40' },
  { label: 'Java', color: 'hover:text-red-300 hover:border-red-400/40' },
  { label: 'Flutter', color: 'hover:text-sky-300 hover:border-sky-400/40' },
  { label: 'Ionic', color: 'hover:text-blue-300 hover:border-blue-400/40' },
  { label: 'Python', color: 'hover:text-yellow-300 hover:border-yellow-400/40' },
  { label: 'PostgreSQL', color: 'hover:text-sky-300 hover:border-sky-400/40' },
  { label: 'Docker', color: 'hover:text-blue-300 hover:border-blue-400/40' },
]

type Stat = { value: number; label: string; suffix: string }

export default function About() {
  const t = useTranslations('about')
  const stats = t.raw('stats') as Stat[]

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT: Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-8"
          >
            <motion.div variants={slideInLeft}>
              <SectionLabel color="cyan">{t('label')}</SectionLabel>
            </motion.div>

            <motion.h2
              variants={slideInLeft}
              className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-tight"
            >
              <GradientText gradient="primary">{t('title')}</GradientText>
            </motion.h2>

            <motion.p variants={slideInLeft} className="text-white/65 text-lg leading-relaxed">
              {t('subtitle')}
            </motion.p>

            <motion.p variants={slideInLeft} className="text-white/55 text-base leading-relaxed">
              {t('body')}
            </motion.p>

            {/* Founder-led trust card — el mensaje de confianza más fuerte, elevado a glass card */}
            <motion.div
              variants={slideInLeft}
              className="group relative overflow-hidden rounded-2xl p-6"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(120,200,255,0.14)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Resplandor de acento (decorativo) */}
              <div
                aria-hidden
                className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(47,245,224,0.14), transparent 70%)' }}
              />
              <div className="relative flex gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-[#2FF5E0]"
                  style={{
                    borderRadius: 14,
                    background: 'rgba(120,200,255,0.06)',
                    border: '1px solid rgba(120,200,255,0.20)',
                  }}
                >
                  <UserRoundCheck size={20} strokeWidth={1.6} />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2FF5E0]/85">
                    {t('highlightLabel')}
                  </p>
                  <p className="text-[15px] leading-[1.65] text-white/75">{t('highlight')}</p>
                </div>
              </div>
            </motion.div>

            {/* Tech stack pills — más aire respecto a la card superior */}
            <motion.div variants={fadeInUp} className="space-y-3 pt-6">
              <p className="text-white/30 text-xs font-semibold tracking-widest uppercase">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map(({ label, color }) => (
                  <span
                    key={label}
                    className={`text-xs font-medium px-3 py-1 rounded-full border border-white/10 text-white/40 bg-white/5 cursor-default transition-all duration-200 ${color}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Stat cards 2×2 */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => {
              const Icon = STAT_ICONS[i]
              return (
                <TiltCard
                  key={stat.label}
                  variants={slideInRight}
                  className="relative flex flex-col gap-3 overflow-hidden p-6"
                  style={{
                    borderRadius: 20,
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(120,200,255,0.10)',
                  }}
                >
                  <div className="relative z-[1] flex flex-col gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center text-[#2FF5E0]"
                      style={{
                        borderRadius: 12,
                        background: 'rgba(120,200,255,0.06)',
                        border: '1px solid rgba(120,200,255,0.18)',
                      }}
                    >
                      <Icon size={18} strokeWidth={1.6} />
                    </div>
                    <div>
                      <div
                        className="font-display text-4xl font-black tabular-nums"
                        style={{
                          background:
                            'linear-gradient(120deg, #2FF5E0 0%, #4D7CFF 50%, #9B6CFF 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        <AnimatedCounter
                          to={stat.value}
                          suffix={stat.suffix}
                          duration={2200}
                        />
                      </div>
                      <p className="mt-1 text-sm font-medium text-white/45">{stat.label}</p>
                    </div>
                  </div>
                </TiltCard>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
