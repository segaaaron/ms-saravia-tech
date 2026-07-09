'use client'

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'

/* ---------- Smooth scroll (Lenis) ---------- */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
  return null
}

/* ---------- Scroll reveal ---------- */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Reveal({
  children,
  i = 0,
  as = 'div',
  className,
  style,
}: {
  children: React.ReactNode
  i?: number
  as?: 'div' | 'section' | 'li' | 'h2' | 'p'
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      custom={i}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {children}
    </MotionTag>
  )
}

/* ---------- Count-up ---------- */
export function Counter({
  to,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {val.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

/* ---------- Magnetic button ---------- */
export function Magnetic({
  children,
  className,
  style,
  onClick,
  as = 'button',
  href,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  as?: 'button' | 'a'
  href?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18 })
  const y = useSpring(my, { stiffness: 220, damping: 18 })
  const handle = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.3)
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }
  // Unión button|a: tipamos laxo para permitir href solo en el caso <a>.
  const Comp: any = as === 'a' ? motion.a : motion.button
  const extra = as === 'a' ? { href } : { type: 'button' as const }
  return (
    <Comp
      ref={ref}
      {...extra}
      onClick={onClick}
      onMouseMove={handle}
      onMouseLeave={reset}
      style={{ x, y, ...style }}
      className={className}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </Comp>
  )
}

/* ---------- Parallax on scroll (subtle) ---------- */
export function useParallax(strength = 40) {
  const y = useMotionValue(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => y.set(window.scrollY * (strength / 1000))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [y, strength])
  return useTransform(y, (v) => v)
}

/* ---------- Demo badge (mock disclaimer) ---------- */
export function DemoBadge({ accent }: { accent: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 90,
        fontFamily: 'var(--font-inter-demo), monospace',
        fontSize: 11,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: accent,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${accent}55`,
        padding: '7px 12px',
        borderRadius: 999,
      }}
    >
      Demo · datos ficticios
    </div>
  )
}

/* ---------- CTA form → backend Lead ---------- */
export function DemoCTA({
  source,
  accent,
  theme = 'dark',
  labels,
}: {
  source: string
  accent: string
  theme?: 'dark' | 'light'
  labels: { name: string; email: string; message: string; button: string; success: string }
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const dark = theme === 'dark'
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'}`,
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    color: dark ? '#fff' : '#111',
    fontSize: 15,
    outlineColor: accent,
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      })
      if (!res.ok) throw new Error()
      setState('ok')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setState('error')
    }
  }

  if (state === 'ok') {
    return (
      <div style={{ padding: '28px 0', color: accent, fontSize: 18, fontWeight: 600 }}>
        {labels.success}
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 14, maxWidth: 460 }}>
      <input
        required
        placeholder={labels.name}
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        style={fieldStyle}
        minLength={2}
      />
      <input
        required
        type="email"
        placeholder={labels.email}
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        style={fieldStyle}
      />
      <textarea
        required
        placeholder={labels.message}
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        rows={4}
        minLength={10}
        style={{ ...fieldStyle, resize: 'vertical' }}
      />
      <Magnetic
        style={{
          padding: '15px 24px',
          borderRadius: 12,
          background: accent,
          color: dark ? '#05060A' : '#fff',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '0.01em',
        }}
      >
        {state === 'sending' ? '…' : labels.button}
      </Magnetic>
      {state === 'error' && (
        <span style={{ color: '#ff6b6b', fontSize: 13 }}>Something went wrong. Try again.</span>
      )}
    </form>
  )
}
