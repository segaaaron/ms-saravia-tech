'use client'
import { useEffect, useRef } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import { fadeInUp, staggerContainer } from '@/lib/motion'

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

  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP se importa DENTRO del efecto, no arriba del archivo. Es la única sección que lo usa y
  // es la novena de la home: importándolo estático, los ~118 kB de gsap + ScrollTrigger viajaban
  // en el bundle inicial de TODA la landing, aunque el visitante no bajara nunca hasta acá.
  // El HTML de los pasos se sigue sirviendo igual (SEO intacto: esto solo mueve CUÁNDO baja la
  // librería de animación, no el contenido).
  //
  // El QUÉ hace el pin no cambió: lo decide `gsap.matchMedia()`, igual que antes. Eso importa —
  // matchMedia de GSAP escucha el resize y monta/desmonta la animación al cruzar el breakpoint
  // solo. Una versión previa lo reemplazó por un `window.matchMedia().matches` de una sola vez y
  // rompía al redimensionar: de móvil a escritorio el pin no arrancaba nunca, y de escritorio a
  // móvil quedaba pegado recortando las cards. Rotar un teléfono cruza ese límite (390px vertical
  // vs 844px horizontal), así que no era un caso raro.
  //
  // El único gate propio es CUÁNDO se pide la librería: un listener de ancho (para no bajarla en
  // teléfonos que nunca la van a usar) más un IntersectionObserver (para no bajarla si el
  // visitante no llega hasta acá).
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let cancelado = false
    let limpiar: (() => void) | undefined
    let cargando = false

    const cargar = async () => {
      if (cargando || cancelado) return
      cargando = true
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelado || !sectionRef.current || !stepsRef.current || !containerRef.current) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // El pin + scroll horizontal SOLO en ≥768px Y con movimiento permitido. En móvil el pin
        // con 100vh se rompe con la barra dinámica y recorta las cards; con prefers-reduced-motion
        // el scroll-hijack es desorientador → en ambos casos los pasos van en stack vertical.
        // matchMedia de GSAP revierte solo al salir de la condición.
        const mm = gsap.matchMedia()
        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
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
          tl.to(stepsRef.current, { x: -scrollDistance, ease: 'none' })
        })
      }, sectionRef)
      limpiar = () => ctx.revert()
    }

    // Se pide gsap cuando la sección se acerca Y la ventana es lo bastante ancha. El listener de
    // `change` cubre el resize/rotación: si el visitante empieza angosto y agranda, se pide ahí.
    const anchoOk = window.matchMedia('(min-width: 768px)')
    let cerca = false
    const intentar = () => { if (cerca && anchoOk.matches) cargar() }

    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { cerca = true; io.disconnect(); intentar() } },
      { rootMargin: '800px' }
    )
    io.observe(el)
    anchoOk.addEventListener('change', intentar)

    return () => {
      cancelado = true
      io.disconnect()
      anchoOk.removeEventListener('change', intentar)
      limpiar?.()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden md:min-h-[100dvh]"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      />

      <div className={`relative z-10 flex flex-col py-12 ${reduce ? '' : 'md:h-[100dvh] md:py-16'}`}>
        {/* Header — static */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex w-full flex-col items-center text-center mb-12 px-4 space-y-4 shrink-0"
        >
          <m.div variants={fadeInUp}>
            <SectionLabel color="violet">{t('label')}</SectionLabel>
          </m.div>

          <m.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight"
          >
            <GradientText gradient="violet">{t('title')}</GradientText>
          </m.h2>

          <m.p variants={fadeInUp} className="text-white/50 text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </m.p>
        </m.div>

        {/* Scroll hint */}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`${reduce ? 'hidden' : 'hidden md:block'} text-center text-white/25 text-xs tracking-widest uppercase mb-8 shrink-0`}
        >
          Scroll to explore →
        </m.p>

        {/* Horizontal scroll container */}
        <div ref={containerRef} className={`flex-1 flex items-center ${reduce ? '' : 'md:overflow-hidden'}`}>
          <div ref={stepsRef} className={`flex flex-col items-stretch gap-6 will-change-transform ${reduce ? '' : 'md:flex-row md:gap-0'}`}>
            {/* Left padding */}
            <div className={`${reduce ? 'hidden' : 'hidden md:block'} shrink-0 w-[8vw]`} />

            {steps.map((step, i) => {
              const c = STEP_COLORS[i]
              const isLast = i === steps.length - 1

              return (
                <div key={step.num} className={`flex items-center w-full ${reduce ? '' : 'md:w-auto md:shrink-0'}`}>
                  {/* Step card */}
                  <div
                    className={`w-full ${reduce ? '' : 'md:w-[360px]'} rounded-2xl border ${c.accent} p-8 flex flex-col gap-4 relative
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
                    <div className={`${reduce ? 'hidden' : 'hidden md:flex'} shrink-0 items-center mx-4`}>
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
            <div className={`${reduce ? 'hidden' : 'hidden md:block'} shrink-0 w-[8vw]`} />
          </div>
        </div>
      </div>
    </section>
  )
}
