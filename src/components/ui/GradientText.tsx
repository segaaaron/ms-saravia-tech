import { cn } from '@/lib/utils'
import React from 'react'

type GradientPreset = 'primary' | 'cyan' | 'violet' | 'magenta'

type Props = {
  children: React.ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  gradient?: GradientPreset
  animate?: boolean
}

const gradients: Record<GradientPreset, string> = {
  primary: 'bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500',
  cyan: 'bg-gradient-to-r from-cyan-300 to-blue-400',
  violet: 'bg-gradient-to-r from-violet-400 to-purple-600',
  magenta: 'bg-gradient-to-r from-fuchsia-400 to-pink-500',
}

export default function GradientText({ children, className, as = 'span', gradient = 'primary', animate = false }: Props) {
  return React.createElement(
    as,
    {
      className: cn(
        gradients[gradient],
        'bg-clip-text text-transparent',
        animate && 'bg-[size:200%] animate-aurora',
        className
      ),
    },
    children
  )
}
