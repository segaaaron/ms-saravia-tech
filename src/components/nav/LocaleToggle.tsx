'use client'
import { useLocale } from 'next-intl'
import { usePathname, getPathname } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { track } from '@/lib/analytics'

// Toggle de idioma de un solo botón: muestra el idioma AL QUE se cambia (destino) y alterna.
// Arma la URL destino con `getPathname` de next-intl (respeta localePrefix 'as-needed') y navega
// duro. Ver switchLocale para por qué la cookie y por qué no es un soft-nav.
export default function LocaleToggle({ onSwitch }: { onSwitch?: () => void } = {}) {
  const currentLocale = useLocale()
  const pathname = usePathname() // pathname SIN prefijo de locale (locale-agnóstico)
  const other = currentLocale === 'en' ? 'es' : 'en'

  const switchLocale = () => {
    // La cookie manda sobre localeDetection en el middleware: sin ella, volver al locale por
    // defecto (/) rebota a /es por Accept-Language.
    document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000;samesite=lax`
    track('lang-switch', { from: currentLocale, to: other })
    onSwitch?.()
    // Nav DURA, no router.replace. En una visita que entró por el redirect / -> /es, el Router
    // Cache del App Router guarda "/" resuelto a /es; un soft-nav a "/" reusa esa entrada y
    // vuelve a español. Solo se ve en prod (en dev el prefetch cache tiene staleTime 0).
    // Se arrastran search Y hash: la nav del sitio son anclas (/#services, /#contact), así que
    // sin el hash quien cambia de idioma leyendo una sección salta al tope de la página.
    window.location.assign(
      getPathname({ href: pathname, locale: other }) +
        window.location.search +
        window.location.hash
    )
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
