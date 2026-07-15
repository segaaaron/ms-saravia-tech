'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { DemoLang } from '../lang'

/* ============================================================
   ROMÁN & ASHFORD — Abogados (demo). Port nativo Next.js del
   diseño original .dc.html. Bilingüe (es/en) según el sitio.
   Assets locales viven en /showcase/img (public).
   ============================================================ */

// opacity con calc/clamp → CSS acepta string, React tipa number
const op = (v: string) => v as unknown as CSSProperties['opacity']

// Datos estructurales (no traducibles): índice, retraso, imágenes, nombres.
const AREA_META = [
  { n: '01', delay: undefined as string | undefined },
  { n: '02', delay: '60' },
  { n: '03', delay: '120' },
  { n: '04', delay: '180' },
  { n: '05', delay: undefined },
  { n: '06', delay: '60' },
  { n: '07', delay: '120' },
  { n: '08', delay: '180' },
]

const ATTORNEY_META = [
  { name: 'Alejandro Román', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80', delay: undefined as string | undefined },
  { name: 'Katherine Ashford', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80', delay: '120' },
  { name: 'Diego Fuentes', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', delay: '240' },
]

const PROCESS_META = [
  { n: '01', delay: undefined as string | undefined },
  { n: '02', delay: '80' },
  { n: '03', delay: '160' },
  { n: '04', delay: '240' },
]

const TESTIMONIAL_META = [
  { name: 'Grupo Meridiano', delay: undefined as string | undefined },
  { name: 'María Elena V.', delay: '120' },
  { name: 'Daniel R.', delay: '240' },
]

const RECOGNITIONS = ['Chambers', 'The Legal 500', 'Best Lawyers', 'Latin Lawyer', "Who's Who Legal"]

const cardBase: CSSProperties = { background: 'linear-gradient(180deg,#0f141b,#0b0e13)', padding: '34px 28px', minHeight: 230, display: 'flex', flexDirection: 'column', gap: 24, border: '1px solid rgba(255,255,255,.07)', borderRadius: 3, position: 'relative', overflow: 'hidden', transition: 'transform .5s cubic-bezier(.2,.7,.2,1),border-color .5s,box-shadow .5s' }

const navLink: CSSProperties = { fontSize: 13, letterSpacing: '.05em', color: 'rgba(236,231,221,.72)', textDecoration: 'none' }
const inputBase: CSSProperties = { padding: '15px 16px', background: '#0c0f14', border: '1px solid rgba(255,255,255,.12)', color: '#ece7dd', fontSize: 14, fontFamily: "'Manrope',sans-serif", outline: 'none' }

type Content = {
  attorneysAtLaw: string
  since: string
  heroHeadline: string
  heroSub: string
  bookConsult: string
  practiceAreasCta: string
  statYears: string
  statCasesWon: string
  statSuccess: string
  scrollHint: string
  nav: { firm: string; practice: string; attorneys: string; results: string; contact: string }
  firmEyebrow: string
  firmTitle: string
  firmP1: string
  firmP2: string
  firmStatRecovered: string
  firmStatAttorneys: string
  firmBadgeTitle: string
  firmBadgeDesc: string
  areasEyebrow: string
  areasTitle: string
  areasNote: string
  areas: { t: string; d: string }[]
  casosEyebrow: string
  casosTitle: string
  casosStats: string[]
  abogadosEyebrow: string
  abogadosTitle: string
  attorneys: { role: string; d: string }[]
  procesoEyebrow: string
  procesoTitle: string
  process: { t: string; d: string }[]
  testimonialsTitle: string
  testimonials: { q: string; role: string }[]
  recognizedBy: string
  faqEyebrow: string
  faqTitle: string
  faqs: { q: string; a: string }[]
  consultaEyebrow: string
  consultaTitle: string
  consultaSub: string
  directLine: string
  emailLabel: string
  formName: string
  formEmail: string
  formPhone: string
  formAreaPlaceholder: string
  formMessage: string
  formSubmit: string
  formDisclaimer: string
  contactEyebrow: string
  contactTitle: string
  addrLabel: string
  addr: string
  hoursLabel: string
  hours: string
  contactLabel: string
  getDirections: string
  footerTagline: string
  footerRights: string
  waIntro: string
  numLocale: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    attorneysAtLaw: 'Abogados',
    since: 'Desde 1998 · Ciudad de México',
    heroHeadline: 'Defendemos lo que más le importa.',
    heroSub: 'Una firma de servicio integral con 25 años representando a personas y empresas con rigor, discreción y resultados.',
    bookConsult: 'Agendar consulta',
    practiceAreasCta: 'Áreas de práctica',
    statYears: 'Años',
    statCasesWon: 'Casos ganados',
    statSuccess: 'de éxito',
    scrollHint: 'Desliza para salir',
    nav: { firm: 'La Firma', practice: 'Áreas', attorneys: 'Abogados', results: 'Casos', contact: 'Contacto' },
    firmEyebrow: 'La Firma',
    firmTitle: 'Una tradición de excelencia, una obsesión por los resultados.',
    firmP1: 'Fundada en 1998, Román & Ashford reúne a abogados reconocidos en sus áreas. Combinamos un profundo conocimiento jurídico con un enfoque personal, discreto y estratégico en cada asunto.',
    firmP2: 'Representamos a personas, familias y empresas ante todo tribunal y autoridad, con la seriedad que su caso merece.',
    firmStatRecovered: 'Recuperados para clientes',
    firmStatAttorneys: 'Abogados',
    firmBadgeTitle: 'Rigor y discreción',
    firmBadgeDesc: 'Cada caso es atendido por un socio senior.',
    areasEyebrow: 'Áreas de práctica',
    areasTitle: 'Asesoría integral, experiencia real.',
    areasNote: 'Ocho áreas de práctica cubiertas por socios especializados.',
    areas: [
      { t: 'Corporativo y Mercantil', d: 'Constitución, contratos, fusiones y gobierno corporativo.' },
      { t: 'Migratorio', d: 'Visas, residencia, ciudadanía y movilidad corporativa.' },
      { t: 'Laboral', d: 'Conflictos individuales y colectivos, cumplimiento y asesoría.' },
      { t: 'Propiedad Intelectual', d: 'Marcas, patentes, derechos de autor y litigio.' },
      { t: 'Litigio Civil', d: 'Disputas complejas, daños y ejecución de sentencias.' },
      { t: 'Familiar', d: 'Divorcios, custodia, sucesiones y mediación.' },
      { t: 'Penal', d: 'Defensa estratégica en todo proceso penal.' },
      { t: 'Fiscal', d: 'Planeación, auditorías y litigio fiscal.' },
    ],
    casosEyebrow: 'Casos y resultados',
    casosTitle: 'Un historial que habla por sí solo.',
    casosStats: ['Casos ganados', 'Recuperados', 'Tasa de éxito', 'Años de práctica'],
    abogadosEyebrow: 'Nuestros abogados',
    abogadosTitle: 'Dirigidos por socios de reconocido prestigio.',
    attorneys: [
      { role: 'Socio Fundador · Corporativo', d: '30 años asesorando a empresas en transacciones complejas y gobierno corporativo.' },
      { role: 'Socia Directora · Litigio', d: 'Litigante de referencia en disputas civiles y mercantiles de alto impacto.' },
      { role: 'Socio · Migratorio y Penal', d: 'Especialista en asuntos migratorios y defensa penal estratégica.' },
    ],
    procesoEyebrow: 'Nuestro proceso',
    procesoTitle: 'Claridad desde la primera reunión.',
    process: [
      { t: 'Consulta confidencial', d: 'Escuchamos su caso con total discreción y sin compromiso.' },
      { t: 'Análisis y estrategia', d: 'Estudiamos cada detalle y diseñamos un plan de acción claro.' },
      { t: 'Representación', d: 'Le representamos con firmeza ante toda autoridad y tribunal.' },
      { t: 'Resolución', d: 'Buscamos el mejor resultado posible y protegemos sus intereses.' },
    ],
    testimonialsTitle: 'Lo que dicen nuestros clientes.',
    testimonials: [
      { q: 'Resolvieron una disputa corporativa que parecía imposible. Estrategia y comunicación impecables.', role: 'Cliente corporativo' },
      { q: 'Me sentí acompañada en cada paso de mi caso. Humanos, profesionales y efectivos.', role: 'Derecho familiar' },
      { q: 'Obtuvieron mi residencia en tiempo récord. Guía clara desde el primer día.', role: 'Migratorio' },
    ],
    recognizedBy: 'Reconocidos por',
    faqEyebrow: 'Preguntas frecuentes',
    faqTitle: 'Respuestas antes de comenzar.',
    faqs: [
      { q: '¿La primera consulta tiene costo?', a: 'La primera consulta es confidencial y sin costo, sin ningún compromiso.' },
      { q: '¿Cómo se estructuran los honorarios?', a: 'Ofrecemos cuotas fijas, por hora o esquemas por resultado según el asunto. Todo se acuerda por escrito de antemano.' },
      { q: '¿Atienden casos fuera de la Ciudad de México?', a: 'Sí. Litigamos en todo el país y coordinamos asuntos internacionales con firmas aliadas.' },
      { q: '¿Mi información se mantiene confidencial?', a: 'Absolutamente. El secreto profesional protege cada conversación desde el primer contacto.' },
      { q: '¿Qué tan rápido pueden atenderme?', a: 'Los asuntos urgentes se atienden en menos de 24 horas. Agende una consulta y le confirmamos de inmediato.' },
    ],
    consultaEyebrow: 'Agendar consulta',
    consultaTitle: 'Cuéntenos su caso.',
    consultaSub: 'Complete el formulario y un socio le contactará en menos de 24 horas. Confidencial y sin compromiso.',
    directLine: 'Línea directa',
    emailLabel: 'Correo',
    formName: 'Nombre completo',
    formEmail: 'Correo',
    formPhone: 'Teléfono',
    formAreaPlaceholder: 'Área de interés',
    formMessage: 'Describa brevemente su caso',
    formSubmit: 'Solicitar consulta',
    formDisclaimer: 'Su información está protegida por el secreto profesional.',
    contactEyebrow: 'Visítenos',
    contactTitle: 'Oficinas y contacto',
    addrLabel: 'Dirección',
    addr: 'Torre Reforma, Av. Paseo de la Reforma 483, Piso 32|Cuauhtémoc, CDMX',
    hoursLabel: 'Horario',
    hours: 'Lun – Vie · 9:00 – 19:00',
    contactLabel: 'Contacto',
    getDirections: 'Cómo llegar →',
    footerTagline: 'Abogados · Ciudad de México',
    footerRights: '© 2026 Román & Ashford. Todos los derechos reservados.',
    waIntro: 'Hola Roman & Ashford, quiero agendar una consulta.',
    numLocale: 'es-MX',
  },
  en: {
    attorneysAtLaw: 'Attorneys at Law',
    since: 'Since 1998 · Mexico City',
    heroHeadline: 'We defend what matters most to you.',
    heroSub: 'A full-service firm with 25 years representing individuals and companies with rigor, discretion and results.',
    bookConsult: 'Book a consultation',
    practiceAreasCta: 'Practice areas',
    statYears: 'Years',
    statCasesWon: 'Cases won',
    statSuccess: 'Success rate',
    scrollHint: 'Scroll to step outside',
    nav: { firm: 'Firm', practice: 'Practice', attorneys: 'Attorneys', results: 'Results', contact: 'Contact' },
    firmEyebrow: 'The Firm',
    firmTitle: 'A tradition of excellence, an obsession with results.',
    firmP1: 'Founded in 1998, Román & Ashford brings together attorneys recognized in their fields. We combine deep legal knowledge with a personal, discreet and strategic approach to each matter.',
    firmP2: 'We represent individuals, families and companies before every court and authority, with the seriousness your case deserves.',
    firmStatRecovered: 'Recovered for clients',
    firmStatAttorneys: 'Attorneys',
    firmBadgeTitle: 'Rigor & discretion',
    firmBadgeDesc: 'Every case is handled by a senior partner.',
    areasEyebrow: 'Practice areas',
    areasTitle: 'Comprehensive counsel, real expertise.',
    areasNote: 'Eight practice areas covered by specialized partners.',
    areas: [
      { t: 'Corporate & Commercial', d: 'Incorporation, contracts, M&A and corporate governance.' },
      { t: 'Immigration', d: 'Visas, residency, citizenship and corporate mobility.' },
      { t: 'Labor & Employment', d: 'Individual and collective disputes, compliance and advisory.' },
      { t: 'Intellectual Property', d: 'Trademarks, patents, copyright and litigation.' },
      { t: 'Civil Litigation', d: 'Complex disputes, damages and enforcement.' },
      { t: 'Family Law', d: 'Divorce, custody, inheritance and mediation.' },
      { t: 'Criminal Defense', d: 'Strategic defense in all criminal proceedings.' },
      { t: 'Tax', d: 'Planning, audits and tax litigation.' },
    ],
    casosEyebrow: 'Results',
    casosTitle: 'A record that speaks for itself.',
    casosStats: ['Cases won', 'Recovered', 'Success rate', 'Years of practice'],
    abogadosEyebrow: 'Attorneys',
    abogadosTitle: 'Led by partners of recognized prestige.',
    attorneys: [
      { role: 'Founding Partner · Corporate', d: '30 years advising companies on complex transactions and governance.' },
      { role: 'Managing Partner · Litigation', d: 'A leading litigator in high-stakes civil and commercial disputes.' },
      { role: 'Partner · Immigration & Criminal', d: 'Specialist in immigration matters and strategic criminal defense.' },
    ],
    procesoEyebrow: 'Our process',
    procesoTitle: 'Clear from the first meeting.',
    process: [
      { t: 'Confidential consultation', d: 'We listen to your case with total discretion and no commitment.' },
      { t: 'Analysis & strategy', d: 'We study every detail and design a clear plan of action.' },
      { t: 'Representation', d: 'We represent you firmly before every authority and court.' },
      { t: 'Resolution', d: 'We pursue the best possible outcome and protect your interests.' },
    ],
    testimonialsTitle: 'What our clients say.',
    testimonials: [
      { q: 'They resolved a corporate dispute that seemed impossible. Impeccable strategy and communication.', role: 'Corporate client' },
      { q: 'I felt accompanied at every step of my case. Human, professional and effective.', role: 'Family law' },
      { q: 'They obtained my residency in record time. Clear guidance from day one.', role: 'Immigration' },
    ],
    recognizedBy: 'Recognized by',
    faqEyebrow: 'FAQ',
    faqTitle: 'Answers before we begin.',
    faqs: [
      { q: 'Does the first consultation have a cost?', a: 'The first consultation is confidential and free of charge, with no obligation.' },
      { q: 'How are your fees structured?', a: 'We offer flat fees, hourly rates or success-based schemes depending on the matter. Everything is agreed in writing beforehand.' },
      { q: 'Do you handle cases outside Mexico City?', a: 'Yes. We litigate nationwide and coordinate international matters with allied firms.' },
      { q: 'Is my information kept confidential?', a: 'Absolutely. Attorney–client privilege protects every conversation from the first contact.' },
      { q: 'How soon can I be seen?', a: 'Urgent matters are attended within 24 hours. Book a consultation and we will confirm right away.' },
    ],
    consultaEyebrow: 'Book a consultation',
    consultaTitle: 'Tell us about your case.',
    consultaSub: 'Complete the form and a partner will contact you within 24 hours. Confidential and no obligation.',
    directLine: 'Direct line',
    emailLabel: 'Email',
    formName: 'Full name',
    formEmail: 'Email',
    formPhone: 'Phone',
    formAreaPlaceholder: 'Area of interest',
    formMessage: 'Briefly describe your case',
    formSubmit: 'Request consultation',
    formDisclaimer: 'Your information is protected by attorney–client privilege.',
    contactEyebrow: 'Visit us',
    contactTitle: 'Offices & contact',
    addrLabel: 'Address',
    addr: 'Torre Reforma, Av. Paseo de la Reforma 483, Floor 32|Cuauhtémoc, Mexico City',
    hoursLabel: 'Hours',
    hours: 'Mon – Fri · 9:00 – 19:00',
    contactLabel: 'Contact',
    getDirections: 'Get directions →',
    footerTagline: 'Attorneys at Law · Mexico City',
    footerRights: '© 2026 Román & Ashford. All rights reserved.',
    waIntro: 'Hello Roman & Ashford, I would like a consultation.',
    numLocale: 'en-US',
  },
}

export default function RomanClient({ lang }: { lang: DemoLang }) {
  const c = CONTENT[lang]
  const rootEl = useRef<HTMLDivElement>(null)
  const navEl = useRef<HTMLElement>(null)
  const stageEl = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const root = rootEl.current
    if (!root) return

    // scroll reveal
    const els = [...root.querySelectorAll<HTMLElement>('[data-reveal]')]
    els.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(34px)'
      el.style.transition = 'opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1)'
    })
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          const el = en.target as HTMLElement
          el.style.transitionDelay = parseFloat(el.dataset.delay || '0') + 'ms'
          el.style.opacity = '1'
          el.style.transform = 'none'
          io.unobserve(el)
        }
      })
    }, { threshold: 0.14 })
    els.forEach((el) => io.observe(el))

    // counters
    const numLocale = CONTENT[lang].numLocale
    const runCount = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count || '0')
      const suf = el.dataset.suffix || ''
      const pre = el.dataset.prefix || ''
      const dur = 1500
      const t0 = performance.now()
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur)
        const e = 1 - Math.pow(1 - p, 3)
        el.textContent = pre + Math.round(target * e).toLocaleString(numLocale) + suf
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    const cio = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) { runCount(en.target as HTMLElement); cio.unobserve(en.target) }
      })
    }, { threshold: 0.5 })
    root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => cio.observe(el))

    // parallax + nav bg
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        root.style.setProperty('--sy', y.toFixed(1))
        const it = document.getElementById('introTrack')
        if (it) {
          // Altura del stage sticky REAL (svh constante), no window.innerHeight: evita que la
          // barra de URL móvil desincronice el progreso y haga saltar la apertura de puertas.
          const stageH = stageEl.current?.offsetHeight || window.innerHeight
          const tot = it.offsetHeight - stageH
          const sc = Math.min(Math.max(-it.getBoundingClientRect().top, 0), Math.max(tot, 1))
          root.style.setProperty('--intro', (tot > 0 ? sc / tot : 0).toFixed(4))
        }
        const nav = navEl.current
        if (nav) {
          nav.style.background = y > 60 ? 'rgba(10,13,18,.9)' : 'rgba(10,13,18,0)'
          nav.style.borderBottomColor = y > 60 ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,0)'
          nav.style.backdropFilter = y > 60 ? 'blur(14px)' : 'none'
        }
        ticking = false
      })
    }
    // Reduced-motion: sin scroll-hijack. Poster estático (puertas cerradas + marca visible en
    // --intro 0.3) y colapsa el track a una pantalla. Los reveals quedan instantáneos por el
    // reset CSS de reduced-motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const it = document.getElementById('introTrack')
      if (it) it.style.height = '100svh'
      root.style.setProperty('--intro', '0.3')
      root.style.setProperty('--sy', '0')
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      cio.disconnect()
    }
  }, [lang])

  const toggleFaq = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    const item = btn.parentElement
    if (!item) return
    const ans = item.querySelector<HTMLElement>('[data-answer]')
    const icon = btn.querySelector<HTMLElement>('[data-icon]')
    if (!ans) return
    const open = !!ans.style.maxHeight && ans.style.maxHeight !== '0px'
    ans.style.maxHeight = open ? '0px' : ans.scrollHeight + 20 + 'px'
    if (icon) icon.style.transform = open ? 'rotate(0deg)' : 'rotate(45deg)'
  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    const g = (n: string) => {
      const el = f.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[name="' + n + '"]')
      return el ? el.value : ''
    }
    const msg = c.waIntro
      + '\n' + g('nombre') + '\n' + g('area') + '\n' + g('telefono') + '\n' + g('mensaje')
    window.open('https://wa.me/525599887766?text=' + encodeURIComponent(msg), '_blank')
  }

  // overflow-x: CLIP (no 'hidden') — 'hidden' convierte a #top en contenedor de scroll
  // y ROMPE el position:sticky del intro cinemático (las puertas se abrían fuera de
  // pantalla → solo se veía negro). 'clip' recorta el overflow horizontal sin crear
  // scroll container, así el sticky se ancla al viewport.
  return (
    <div ref={rootEl} id="top" style={{ position: 'relative', background: '#0c0f14', color: '#ece7dd', fontFamily: "'Manrope',system-ui,sans-serif", WebkitFontSmoothing: 'antialiased', overflowX: 'clip' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes kenBurns { 0%{ transform:scale(1.02) translate(0,0);} 100%{ transform:scale(1.16) translate(-1.5%,-1.5%);} }
        @keyframes scrollDot { 0%{ transform:translateY(0); opacity:0;} 30%{opacity:1;} 70%{opacity:1;} 100%{ transform:translateY(18px); opacity:0;} }
        .ra-nav:hover{ color:#ece7dd; }
        .ra-gold:hover{ background:#d9c088; }
        .ra-outline:hover{ border-color:#c2a15a; }
        .ra-card:hover{ transform:translateY(-6px); border-color:rgba(194,161,90,.45); box-shadow:0 22px 45px -25px rgba(0,0,0,.85); }
        .ra-att:hover{ filter:grayscale(0); transform:scale(1.04); }
        .ra-maps:hover{ background:#1a1f28; }
        .ra-form-input::selection{ background:#c2a15a; color:#0c0f14; }
      `}</style>

      {/* CINEMATIC INTRO (scroll-driven): the court doors open and you step outside */}
      <section id="introTrack" style={{ position: 'relative', height: '280svh', background: '#0c0f14', zIndex: 5 }}>
        <div ref={stageEl} style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
          {/* EXTERIOR: al abrirse las puertas se "sale a la calle" y se ven los edificios. */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><div style={{ position: 'absolute', inset: '-8%', background: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1900&q=80) center/cover', animation: 'kenBurns 26s ease-in-out infinite alternate' }} /></div>
          {/* Gradiente ligero: revela los edificios (antes .66→.9 los tapaba en negro) y aún da legibilidad al texto abajo. */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,11,16,.34) 0%, rgba(8,11,16,.24) 45%, rgba(8,11,16,.86) 100%)' }} />

          <div style={{ position: 'absolute', inset: 0, transform: 'scale(calc(1 + var(--intro,0) * 0.55))' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '51%', height: '100%', overflow: 'hidden', transform: 'translateX(calc(clamp(0, calc((var(--intro,0) - 0.48) / 0.5), 1) * -103%))', willChange: 'transform' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: '196%', height: '100%', background: 'url(/showcase/img/corte-corredor.webp) center/cover' }} />
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0, width: '51%', height: '100%', overflow: 'hidden', transform: 'translateX(calc(clamp(0, calc((var(--intro,0) - 0.48) / 0.5), 1) * 103%))', willChange: 'transform' }}>
              <div style={{ position: 'absolute', right: 0, top: 0, width: '196%', height: '100%', background: 'url(/showcase/img/corte-corredor.webp) center/cover' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 46%, rgba(255,247,225,0) 12%, rgba(12,15,20,.32) 60%, rgba(12,15,20,.82) 100%)', opacity: op('clamp(0, calc((0.5 - var(--intro,0)) / 0.5), 1)') }} />
          </div>

          <div style={{ position: 'absolute', left: 0, right: 0, top: '44%', transform: 'translateY(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: op('min(clamp(0, calc(var(--intro,0) / 0.14), 1), clamp(0, calc((0.5 - var(--intro,0)) / 0.16), 1))') }}>
            <div style={{ width: 66, height: 66, margin: '0 auto 18px', border: '1px solid #c2a15a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: 30, color: '#c2a15a' }}>R&amp;A</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(26px,4vw,44px)', letterSpacing: '.2em', color: '#f3efe8' }}>ROMÁN &amp; ASHFORD</div>
            <div style={{ fontSize: 11, letterSpacing: '.4em', color: '#c2a15a', textTransform: 'uppercase', marginTop: 10 }}>{c.attorneysAtLaw}</div>
          </div>

          <div style={{ position: 'absolute', inset: 0, zIndex: 3, opacity: op('clamp(0, calc((var(--intro,0) - 0.74) / 0.24), 1)'), transform: 'translateY(calc((1 - clamp(0, calc((var(--intro,0) - 0.74) / 0.24), 1)) * 34px))' }}>
            <div style={{ height: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
                <span style={{ width: 46, height: 1, background: '#c2a15a' }} />
                <span style={{ fontSize: 12, letterSpacing: '.42em', color: '#c2a15a', textTransform: 'uppercase' }}>{c.since}</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(46px,7vw,104px)', lineHeight: 1.02, fontWeight: 500, color: '#f3efe8', margin: 0, maxWidth: '15ch', textWrap: 'balance' as CSSProperties['textWrap'] }}>{c.heroHeadline}</h1>
              <p style={{ maxWidth: 520, fontSize: 17, lineHeight: 1.7, color: 'rgba(236,231,221,.72)', margin: '28px 0 0', fontWeight: 300 }}>{c.heroSub}</p>
              <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
                <a href="#consulta" className="ra-gold" style={{ fontSize: 14, letterSpacing: '.05em', color: '#0c0f14', background: '#c2a15a', padding: '16px 30px', textDecoration: 'none', fontWeight: 600 }}>{c.bookConsult}</a>
                <a href="#areas" className="ra-outline" style={{ fontSize: 14, letterSpacing: '.05em', color: '#ece7dd', border: '1px solid rgba(255,255,255,.28)', padding: '16px 30px', textDecoration: 'none', fontWeight: 500 }}>{c.practiceAreasCta}</a>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTop: '1px solid rgba(255,255,255,.1)', background: 'rgba(8,11,16,.4)', backdropFilter: 'blur(6px)' }}>
              <div style={{ maxWidth: 1200, margin: '0 auto', padding: '22px 40px', display: 'flex', flexWrap: 'wrap', gap: 44 }}>
                <div><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, color: '#c2a15a' }}><span data-count="25">0</span></span> <span style={{ fontSize: 12, color: '#8a93a2', letterSpacing: '.05em' }}>{c.statYears}</span></div>
                <div><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, color: '#c2a15a' }}><span data-count="500" data-suffix="+">0</span></span> <span style={{ fontSize: 12, color: '#8a93a2', letterSpacing: '.05em' }}>{c.statCasesWon}</span></div>
                <div><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, color: '#c2a15a' }}><span data-count="98" data-suffix="%">0</span></span> <span style={{ fontSize: 12, color: '#8a93a2', letterSpacing: '.05em' }}>{c.statSuccess}</span></div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', opacity: op('clamp(0, calc((0.3 - var(--intro,0)) / 0.3), 1)') }}>
            <div style={{ fontSize: 10, letterSpacing: '.34em', color: 'rgba(236,231,221,.6)', textTransform: 'uppercase', marginBottom: 9 }}>{c.scrollHint}</div>
            <div style={{ width: 22, height: 36, margin: '0 auto', border: '1px solid rgba(236,231,221,.35)', borderRadius: 14, position: 'relative' }}><span style={{ position: 'absolute', left: '50%', top: 7, transform: 'translateX(-50%)', width: 3, height: 7, borderRadius: 3, background: '#c2a15a', animation: 'scrollDot 1.8s ease-in-out infinite' }} /></div>
          </div>
        </div>
      </section>

      {/* ===================== NAV ===================== */}
      <header ref={navEl} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid rgba(255,255,255,0)', transition: 'background .5s, border-color .5s' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 13, textDecoration: 'none' }}>
          <span style={{ width: 38, height: 38, border: '1px solid #c2a15a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: '#c2a15a', letterSpacing: '.02em' }}>R&amp;A</span>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, letterSpacing: '.14em', color: '#ece7dd' }}>ROMÁN &amp; ASHFORD</span>
            <span style={{ fontSize: 9, letterSpacing: '.34em', color: '#8a93a2', textTransform: 'uppercase' }}>{c.attorneysAtLaw}</span>
          </span>
        </a>
        {/* Navegación inline (desktop) */}
        <nav className="dnav-hide" style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
          <a href="#firma" className="ra-nav" style={navLink}>{c.nav.firm}</a>
          <a href="#areas" className="ra-nav" style={navLink}>{c.nav.practice}</a>
          <a href="#abogados" className="ra-nav" style={navLink}>{c.nav.attorneys}</a>
          <a href="#casos" className="ra-nav" style={navLink}>{c.nav.results}</a>
          <a href="#contacto" className="ra-nav" style={navLink}>{c.nav.contact}</a>
          <a href="#consulta" className="ra-gold" style={{ fontSize: 12, letterSpacing: '.08em', color: '#0c0f14', background: '#c2a15a', padding: '11px 20px', textDecoration: 'none', fontWeight: 600 }}>{c.bookConsult}</a>
        </nav>
        {/* Menú hamburguesa (móvil) */}
        <div className="dnav-only" style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            style={{ width: 42, height: 42, borderRadius: 6, border: '1px solid rgba(194,161,90,.5)', background: 'rgba(12,15,20,.35)', color: '#ece7dd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, lineHeight: 1 }}
          >
            {menuOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>}
          </button>
          {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 69 }} />}
          {menuOpen && (
            <div style={{ position: 'absolute', top: 54, right: 0, minWidth: 230, background: '#12161d', border: '1px solid rgba(194,161,90,.28)', borderRadius: 8, boxShadow: '0 26px 56px -20px rgba(0,0,0,.7)', padding: 10, zIndex: 70, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <a href="#firma" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 6 }}>{c.nav.firm}</a>
              <a href="#areas" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 6 }}>{c.nav.practice}</a>
              <a href="#abogados" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 6 }}>{c.nav.attorneys}</a>
              <a href="#casos" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 6 }}>{c.nav.results}</a>
              <a href="#contacto" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 6 }}>{c.nav.contact}</a>
              <a href="#consulta" onClick={() => setMenuOpen(false)} style={{ fontSize: 12, letterSpacing: '.08em', color: '#0c0f14', background: '#c2a15a', padding: '13px 16px', textDecoration: 'none', fontWeight: 600, borderRadius: 6, textAlign: 'center', marginTop: 6 }}>{c.bookConsult}</a>
            </div>
          )}
        </div>
      </header>

      {/* ===================== SOBRE LA FIRMA ===================== */}
      <section id="firma" style={{ background: '#f3efe8', color: '#1a1c20', padding: '130px 40px' }}>
        <div className="dcol-2" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div data-reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
              <span style={{ fontSize: 12, letterSpacing: '.34em', color: '#a07f47', textTransform: 'uppercase' }}>{c.firmEyebrow}</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4.2vw,58px)', lineHeight: 1.1, fontWeight: 500, margin: '0 0 26px', textWrap: 'balance' as CSSProperties['textWrap'] }}>{c.firmTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#4a4e54', fontWeight: 300, margin: '0 0 22px' }}>{c.firmP1}</p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#4a4e54', fontWeight: 300, margin: '0 0 34px' }}>{c.firmP2}</p>
            <div style={{ display: 'flex', gap: 48, borderTop: '1px solid rgba(20,25,30,.12)', paddingTop: 28 }}>
              <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, color: '#1a1c20' }}><span data-count="120" data-prefix="$" data-suffix="M">0</span></div><div style={{ fontSize: 13, color: '#7a7f86', marginTop: 2 }}>{c.firmStatRecovered}</div></div>
              <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, color: '#1a1c20' }}><span data-count="40" data-suffix="+">0</span></div><div style={{ fontSize: 13, color: '#7a7f86', marginTop: 2 }}>{c.firmStatAttorneys}</div></div>
            </div>
          </div>
          <div data-reveal data-delay="120" style={{ position: 'relative' }}>
            <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#dcd6ca' }}><div style={{ width: '100%', height: '100%', background: 'url(/showcase/img/despacho.webp) center/cover', transform: 'translateY(calc(var(--sy,0) * -0.03px)) scale(1.06)' }} /></div>
            <div style={{ position: 'absolute', left: -30, bottom: -30, background: '#0c0f14', color: '#ece7dd', padding: '26px 30px', maxWidth: 250 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: '#c2a15a', marginBottom: 6 }}>{c.firmBadgeTitle}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(236,231,221,.7)', fontWeight: 300 }}>{c.firmBadgeDesc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ÁREAS DE PRÁCTICA ===================== */}
      <section id="areas" style={{ background: '#0c0f14', padding: '130px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 60 }} data-reveal>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
                <span style={{ fontSize: 12, letterSpacing: '.34em', color: '#c2a15a', textTransform: 'uppercase' }}>{c.areasEyebrow}</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4.2vw,58px)', lineHeight: 1.08, fontWeight: 500, margin: 0, color: '#f3efe8' }}>{c.areasTitle}</h2>
            </div>
            <p style={{ maxWidth: 340, fontSize: 15, lineHeight: 1.7, color: 'rgba(236,231,221,.6)', fontWeight: 300 }}>{c.areasNote}</p>
          </div>
          <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {AREA_META.map((a, i) => (
              <div key={a.n} className="ra-card" style={cardBase} data-reveal data-delay={a.delay}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#c2a15a', letterSpacing: '.14em' }}><span style={{ width: 22, height: 1, background: 'rgba(194,161,90,.55)' }} />{a.n}</div>
                <div><h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 25, color: '#f3efe8', margin: '0 0 10px', fontWeight: 500 }}>{c.areas[i].t}</h3><p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#8a93a2', margin: 0, fontWeight: 300 }}>{c.areas[i].d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CASOS Y RESULTADOS ===================== */}
      <section id="casos" style={{ position: 'relative', padding: '150px 40px', overflow: 'hidden', background: '#0c0f14' }}>
        <div style={{ position: 'absolute', inset: 0, transform: 'translateY(calc(var(--sy,0) * 0.04px))' }}><div style={{ position: 'absolute', inset: '-8%', background: 'url(/showcase/img/biblioteca.webp) center/cover', opacity: 0.22 }} /></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0c0f14,rgba(12,15,20,.85),#0c0f14)' }} />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 70px' }} data-reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
              <span style={{ fontSize: 12, letterSpacing: '.34em', color: '#c2a15a', textTransform: 'uppercase' }}>{c.casosEyebrow}</span>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4.4vw,60px)', lineHeight: 1.08, fontWeight: 500, margin: 0, color: '#f3efe8' }}>{c.casosTitle}</h2>
          </div>
          <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, textAlign: 'center' }} data-reveal data-delay="100">
            <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(44px,5vw,72px)', color: '#c2a15a', lineHeight: 1 }}><span data-count="500" data-suffix="+">0</span></div><div style={{ fontSize: 13, color: '#8a93a2', marginTop: 10, letterSpacing: '.04em' }}>{c.casosStats[0]}</div></div>
            <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(44px,5vw,72px)', color: '#c2a15a', lineHeight: 1 }}><span data-count="120" data-prefix="$" data-suffix="M">0</span></div><div style={{ fontSize: 13, color: '#8a93a2', marginTop: 10, letterSpacing: '.04em' }}>{c.casosStats[1]}</div></div>
            <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(44px,5vw,72px)', color: '#c2a15a', lineHeight: 1 }}><span data-count="98" data-suffix="%">0</span></div><div style={{ fontSize: 13, color: '#8a93a2', marginTop: 10, letterSpacing: '.04em' }}>{c.casosStats[2]}</div></div>
            <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(44px,5vw,72px)', color: '#c2a15a', lineHeight: 1 }}><span data-count="25">0</span></div><div style={{ fontSize: 13, color: '#8a93a2', marginTop: 10, letterSpacing: '.04em' }}>{c.casosStats[3]}</div></div>
          </div>
        </div>
      </section>

      {/* ===================== ABOGADOS ===================== */}
      <section id="abogados" style={{ background: '#f3efe8', color: '#1a1c20', padding: '130px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 60 }} data-reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
              <span style={{ fontSize: 12, letterSpacing: '.34em', color: '#a07f47', textTransform: 'uppercase' }}>{c.abogadosEyebrow}</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4.2vw,58px)', lineHeight: 1.08, fontWeight: 500, margin: 0, maxWidth: '16ch' }}>{c.abogadosTitle}</h2>
          </div>
          <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {ATTORNEY_META.map((at, i) => (
              <div key={at.name} data-reveal data-delay={at.delay}>
                <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#dcd6ca', marginBottom: 20 }}><div className="ra-att" style={{ width: '100%', height: '100%', background: `url(${at.img}) center/cover`, filter: 'grayscale(.35)', transition: 'filter .5s, transform .8s' }} /></div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 27, margin: '0 0 4px', fontWeight: 500 }}>{at.name}</h3>
                <div style={{ fontSize: 12, letterSpacing: '.14em', color: '#a07f47', textTransform: 'uppercase', marginBottom: 12 }}>{c.attorneys[i].role}</div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#5a5e64', fontWeight: 300, margin: 0 }}>{c.attorneys[i].d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROCESO ===================== */}
      <section style={{ background: '#0c0f14', padding: '130px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 70 }} data-reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
              <span style={{ fontSize: 12, letterSpacing: '.34em', color: '#c2a15a', textTransform: 'uppercase' }}>{c.procesoEyebrow}</span>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4.2vw,58px)', lineHeight: 1.08, fontWeight: 500, margin: 0, color: '#f3efe8' }}>{c.procesoTitle}</h2>
          </div>
          <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
            {PROCESS_META.map((p, i) => (
              <div key={p.n} data-reveal data-delay={p.delay} style={{ borderTop: '1px solid rgba(255,255,255,.14)', paddingTop: 26 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, color: '#c2a15a', marginBottom: 16 }}>{p.n}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 23, color: '#f3efe8', margin: '0 0 10px', fontWeight: 500 }}>{c.process[i].t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#8a93a2', fontWeight: 300, margin: 0 }}>{c.process[i].d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIOS ===================== */}
      <section style={{ background: '#f3efe8', color: '#1a1c20', padding: '130px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(30px,3.8vw,52px)', lineHeight: 1.1, fontWeight: 500, margin: '0 0 56px', maxWidth: '18ch' }} data-reveal>{c.testimonialsTitle}</h2>
          <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 26 }}>
            {TESTIMONIAL_META.map((t, i) => (
              <div key={t.name} data-reveal data-delay={t.delay} style={{ background: '#fff', border: '1px solid rgba(20,25,30,.08)', padding: 38, minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, lineHeight: 0, color: '#c2a15a', height: 28 }}>“</div><p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#3a3e43', fontWeight: 300, margin: 0 }}>{c.testimonials[i].q}</p></div>
                <div style={{ borderTop: '1px solid rgba(20,25,30,.1)', paddingTop: 18 }}><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19 }}>{t.name}</div><div style={{ fontSize: 12, color: '#8a8f95', marginTop: 2, letterSpacing: '.04em' }}>{c.testimonials[i].role}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== RECONOCIMIENTOS ===================== */}
      <section style={{ background: '#0c0f14', padding: '70px 40px', borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }} data-reveal>
          <div style={{ fontSize: 11, letterSpacing: '.34em', color: '#8a93a2', textTransform: 'uppercase', marginBottom: 34 }}>{c.recognizedBy}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 50 }}>
            {RECOGNITIONS.map((r) => (
              <span key={r} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, letterSpacing: '.06em', color: 'rgba(236,231,221,.55)' }}>{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section style={{ background: '#f3efe8', color: '#1a1c20', padding: '130px 40px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }} data-reveal>
            <div style={{ fontSize: 12, letterSpacing: '.34em', color: '#a07f47', textTransform: 'uppercase', marginBottom: 18 }}>{c.faqEyebrow}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: 500, margin: 0 }}>{c.faqTitle}</h2>
          </div>
          <div data-reveal>
            {c.faqs.map((f) => (
              <div key={f.q} style={{ borderBottom: '1px solid rgba(20,25,30,.12)' }}>
                <button onClick={toggleFaq} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, cursor: 'pointer', fontFamily: "'Manrope',sans-serif", color: '#1a1c20' }}>
                  <span style={{ fontSize: 18, fontWeight: 500 }}>{f.q}</span>
                  <span data-icon style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: '#c2a15a', flexShrink: 0, transition: 'transform .3s' }}>+</span>
                </button>
                <div data-answer style={{ maxHeight: 0, overflow: 'hidden', transition: 'max-height .4s ease' }}><p style={{ fontSize: 15, lineHeight: 1.75, color: '#5a5e64', fontWeight: 300, margin: 0, padding: '0 0 26px' }}>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AGENDAR CONSULTA ===================== */}
      <section id="consulta" style={{ background: '#0c0f14', padding: '130px 40px' }}>
        <div className="dcol-2" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 70, alignItems: 'start' }}>
          <div data-reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
              <span style={{ fontSize: 12, letterSpacing: '.34em', color: '#c2a15a', textTransform: 'uppercase' }}>{c.consultaEyebrow}</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4.2vw,56px)', lineHeight: 1.08, fontWeight: 500, margin: '0 0 22px', color: '#f3efe8' }}>{c.consultaTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(236,231,221,.65)', fontWeight: 300, margin: '0 0 34px' }}>{c.consultaSub}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><span style={{ width: 40, height: 40, border: '1px solid rgba(194,161,90,.5)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#c2a15a', fontSize: 16 }}>☎</span><div><div style={{ fontSize: 12, color: '#8a93a2' }}>{c.directLine}</div><div style={{ fontSize: 16, color: '#ece7dd' }}>+52 55 9988 7766</div></div></div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><span style={{ width: 40, height: 40, border: '1px solid rgba(194,161,90,.5)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#c2a15a', fontSize: 15 }}>✉</span><div><div style={{ fontSize: 12, color: '#8a93a2' }}>{c.emailLabel}</div><div style={{ fontSize: 16, color: '#ece7dd' }}>contacto@romanashford.mx</div></div></div>
            </div>
          </div>
          <form onSubmit={submitForm} data-reveal data-delay="120" style={{ background: '#12161d', border: '1px solid rgba(255,255,255,.08)', padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input name="nombre" required placeholder={c.formName} className="ra-form-input" style={{ width: '100%', ...inputBase }} />
            <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <input name="email" type="email" required placeholder={c.formEmail} className="ra-form-input" style={{ width: '100%', ...inputBase }} />
              <input name="telefono" placeholder={c.formPhone} className="ra-form-input" style={{ width: '100%', ...inputBase }} />
            </div>
            <select name="area" style={{ width: '100%', padding: '15px 16px', background: '#0c0f14', border: '1px solid rgba(255,255,255,.12)', color: '#8a93a2', fontSize: 14, fontFamily: "'Manrope',sans-serif", outline: 'none' }}>
              <option value="">{c.formAreaPlaceholder}</option>
              {c.areas.map((a) => (
                <option key={a.t}>{a.t}</option>
              ))}
            </select>
            <textarea name="mensaje" rows={4} placeholder={c.formMessage} className="ra-form-input" style={{ width: '100%', ...inputBase, resize: 'vertical' }} />
            <button type="submit" className="ra-gold" style={{ width: '100%', padding: 16, background: '#c2a15a', border: 'none', color: '#0c0f14', fontSize: 14, fontWeight: 600, letterSpacing: '.04em', cursor: 'pointer', fontFamily: "'Manrope',sans-serif" }}>{c.formSubmit}</button>
            <div style={{ fontSize: 12, color: '#6a707a', textAlign: 'center' }}>{c.formDisclaimer}</div>
          </form>
        </div>
      </section>

      {/* ===================== CONTACTO / UBICACIÓN ===================== */}
      <section id="contacto" style={{ background: '#f3efe8', color: '#1a1c20' }}>
        <div className="dcol-2" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'stretch' }}>
          <div style={{ padding: '100px 50px 100px 40px' }} data-reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <span style={{ width: 36, height: 1, background: '#c2a15a' }} />
              <span style={{ fontSize: 12, letterSpacing: '.34em', color: '#a07f47', textTransform: 'uppercase' }}>{c.contactEyebrow}</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(30px,3.8vw,50px)', fontWeight: 500, margin: '0 0 32px' }}>{c.contactTitle}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 420 }}>
              <div style={{ borderTop: '1px solid rgba(20,25,30,.12)', paddingTop: 20 }}><div style={{ fontSize: 13, color: '#8a8f95', marginBottom: 5 }}>{c.addrLabel}</div><div style={{ fontSize: 16 }}>{c.addr.split('|')[0]}<br />{c.addr.split('|')[1]}</div></div>
              <div style={{ borderTop: '1px solid rgba(20,25,30,.12)', paddingTop: 20 }}><div style={{ fontSize: 13, color: '#8a8f95', marginBottom: 5 }}>{c.hoursLabel}</div><div style={{ fontSize: 16 }}>{c.hours}</div></div>
              <div style={{ borderTop: '1px solid rgba(20,25,30,.12)', paddingTop: 20 }}><div style={{ fontSize: 13, color: '#8a8f95', marginBottom: 5 }}>{c.contactLabel}</div><div style={{ fontSize: 16 }}>+52 55 9988 7766<br />contacto@romanashford.mx</div></div>
              <a href="https://www.google.com/maps/search/?api=1&query=Torre+Reforma+Paseo+de+la+Reforma+483+CDMX" target="_blank" rel="noopener" className="ra-maps" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, alignSelf: 'flex-start', marginTop: 6, background: '#0c0f14', color: '#ece7dd', fontSize: 13, fontWeight: 600, letterSpacing: '.04em', padding: '14px 24px', textDecoration: 'none' }}>{c.getDirections}</a>
            </div>
          </div>
          <div style={{ minHeight: 520, position: 'relative', background: '#0c0f14' }}>
            <iframe title="Ubicación Román & Ashford" src="https://maps.google.com/maps?q=Torre%20Reforma%2C%20Paseo%20de%20la%20Reforma%20483%2C%20CDMX&t=&z=15&ie=UTF8&iwloc=&output=embed" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, filter: 'grayscale(1) contrast(1.05) brightness(.85)' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: '#0c0f14', color: 'rgba(236,231,221,.55)', padding: '60px 40px 40px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ width: 38, height: 38, border: '1px solid #c2a15a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: '#c2a15a' }}>R&amp;A</span>
            <div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, letterSpacing: '.12em', color: '#ece7dd' }}>ROMÁN &amp; ASHFORD</div><div style={{ fontSize: 10, letterSpacing: '.3em', color: '#8a93a2', textTransform: 'uppercase' }}>{c.footerTagline}</div></div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(236,231,221,.4)', textAlign: 'right' }}>{c.footerRights}</div>
        </div>
      </footer>
    </div>
  )
}
