'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Cloud, Smartphone, Sparkles, Lightbulb } from 'lucide-react'
import TiltCard from '@/components/ui/TiltCard'

// Cover por post: foto real (public/blog/<slug>.webp) + tinte de marca por cluster + icono.
const CLUSTER: Record<string, { grad: string; accent: string; Icon: typeof Cloud }> = {
  saas: { grad: 'linear-gradient(135deg, #2FF5E0 0%, #4D7CFF 100%)', accent: '#2FF5E0', Icon: Cloud },
  'mobile-apps': { grad: 'linear-gradient(135deg, #9B6CFF 0%, #FF2BD6 100%)', accent: '#9B6CFF', Icon: Smartphone },
  'ai-agents': { grad: 'linear-gradient(135deg, #FF2BD6 0%, #7C3AED 100%)', accent: '#FF2BD6', Icon: Sparkles },
  'tech-consulting': { grad: 'linear-gradient(135deg, #2FF5E0 0%, #9B6CFF 100%)', accent: '#2FF5E0', Icon: Lightbulb },
}

export default function BlogCard({
  href, slug, cluster, dateLabel, readingLabel, title, excerpt, readMore,
}: {
  href: string
  slug: string
  cluster: string
  dateLabel: string
  readingLabel: string
  title: string
  excerpt: string
  readMore: string
}) {
  const meta = CLUSTER[cluster] ?? CLUSTER.saas
  const Icon = meta.Icon

  return (
    <TiltCard
      max={9}
      className="group relative h-full overflow-hidden"
      style={{
        borderRadius: 20,
        border: '1px solid rgba(120,200,255,0.10)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      }}
    >
      <Link href={href} className="flex h-full flex-col" style={{ transform: 'translateZ(28px)' }}>
        {/* Cover: foto real + tinte de marca + icono */}
        <div className="relative h-44 overflow-hidden" style={{ background: '#0a1018' }}>
          <Image
            src={`/blog/${slug}.webp`}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Tinte de marca (deja ver la foto) */}
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: meta.grad, opacity: 0.55 }} />
          {/* Legibilidad */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(6,8,16,0.1) 0%, rgba(6,8,16,0.55) 100%)' }} />
          <Icon
            aria-hidden
            size={30}
            strokeWidth={1.6}
            className="absolute left-5 top-5 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-2.5 text-[12px] text-white/45">
            <span>{dateLabel}</span>
            <span aria-hidden>·</span>
            <span>{readingLabel}</span>
          </div>
          <h2 className="mt-3 text-[20px] font-bold leading-snug tracking-tight text-white">{title}</h2>
          <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-white/55">{excerpt}</p>
          <span
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:text-[#2FF5E0]"
            style={{ color: meta.accent }}
          >
            {readMore}
            <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </TiltCard>
  )
}
