'use client'

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import dynamic from 'next/dynamic'
import type { DemoLang } from '../types'

/* ============================================================================
   SAVERA GT — landing premium de superdeportivo (demo de portafolio, ficticia).
   Escena 3D scroll-driven (R3F) + secciones editoriales. Bilingüe es/en.

   El Canvas es WebGL puro: no aporta al HTML servido y arrastra ~el bundle de
   three, así que va con dynamic(ssr:false) y montado bajo el pliegue por
   IntersectionObserver — el LCP es el título del hero (texto HTML), nunca espera
   a que baje three.

   El progreso de scroll (0→1) NO pasa por React state: se escribe en un ref
   (leído dentro de useFrame para mover cámara + rig) y en CSS vars (leídas por
   las cards de info). Cero re-render por scroll.
   ============================================================================ */

const SaveraScene = dynamic(() => import('./SaveraScene'), { ssr: false })

const ROSSO = '#e50914'
const ROSSO_HOT = '#ff2800'
const CHALK = '#f5f5f7'
const CARBON = '#0b0b0b'

type Phase = { badge: string; title: string; body: string; specs: { k: string; v: string }[] }
type Spec = { label: string; value: string; unit: string; note: string }
type Content = {
  nav: { models: string; engineering: string; experience: string; contact: string }
  cta: string
  heroModel: string
  heroTagline: string
  heroSub: string
  scrollHint: string
  phases: Phase[]
  specsEyebrow: string
  specsTitle: string
  specsSub: string
  specCards: Spec[]
  contactEyebrow: string
  contactTitle: string
  contactSub: string
  form: { name: string; email: string; phone: string; dealer: string; message: string }
  send: string
  sending: string
  sent: string
  sentNote: string
  legal: string[]
  rights: string
  builtBy: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    nav: { models: 'Modelos', engineering: 'Ingeniería', experience: 'Experiencia', contact: 'Contacto' },
    cta: 'Reservar Test Drive',
    heroModel: 'SAVERA SV-12 Stradale',
    heroTagline: 'El silencio antes de la tormenta',
    heroSub: 'Doce cilindros forjados a mano. Una carrocería nacida en el túnel de viento. Un manifiesto de ingeniería italiana llevado a su forma más pura.',
    scrollHint: 'Scroll para explorar',
    phases: [
      {
        badge: 'Fase 01 · Habitáculo',
        title: 'Puertas ala-de-gaviota',
        body: 'Se abren hacia el cielo y revelan una cabina envuelta en Alcántara. Volante de carreras aplanado, cluster OLED curvo y control háptico donde antes hubo botones.',
        specs: [
          { k: 'Volante', v: 'Carreras · aplanado' },
          { k: 'Instrumentación', v: 'OLED curvo 12,3"' },
          { k: 'Tapizado', v: 'Alcántara & fibra' },
        ],
      },
      {
        badge: 'Fase 02 · Corazón V12',
        title: '6.5L V12 Biturbo',
        body: 'La cubierta se levanta sobre un bloque forjado que respira por doce gargantas. Respuesta instantánea, corte a 9.500 rpm y una banda sonora que no pide disculpas.',
        specs: [
          { k: 'Potencia', v: '980 CV' },
          { k: '0–100 km/h', v: '2,5 s' },
          { k: 'V. máx', v: '> 340 km/h' },
        ],
      },
      {
        badge: 'Fase 03 · Chasis & Aero',
        title: 'Monocasco de fibra de carbono',
        body: 'Un chasis de 1.380 kg tallado en carbono, alerón activo retráctil y difusor de doble plano. Frenos carbo-cerámicos que detienen el tiempo tanto como la velocidad.',
        specs: [
          { k: 'Chasis', v: 'Monocasco carbono' },
          { k: 'Frenos', v: 'Carbo-cerámicos' },
          { k: 'Aero', v: 'Alerón activo' },
        ],
      },
    ],
    specsEyebrow: 'Ficha técnica',
    specsTitle: 'Cifras que definen el mito',
    specsSub: 'Cada número es una decisión de ingeniería. Ninguno es casualidad.',
    specCards: [
      { label: 'Potencia', value: '980', unit: 'CV @ 9.000 rpm', note: 'V12 6.5L biturbo, bloque de aluminio' },
      { label: 'Peso', value: '1.380', unit: 'kg en seco', note: 'Monocasco de fibra de carbono' },
      { label: 'Aero', value: '390', unit: 'kg de carga a 250', note: 'Alerón activo + difusor de doble plano' },
      { label: 'Transmisión', value: '8', unit: 'velocidades DCT', note: 'Doble embrague, cambio en 40 ms' },
    ],
    contactEyebrow: 'VIP Concierge',
    contactTitle: 'Reserve su encuentro privado',
    contactSub: 'Un especialista de SAVERA le contactará para coordinar una prueba dinámica y una configuración a medida. Cupos limitados por temporada.',
    form: { name: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono', dealer: 'Concesionario / País', message: 'Cuéntenos qué busca' },
    send: 'Solicitar invitación',
    sending: 'Enviando…',
    sent: 'Solicitud recibida',
    sentNote: 'Gracias. Nuestro concierge le contactará en menos de 24 horas. (Demo — no se envía nada real.)',
    legal: ['Aviso legal', 'Privacidad', 'Cookies'],
    rights: '© 2026 SAVERA GT. Marca ficticia. Todos los derechos reservados.',
    builtBy: 'Demo construida por MS Saravia Tech Stack',
  },
  en: {
    nav: { models: 'Models', engineering: 'Engineering', experience: 'Experience', contact: 'Contact' },
    cta: 'Book a Test Drive',
    heroModel: 'SAVERA SV-12 Stradale',
    heroTagline: 'The silence before the storm',
    heroSub: 'Twelve hand-forged cylinders. A body born in the wind tunnel. A manifesto of Italian engineering distilled to its purest form.',
    scrollHint: 'Scroll to explore',
    phases: [
      {
        badge: 'Phase 01 · Cockpit',
        title: 'Gullwing doors',
        body: 'They rise toward the sky and reveal a cabin wrapped in Alcántara. Flat-bottomed racing wheel, curved OLED cluster and haptic control where buttons used to live.',
        specs: [
          { k: 'Wheel', v: 'Racing · flat-bottom' },
          { k: 'Cluster', v: 'Curved 12.3" OLED' },
          { k: 'Trim', v: 'Alcántara & carbon' },
        ],
      },
      {
        badge: 'Phase 02 · V12 Heart',
        title: '6.5L V12 Biturbo',
        body: 'The cover lifts over a forged block that breathes through twelve throats. Instant response, a 9,500 rpm redline and a soundtrack that offers no apologies.',
        specs: [
          { k: 'Power', v: '980 HP' },
          { k: '0–100 km/h', v: '2.5 s' },
          { k: 'Top speed', v: '> 340 km/h' },
        ],
      },
      {
        badge: 'Phase 03 · Chassis & Aero',
        title: 'Carbon-fibre monocoque',
        body: 'A 1,380 kg chassis carved from carbon, a retractable active wing and a dual-plane diffuser. Carbon-ceramic brakes that stop time as much as speed.',
        specs: [
          { k: 'Chassis', v: 'Carbon monocoque' },
          { k: 'Brakes', v: 'Carbon-ceramic' },
          { k: 'Aero', v: 'Active wing' },
        ],
      },
    ],
    specsEyebrow: 'Technical sheet',
    specsTitle: 'The numbers behind the myth',
    specsSub: 'Every figure is an engineering decision. None of them is an accident.',
    specCards: [
      { label: 'Power', value: '980', unit: 'HP @ 9,000 rpm', note: '6.5L twin-turbo V12, aluminium block' },
      { label: 'Weight', value: '1,380', unit: 'kg dry', note: 'Carbon-fibre monocoque' },
      { label: 'Aero', value: '390', unit: 'kg downforce @ 250', note: 'Active wing + dual-plane diffuser' },
      { label: 'Gearbox', value: '8', unit: 'speed DCT', note: 'Dual-clutch, 40 ms shifts' },
    ],
    contactEyebrow: 'VIP Concierge',
    contactTitle: 'Reserve your private encounter',
    contactSub: 'A SAVERA specialist will reach out to arrange a dynamic drive and a bespoke configuration. Seasonal seats are limited.',
    form: { name: 'Full name', email: 'Email address', phone: 'Phone', dealer: 'Dealership / Country', message: 'Tell us what you are after' },
    send: 'Request invitation',
    sending: 'Sending…',
    sent: 'Request received',
    sentNote: 'Thank you. Our concierge will contact you within 24 hours. (Demo — nothing is actually sent.)',
    legal: ['Legal notice', 'Privacy', 'Cookies'],
    rights: '© 2026 SAVERA GT. Fictional brand. All rights reserved.',
    builtBy: 'Demo built by MS Saravia Tech Stack',
  },
}

/* opacidad triangular: sube a→b, mantiene b→c, baja c→d */
const winOp = (p: number, a: number, b: number, c: number, d: number) => {
  if (p <= a || p >= d) return 0
  if (p < b) return (p - a) / (b - a)
  if (p > c) return 1 - (p - c) / (d - c)
  return 1
}

const glassCard: CSSProperties = {
  background: 'linear-gradient(150deg, rgba(26,26,30,.72), rgba(11,11,11,.58))',
  border: '1px solid rgba(255,255,255,.14)',
  borderRadius: 20,
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  boxShadow: '0 30px 80px -40px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.08)',
}

const Social = ({ d, label }: { d: string; label: string }) => (
  <a href="#top" aria-label={label} className="sv-social" style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(245,245,247,.7)' }}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
  </a>
)
const IG = 'M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.3.07 1.68.07 4.9s0 3.6-.07 4.9c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.3.06-1.68.07-4.9.07s-3.6 0-4.9-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.98c-3.15 0-3.52.01-4.76.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7-.06 1.24-.07 1.6-.07 4.76s.01 3.52.07 4.76c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.6.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.6.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32-1.24-.06-1.6-.07-4.76-.07Zm0 3.37a4.45 4.45 0 1 1 0 8.9 4.45 4.45 0 0 1 0-8.9Zm0 7.34a2.89 2.89 0 1 0 0-5.78 2.89 2.89 0 0 0 0 5.78Zm5.66-7.55a1.04 1.04 0 1 1-2.08 0 1.04 1.04 0 0 1 2.08 0Z'
const YT = 'M23.5 6.5a3 3 0 0 0-2.11-2.13C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.39.51A3 3 0 0 0 .5 6.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.5 3 3 0 0 0 2.11 2.13c1.89.51 9.39.51 9.39.51s7.5 0 9.39-.51a3 3 0 0 0 2.11-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z'
const X = 'M18.9 2H22l-7.1 8.1L23.3 22h-6.6l-5.2-6.8L5.6 22H2.5l7.6-8.7L1 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z'
const LI = 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z'

export default function SaveraClient({ lang }: { lang: DemoLang }) {
  const c = CONTENT[lang]
  const rootEl = useRef<HTMLDivElement>(null)
  const trackEl = useRef<HTMLElement>(null)
  const stageEl = useRef<HTMLDivElement>(null)
  const progress = useRef(0)

  const [reduced, setReduced] = useState(false)
  const [mounted, setMounted] = useState(false) // Canvas montado (LCP-safe)
  const [active, setActive] = useState(true) // frameloop on/off por visibilidad
  const [hq, setHq] = useState(true) // calidad alta (desktop) vs. degradada (móvil)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    const host = rootEl.current
    if (!host) return
    const r = host.style
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallOrTouch = window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches
    setReduced(rm)
    setHq(!smallOrTouch)

    // Reduced-motion: sin scroll-driving. Progreso fijo en el hero (auto cerrado),
    // track colapsado a una pantalla, y las fases se muestran como sección normal.
    if (rm) {
      progress.current = 0.02
      setActive(false) // frameloop 'never' → un frame estático, cero rAF permanente
      if (trackEl.current) trackEl.current.style.height = '100svh'
      setMounted(true)
      r.setProperty('--heroText', '1')
      r.setProperty('--hint', '0')
      return
    }

    let ticking = false
    const update = () => {
      const t = trackEl.current
      if (!t) return
      // Altura del stage sticky REAL (svh constante), no innerHeight: en móvil la barra
      // de URL cambia innerHeight a mitad de scroll y desincroniza el progreso.
      const stageH = stageEl.current?.offsetHeight || window.innerHeight
      const total = t.offsetHeight - stageH
      const scrolled = Math.min(Math.max(-t.getBoundingClientRect().top, 0), Math.max(total, 1))
      const p = total > 0 ? scrolled / total : 0
      progress.current = p
      r.setProperty('--heroText', (1 - Math.min(1, p / 0.1)).toFixed(3))
      r.setProperty('--hint', (1 - Math.min(1, p / 0.06)).toFixed(3))
      r.setProperty('--c1', winOp(p, 0.15, 0.21, 0.33, 0.4).toFixed(3))
      r.setProperty('--c2', winOp(p, 0.43, 0.49, 0.61, 0.67).toFixed(3))
      r.setProperty('--c3', winOp(p, 0.68, 0.74, 0.86, 0.93).toFixed(3))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { update(); ticking = false })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    // Monta el Canvas y controla frameloop cuando el stage entra/sale de pantalla.
    const io = new IntersectionObserver(
      (ents) => {
        const vis = ents[0]?.isIntersecting ?? false
        if (vis) setMounted(true)
        setActive(vis)
      },
      { rootMargin: '200px' },
    )
    if (stageEl.current) io.observe(stageEl.current)

    // Reveal progresivo de las secciones normales
    const reveals = [...host.querySelectorAll<HTMLElement>('[data-reveal]')]
    reveals.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)'
    })
    const rio = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          ;(en.target as HTMLElement).style.opacity = '1'
          ;(en.target as HTMLElement).style.transform = 'none'
          rio.unobserve(en.target)
        }
      })
    }, { threshold: 0.14 })
    reveals.forEach((el) => rio.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      io.disconnect()
      rio.disconnect()
    }
  }, [])

  const onSubmit = (e: FormEvent) => {
    // Mock: como el resto de demos, NO cablea envío real. Simula latencia y confirma.
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1100)
  }

  // fallback 0 para las cards de fase (ocultas hasta su ventana); 1 para hero/hint, así el
  // título es visible en el HTML servido antes de que el efecto escriba las vars (LCP inmediato).
  const cardVar = (v: string, fb = 0): CSSProperties => ({ opacity: `var(${v},${fb})` as unknown as number })

  return (
    <div ref={rootEl} id="top" style={{ position: 'relative', background: CARBON, color: CHALK, fontFamily: "'Inter',system-ui,sans-serif", overflowX: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" />
      <style>{`
        @keyframes svDot { 0%{transform:translateY(0);opacity:0} 30%{opacity:1} 70%{opacity:1} 100%{transform:translateY(18px);opacity:0} }
        .sv-social{ transition: color .25s, border-color .25s, background .25s }
        .sv-social:hover{ color:#fff; border-color:${ROSSO}; background:rgba(229,9,20,.12) }
        .sv-cta{ transition: box-shadow .3s, transform .2s, background .3s }
        .sv-cta:hover{ transform:translateY(-2px); box-shadow:0 16px 40px -12px rgba(229,9,20,.7); background:${ROSSO_HOT} }
        .sv-spec{ transition: transform .45s cubic-bezier(.16,1,.3,1), border-color .45s, box-shadow .45s }
        .sv-spec:hover{ transform:translateY(-8px); border-color:rgba(229,9,20,.5); box-shadow:0 26px 60px -30px rgba(229,9,20,.5) }
        .sv-nav a{ transition: color .2s } .sv-nav a:hover{ color:#fff }
        .sv-input{ transition: border-color .2s, background .2s }
        .sv-input:focus{ border-color:${ROSSO}; background:rgba(255,255,255,.05); outline:none }
        .sv-input::placeholder{ color:rgba(245,245,247,.4) }
        @media (max-width:820px){ .sv-desknav{ display:none!important } .sv-menu-btn{ display:flex!important } .sv-phase-card{ right:16px!important; left:16px!important; max-width:none!important } .sv-specgrid{ grid-template-columns:1fr 1fr!important } .sv-contact-grid{ grid-template-columns:1fr!important } }
        @media (min-width:821px){ .sv-menu-btn{ display:none!important } }
      `}</style>

      {/* ---------------- TOP BAR ---------------- */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px clamp(18px,4vw,44px)', background: 'rgba(11,11,11,.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: ROSSO, transform: 'rotate(45deg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 9, height: 9, background: CARBON, transform: 'rotate(-45deg)' }} />
          </span>
          <span style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '.28em', paddingLeft: '.28em', color: CHALK }}>SAVERA</span>
        </a>
        <nav className="sv-nav sv-desknav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#specs" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.models}</a>
          <a href="#specs" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.engineering}</a>
          <a href="#contact" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.experience}</a>
          <a href="#contact" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.contact}</a>
          <a href="#contact" className="sv-cta" style={{ fontSize: 12.5, letterSpacing: '.08em', fontWeight: 600, color: CHALK, background: ROSSO, padding: '11px 22px', borderRadius: 100 }}>{c.cta}</a>
        </nav>
        <button className="sv-menu-btn" onClick={() => setMenuOpen((s) => !s)} aria-label="Menu" aria-expanded={menuOpen} style={{ display: 'none', width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,.14)', color: CHALK, alignItems: 'center', justifyContent: 'center' }}>
          {menuOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>}
        </button>
        {menuOpen && (
          <div style={{ position: 'absolute', top: 62, right: 16, minWidth: 210, ...glassCard, padding: 10, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 90 }}>
            {[c.nav.models, c.nav.engineering, c.nav.experience, c.nav.contact].map((label, i) => (
              <a key={i} href={i < 2 ? '#specs' : '#contact'} onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(245,245,247,.8)', padding: '12px 14px', borderRadius: 10 }}>{label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, textAlign: 'center', fontWeight: 600, color: CHALK, background: ROSSO, padding: '12px', borderRadius: 100, marginTop: 6 }}>{c.cta}</a>
          </div>
        )}
      </header>

      {/* ---------------- ESCENA 3D SCROLL-DRIVEN ---------------- */}
      <section ref={trackEl} style={{ position: 'relative', height: '520svh', background: CARBON }}>
        <div ref={stageEl} style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
          {/* fondo de estudio */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 42%, #1a1a1e 0%, #121212 45%, #0b0b0b 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(40% 30% at 50% 78%, rgba(229,9,20,.14), transparent 70%)`, pointerEvents: 'none' }} />

          {/* Canvas: montado bajo el pliegue por IO. Mientras no está, el hero (texto) ya pinta. */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {mounted && <SaveraScene progress={progress} active={active} hq={hq} />}
          </div>

          {/* viñeta */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(100% 100% at 50% 45%, transparent 55%, rgba(0,0,0,.6) 100%)' }} />

          {/* HERO TEXT */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', padding: '0 20px', ...cardVar('--heroText', 1) }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 'clamp(38px,8.5vw,120px)', letterSpacing: '.14em', paddingLeft: '.14em', lineHeight: 1, color: CHALK, textShadow: '0 6px 50px rgba(0,0,0,.6)' }}>SAVERA GT</div>
            <div style={{ marginTop: 18, fontSize: 'clamp(12px,1.5vw,17px)', letterSpacing: '.42em', textTransform: 'uppercase', color: ROSSO }}>{c.heroTagline}</div>
            <p style={{ maxWidth: 560, margin: '26px auto 0', fontSize: 'clamp(14px,1.4vw,16px)', lineHeight: 1.75, color: 'rgba(245,245,247,.66)', fontWeight: 300 }}>{c.heroSub}</p>
            <div style={{ marginTop: 14, fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.3em', color: 'rgba(245,245,247,.5)' }}>{c.heroModel}</div>
          </div>

          {/* SCROLL HINT */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, pointerEvents: 'none', ...cardVar('--hint', 1) }}>
            <span style={{ fontSize: 10.5, letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(245,245,247,.7)' }}>{c.scrollHint}</span>
            <div style={{ width: 24, height: 40, border: '1px solid rgba(245,245,247,.4)', borderRadius: 14, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '50%', top: 7, transform: 'translateX(-50%)', width: 3, height: 7, borderRadius: 3, background: ROSSO, animation: 'svDot 1.8s ease-in-out infinite' }} />
            </div>
          </div>

          {/* PHASE CARDS (glassmorphism, opacidad por CSS var — no re-render) */}
          {!reduced && c.phases.map((ph, i) => (
            <div key={i} className="sv-phase-card" style={{ position: 'absolute', right: 'clamp(20px,5vw,72px)', top: '50%', transform: 'translateY(-50%)', maxWidth: 380, width: '42vw', padding: 30, ...glassCard, pointerEvents: 'none', ...cardVar(['--c1', '--c2', '--c3'][i]) }}>
              <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 10.5, letterSpacing: '.24em', color: ROSSO, marginBottom: 16 }}>{ph.badge}</div>
              <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 600, lineHeight: 1.1, margin: '0 0 14px', letterSpacing: '-.01em' }}>{ph.title}</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,245,247,.7)', fontWeight: 300, margin: '0 0 22px' }}>{ph.body}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 18 }}>
                {ph.specs.map((s) => (
                  <div key={s.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
                    <span style={{ fontSize: 12.5, color: 'rgba(245,245,247,.5)', letterSpacing: '.03em' }}>{s.k}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: CHALK }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reduced-motion: fases como sección estática normal (sin overlay animado) */}
      {reduced && (
        <section style={{ padding: '80px clamp(18px,5vw,44px)', background: '#0e0e10' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {c.phases.map((ph, i) => (
              <div key={i} style={{ padding: 30, ...glassCard }}>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 10.5, letterSpacing: '.24em', color: ROSSO, marginBottom: 16 }}>{ph.badge}</div>
                <h2 style={{ fontSize: 26, fontWeight: 600, margin: '0 0 14px' }}>{ph.title}</h2>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,245,247,.7)', fontWeight: 300, margin: 0 }}>{ph.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- SPECS GRID ---------------- */}
      <section id="specs" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: 'linear-gradient(180deg,#0b0b0b,#111114)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.specsEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 16px', maxWidth: '16ch' }}>{c.specsTitle}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 520, margin: 0 }}>{c.specsSub}</p>
          </div>
          <div className="sv-specgrid" data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {c.specCards.map((s) => (
              <div key={s.label} className="sv-spec" style={{ padding: 28, borderRadius: 18, background: 'linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))', border: '1px solid rgba(255,255,255,.1)', minHeight: 220, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 10.5, letterSpacing: '.2em', color: 'rgba(245,245,247,.55)', marginBottom: 'auto' }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 24 }}>
                  <span style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 'clamp(34px,4.4vw,50px)', color: CHALK, lineHeight: 1 }}>{s.value}</span>
                </div>
                <div style={{ fontSize: 13, color: ROSSO, fontWeight: 500, marginTop: 8, letterSpacing: '.02em' }}>{s.unit}</div>
                <div style={{ fontSize: 13, color: 'rgba(245,245,247,.5)', marginTop: 12, lineHeight: 1.5, fontWeight: 300 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTACTO VIP ---------------- */}
      <section id="contact" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: '#0b0b0b', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle,rgba(229,9,20,.16),transparent 68%)', pointerEvents: 'none' }} />
        <div className="sv-contact-grid" data-reveal style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.contactEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,52px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.06, margin: '0 0 20px' }}>{c.contactTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(245,245,247,.62)', fontWeight: 300, maxWidth: 440 }}>{c.contactSub}</p>
          </div>

          {status === 'sent' ? (
            <div style={{ ...glassCard, padding: 'clamp(32px,4vw,48px)', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(229,9,20,.14)', border: `1px solid ${ROSSO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ROSSO} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 12px' }}>{c.sent}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(245,245,247,.65)', fontWeight: 300, margin: 0 }}>{c.sentNote}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ ...glassCard, padding: 'clamp(26px,3.4vw,40px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="sv-input" required placeholder={c.form.name} style={inputStyle} />
                <input className="sv-input" required type="email" placeholder={c.form.email} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="sv-input" placeholder={c.form.phone} style={inputStyle} />
                <input className="sv-input" placeholder={c.form.dealer} style={inputStyle} />
              </div>
              <textarea className="sv-input" rows={4} placeholder={c.form.message} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              <button type="submit" disabled={status === 'sending'} className="sv-cta" style={{ marginTop: 6, padding: 16, borderRadius: 100, background: ROSSO, color: CHALK, fontSize: 14, fontWeight: 600, letterSpacing: '.06em', fontFamily: "'Syncopate',sans-serif" }}>
                {status === 'sending' ? c.sending : c.send}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,.07)', padding: 'clamp(48px,6vw,72px) clamp(18px,5vw,44px) 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: ROSSO, transform: 'rotate(45deg)' }} />
            <span style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '.26em', paddingLeft: '.26em' }}>SAVERA GT</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {c.legal.map((l) => (
              <a key={l} href="#top" style={{ fontSize: 13, color: 'rgba(245,245,247,.55)' }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Social d={IG} label="Instagram" />
            <Social d={YT} label="YouTube" />
            <Social d={X} label="X" />
            <Social d={LI} label="LinkedIn" />
          </div>
        </div>
        <div style={{ maxWidth: 1180, margin: '34px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', fontSize: 12.5, color: 'rgba(245,245,247,.4)' }}>
          <span>{c.rights}</span>
          <span>{c.builtBy}</span>
        </div>
      </footer>
    </div>
  )
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(255,255,255,.03)',
  border: '1px solid rgba(255,255,255,.13)',
  borderRadius: 12,
  color: '#f5f5f7',
  fontSize: 14,
  fontFamily: "'Inter',sans-serif",
}
