'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

// Toggle de idioma de un solo botón: muestra el idioma AL QUE se cambia (destino) y alterna.
export default function LocaleToggle() {
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const other = currentLocale === 'en' ? 'es' : 'en'

  const switchLocale = () => {
    // Normaliza a la ruta sin prefijo (localePrefix as-needed: en sin prefijo, es → /es).
    let path = pathname
    if (path === '/es' || path.startsWith('/es/')) path = path.slice(3) || '/'
    if (other === 'es') path = '/es' + (path === '/' ? '' : path)
    router.push(path || '/')
  }

  return (
    <motion.button
      onClick={switchLocale}
      aria-label={other === 'es' ? 'Cambiar a español' : 'Switch to English'}
      whileTap={{ scale: 0.93 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold tracking-wider text-white/70 transition-colors duration-200 hover:border-cyan-400/30 hover:text-cyan-400 cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]"
    >
      <Globe size={13} className="opacity-70" />
      {other.toUpperCase()}
    </motion.button>
  )
}
