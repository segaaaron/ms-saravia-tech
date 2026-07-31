'use client'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Cloud, Smartphone, Bot, Lightbulb, ArrowUpRight } from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import TiltCard from '@/components/ui/TiltCard'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { serviceSlugs } from '@/content/seo'
import { umamiAttrs } from '@/lib/analytics'

const ICONS = [Cloud, Smartphone, Bot, Lightbulb]

type ServiceItem = { title: string; desc: string; stack: string[] }

export default function Services() {
  const t = useTranslations('services')
  const locale = useLocale()
  const items = t.raw('items') as ServiceItem[]
  const prefix = locale === 'es' ? '/es' : ''

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      {/* subtle grid background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div variants={fadeInUp}>
            <SectionLabel color="cyan">{t('label')}</SectionLabel>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white"
          >
            <GradientText gradient="primary">{t('title')}</GradientText>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-white/50 text-lg max-w-xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i]
            const idx = String(i + 1).padStart(2, '0')
            return (
              <TiltCard
                key={item.title}
                variants={fadeInUp}
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
                  <div
                    className="mb-[22px] flex h-[52px] w-[52px] items-center justify-center"
                    style={{
                      borderRadius: 14,
                      background: 'rgba(120,200,255,0.06)',
                      border: '1px solid rgba(120,200,255,0.18)',
                    }}
                  >
                    <Icon size={26} strokeWidth={1.6} className="text-[#2FF5E0]" />
                  </div>

                  <h3 className="mb-3 text-[21px] font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>

                  <p
                    className="mb-5 flex-1 text-[15px] leading-[1.6]"
                    style={{ color: '#8896A6' }}
                  >
                    {item.desc}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono"
                        style={{
                          fontSize: 11,
                          color: '#5C6A7A',
                          padding: '5px 10px',
                          border: '1px solid rgba(120,200,255,0.10)',
                          borderRadius: 8,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {serviceSlugs[i] && (
                    <Link
                      href={`${prefix}/services/${serviceSlugs[i]}`}
                      className="group/link mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white/55 transition-colors hover:text-[#2FF5E0]"
                      aria-label={`${t('learnMore')}: ${item.title}`}
                      {...umamiAttrs('service-open', { service: serviceSlugs[i] })}
                    >
                      {t('learnMore')}
                      <ArrowUpRight size={13} className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </TiltCard>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
