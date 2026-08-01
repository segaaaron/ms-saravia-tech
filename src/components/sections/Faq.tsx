'use client'
import { m } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Plus } from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { FAQ, type Locale } from '@/content/faq'
import { track } from '@/lib/analytics'

export default function Faq() {
  const locale = useLocale()
  const l: Locale = locale === 'es' ? 'es' : 'en'
  const items = FAQ[l]
  const heading = l === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'
  const label = l === 'es' ? 'FAQ' : 'FAQ'
  const sub =
    l === 'es'
      ? 'Lo que suelen preguntar antes de iniciar un proyecto.'
      : 'What clients usually ask before starting a project.'

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-14 space-y-4"
        >
          <m.div variants={fadeInUp}>
            <SectionLabel color="violet">{label}</SectionLabel>
          </m.div>
          <m.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white"
          >
            <GradientText gradient="primary">{heading}</GradientText>
          </m.h2>
          <m.p variants={fadeInUp} className="text-white/50 text-lg max-w-xl mx-auto">
            {sub}
          </m.p>
        </m.div>

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-3"
        >
          {items.map((item, i) => (
            <m.details
              key={item.q}
              variants={fadeInUp}
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) track('faq-open', { index: i })
              }}
              className="group overflow-hidden"
              style={{
                borderRadius: 16,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(120,200,255,0.10)',
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-white [&::-webkit-details-marker]:hidden">
                <span className="text-[16px] font-semibold tracking-tight">
                  {item.q}
                </span>
                <Plus
                  size={20}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#2FF5E0] transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <div
                className="px-6 pb-5 text-[15px] leading-[1.6]"
                style={{ color: '#8896A6' }}
              >
                {item.a}
              </div>
            </m.details>
          ))}
        </m.div>
      </div>
    </section>
  )
}
