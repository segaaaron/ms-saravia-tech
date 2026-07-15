'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

// Toggle de idioma de un solo botón: muestra el idioma AL QUE se cambia (destino) y alterna.
// Usa la navegación de next-intl para setear la cookie NEXT_LOCALE y armar la URL correcta
// (con next/navigation crudo + localeDetection quedaba atascado al volver al idioma por defecto).
export default function LocaleToggle({ onSwitch }: { onSwitch?: () => void } = {}) {
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname() // pathname SIN prefijo de locale (locale-agnóstico)
  const other = currentLocale === 'en' ? 'es' : 'en'

  const switchLocale = () => {
    // Setea la cookie explícito ANTES de navegar: así el middleware (localeDetection) respeta
    // el cambio incluso al volver al locale por defecto (/), sin rebotar por Accept-Language.
    document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000;samesite=lax`
    // router.replace es soft-nav: el Navbar NO se remonta, así que el drawer mobile queda
    // abierto (mobileOpen sigue true) tapando todo. Cerrarlo explícito antes de navegar.
    onSwitch?.()
    router.replace(pathname, { locale: other })
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
