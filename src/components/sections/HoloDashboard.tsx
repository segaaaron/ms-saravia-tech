'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { slideInLeft, slideInRight, staggerContainer } from '@/lib/motion'

const METRICS = [
  { key: 'uptime',   value: '99.9%', pct: 99 },
  { key: 'latency',  value: '42ms',  pct: 88 },
  { key: 'deploys',  value: '26',    pct: 74 },
  { key: 'coverage', value: '92%',   pct: 92 },
]

const GRAD = 'linear-gradient(120deg, #2FF5E0 0%, #4D7CFF 50%, #9B6CFF 100%)'

function MetricRow({ label, value, pct, index }: {
  label: string; value: string; pct: number; index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div
      ref={ref}
      className="flex items-center justify-between"
      style={{
        padding: '14px 0',
        borderBottom: '1px dashed rgba(120,200,255,0.16)',
      }}
    >
      <span
        className="font-mono"
        style={{ fontSize: 13, color: '#8896A6', letterSpacing: '0.04em' }}
      >
        {label}
      </span>
      <span
        className="overflow-hidden rounded w-[80px] sm:w-[120px]"
        style={{
          height: 6,
          borderRadius: 4,
          background: 'rgba(120,200,255,0.12)',
        }}
      >
        <motion.span
          className="block h-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.12 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderRadius: 4,
            background: GRAD,
            boxShadow: '0 0 10px rgba(77,124,255,0.6)',
          }}
        />
      </span>
      <span
        className="font-mono font-bold"
        style={{
          fontSize: 18,
          background: GRAD,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          minWidth: 64,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function HoloCube() {
  const size = 180
  const half = `${size / 2}px`
  const faceStyle = (transform: string): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    border: '1.5px solid rgba(120,200,255,0.4)',
    background: 'linear-gradient(135deg, rgba(47,245,224,0.06), rgba(155,108,255,0.06))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: 30,
    color: 'rgba(238,243,248,0.85)',
    boxShadow: 'inset 0 0 30px rgba(77,124,255,0.15)',
    transform,
  })
  return (
    <div className="relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
      <div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(77,124,255,0.30), transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: size, height: size,
          transformStyle: 'preserve-3d',
          animation: 'cube-float 14s linear infinite',
        }}
      >
        <div style={faceStyle(`translateZ(${half})`)}>MS</div>
        <div style={faceStyle(`rotateY(180deg) translateZ(${half})`)}>MS</div>
        <div style={faceStyle(`rotateY(90deg) translateZ(${half})`)}>{'{ }'}</div>
        <div style={faceStyle(`rotateY(-90deg) translateZ(${half})`)}>{'</>'}</div>
        <div style={faceStyle(`rotateX(90deg) translateZ(${half})`)}>⬢</div>
        <div style={faceStyle(`rotateX(-90deg) translateZ(${half})`)}>⬡</div>
      </div>
    </div>
  )
}

export default function HoloDashboard() {
  const t = useTranslations('system')
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hover: false })
  const [sheen, setSheen] = useState({ mx: '50%', my: '50%' })

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const max = 7
    setSheen({ mx: `${px * 100}%`, my: `${py * 100}%` })
    setTilt({ rx: (0.5 - py) * max, ry: (px - 0.5) * max, hover: true })
  }
  const handlePointerLeave = () => setTilt({ rx: 0, ry: 0, hover: false })

  return (
    <section id="system" className="relative py-[100px] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"
          style={{ perspective: 1400 }}
        >
          {/* LEFT: Holo panel */}
          <motion.div
            variants={slideInLeft}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative overflow-hidden p-5 sm:p-[34px]"
            style={{
              borderRadius: 22,
              background: 'linear-gradient(160deg, rgba(20,34,56,0.55), rgba(9,15,26,0.55))',
              border: '1px solid rgba(120,200,255,0.22)',
              boxShadow:
                '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10), 0 0 40px rgba(77,124,255,0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transformStyle: 'preserve-3d',
              transform: tilt.hover
                ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px)`
                : 'perspective(900px) rotateX(0deg) rotateY(0deg)',
              transition: 'transform .2s cubic-bezier(.2,.7,.2,1)',
            }}
          >
            {/* sheen following cursor */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle 280px at ${sheen.mx} ${sheen.my}, rgba(47,245,224,0.16), rgba(155,108,255,0.10) 40%, transparent 70%)`,
                opacity: tilt.hover ? 1 : 0,
                transition: 'opacity .25s',
                zIndex: 1,
                mixBlendMode: 'screen',
              }}
            />
            {/* scanlines */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'repeating-linear-gradient(0deg, rgba(120,200,255,0.05) 0, rgba(120,200,255,0.05) 1px, transparent 2px, transparent 4px)',
                mixBlendMode: 'screen',
                opacity: 0.5,
                zIndex: 1,
              }}
            />
            {/* sweep */}
            <span
              className="pointer-events-none absolute"
              style={{
                top: '-60%', left: '-30%', width: '60%', height: '220%',
                background:
                  'linear-gradient(90deg, transparent, rgba(47,245,224,0.18), rgba(155,108,255,0.14), transparent)',
                transform: 'rotate(18deg)',
                animation: 'holo-sweep 6s ease-in-out infinite',
                zIndex: 1,
              }}
            />

            <div className="relative" style={{ zIndex: 2 }}>
              <span
                className="inline-flex items-center font-mono uppercase"
                style={{
                  gap: 9,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: '#2FF5E0',
                  padding: '7px 13px',
                  border: '1px solid rgba(120,200,255,0.25)',
                  borderRadius: 100,
                  marginBottom: 22,
                  background: 'rgba(47,245,224,0.05)',
                }}
              >
                <span
                  className="inline-block animate-pulse"
                  style={{ width: 7, height: 7, borderRadius: '50%', background: '#2FF5E0', boxShadow: '0 0 10px #2FF5E0' }}
                />
                {t('badge')}
              </span>

              <h2
                className="font-display"
                style={{
                  fontWeight: 700,
                  fontSize: 'clamp(26px, 3.4vw, 38px)',
                  letterSpacing: '-0.02em',
                  margin: '0 0 8px',
                  lineHeight: 1.1,
                  color: '#EEF3F8',
                }}
              >
                {t('title')}
              </h2>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: '#8896A6',
                  margin: '0 0 26px',
                }}
              >
                {t('subtitle')}
              </p>

              <div>
                {METRICS.map((m, i) => (
                  <MetricRow key={m.key} label={t(`metrics.${m.key}`)} value={m.value} pct={m.pct} index={i} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: cube */}
          <motion.div variants={slideInRight} className="flex items-center justify-center">
            <div style={{ perspective: 1400 }}>
              <HoloCube />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes holo-sweep {
          0%, 100% { left: -40%; }
          50% { left: 90%; }
        }
        @keyframes cube-float {
          0%   { transform: rotateX(-22deg) rotateY(0deg); }
          100% { transform: rotateX(-22deg) rotateY(360deg); }
        }
      `}</style>
    </section>
  )
}
