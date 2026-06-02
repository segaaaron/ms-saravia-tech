'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import MagneticButton from '@/components/ui/MagneticButton'
import GradientText from '@/components/ui/GradientText'
import AuroraBackground from '@/components/fx/AuroraBackground'
import Spotlight from './Spotlight'
import ReactorVisual from './ReactorVisual'
import { fadeInUp, staggerContainer } from '@/lib/motion'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <AuroraBackground />
      <Spotlight />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-8 items-center">

          {/* LEFT: Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8 lg:pr-4"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
                style={{
                  border: '1px solid rgba(0,229,255,0.3)',
                  background: 'rgba(0,229,255,0.06)',
                  color: 'rgba(0,229,255,0.85)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: '#00E5FF', boxShadow: '0 0 6px #00E5FF' }}
                />
                {t('badge')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="font-display font-bold leading-[1.05] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.4rem, 4.4vw, 4.6rem)' }}
            >
              <span className="block">{t('headline_1')}</span>
              <span className="block lg:whitespace-nowrap">
                <GradientText gradient="primary" animate>
                  {t('headline_highlight')}
                </GradientText>
              </span>
              <span className="block lg:whitespace-nowrap">{t('headline_2')}</span>
            </motion.h1>

            {/* Lead */}
            <motion.p
              variants={fadeInUp}
              className="text-white/55 leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(1rem, 1.3vw, 1.1rem)' }}
            >
              {t('lead')}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <MagneticButton variant="primary" href="#contact">
                {t('cta_primary')}
              </MagneticButton>
              <MagneticButton variant="ghost" href="#services">
                {t('cta_secondary')} <span style={{ color: '#2FF5E0', fontFamily: 'monospace' }}>→</span>
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-10 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {([
                { value: '99.9%', key: 'stat2' },
                { value: '8+',   key: 'stat3' },
              ] as const).map((s) => (
                <div key={s.key}>
                  <div
                    className="font-display font-bold gradient-text"
                    style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', letterSpacing: '-0.03em' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-white/40 text-sm mt-0.5 font-medium">
                    {t(s.key as Parameters<typeof t>[0])}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Reactor visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="relative flex items-center justify-center"
            style={{ height: 480 }}
          >
            <ReactorVisual />
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-12 origin-top"
          style={{ background: 'linear-gradient(to bottom, rgba(0,229,255,0.5), transparent)' }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-white/20 text-xs font-mono tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>scroll</span>
      </motion.div>
    </section>
  )
}
