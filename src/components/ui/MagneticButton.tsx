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
    variant === 'primary' && 'text-[#060A10] hover:-translate-y-0.5',
    variant === 'ghost' && 'text-[#EEF3F8] border bg-white/[0.02] hover:border-[#2FF5E0] hover:bg-[rgba(47,245,224,0.06)]',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  const primaryStyle =
    variant === 'primary'
      ? {
          background:
            'linear-gradient(120deg, #2FF5E0 0%, #4D7CFF 50%, #9B6CFF 100%)',
          boxShadow:
            '0 0 0 1px rgba(120,200,255,0.2), 0 10px 30px rgba(77,124,255,0.3)',
        }
      : undefined

  const ghostStyle =
    variant === 'ghost'
      ? { borderColor: 'rgba(120,200,255,0.18)' }
      : undefined

  // shimmer overlay for primary
  const shimmer = variant === 'primary' && (
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
  )

  const inner = (
    <>
      {shimmer}
      <span className="relative z-10">{children}</span>
    </>
  )

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
