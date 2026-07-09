'use client'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ExternalLink, Clock, ArrowRight } from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import TiltCard from '@/components/ui/TiltCard'
import { floatUp3D, staggerContainer } from '@/lib/motion'

type Project = {
  title: string
  category: string
  desc: string
  url: string | null
  status: string
}

export default function Work() {
  const t = useTranslations('work')
  const locale = useLocale()
  const projects = t.raw('projects') as Project[]

  return (
    <section id="work" className="relative py-24 overflow-hidden">
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
            <SectionLabel color="magenta">Portfolio</SectionLabel>
          </motion.div>

          <motion.h2
            variants={floatUp3D}
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight"
          >
            <GradientText gradient="magenta">{t('title')}</GradientText>
          </motion.h2>

          <motion.p variants={floatUp3D} className="text-white/50 text-lg max-w-md mx-auto">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Project cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          style={{ perspective: '1000px' }}
        >
          {projects.map((project, i) => {
            const idx = String(i + 1).padStart(2, '0')
            return (
              <TiltCard
                key={project.title}
                variants={floatUp3D}
                className="group relative flex h-full flex-col overflow-hidden p-8"
                style={{
                  borderRadius: 20,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(120,200,255,0.10)',
                }}
              >
                <span
                  className="absolute right-[26px] top-[24px] font-mono text-[14px] font-bold tracking-wide"
                  style={{ color: '#5C6A7A', zIndex: 1 }}
                >
                  {idx}
                </span>

                <div className="relative z-[1] flex flex-1 flex-col">
                  <span
                    className="mb-5 self-start font-mono"
                    style={{
                      fontSize: 11,
                      color: '#2FF5E0',
                      padding: '5px 12px',
                      border: '1px solid rgba(120,200,255,0.25)',
                      borderRadius: 100,
                      background: 'rgba(47,245,224,0.05)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {project.category}
                  </span>

                  <h3 className="mb-3 text-[24px] font-bold tracking-tight text-white">
                    {project.title}
                  </h3>

                  <p
                    className="mb-6 flex-1 text-[15px] leading-[1.6]"
                    style={{ color: '#8896A6' }}
                  >
                    {project.desc}
                  </p>

                  <div
                    className="mt-auto flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid rgba(120,200,255,0.10)' }}
                  >
                    {project.status === 'live' ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t('live')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <Clock size={12} />
                        {t('soon')}
                      </span>
                    )}

                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors duration-200 hover:text-[#2FF5E0]"
                        aria-label={`View ${project.title} project`}
                      >
                        {t('view')}
                        <ExternalLink
                          size={12}
                          className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                        />
                      </a>
                    ) : (
                      <span className="text-xs italic text-white/25">{t('soon')}</span>
                    )}
                  </div>
                </div>
              </TiltCard>
            )
          })}
        </motion.div>

        <motion.div
          variants={floatUp3D}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 text-center"
        >
          <Link
            href={locale === 'es' ? '/es/work' : '/work'}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-[#2FF5E0]"
          >
            {t('seeAll')}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
