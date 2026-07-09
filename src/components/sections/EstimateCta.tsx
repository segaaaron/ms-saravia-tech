'use client'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Calculator } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { fadeInUp } from '@/lib/motion'

// Card compacta en la home que invita a cotizar → lleva a la página /estimate.
export default function EstimateCta() {
  const t = useTranslations('estimateCta')
  const locale = useLocale()
  const href = `${locale === 'es' ? '/es' : ''}/estimate`

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl p-8 sm:p-10"
          style={{
            border: '1px solid rgba(120,200,255,0.14)',
            background: 'linear-gradient(120deg, rgba(47,245,224,0.07), rgba(155,108,255,0.06))',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(47,245,224,0.14), transparent 70%)' }}
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center text-[#2FF5E0]"
                style={{ borderRadius: 14, background: 'rgba(120,200,255,0.06)', border: '1px solid rgba(120,200,255,0.20)' }}
              >
                <Calculator size={22} strokeWidth={1.6} />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-[26px] font-display font-bold tracking-tight text-white">
                  {t('title')}
                </h2>
                <p className="max-w-xl text-[15px] leading-[1.6] text-white/55">{t('subtitle')}</p>
              </div>
            </div>
            <CtaButton href={href} size="lg" className="shrink-0">
              {t('button')}
            </CtaButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
