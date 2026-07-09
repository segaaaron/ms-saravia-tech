'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export default function MagneticButton({ children, href, onClick, variant = 'primary', className, type = 'button', disabled }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * 0.25
    const y = (clientY - (top + height / 2)) * 0.25
    setPosition({ x, y })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  const baseClasses = cn(
    'relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[13px] font-semibold text-[15px] tracking-wide cursor-pointer transition-all duration-300 overflow-hidden',
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
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring' as const, stiffness: 200, damping: 15 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileTap: { scale: 0.97 },
    className: cn('group', baseClasses),
    style: primaryStyle ?? ghostStyle,
  }

  if (href) {
    return (
      <motion.a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...motionProps}>
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} {...motionProps}>
      {inner}
    </motion.button>
  )
}
