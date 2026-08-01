'use client'
import { useRef } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  // Atributos data-umami-event* (usar umamiAttrs()). Umami los lee en su propio listener de
  // click, así el evento se envía de forma fiable aunque el click navegue fuera de la página.
  dataUmami?: Record<string, string>
}

export default function MagneticButton({ children, href, onClick, variant = 'primary', className, type = 'button', disabled, dataUmami }: Props) {
  const ref = useRef<HTMLElement>(null)

  // Motion values, no useState: antes cada `mousemove` disparaba un setState, o sea un
  // re-render de React por evento del ratón (~60-120/s) para mover un botón dos píxeles.
  // Los motion values escriben el transform directo, fuera del ciclo de render.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 200, damping: 15 })
  const y = useSpring(my, { stiffness: 200, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    mx.set((clientX - (left + width / 2)) * 0.25)
    my.set((clientY - (top + height / 2)) * 0.25)
  }

  const handleMouseLeave = () => { mx.set(0); my.set(0) }

  const baseClasses = cn(
    // transition-colors, no transition-all: con `all` el CSS interpolaba también el `transform`
    // que framer reescribe cada frame para el efecto magnético, así que el botón perseguía al
    // cursor con 300ms de retraso encima del spring.
    'relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[13px] font-semibold text-[15px] tracking-wide cursor-pointer transition-colors duration-300 overflow-hidden',
    variant === 'primary' && 'text-white hover:-translate-y-0.5',
    variant === 'ghost' && 'text-[#EEF3F8] border bg-white/[0.02] hover:border-[#2FF5E0] hover:bg-[rgba(47,245,224,0.06)]',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  const primaryStyle =
    variant === 'primary'
      ? {
          // Índigo suave + texto blanco (elegante, sin fatiga visual). Color por style inline
          // (contraste garantizado, sin depender del JIT de Tailwind).
          background: '#4F46E5',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px -8px rgba(79,70,229,0.5)',
        }
      : undefined

  const ghostStyle =
    variant === 'ghost'
      ? { borderColor: 'rgba(120,200,255,0.18)' }
      : undefined

  // Botón plano de un solo color (sin degradado ni shimmer). inline-flex + items-center para
  // que icono y texto queden alineados en la misma línea (no apilados).
  const inner = <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>

  const motionProps = {
    // onClick también en la variante <a>: antes solo lo recibía el <button>, así que el CTA del
    // drawer móvil (href="/#contact") navegaba al ancla pero nunca ejecutaba su onClick de
    // cierre. Al ser una navegación por hash en la misma página, el menú se quedaba abierto.
    onClick,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileTap: { scale: 0.97 },
    className: cn('group', baseClasses),
    style: { ...(primaryStyle ?? ghostStyle), x, y },
    ...dataUmami,
  }

  if (href) {
    return (
      <m.a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...motionProps}>
        {inner}
      </m.a>
    )
  }

  return (
    <m.button ref={ref as React.Ref<HTMLButtonElement>} type={type} disabled={disabled} {...motionProps}>
      {inner}
    </m.button>
  )
}
