'use client'
import { m } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import NavCircuit from '@/components/nav/NavCircuit'
import { cn } from '@/lib/utils'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { SOCIALS, type SocialKey } from '@/content/socials'
import { umamiAttrs } from '@/lib/analytics'

const NAV_LINKS = [
  { href: '#services', labelKey: 'services' },
  { href: '#work',     labelKey: 'work' },
  { href: '#about',    labelKey: 'about' },
  { href: '#contact',  labelKey: 'contact' },
]

const SOCIAL_ICONS: Record<SocialKey, typeof Mail> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
}

// Hide entries without a real URL (github/linkedin until valid links provided).
const VISIBLE_SOCIALS = SOCIALS.filter(
  (s): s is typeof s & { href: string } => s.href !== null,
)

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  // Anclas → SIEMPRE a la home + hash, para que funcionen desde cualquier subpágina.
  const prefix = locale === 'es' ? '/es' : ''

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'rgba(5,6,10,0.98)' }}
    >
      {/* Top gradient border */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00E5FF 25%, #7C3AED 50%, #FF2BD6 75%, transparent 100%)',
          opacity: 0.6,
        }}
      />

      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Large wordmark row */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="pt-16 pb-12 border-b border-white/[0.06]"
        >
          <m.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-center gap-3">
              <NavCircuit size={56} />
              <p className="font-display font-semibold text-xl tracking-tight text-[#EEF3F8]">
                MS<span className="font-normal text-[#8896A6]"> Tech Stack LLC</span>
              </p>
            </div>

            <p className="text-white/35 text-base max-w-xs leading-relaxed">
              {t('tagline')}
            </p>
          </m.div>
        </m.div>

        {/* 3-column grid */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-10 border-b border-white/[0.06]"
        >
          {/* Col 1: Company */}
          <m.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-white/70 text-xs font-semibold tracking-widest uppercase">
              {t('company')}
            </h3>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              {t('description')}
            </p>
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <MapPin size={12} />
              <span>{t('location')}</span>
            </div>
          </m.div>

          {/* Col 2: Quick links */}
          <m.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-white/70 text-xs font-semibold tracking-widest uppercase">
              {t('quick_links')}
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ href, labelKey }) => (
                <li key={labelKey}>
                  <Link
                    href={`${prefix}/${href}`}
                    className="text-white/40 text-sm hover:text-cyan-400 transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    {...umamiAttrs('nav-click', { item: labelKey, placement: 'footer' })}
                  >
                    {tNav(labelKey as 'services' | 'work' | 'about' | 'contact')}
                  </Link>
                </li>
              ))}
            </ul>
          </m.div>

          {/* Col 3: Contact + socials */}
          <m.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-white/70 text-xs font-semibold tracking-widest uppercase">
              Get in Touch
            </h3>

            {/* Correo: icono + dirección en la MISMA línea */}
            <a
              href="mailto:techstackmssaravia@gmail.com"
              aria-label="Email techstackmssaravia@gmail.com"
              className="group inline-flex items-center gap-3 text-white/45 text-sm hover:text-cyan-400 transition-colors duration-200"
              {...umamiAttrs('email-click', { placement: 'footer' })}
            >
              <span
                className={cn(
                  'w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center shrink-0',
                  'text-white/45 group-hover:text-cyan-400 group-hover:border-cyan-400/40',
                  'group-hover:shadow-[0_0_16px_rgba(0,229,255,0.25)] transition-all duration-200'
                )}
              >
                <Mail size={15} strokeWidth={1.5} />
              </span>
              <span className="break-all">techstackmssaravia@gmail.com</span>
            </a>

            {/* Otras redes (github/linkedin) cuando existan URL real — el email ya va arriba */}
            {(() => {
              const others = VISIBLE_SOCIALS.filter((s) => s.key !== 'email')
              if (others.length === 0) return null
              return (
                <div className="flex items-center gap-3 pt-1">
                  {others.map(({ href, label, key }) => {
                    const Icon = SOCIAL_ICONS[key]
                    return (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={cn(
                          'w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center',
                          'text-white/40 hover:text-cyan-400 hover:border-cyan-400/40',
                          'hover:shadow-[0_0_16px_rgba(0,229,255,0.25)]',
                          'transition-all duration-200 cursor-pointer'
                        )}
                        {...umamiAttrs('social-click', { network: key })}
                      >
                        <Icon size={15} strokeWidth={1.5} />
                      </a>
                    )
                  })}
                </div>
              )
            })()}
          </m.div>
        </m.div>

        {/* Bottom copyright row */}
        <m.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-white/20 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} {t('company')}. {t('rights')}
          </p>
          <p className="text-white/15 text-xs">
            Built with Next.js 15 · TypeScript · Tailwind CSS
          </p>
        </m.div>

      </div>
    </footer>
  )
}
