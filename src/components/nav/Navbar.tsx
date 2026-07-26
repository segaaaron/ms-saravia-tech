'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import MagneticButton from '@/components/ui/MagneticButton'
import LocaleToggle from './LocaleToggle'
import NavCircuit from './NavCircuit'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const SCROLL_KEYS = ['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End', ' ']
const TOGGLE_SELECTOR = '[data-menu-toggle]'
// Mismo 1024px que el prefijo `lg:` de Tailwind, que es lo que oculta drawer y hamburguesa.
const DESKTOP_QUERY = '(min-width: 1024px)'
// Elementos que pueden recibir foco dentro del drawer. `:not([disabled])` y `tabindex="-1"`
// fuera, porque un trap que devuelve el foco a un control inerte deja al usuario atascado.
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
// `offsetParent !== null` NO sirve aquí: el spec obliga a devolver null en cualquier elemento
// `position: fixed`, y tanto la hamburguesa como el drawer lo son. Con ese test el botón se
// consideraba oculto SIEMPRE (fuera del ciclo de Tab, y el foco no volvía a él al cerrar).
const isVisible = (el: HTMLElement) => el.getClientRects().length > 0

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

  const drawerRef = useRef<HTMLElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const openRef = useRef(false)

  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1])

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20))
    return () => unsub()
  }, [scrollY])

  // El scroll de fondo YA NO se bloquea tocando `document.body.style.overflow`. Ese era el
  // origen real del tirón al cerrar: alternar `overflow` en el body invalida el layout del
  // documento entero (hero, blurs, canvas), y ese reflow caía justo en el primer frame de la
  // animación de salida — el panel se quedaba clavado unos 100ms y recién ahí se iba.
  // Ahora el bloqueo es puramente CSS y local al overlay: el backdrop cubre todo el viewport
  // con `touch-action: none` (no hay pan posible sobre él) y el drawer usa `overscroll-contain`
  // (su scroll no encadena al body). Cero mutación de estilos globales → cero reflow al abrir
  // y al cerrar. Además desaparece el riesgo de que el scroll al ancla (#contact) se pierda
  // porque el body seguía bloqueado en el momento de la navegación.

  // El canvas de partículas repinta a pantalla completa en cada frame. Mientras el drawer
  // anima compite por el mismo hilo y por el compositor, que es de donde salía buena parte
  // del tirón en móviles de gama media. Se pausa al abrir; se reanuda en `onExitComplete`,
  // NO al bajar el estado: reanudarlo al instante devolvía el rAF a pantalla completa
  // encima de los 180ms de la animación de salida.
  useEffect(() => {
    openRef.current = mobileOpen
    if (mobileOpen) window.dispatchEvent(new CustomEvent('mss:menu', { detail: true }))
  }, [mobileOpen])

  const resumeBackground = () => {
    window.dispatchEvent(new CustomEvent('mss:menu', { detail: false }))
  }

  // Si el Navbar se desmonta con el menú abierto, el canvas se quedaría pausado para siempre.
  // Solo si estaba abierto: emitirlo siempre es inocuo pero manda un evento por cada desmontaje.
  useEffect(() => () => {
    if (openRef.current) window.dispatchEvent(new CustomEvent('mss:menu', { detail: false }))
  }, [])

  // Escape cierra el drawer: es lo que se espera de cualquier overlay modal, y en tablet con
  // teclado era la única salida que no funcionaba (tap en X, backdrop, link y CTA ya cerraban).
  // Las teclas de scroll (PageDown, flechas, Space, Home/End) se anulan mientras el drawer está
  // abierto salvo que el foco esté dentro del panel: `touch-action` es SOLO táctil, no cubre ni
  // rueda ni teclado, así que sin esto el fondo scrolleaba detrás del overlay con PageDown.
  useEffect(() => {
    if (!mobileOpen) return
    const drawer = () => drawerRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); return }
      // Focus trap. El drawer es `aria-modal`, o sea que declara inerte todo lo de detrás: si
      // el Tab siguiera saliendo al documento, un usuario de teclado o lector de pantalla se
      // quedaría navegando a ciegas por links que visualmente están tapados por el panel.
      // El ciclo incluye el botón hamburguesa/X, que es hermano del drawer pero se pinta
      // dentro de su cabecera: para el usuario forma parte del mismo overlay.
      if (e.key === 'Tab') {
        const panel = drawer()
        if (!panel) return
        const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
          .filter((el): el is HTMLElement => !!el && isVisible(el))
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement as HTMLElement | null
        // Foco fuera del ciclo (p.ej. sigue en el <body> tras abrir) → entrar por el extremo
        // que corresponda en vez de dejar que el navegador salte al documento.
        if (!active || !items.includes(active)) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
          return
        }
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
        return
      }
      if (!SCROLL_KEYS.includes(e.key)) return
      // El botón hamburguesa es HERMANO del drawer, no descendiente: sin esta excepción Space
      // sobre él quedaba anulado y el control no respondía (WCAG 2.1.1).
      if (e.target instanceof Element && e.target.closest(TOGGLE_SELECTOR)) return
      const target = e.target as Node | null
      if (target && drawer()?.contains(target)) return
      e.preventDefault()
    }
    // Rueda/trackpad: preventDefault necesita un listener NO pasivo, y React registra `onWheel`
    // como pasivo. De ahí el addEventListener nativo con { passive: false }.
    const onWheel = (e: WheelEvent) => {
      const target = e.target as Node | null
      if (target && drawer()?.contains(target)) return
      e.preventDefault()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('wheel', onWheel)
    }
  }, [mobileOpen])

  // Al abrir, el foco entra al panel (que es `tabIndex={-1}`, no un tab stop): así el lector de
  // pantalla anuncia el diálogo y su etiqueta, y el primer Tab cae dentro del ciclo. Al cerrar,
  // el foco vuelve a la hamburguesa, que es el control que lo abrió.
  // La restauración se hace SOLO si el foco seguía dentro del overlay: si el usuario cerró
  // tocando un link, el foco ya se lo llevó la navegación y robárselo sería peor.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (mobileOpen) {
      wasOpen.current = true
      drawerRef.current?.focus({ preventScroll: true })
      return
    }
    // Sin esta guarda, el efecto correría también en el montaje inicial y la carga de CUALQUIER
    // página robaría el foco hacia la hamburguesa.
    if (!wasOpen.current) return
    wasOpen.current = false
    const active = document.activeElement
    const inOverlay =
      !active ||
      active === document.body ||
      drawerRef.current?.contains(active) ||
      toggleRef.current?.contains(active)
    const toggle = toggleRef.current
    if (inOverlay && toggle && isVisible(toggle)) toggle.focus({ preventScroll: true })
  }, [mobileOpen])

  // Cruzar a desktop con el drawer abierto lo dejaba en un limbo: drawer, backdrop y hamburguesa
  // se ocultan por CSS (`lg:hidden`) pero `mobileOpen` seguía en true, así que los bloqueos de
  // rueda/teclado y el `touch-action:none` del header seguían activos sin ningún control visible
  // para cerrarlos. Pasa de verdad al rotar un iPad o redimensionar la ventana.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const sync = () => { if (mq.matches) setMobileOpen(false) }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <motion.header
        className={cn(
          // transition-colors, no transition-all: con `all` el navegador interpolaba también el
          // backdrop-filter, o sea medio segundo de blur a pantalla completa recalculado por
          // frame justo mientras el drawer anima.
          'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
          scrolled && 'backdrop-blur-md'
        )}
        style={{
          backgroundColor: scrolled ? 'rgba(5,6,10,0.85)' : 'transparent',
          // El header es z-50 y pinta ENCIMA del backdrop (z-40): un pan que empieza en esta
          // franja de 64px a ancho completo nunca toca el backdrop y llegaba al scroller del
          // documento. `touch-action` solo aplica al elemento donde ARRANCA el gesto, así que
          // el bloqueo hay que replicarlo aquí. Mismo motivo en el botón hamburguesa.
          touchAction: mobileOpen ? 'none' : undefined,
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
        ref={toggleRef}
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-0 right-6 z-[70] w-11 h-11 flex items-center justify-center text-white/70 hover:text-white transition-colors active:scale-90"
        // touch-action por style, no por clase: con el drawer abierto tiene que ser `none`
        // (el botón es z-[70], está por encima del backdrop, y `manipulation` = `pan-x pan-y`
        // autorizaba explícitamente el scroll del fondo justo donde queda el dedo tras abrir).
        style={{ marginTop: '10px', WebkitTapHighlightColor: 'transparent', touchAction: mobileOpen ? 'none' : 'manipulation' }}
        // La etiqueta era "Toggle menu" fija en inglés incluso en /es, y no decía qué iba a pasar
        // al pulsar. Ahora está traducida y refleja la acción según el estado.
        aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
        aria-expanded={mobileOpen}
        aria-controls="mobile-drawer"
        data-menu-toggle
      >
        {/* Los dos iconos viven SIEMPRE montados, superpuestos, y solo cruzan opacidad/rotación.
            Antes era un AnimatePresence con mode="wait": ese modo espera a que termine la salida
            (0.2s) para recién empezar la entrada (0.2s), o sea 0.4s con el hueco vacío en medio.
            Ese era el "delay" al tocar la hamburguesa o la X — el botón respondía al instante
            pero el icono tardaba casi medio segundo en aparecer. */}
        {/* `initial={false}` en ambos: sin él, framer monta el span con la opacidad que trae del
            CSS (1) y recién entonces anima hacia el destino, así que en CADA carga de página la X
            aparecía encima de la hamburguesa y se desvanecía en 150 ms. Con `initial={false}`
            arrancan directamente en su valor final y solo animan cuando `mobileOpen` cambia. */}
        <span className="relative block w-[22px] h-[22px]">
          <motion.span
            className="absolute inset-0"
            initial={false}
            animate={{ rotate: mobileOpen ? 90 : 0, opacity: mobileOpen ? 0 : 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Menu size={22} />
          </motion.span>
          <motion.span
            className="absolute inset-0"
            initial={false}
            animate={{ rotate: mobileOpen ? 0 : -90, opacity: mobileOpen ? 1 : 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <X size={22} />
          </motion.span>
        </span>
      </button>

      {/* Mobile drawer overlay */}
      <AnimatePresence onExitComplete={resumeBackground}>
        {mobileOpen && (
          <>
            {/* Backdrop. `touch-action: none` es lo que bloquea el scroll de fondo (antes lo hacía
                `overflow:hidden` en el body, con el reflow de documento completo que eso implica). */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'linear' }}
              style={{ touchAction: 'none', willChange: 'opacity' }}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.nav
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              // Tween en las dos direcciones, no spring. El spring de entrada estaba
              // sobreamortiguado (ζ≈1.17): cubría el 90% del recorrido rápido pero arrastraba
              // una cola larga antes de darse por terminado, y esa cola se leía como lentitud.
              // Un tween de 0.22s llega y termina, sin cola.
              // `easeIn` en la salida era la otra mitad del problema: easeIn arranca casi parado.
              // El icono cambiaba a hamburguesa al instante y el panel se quedaba quieto ~80ms
              // antes de moverse — exactamente el "delay" que se veía. Misma curva que la entrada
              // (easeOutQuint): sale disparado en el primer frame y frena al final.
              exit={{ x: '100%', transition: { type: 'tween', duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
              transition={{ type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              // overscroll-contain: si el contenido no entra en pantallas bajas, el drawer scrollea
              // solo — sin encadenar al documento de detrás, que es lo que antes obligaba a
              // bloquear el body.
              style={{ willChange: 'transform', overscrollBehavior: 'contain', scrollbarWidth: 'none' }}
              data-mobile-drawer
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-[#05060A] border-l border-white/[0.06] flex flex-col overflow-y-auto outline-none [&::-webkit-scrollbar]:w-0 lg:hidden"
              // Semántica de diálogo modal: `aria-modal` declara inerte todo lo de detrás para
              // el lector de pantalla (que es lo que el backdrop ya hace visualmente), y el
              // trap de Tab del efecto de arriba hace cumplir lo mismo con el teclado.
              // `tabIndex={-1}` para poder enfocar el panel al abrir sin añadir un tab stop.
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('menu')}
              tabIndex={-1}
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
                    initial: { opacity: 0, x: 16 },
                    animate: { opacity: 1, x: 0 },
                    // 7 links a 0.03s de paso = el último entraba a los 0.24s, y encima con el
                    // spring por defecto de framer encima. El escalonado terminaba después que
                    // el propio panel. Paso de 0.015s y tween corto: cierra junto con el drawer.
                    transition: { delay: i * 0.015, duration: 0.16, ease: 'easeOut' as const },
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
