'use client'
import { m } from 'framer-motion'
import { useTranslations } from 'next-intl'
import MagneticButton from '@/components/ui/MagneticButton'
import { umamiAttrs } from '@/lib/analytics'
import GradientText from '@/components/ui/GradientText'
import AuroraBackground from '@/components/fx/AuroraBackground'
import Spotlight from './Spotlight'
import ReactorVisual from './ReactorVisual'

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

          {/* LEFT: Copy. La entrada va por CSS (.hero-rise), no por framer: es contenido
              above-the-fold y con `initial="hidden"` se quedaba invisible hasta hidratar. */}
          <div className="space-y-8 lg:pr-4">
            {/* Headline */}
            <h1
              className="hero-rise hero-rise-1 font-display font-bold leading-[1.05] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.4rem, 4.4vw, 4.6rem)' }}
            >
              <span className="block">{t('headline_1')}</span>
              <span className="block lg:whitespace-nowrap">
                <GradientText gradient="primary" animate>
                  {t('headline_highlight')}
                </GradientText>
              </span>
              <span className="block lg:whitespace-nowrap">{t('headline_2')}</span>
            </h1>

            {/* Lead */}
            <p
              className="hero-rise hero-rise-2 text-white/55 leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(1rem, 1.3vw, 1.1rem)' }}
            >
              {t('lead')}
            </p>

            {/* CTAs */}
            <div className="hero-rise hero-rise-3 flex flex-wrap gap-4">
              <MagneticButton
                variant="primary"
                href="#contact"
                dataUmami={umamiAttrs('cta-click', { placement: 'hero', target: 'contact' })}
              >
                {t('cta_primary')}
              </MagneticButton>
              <MagneticButton
                variant="ghost"
                href="#services"
                dataUmami={umamiAttrs('cta-click', { placement: 'hero', target: 'services' })}
              >
                {t('cta_secondary')} <span style={{ color: '#2FF5E0', fontFamily: 'monospace' }}>→</span>
              </MagneticButton>
            </div>

            {/* Stats */}
            <div
              className="hero-rise hero-rise-4 flex flex-wrap gap-10 pt-6"
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
            </div>
          </div>

          {/* RIGHT: Reactor visual */}
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="relative flex items-center justify-center h-[360px] sm:h-[480px] scale-[0.8] sm:scale-100"
          >
            <ReactorVisual />
          </m.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <m.div
        className="hidden sm:flex absolute bottom-8 left-8 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <m.div
          className="w-px h-12 origin-top"
          style={{ background: 'linear-gradient(to bottom, rgba(0,229,255,0.5), transparent)' }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-white/20 text-xs font-mono tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>{t('scroll')}</span>
      </m.div>
    </section>
  )
}
