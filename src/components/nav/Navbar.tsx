'use client'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import MagneticButton from '@/components/ui/MagneticButton'
import LocaleToggle from './LocaleToggle'
import NavCircuit from './NavCircuit'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { key: 'services', href: '#services' },
  { key: 'work', href: '#work' },
  { key: 'about', href: '#about' },
  { key: 'contact', href: '#contact' },
  { key: 'blog', href: '/blog' },
  { key: 'estimate', href: '/estimate' },
  { key: 'demos', href: '/demos', route: true },
] as const

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const prefix = locale === 'es' ? '/es' : ''
  // Demos viven fuera de [locale] → idioma por query (?lang). Rutas in-locale (ej. /blog) →
  // prefijo de locale. Anclas (#services) → SIEMPRE a la home + hash (`/#services`), para que
  // funcionen desde cualquier subpágina (/blog, /services…), no solo desde el inicio.
  const hrefFor = (link: { href: string; route?: boolean }) => {
    if (link.route) return `${link.href}?lang=${locale}`
    if (link.href.startsWith('#')) return `${prefix}/${link.href}`
    return `${prefix}${link.href}`
  }
  // CTA "Let's Talk" → sección de contacto de la home, desde cualquier página.
  const ctaHref = `${prefix}/#contact`
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1])

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20))
    return () => unsub()
  }, [scrollY])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Escape cierra el drawer: es lo que se espera de cualquier overlay modal, y en tablet con
  // teclado era la única salida que no funcionaba (tap en X, backdrop, link y CTA ya cerraban).
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled && 'backdrop-blur-md'
        )}
        style={{
          backgroundColor: scrolled ? 'rgba(5,6,10,0.85)' : 'transparent',
        }}
      >
        {/* Border bottom that appears on scroll */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]"
          style={{ opacity: borderOpacity }}
        />

        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="MS Saravia Tech Stack">
            <NavCircuit size={38} />
            <span className="font-display font-semibold text-[15px] sm:text-[17px] tracking-tight text-[#EEF3F8]">
              MS Saravia<span className="hidden sm:inline font-normal text-[#8896A6]"> Tech Stack</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const className =
                'text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium relative group'
              const inner = (
                <>
                  {t(link.key)}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 group-hover:w-full transition-all duration-300" />
                </>
              )
              // Todos los links (anclas normalizadas a /#x, rutas y demos) van por hrefFor →
              // siempre <Link> con href navegable. Funciona desde cualquier página.
              return (
                <Link key={link.key} href={hrefFor(link)} className={className}>
                  {inner}
                </Link>
              )
            })}
          </nav>

          {/* Right side: locale toggle + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LocaleToggle />
            <MagneticButton variant="primary" href={ctaHref} className="text-xs px-5 py-2.5">
              {t('cta')}
            </MagneticButton>
          </div>

          {/* Mobile: hueco reservado para el botón hamburguesa, que vive fuera del header
              (ver abajo) para poder pintarse encima del drawer. */}
          <div className="lg:hidden w-11 h-11" aria-hidden />
        </div>
      </motion.header>

      {/* Botón hamburguesa/X. FUERA del <header> a propósito: el header es `fixed z-50`, o sea
          un stacking context, y cualquier z-index de sus hijos queda encapsulado dentro. El
          drawer (z-50, posterior en el DOM) ganaba el empate y tapaba la X → tocar la X no
          cerraba nada. Como hermano posterior con z-[70], la X siempre recibe el tap. */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-0 right-6 z-[70] w-11 h-11 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        style={{ marginTop: '10px' }}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mobileOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.nav
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              // Salida por tween, no spring: un spring tiene que "asentarse" y tarda ~1s en
              // darse por terminado, así que el drawer se quedaba visible mucho después del tap.
              exit={{ x: '100%', transition: { type: 'tween', duration: 0.2, ease: 'easeIn' } }}
              transition={{ type: 'spring', stiffness: 420, damping: 40, mass: 0.7 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-[#05060A] border-l border-white/[0.06] flex flex-col lg:hidden"
              aria-label="Mobile navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
                <span className="font-display font-bold text-xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  MS▲
                </span>
              </div>

              {/* Drawer links */}
              <div className="flex flex-col flex-1 px-6 py-8 gap-1">
                {NAV_LINKS.map((link, i) => {
                  const motionProps = {
                    onClick: closeMobile,
                    initial: { opacity: 0, x: 20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: 0.03 + i * 0.03 },
                    className:
                      'flex items-center py-4 text-lg font-medium text-white/70 hover:text-white border-b border-white/[0.04] transition-colors duration-200 group',
                  }
                  const inner = (
                    <>
                      <span className="flex-1">{t(link.key)}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400 transition-colors duration-200" />
                    </>
                  )
                  return (
                    <motion.div key={link.key} {...motionProps}>
                      <Link href={hrefFor(link)} onClick={closeMobile} className="flex items-center flex-1">
                        {inner}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Drawer footer */}
              <div className="px-6 pb-10 flex flex-col gap-4">
                <LocaleToggle onSwitch={closeMobile} />
                <MagneticButton
                  variant="primary"
                  href={ctaHref}
                  onClick={closeMobile}
                  className="w-full justify-center"
                >
                  {t('cta')}
                </MagneticButton>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
