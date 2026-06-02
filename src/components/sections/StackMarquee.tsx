'use client'

const ITEMS = [
  'React', 'React Native', 'Next.js', 'Node.js', 'TypeScript',
  'Swift', 'SwiftUI', 'RxSwift', 'Kotlin', 'Java',
  'Flutter', 'Ionic', 'Python', 'PostgreSQL', 'Docker',
]

const DOUBLE = [...ITEMS, ...ITEMS]

export default function StackMarquee() {
  return (
    <section
      className="relative overflow-hidden py-10"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.01)',
      }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Label */}
      <p
        className="text-center font-mono text-xs tracking-[0.3em] uppercase mb-8"
        style={{ color: 'rgba(255,255,255,0.18)' }}
      >
        {'// CONSTRUIDO CON TECNOLOGÍA DE FRONTERA'}
      </p>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #05060A, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #05060A, transparent)' }}
        />

        <div
          className="flex gap-14 whitespace-nowrap"
          style={{
            width: 'max-content',
            animation: 'marquee 26s linear infinite',
          }}
        >
          {DOUBLE.map((item, i) => (
            <span
              key={i}
              className="font-display font-semibold tracking-tight select-none"
              style={{
                fontSize: '26px',
                color: 'rgba(255,255,255,0.22)',
                letterSpacing: '-0.02em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'rgba(0,229,255,0.8)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.22)' }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
