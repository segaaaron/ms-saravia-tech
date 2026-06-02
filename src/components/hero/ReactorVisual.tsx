'use client'
import { motion } from 'framer-motion'

const CYAN   = '#2FF5E0'
const BLUE   = '#4D7CFF'
const VIOLET = '#9B6CFF'
const GRAD   = 'linear-gradient(120deg, #2FF5E0 0%, #4D7CFF 50%, #9B6CFF 100%)'

// Container: 360px × 360px (matches reactor.xl in HTML)
const SIZE = 360

function ring(pct: number) {
  const s = SIZE * pct
  const off = (SIZE - s) / 2
  return { width: s, height: s, top: off, left: off }
}

export default function ReactorVisual() {
  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        width: SIZE, height: SIZE,
        filter: 'drop-shadow(0 0 14px rgba(77,124,255,0.45))',
      }}
    >
      {/* outer dashed ring — reactor.xl::after (inset -8%) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: SIZE * 1.16, height: SIZE * 1.16,
          top: -(SIZE * 0.08), left: -(SIZE * 0.08),
          border: '1px dashed rgba(120,200,255,0.2)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* o1 — top+bottom cyan, 6s */}
      <motion.div
        className="absolute rounded-full"
        style={{
          ...ring(1),
          border: '2px solid transparent',
          borderTopColor: CYAN,
          borderBottomColor: CYAN,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* o2 — left+right blue, 4s reverse, inset 14% */}
      <motion.div
        className="absolute rounded-full"
        style={{
          ...ring(0.72),
          border: '2px solid transparent',
          borderLeftColor: BLUE,
          borderRightColor: BLUE,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* o3 — top+left violet, 8s, inset 28% */}
      <motion.div
        className="absolute rounded-full"
        style={{
          ...ring(0.44),
          border: '2px solid transparent',
          borderTopColor: VIOLET,
          borderLeftColor: VIOLET,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* core — grad bg, dark MS text, inset 40% */}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          ...ring(0.2),
          background: GRAD,
          boxShadow: '0 0 18px rgba(77,124,255,0.7)',
        }}
      >
        <b style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 20, color: '#060A10' }}>
          MS
        </b>
      </div>

      {/* orbit dot A — cyan, 12s, radius ≈ 180px (edge of o1) */}
      <motion.div
        className="absolute rounded-full"
        style={{ ...ring(1) }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: 10, height: 10,
            top: '50%', left: '50%',
            marginTop: -5, marginLeft: -5,
            transform: 'translateY(-178px)',
            background: CYAN,
            boxShadow: `0 0 12px ${CYAN}`,
          }}
        />
      </motion.div>

      {/* orbit dot B — violet, 18s reverse, radius ≈ 140px (o2 range) */}
      <motion.div
        className="absolute rounded-full"
        style={{ ...ring(1) }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: 10, height: 10,
            top: '50%', left: '50%',
            marginTop: -5, marginLeft: -5,
            transform: 'translateY(-142px)',
            background: VIOLET,
            boxShadow: `0 0 12px ${VIOLET}`,
          }}
        />
      </motion.div>
    </div>
  )
}
