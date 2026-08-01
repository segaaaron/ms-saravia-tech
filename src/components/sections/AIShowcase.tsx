'use client'
import { m } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Brain, Zap, Network, Sparkles } from 'lucide-react'
import GradientText from '@/components/ui/GradientText'
import SectionLabel from '@/components/ui/SectionLabel'
import { fadeInUp, staggerContainer, slideInRight } from '@/lib/motion'

const FEATURE_ICONS = [Brain, Zap, Network, Sparkles]
const FEATURE_COLORS = [
  { icon: 'text-cyan-400', border: 'border-cyan-400/30 bg-cyan-400/8', glow: 'shadow-[0_0_16px_rgba(0,229,255,0.2)]' },
  { icon: 'text-violet-400', border: 'border-violet-400/30 bg-violet-400/8', glow: 'shadow-[0_0_16px_rgba(124,58,237,0.2)]' },
  { icon: 'text-fuchsia-400', border: 'border-fuchsia-400/30 bg-fuchsia-400/8', glow: 'shadow-[0_0_16px_rgba(255,43,214,0.2)]' },
  { icon: 'text-cyan-300', border: 'border-cyan-300/30 bg-cyan-300/8', glow: 'shadow-[0_0_16px_rgba(0,229,255,0.15)]' },
]

// Node positions (cx, cy) in a 400×340 viewBox
const NODES = [
  { cx: 200, cy: 170, r: 22, label: 'AI', central: true },
  { cx: 80,  cy: 80,  r: 12, label: 'NLP', central: false },
  { cx: 320, cy: 80,  r: 12, label: 'CV',  central: false },
  { cx: 60,  cy: 250, r: 12, label: 'ML',  central: false },
  { cx: 340, cy: 250, r: 12, label: 'API', central: false },
  { cx: 200, cy: 40,  r: 10, label: 'LLM', central: false },
  { cx: 200, cy: 300, r: 10, label: 'DB',  central: false },
]

// Edges: pairs of node indices
const EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 5], [2, 5], [3, 6], [4, 6],
]

function getPath(a: (typeof NODES)[number], b: (typeof NODES)[number]) {
  return `M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}`
}


export default function AIShowcase() {
  const t = useTranslations('ai')
  const features = t.raw('features') as string[]

  return (
    <m.section
      className="relative w-full py-24 overflow-hidden"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backgroundSize: '200% 200%',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(0,229,255,0.08) 50%, rgba(255,43,214,0.1) 100%)',
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: copy */}
          <m.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-8"
          >
            <m.div variants={fadeInUp}>
              <SectionLabel color="violet">{t('badge')}</SectionLabel>
            </m.div>

            <m.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white leading-tight"
            >
              <GradientText gradient="violet">{t('title')}</GradientText>
            </m.h2>

            <m.p
              variants={fadeInUp}
              className="text-white/50 text-lg leading-relaxed max-w-lg"
            >
              {t('subtitle')}
            </m.p>

            {/* Feature pills */}
            <m.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {features.map((feat, i) => {
                const Icon = FEATURE_ICONS[i]
                const c = FEATURE_COLORS[i]
                return (
                  <m.div
                    key={feat}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, rotateX: -5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.border} ${c.glow} transition-all duration-300 cursor-default`}
                  >
                    <Icon size={18} className={c.icon} strokeWidth={1.5} />
                    <span className="text-white/80 text-sm font-medium">{feat}</span>
                  </m.div>
                )
              })}
            </m.div>
          </m.div>

          {/* RIGHT: Animated SVG node graph */}
          <m.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-[400px]">
              {/* Radial glow behind SVG */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(0,229,255,0.3) 50%, transparent 80%)',
                }}
              />
              <svg
                viewBox="0 0 400 340"
                className="w-full h-auto relative z-10"
                aria-hidden="true"
              >
                <defs>
                  {/* Gradient for edges */}
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FF2BD6" stopOpacity="0.3" />
                  </linearGradient>
                  {/* Traveling dot gradient */}
                  <linearGradient id="dotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                  </linearGradient>
                  <filter id="nodeGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="centralGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Edges with traveling dot animation */}
                {EDGES.map(([ai, bi], edgeIdx) => {
                  const a = NODES[ai]
                  const b = NODES[bi]
                  const delay = edgeIdx * 0.4
                  return (
                    <g key={`edge-${ai}-${bi}`}>
                      {/* Static edge line */}
                      <path
                        d={getPath(a, b)}
                        stroke="url(#edgeGrad)"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.5"
                      />
                      {/* Traveling dot */}
                      <circle r="2.5" fill="#00E5FF" opacity="0.9" filter="url(#nodeGlow)">
                        <animateMotion
                          path={getPath(a, b)}
                          dur={`${1.8 + (edgeIdx % 3) * 0.4}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                          calcMode="linear"
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          dur={`${1.8 + (edgeIdx % 3) * 0.4}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  )
                })}

                {/* Non-central nodes */}
                {NODES.filter((n) => !n.central).map((node) => (
                  <g key={node.label}>
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r + 6}
                      fill="rgba(124,58,237,0.1)"
                      stroke="rgba(124,58,237,0.25)"
                      strokeWidth="1"
                    />
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r}
                      fill="rgba(10,10,20,0.9)"
                      stroke="rgba(0,229,255,0.4)"
                      strokeWidth="1.5"
                      filter="url(#nodeGlow)"
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 4}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}

                {/* Central node — pulses */}
                {(() => {
                  const n = NODES[0]
                  return (
                    <g key="central" className="animate-glow-pulse">
                      {/* Outer pulse ring */}
                      <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={n.r + 20}
                        fill="none"
                        stroke="rgba(0,229,255,0.15)"
                        strokeWidth="1"
                      >
                        <animate
                          attributeName="r"
                          values={`${n.r + 12};${n.r + 28};${n.r + 12}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.4;0;0.4"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Middle ring */}
                      <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={n.r + 10}
                        fill="rgba(0,229,255,0.06)"
                        stroke="rgba(0,229,255,0.3)"
                        strokeWidth="1"
                      />
                      {/* Core */}
                      <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={n.r}
                        fill="rgba(0,229,255,0.15)"
                        stroke="rgba(0,229,255,0.8)"
                        strokeWidth="2"
                        filter="url(#centralGlow)"
                      />
                      <text
                        x={n.cx}
                        y={n.cy + 5}
                        textAnchor="middle"
                        fill="rgba(0,229,255,1)"
                        fontSize="12"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        {n.label}
                      </text>
                    </g>
                  )
                })()}
              </svg>
            </div>
          </m.div>
        </div>
      </div>
    </m.section>
  )
}
