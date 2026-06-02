import { cn } from '@/lib/utils'

type Props = { children: React.ReactNode; className?: string; color?: 'cyan' | 'violet' | 'magenta' }

const colors = {
  cyan: 'border-cyan-400/30 text-cyan-400 bg-cyan-400/10',
  violet: 'border-violet-400/30 text-violet-400 bg-violet-400/10',
  magenta: 'border-fuchsia-400/30 text-fuchsia-400 bg-fuchsia-400/10',
}

export default function SectionLabel({ children, className, color = 'cyan' }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border',
      colors[color],
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', {
        'bg-cyan-400': color === 'cyan',
        'bg-violet-400': color === 'violet',
        'bg-fuchsia-400': color === 'magenta',
      })} />
      {children}
    </span>
  )
}
