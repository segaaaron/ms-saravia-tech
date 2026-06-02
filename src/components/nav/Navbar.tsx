'use client'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
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
] as const

export default function Navbar() {
  const t = useTranslations('nav')
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

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled && 'backdrop-blur-xl'
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
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium relative group"
              >
                {t(key)}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right side: locale toggle + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LocaleToggle />
            <MagneticButton variant="primary" href="#contact" className="text-xs px-5 py-2.5">
              {t('cta')}
            </MagneticButton>
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden relative z-[60] w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
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
        </div>
      </motion.header>

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
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.nav
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-[#05060A] border-l border-white/[0.06] flex flex-col md:hidden"
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
                {NAV_LINKS.map(({ key, href }, i) => (
                  <motion.a
                    key={key}
                    href={href}
                    onClick={closeMobile}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07 }}
                    className="flex items-center py-4 text-lg font-medium text-white/70 hover:text-white border-b border-white/[0.04] transition-colors duration-200 group"
                  >
                    <span className="flex-1">{t(key)}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400 transition-colors duration-200" />
                  </motion.a>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="px-6 pb-10 flex flex-col gap-4">
                <LocaleToggle />
                <MagneticButton
                  variant="primary"
                  href="#contact"
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
