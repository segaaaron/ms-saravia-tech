'use client'

import { useRef, useState } from 'react'
import { useLazyBg } from './useLazyBg'
import Link from 'next/link'

export type GalleryCardData = {
  href: string
  accent: string
  accent2: string
  thumb: string
  vertical: string
  name: string
  desc: string
  tags: string[]
  view: string
}

// Tilt 3D elegante siguiendo el puntero. Wrapper cliente sobre la card del
// server component: el <Link> aporta la perspectiva, el <article> rota en 3D
// según la posición del cursor y una veladura (glare) recorre la superficie.
export default function GalleryCard({ data }: { data: GalleryCardData }) {
  const ref = useRef<HTMLElement>(null)
  const [setThumbNode, thumbVisible] = useLazyBg<HTMLDivElement>()
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false })
  const MAX = 8

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    // Solo ratón. `pointermove` también dispara con el dedo, así que arrastrar sobre la galería
    // metía un setState —y por lo tanto un re-render— por cada muestra del gesto, justo mientras
    // el usuario scrollea. Además en táctil no hay `pointerleave`, así que la card quedaba
    // trabada en tilt después de un tap.
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setT({ rx: (0.5 - py) * MAX, ry: (px - 0.5) * MAX, mx: px * 100, my: py * 100, active: true })
  }
  const onLeave = () => setT((s) => ({ ...s, rx: 0, ry: 0, active: false }))

  return (
    <Link
      href={data.href}
      className="gallery-card"
      style={{ display: 'block', perspective: '1000px' }}
    >
      <article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          position: 'relative',
          height: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(140,170,210,0.14)',
          background: 'linear-gradient(180deg, #0E1626, #0A111C)',
          transformStyle: 'preserve-3d',
          transform: t.active
            ? `rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateY(-6px) scale(1.012)`
            : 'rotateX(0deg) rotateY(0deg)',
          transition: t.active
            ? 'transform .08s linear, box-shadow .3s ease, border-color .3s ease'
            : 'transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .4s ease, border-color .4s ease',
          boxShadow: t.active
            ? `0 30px 70px -30px rgba(0,0,0,0.85), 0 0 40px -20px ${data.accent}66`
            : '0 14px 40px -30px rgba(0,0,0,0.7)',
          borderColor: t.active ? `${data.accent}55` : 'rgba(140,170,210,0.14)',
        }}
      >
        <div
          ref={setThumbNode}
          aria-hidden
          style={{
            height: 150,
            // Imagen clara: overlay solo en el tercio inferior (legibilidad del badge),
            // resto transparente. Tinte de marca muy sutil para no opacar la foto.
            // La foto (ultima capa) solo se pide al acercarse: un background-image no tiene
            // loading="lazy" y las 10 miniaturas salian juntas, compitiendo con el LCP. Los
            // gradientes se pintan siempre, asi que no queda un hueco mientras carga.
            backgroundImage: [
              'linear-gradient(180deg, rgba(6,8,16,0) 42%, rgba(10,17,28,0.62) 100%)',
              `radial-gradient(70% 120% at 30% 0%, ${data.accent}1f, transparent 70%)`,
              `radial-gradient(60% 100% at 90% 100%, ${data.accent2}14, transparent 65%)`,
              ...(thumbVisible ? [`url('${data.thumb}')`] : []),
            ].join(', '),
            backgroundSize: 'cover, cover, cover, cover',
            backgroundPosition: 'center',
            borderBottom: `1px solid ${data.accent}22`,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 20,
            transform: 'translateZ(30px)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-manrope), monospace',
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#EAF0F7',
              background: 'rgba(8,12,20,0.55)',
              border: `1px solid ${data.accent}77`,
              borderRadius: 999,
              padding: '5px 12px',
              backdropFilter: 'blur(4px)',
            }}
          >
            {data.vertical}
          </span>
        </div>
        <div style={{ padding: 24, transform: 'translateZ(24px)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontWeight: 700,
              fontSize: '1.4rem',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {data.name}
          </h2>
          <p style={{ color: '#8FA0B4', fontSize: 15, margin: '10px 0 18px' }}>{data.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {data.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-manrope), monospace',
                  fontSize: 11.5,
                  color: '#9fb0c4',
                  border: '1px solid rgba(140,170,210,0.16)',
                  borderRadius: 8,
                  padding: '5px 9px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: data.accent,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            {data.view}
            <span className="arrow" style={{ transition: 'transform .25s' }}>→</span>
          </span>
        </div>

        {/* Glare — veladura que sigue el cursor */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 20,
            background: `radial-gradient(340px circle at ${t.mx}% ${t.my}%, rgba(255,255,255,0.10), transparent 60%)`,
            opacity: t.active ? 1 : 0,
            transition: 'opacity .3s ease',
            mixBlendMode: 'screen',
            transform: 'translateZ(60px)',
          }}
        />
      </article>
    </Link>
  )
}
