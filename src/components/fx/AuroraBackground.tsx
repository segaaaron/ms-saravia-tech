'use client'
import { cn } from '@/lib/utils'

type Props = { className?: string }

export default function AuroraBackground({ className }: Props) {
  return (
    <div
      aria-hidden
      className={cn('fixed inset-0 -z-10 overflow-hidden pointer-events-none', className)}
    >
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#05060A]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-100" />

      {/* Aurora blobs */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.10] blur-[80px]"
        style={{
          background: 'radial-gradient(circle, #FF2BD6 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite 2s',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  )
}
