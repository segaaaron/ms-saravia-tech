'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const locales = ['EN', 'ES'] as const

export default function LocaleToggle() {
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (locale: string) => {
    const lower = locale.toLowerCase()
    if (lower === currentLocale) return

    // Replace /en/... or /es/... prefix, or handle root
    const segments = pathname.split('/')
    // segments[0] = '', segments[1] = locale, segments[2..] = rest
    if (segments[1] === 'en' || segments[1] === 'es') {
      segments[1] = lower
    } else {
      segments.splice(1, 0, lower)
    }
    router.push(segments.join('/') || '/')
  }

  return (
    <div className="flex items-center gap-1 p-0.5 rounded-full border border-white/10 bg-white/[0.03]">
      {locales.map((locale) => {
        const isActive = locale.toLowerCase() === currentLocale
        return (
          <motion.button
            key={locale}
            onClick={() => switchLocale(locale)}
            className={cn(
              'relative px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-colors duration-200 cursor-pointer select-none',
              isActive
                ? 'text-cyan-400'
                : 'text-white/40 hover:text-white/70'
            )}
            whileTap={{ scale: 0.93 }}
          >
            {isActive && (
              <motion.span
                layoutId="locale-pill"
                className="absolute inset-0 rounded-full bg-cyan-400/10 border border-cyan-400/30"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{locale}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
