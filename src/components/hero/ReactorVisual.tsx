'use client'
import { useEffect, useRef, useState } from 'react'

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
  const hostRef = useRef<HTMLDivElement>(null)
  // Antes eran 6 animaciones de framer con `repeat: Infinity`, o sea 6 escrituras de transform
  // por frame desde JS, para siempre: seguían girando con la pestaña de fondo y con el reactor
  // scrolleado fuera de pantalla, y cada frame invalidaba el drop-shadow del contenedor.
  // Ahora son keyframes CSS: las mueve el compositor, no el hilo principal, y basta con
  // `animation-play-state` para congelarlas cuando nadie las ve. De paso pasan a respetar la
  // regla global de `prefers-reduced-motion`, cosa que el rotate de framer se saltaba.
  const [live, setLive] = useState(true)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let onScreen = true
    const sync = () => setLive(onScreen && document.visibilityState === 'visible')

    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync() })
    io.observe(host)
    document.addEventListener('visibilitychange', sync)
    // Sync explícito al montar: el IntersectionObserver NO entrega su primer callback mientras
    // la pestaña está oculta (no hay pipeline de render), así que si la página carga en segundo
    // plano `live` se quedaba en su valor inicial y las animaciones arrancaban corriendo.
    sync()
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [])

  const spin = (seconds: number, reverse = false) => ({
    animation: `spin-slow ${seconds}s linear infinite`,
    animationDirection: reverse ? ('reverse' as const) : ('normal' as const),
    animationPlayState: live ? ('running' as const) : ('paused' as const),
    willChange: 'transform',
  })

  return (
    <div
      ref={hostRef}
      className="relative select-none pointer-events-none"
      style={{
        width: SIZE, height: SIZE,
        filter: 'drop-shadow(0 0 14px rgba(77,124,255,0.45))',
      }}
    >
      {/* outer dashed ring — reactor.xl::after (inset -8%) */}
      <div
        className="absolute rounded-full"
        style={{
          width: SIZE * 1.16, height: SIZE * 1.16,
          top: -(SIZE * 0.08), left: -(SIZE * 0.08),
          border: '1px dashed rgba(120,200,255,0.2)',
          ...spin(30),
        }}
      />

      {/* o1 — top+bottom cyan, 6s */}
      <div
        className="absolute rounded-full"
        style={{
          ...ring(1),
          border: '2px solid transparent',
          borderTopColor: CYAN,
          borderBottomColor: CYAN,
          ...spin(6),
        }}
      />

      {/* o2 — left+right blue, 4s reverse, inset 14% */}
      <div
        className="absolute rounded-full"
        style={{
          ...ring(0.72),
          border: '2px solid transparent',
          borderLeftColor: BLUE,
          borderRightColor: BLUE,
          ...spin(4, true),
        }}
      />

      {/* o3 — top+left violet, 8s, inset 28% */}
      <div
        className="absolute rounded-full"
        style={{
          ...ring(0.44),
          border: '2px solid transparent',
          borderTopColor: VIOLET,
          borderLeftColor: VIOLET,
          ...spin(8),
        }}
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
      <div className="absolute rounded-full" style={{ ...ring(1), ...spin(12) }}>
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
      </div>

      {/* orbit dot B — violet, 18s reverse, radius ≈ 140px (o2 range) */}
      <div className="absolute rounded-full" style={{ ...ring(1), ...spin(18, true) }}>
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
      </div>
    </div>
  )
}
