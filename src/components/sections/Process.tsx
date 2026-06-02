'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import { fadeInUp, staggerContainer } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

const STEP_COLORS = [
  { num: 'from-cyan-400 to-blue-500', accent: 'border-cyan-400/30 bg-cyan-400/5', dot: 'bg-cyan-400', glow: 'rgba(0,229,255,0.4)' },
  { num: 'from-violet-400 to-purple-600', accent: 'border-violet-400/30 bg-violet-400/5', dot: 'bg-violet-400', glow: 'rgba(124,58,237,0.4)' },
  { num: 'from-fuchsia-400 to-pink-600', accent: 'border-fuchsia-400/30 bg-fuchsia-400/5', dot: 'bg-fuchsia-400', glow: 'rgba(255,43,214,0.4)' },
  { num: 'from-cyan-400 to-violet-500', accent: 'border-cyan-400/30 bg-cyan-400/5', dot: 'bg-cyan-400', glow: 'rgba(0,229,255,0.35)' },
  { num: 'from-violet-400 to-fuchsia-500', accent: 'border-violet-400/30 bg-violet-400/5', dot: 'bg-violet-400', glow: 'rgba(124,58,237,0.35)' },
]

type Step = { num: string; title: string; desc: string }

export default function Process() {
  const t = useTranslations('process')
  const steps = t.raw('steps') as Step[]

  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !stepsRef.current || !containerRef.current) return

    const totalWidth = stepsRef.current.scrollWidth
    const viewportWidth = containerRef.current.offsetWidth
    const scrollDistance = totalWidth - viewportWidth

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${scrollDistance + 200}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    tl.to(stepsRef.current, {
      x: -scrollDistance,
      ease: 'none',
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col h-screen py-16">
        {/* Header — static */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12 px-4 space-y-4 shrink-0"
        >
          <motion.div variants={fadeInUp}>
            <SectionLabel color="violet">Process</SectionLabel>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight"
          >
            <GradientText gradient="violet">{t('title')}</GradientText>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-white/50 text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/25 text-xs tracking-widest uppercase mb-8 shrink-0"
        >
          Scroll to explore →
        </motion.p>

        {/* Horizontal scroll container */}
        <div ref={containerRef} className="flex-1 overflow-hidden flex items-center">
          <div ref={stepsRef} className="flex items-stretch gap-0 will-change-transform">
            {/* Left padding */}
            <div className="shrink-0 w-[8vw]" />

            {steps.map((step, i) => {
              const c = STEP_COLORS[i]
              const isLast = i === steps.length - 1

              return (
                <div key={step.num} className="flex items-center shrink-0">
                  {/* Step card */}
                  <div
                    className={`w-[360px] rounded-2xl border ${c.accent} p-8 flex flex-col gap-4 relative
                      glass transition-all duration-300 hover:scale-[1.02] cursor-default`}
                    style={{
                      boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.4)`,
                    }}
                  >
                    {/* Step number */}
                    <span
                      className={`font-display font-black text-7xl leading-none bg-gradient-to-br ${c.num} bg-clip-text text-transparent opacity-90 select-none`}
                    >
                      {step.num}
                    </span>

                    {/* Title */}
                    <h3 className="text-white font-display font-bold text-2xl tracking-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 text-sm leading-relaxed flex-1">
                      {step.desc}
                    </p>

                    {/* Bottom accent dot */}
                    <div className={`w-2 h-2 rounded-full ${c.dot} mt-2`} style={{
                      boxShadow: `0 0 12px ${c.glow}`,
                    }} />
                  </div>

                  {/* Connecting line between steps */}
                  {!isLast && (
                    <div className="shrink-0 flex items-center mx-4">
                      <div
                        className="w-16 h-px"
                        style={{
                          background: 'linear-gradient(90deg, rgba(0,229,255,0.4), rgba(124,58,237,0.4))',
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full shrink-0 ml-px"
                        style={{
                          background: 'rgba(124,58,237,0.8)',
                          boxShadow: '0 0 8px rgba(124,58,237,0.6)',
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Right padding */}
            <div className="shrink-0 w-[8vw]" />
          </div>
        </div>
      </div>
    </section>
  )
}
