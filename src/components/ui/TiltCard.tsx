'use client'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { m, type Variants } from 'framer-motion'

type Props = {
  children: ReactNode
  variants?: Variants
  className?: string
  style?: CSSProperties
  max?: number
}

// El wrapper externo (motion.div) es el ÚNICO dueño del transform de entrada
// (framer variants: rotateX/y). El tilt de puntero vive en un div interno para
// que ambos transforms no compitan por el mismo `style.transform` — si compartían
// el nodo, el re-render del tilt congelaba la animación de entrada a medio camino
// (rotateX ~7°), inflando las cards de los bordes bajo la perspectiva del grid.
export default function TiltCard({
  children,
  variants,
  className,
  style,
  max = 11,
}: Props) {
  const [t, setT] = useState({ rx: 0, ry: 0, hover: false })
  const [s, setS] = useState({ mx: '50%', my: '50%' })

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Solo ratón. `pointermove` también dispara con el dedo, así que al arrastrar sobre la
    // tarjeta se encadenaban dos setState por evento — un re-render por cada muestra del
    // gesto, justo mientras el usuario scrollea. Además el tilt quedaba trabado en hover
    // después de un tap, porque en táctil no hay `pointerleave` que lo resetee.
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setS({ mx: `${px * 100}%`, my: `${py * 100}%` })
    setT({ rx: (0.5 - py) * max, ry: (px - 0.5) * max, hover: true })
  }
  const onLeave = () => setT({ rx: 0, ry: 0, hover: false })

  return (
    <m.div variants={variants} style={{ display: 'grid' }}>
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={className}
        style={{
          ...style,
          transformStyle: 'preserve-3d',
          transform: t.hover
            ? `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateY(-4px)`
            : 'perspective(900px) rotateX(0deg) rotateY(0deg)',
          transition: 'transform .2s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle 280px at ${s.mx} ${s.my}, rgba(47,245,224,0.18), rgba(155,108,255,0.12) 40%, transparent 70%)`,
            opacity: t.hover ? 1 : 0,
            transition: 'opacity .25s',
            mixBlendMode: 'screen',
            zIndex: 1,
            borderRadius: 'inherit',
          }}
        />
        {children}
      </div>
    </m.div>
  )
}
