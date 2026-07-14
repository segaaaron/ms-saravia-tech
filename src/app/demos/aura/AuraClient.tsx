'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import ConsultorioScene from './Scene'
import type { DemoLang } from '../lang'

/* ============================================================
   AURA — Medicina Estética (demo). Port nativo Next.js del
   diseño original .dc.html. Bilingüe (es/en) según el sitio.
   Assets locales viven en /showcase/img (public).
   ============================================================ */

const ACCENT = '#c2a274'
const DOCTOR_NAME = 'Dra. Valentina Rivas'
const WA_NUMBER = '+52 55 9876 5432'
const WA_DIGITS = WA_NUMBER.replace(/\D/g, '') || '5215598765432'
const IMMERSION = 1500

const uns = (id: string, w = 700) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`
const SERVICE_IMG = [
  uns('1512290923902-8a9f81dc236c'),
  uns('1570172619644-dfd03ed5d881'),
  uns('1598440947619-2c35fc9aa908'),
  uns('1519824145371-296894a0daa9'),
  uns('1616394584738-fc6e612e71b9'),
  uns('1540555700478-4be289fbecef'),
]
const SERVICE_META = [
  { n: '01', dur: '20 min' },
  { n: '02', dur: '40 min' },
  { n: '03', dur: '45 min' },
  { n: '04', dur: '50 min' },
  { n: '05', dur: '30 min' },
  { n: '06', dur: '60 min' },
]
const GALLERY_IMG = [
  { unsplash: '1595476108010-b4d1f102b1b1?w=1000&q=80', local: 'g-recepcion.jpg', span: true },
  { unsplash: '1600334089648-b0d9d3028eb2?w=800&q=80', local: 'g-cabina.jpg' },
  { unsplash: '1487412947147-5cebf100ffc2?w=800&q=80', local: 'g-resultado.jpg' },
  { unsplash: '1616394584738-fc6e612e71b9?w=800&q=80', local: 'g-sala.jpg' },
  { unsplash: '1598440947619-2c35fc9aa908?w=800&q=80', local: 'g-equipo.jpg' },
]

const MAPS_SEARCH = 'https://www.google.com/maps/search/?api=1&query=Paseo+de+las+Palmas+340,+Lomas+de+Chapultepec,+CDMX'

type Content = {
  nav: { servicios: string; doctora: string; resultados: string; faq: string; cta: string }
  tagline: string
  enterBadge: string
  enterTitle: string
  enterDesc: string
  ctaBook: string
  ctaTreat: string
  scrollHint: string
  introEyebrow: string
  introTitle: string
  statsExp: string
  statsPat: string
  servicesTitle: string
  servicesNote: string
  bookShort: string
  services: { t: string; d: string; price: string }[]
  doctoraEyebrow: string
  doctoraBio: string
  certLabel: string
  cert: string
  formLabel: string
  form: string
  resultsEyebrow: string
  resultsTitle: string
  gallery: string[]
  testimonialsTitle: string
  testimonials: { q: string; name: string; treat: string }[]
  faqEyebrow: string
  faqTitle: string
  faq: { q: string; a: string }[]
  agendarEyebrow: string
  agendarTitle: string
  namePh: string
  phonePh: string
  confirmReady: string
  confirmIncomplete: string
  agendarNote: string
  dateHint: string
  weekdays: string[]
  locEyebrow: string
  locTitle: string
  addrLabel: string
  addr: string
  hoursLabel: string
  hours: string
  contactLabel: string
  directions: string
  viewMaps: string
  footerTagline: string
  footerRights: string
  portraitAlt: string
  waFloatMsg: string
  waBookIntro: string
  waLabels: { name: string; phone: string; date: string; time: string }
  dateLocale: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    nav: { servicios: 'Servicios', doctora: 'Doctora', resultados: 'Resultados', faq: 'FAQ', cta: 'Agendar cita' },
    tagline: 'Medicina Estética · Dermatología',
    enterBadge: 'Bienvenido',
    enterTitle: 'Ha entrado al consultorio',
    enterDesc: 'Un espacio diseñado para su bienestar, la tecnología y el cuidado experto de su piel.',
    ctaBook: 'Agendar valoración',
    ctaTreat: 'Ver tratamientos',
    scrollHint: 'Desliza para entrar',
    introEyebrow: 'Su piel, nuestra ciencia',
    introTitle: 'Tratamientos personalizados con tecnología de vanguardia y un enfoque profundamente humano.',
    statsExp: 'años de experiencia',
    statsPat: 'pacientes atendidos',
    servicesTitle: 'Tratamientos',
    servicesNote: 'Valoración inicial sin costo',
    bookShort: 'Agendar →',
    services: [
      { t: 'Toxina Botulínica', d: 'Suaviza líneas de expresión con precisión milimétrica y un gesto natural.', price: 'Desde $3,500' },
      { t: 'Ácido Hialurónico', d: 'Rellenos y armonización facial de aspecto natural y resultados inmediatos.', price: 'Desde $6,900' },
      { t: 'Bioestimuladores', d: 'Estimulan tu propio colágeno para una piel firme, densa y luminosa.', price: 'Desde $8,500' },
      { t: 'Láser Fraccionado', d: 'Renovación profunda de textura, manchas, poros y cicatrices.', price: 'Desde $4,200' },
      { t: 'Peeling Médico', d: 'Exfoliación controlada que revela una piel renovada y uniforme.', price: 'Desde $1,800' },
      { t: 'Hydrafacial', d: 'Limpieza profunda, exfoliación e hidratación intensa en una sesión.', price: 'Desde $1,500' },
    ],
    doctoraEyebrow: 'La especialista',
    doctoraBio: 'Dermatóloga certificada por el Consejo Mexicano, con formación en medicina estética avanzada. Cada protocolo se diseña a partir de un diagnóstico riguroso de su piel, priorizando resultados naturales y seguros.',
    certLabel: 'Certificación',
    cert: 'Cédula Esp. 7841562',
    formLabel: 'Formación',
    form: 'UNAM · Barcelona',
    resultsEyebrow: 'Espacio & resultados',
    resultsTitle: 'Un entorno pensado para su confianza.',
    gallery: ['Recepción', 'Cabina láser', 'Resultado facial', 'Ritual facial', 'Productos & cuidado'],
    testimonialsTitle: 'Lo que dicen nuestras pacientes',
    testimonials: [
      { q: 'La atención de la Dra. Rivas es de otro nivel. Me explicó cada paso y los resultados se ven completamente naturales.', name: 'Mariana G.', treat: 'Ácido hialurónico' },
      { q: 'Entrar al consultorio ya te transmite confianza. Tecnología impecable y un trato humano que se agradece.', name: 'Fernanda L.', treat: 'Láser fraccionado' },
      { q: 'Llevaba años con acné y por fin encontré un plan que funciona. Mi piel cambió por completo.', name: 'Daniela R.', treat: 'Protocolo antiacné' },
    ],
    faqEyebrow: 'Preguntas frecuentes',
    faqTitle: 'Resolvemos sus dudas',
    faq: [
      { q: '¿La valoración tiene costo?', a: 'La primera valoración es sin costo y sin compromiso. Realizamos un diagnóstico completo de tu piel y diseñamos un plan personalizado.' },
      { q: '¿Los tratamientos son dolorosos?', a: 'Utilizamos anestesia tópica y técnicas de mínima molestia. La mayoría de los pacientes describen los procedimientos como muy tolerables.' },
      { q: '¿Cuánto duran los resultados?', a: 'Depende del tratamiento: la toxina botulínica dura de 4 a 6 meses, los rellenos de 9 a 18 meses y los bioestimuladores hasta 2 años.' },
      { q: '¿Puedo retomar mi rutina el mismo día?', a: 'Sí. La mayoría de nuestros tratamientos no requieren reposo y puedes volver a tus actividades de inmediato con cuidados básicos.' },
      { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos efectivo, todas las tarjetas y planes a meses sin intereses con tarjetas participantes.' },
    ],
    agendarEyebrow: 'Agende su cita',
    agendarTitle: 'Reserve su valoración',
    namePh: 'Nombre completo',
    phonePh: 'Teléfono / WhatsApp',
    confirmReady: 'Confirmar por WhatsApp',
    confirmIncomplete: 'Complete los datos',
    agendarNote: 'Confirmamos su cita por WhatsApp en minutos.',
    dateHint: 'Seleccione una fecha disponible',
    weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    locEyebrow: 'Visítenos',
    locTitle: 'Ubicación & horarios',
    addrLabel: 'Dirección',
    addr: 'Av. Palmas 340, Piso 8|Lomas de Chapultepec, CDMX',
    hoursLabel: 'Horarios',
    hours: 'Lun – Vie · 9:00 – 19:00|Sábado · 9:00 – 14:00',
    contactLabel: 'Contacto',
    directions: 'Cómo llegar',
    viewMaps: 'Ver en Google Maps',
    footerTagline: 'Medicina Estética & Dermatología · Ciudad de México',
    footerRights: '© 2026 AURA. Todos los derechos reservados.',
    portraitAlt: `Retrato de ${DOCTOR_NAME}`,
    waFloatMsg: 'Hola AURA, me gustaría más información.',
    waBookIntro: 'Hola AURA, quiero agendar una valoración.',
    waLabels: { name: 'Nombre', phone: 'Teléfono', date: 'Fecha', time: 'Hora' },
    dateLocale: 'es-MX',
  },
  en: {
    nav: { servicios: 'Services', doctora: 'Doctor', resultados: 'Results', faq: 'FAQ', cta: 'Book appointment' },
    tagline: 'Aesthetic Medicine · Dermatology',
    enterBadge: 'Welcome',
    enterTitle: 'You have entered the clinic',
    enterDesc: 'A space designed for your wellbeing, technology and the expert care of your skin.',
    ctaBook: 'Book assessment',
    ctaTreat: 'View treatments',
    scrollHint: 'Scroll to enter',
    introEyebrow: 'Your skin, our science',
    introTitle: 'Personalized treatments with cutting-edge technology and a deeply human approach.',
    statsExp: 'years of experience',
    statsPat: 'patients treated',
    servicesTitle: 'Treatments',
    servicesNote: 'Free initial assessment',
    bookShort: 'Book →',
    services: [
      { t: 'Botulinum Toxin', d: 'Softens expression lines with millimetric precision and a natural look.', price: 'From $3,500' },
      { t: 'Hyaluronic Acid', d: 'Fillers and facial harmonization with a natural look and immediate results.', price: 'From $6,900' },
      { t: 'Biostimulators', d: 'Stimulate your own collagen for firm, dense and luminous skin.', price: 'From $8,500' },
      { t: 'Fractional Laser', d: 'Deep renewal of texture, spots, pores and scars.', price: 'From $4,200' },
      { t: 'Medical Peel', d: 'Controlled exfoliation that reveals renewed, even skin.', price: 'From $1,800' },
      { t: 'Hydrafacial', d: 'Deep cleansing, exfoliation and intense hydration in a single session.', price: 'From $1,500' },
    ],
    doctoraEyebrow: 'The specialist',
    doctoraBio: 'Board-certified dermatologist by the Mexican Council, with training in advanced aesthetic medicine. Each protocol is designed from a rigorous diagnosis of your skin, prioritizing natural, safe results.',
    certLabel: 'Certification',
    cert: 'License No. 7841562',
    formLabel: 'Training',
    form: 'UNAM · Barcelona',
    resultsEyebrow: 'Space & results',
    resultsTitle: 'An environment built for your confidence.',
    gallery: ['Reception', 'Laser room', 'Facial result', 'Facial ritual', 'Products & care'],
    testimonialsTitle: 'What our patients say',
    testimonials: [
      { q: "Dr. Rivas's care is on another level. She explained every step and the results look completely natural.", name: 'Mariana G.', treat: 'Hyaluronic acid' },
      { q: 'Just walking into the clinic gives you confidence. Impeccable technology and a human touch you appreciate.', name: 'Fernanda L.', treat: 'Fractional laser' },
      { q: 'I struggled with acne for years and finally found a plan that works. My skin changed completely.', name: 'Daniela R.', treat: 'Anti-acne protocol' },
    ],
    faqEyebrow: 'Frequently asked questions',
    faqTitle: 'We answer your questions',
    faq: [
      { q: 'Is the assessment free?', a: 'The first assessment is free and with no commitment. We run a full diagnosis of your skin and design a personalized plan.' },
      { q: 'Are the treatments painful?', a: 'We use topical anesthesia and minimal-discomfort techniques. Most patients describe the procedures as very tolerable.' },
      { q: 'How long do results last?', a: 'It depends on the treatment: botulinum toxin lasts 4 to 6 months, fillers 9 to 18 months and biostimulators up to 2 years.' },
      { q: 'Can I resume my routine the same day?', a: 'Yes. Most of our treatments require no downtime and you can return to your activities immediately with basic care.' },
      { q: 'What payment methods do you accept?', a: 'We accept cash, all cards and interest-free installment plans with participating cards.' },
    ],
    agendarEyebrow: 'Book your appointment',
    agendarTitle: 'Reserve your assessment',
    namePh: 'Full name',
    phonePh: 'Phone / WhatsApp',
    confirmReady: 'Confirm via WhatsApp',
    confirmIncomplete: 'Complete the details',
    agendarNote: 'We confirm your appointment via WhatsApp within minutes.',
    dateHint: 'Select an available date',
    weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    locEyebrow: 'Visit us',
    locTitle: 'Location & hours',
    addrLabel: 'Address',
    addr: 'Av. Palmas 340, Floor 8|Lomas de Chapultepec, Mexico City',
    hoursLabel: 'Hours',
    hours: 'Mon – Fri · 9:00 – 19:00|Saturday · 9:00 – 14:00',
    contactLabel: 'Contact',
    directions: 'Get directions',
    viewMaps: 'View on Google Maps',
    footerTagline: 'Aesthetic Medicine & Dermatology · Mexico City',
    footerRights: '© 2026 AURA. All rights reserved.',
    portraitAlt: `Portrait of ${DOCTOR_NAME}`,
    waFloatMsg: "Hi AURA, I'd like more information.",
    waBookIntro: "Hi AURA, I'd like to book an assessment.",
    waLabels: { name: 'Name', phone: 'Phone', date: 'Date', time: 'Time' },
    dateLocale: 'en-US',
  },
}

const WaIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm5.3 14.1c-.22.62-1.3 1.2-1.8 1.24-.46.05-1.05.07-1.7-.1a10.9 10.9 0 0 1-1.53-.57 8.4 8.4 0 0 1-3.2-2.83c-.24-.32-.87-1.16-.87-2.22s.55-1.58.75-1.8a.78.78 0 0 1 .57-.27h.4c.14 0 .3-.02.47.36.18.42.6 1.48.66 1.58.05.11.09.24.02.38-.28.57-.58.55-.4.86.6.98 1.2 1.32 2.07 1.75.15.08.24.07.33-.04.1-.11.38-.44.48-.6.1-.14.2-.12.34-.07.14.05 1.86.87 1.87 1.28Z" />
  </svg>
)

const navLink: CSSProperties = { fontSize: 13, letterSpacing: '.06em', color: 'rgba(246,242,236,.68)', textDecoration: 'none' }
const label: CSSProperties = { fontFamily: 'ui-monospace,monospace', fontSize: 11, color: '#fff', background: 'rgba(20,15,8,.42)', padding: '4px 10px', borderRadius: 100, backdropFilter: 'blur(4px)' }

export default function AuraClient({ lang }: { lang: DemoLang }) {
  const c = CONTENT[lang]
  const rootEl = useRef<HTMLDivElement>(null)
  const heroEl = useRef<HTMLElement>(null)

  const [faqOpen, setFaqOpen] = useState(-1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selDate, setSelDate] = useState<string | null>(null)
  const [selTime, setSelTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--accent', ACCENT)

    let ticking = false
    const updateScene = () => {
      const t = heroEl.current
      if (!t) return
      const total = t.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-t.getBoundingClientRect().top, 0), Math.max(total, 1))
      const p = total > 0 ? scrolled / total : 0
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      const clamp = (x: number) => Math.max(0, Math.min(1, x))
      r.setProperty('--p', p.toFixed(4))
      r.setProperty('--fly', (ease * IMMERSION).toFixed(1))
      r.setProperty('--door', clamp((p - 0.42) / 0.24).toFixed(4))
      r.setProperty('--heroText', (1 - clamp(p / 0.3)).toFixed(4))
      r.setProperty('--enterText', clamp((p - 0.66) / 0.22).toFixed(4))
      r.setProperty('--flare', clamp((p - 0.5) / 0.3).toFixed(4))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { updateScene(); ticking = false })
    }
    const onMove = (e: MouseEvent) => {
      r.setProperty('--mx', ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3))
      r.setProperty('--my', ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('mousemove', onMove, { passive: true })
    updateScene()

    let io: IntersectionObserver | undefined
    if (rootEl.current) {
      const els = [...rootEl.current.querySelectorAll<HTMLElement>('[data-reveal]')]
      els.forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(30px)'
        el.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)'
      })
      io = new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            ;(en.target as HTMLElement).style.opacity = '1'
            ;(en.target as HTMLElement).style.transform = 'none'
            io!.unobserve(en.target)
          }
        })
      }, { threshold: 0.12 })
      els.forEach((el) => io!.observe(el))
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('mousemove', onMove)
      io?.disconnect()
    }
  }, [])

  const faqItems = c.faq.map((f, i) => {
    const open = faqOpen === i
    return { ...f, open, rot: open ? 'rotate(45deg)' : 'rotate(0deg)', toggle: () => setFaqOpen(open ? -1 : i) }
  })

  const { monthLabel, calendar } = useMemo(() => {
    const base = new Date()
    const cur = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1)
    const y = cur.getFullYear(), m = cur.getMonth()
    const monthLabel = cur.toLocaleDateString(c.dateLocale, { month: 'long', year: 'numeric' })
    const firstDow = (cur.getDay() + 6) % 7
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const today = new Date(); today.setHours(0, 0, 0, 0)
    type Cell = { key: string; d: number | ''; iso?: string; disabled: boolean; cursor: string; bg: string; color: string }
    const calendar: Cell[] = []
    for (let i = 0; i < firstDow; i++) calendar.push({ key: `e${i}`, d: '', disabled: true, cursor: 'default', bg: 'transparent', color: 'transparent' })
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d)
      const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const disabled = date < today || date.getDay() === 0
      const sel = selDate === iso
      calendar.push({
        key: iso, d, iso, disabled,
        cursor: disabled ? 'default' : 'pointer',
        bg: sel ? '#20211f' : disabled ? 'transparent' : '#f1ece1',
        color: sel ? '#f6f2ec' : disabled ? '#c9ccd0' : '#20211f',
      })
    }
    return { monthLabel, calendar }
  }, [monthOffset, selDate, c.dateLocale])

  const times = useMemo(() => {
    if (!selDate) return []
    const dd = new Date(selDate + 'T00:00:00')
    const sat = dd.getDay() === 6
    return (sat ? ['09:00', '10:00', '11:00', '12:00', '13:00'] : ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00']).map((t) => ({ t, sel: selTime === t }))
  }, [selDate, selTime])

  const dateSummary = selDate
    ? new Date(selDate + 'T00:00:00').toLocaleDateString(c.dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })
    : c.dateHint

  const canConfirm = !!(selDate && selTime && name.trim() && phone.trim())
  let waHref = '#agendar'
  if (canConfirm) {
    const fecha = new Date(selDate! + 'T00:00:00').toLocaleDateString(c.dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const L = c.waLabels
    const msg = `${c.waBookIntro}%0A%0A${L.name}: ${encodeURIComponent(name)}%0A${L.phone}: ${encodeURIComponent(phone)}%0A${L.date}: ${encodeURIComponent(fecha)}%0A${L.time}: ${encodeURIComponent(selTime!)}`
    waHref = `https://wa.me/${WA_DIGITS}?text=${msg}`
  }
  const waFloat = `https://wa.me/${WA_DIGITS}?text=${encodeURIComponent(c.waFloatMsg)}`
  const confirmBg = canConfirm ? '#25D366' : '#dcd7cc'
  const confirmColor = canConfirm ? '#fff' : '#9a958a'
  const confirmLabel = canConfirm ? c.confirmReady : c.confirmIncomplete

  return (
    <div ref={rootEl} id="top" style={{ position: 'relative', background: '#f6f2ec', fontFamily: "'Manrope',system-ui,sans-serif", color: '#191b1f' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Manrope:wght@300;400;500;600;700&display=swap" />
      <style>{`
        @keyframes auraSpin { to { transform: rotate(360deg); } }
        @keyframes scrollDot { 0%{ transform:translateY(0); opacity:0;} 30%{opacity:1;} 70%{opacity:1;} 100%{ transform:translateY(20px); opacity:0;} }
        @keyframes waRing { 0%{ transform:scale(1); opacity:.55;} 100%{ transform:scale(1.9); opacity:0;} }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 34px', background: 'rgba(9,12,17,.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${ACCENT}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
          </span>
          <span style={{ fontFamily: "'Marcellus',serif", fontSize: 21, letterSpacing: '.34em', color: '#f6f2ec' }}>AURA</span>
        </a>
        {/* Navegación inline (desktop) */}
        <nav className="dnav-hide" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="#servicios" style={navLink}>{c.nav.servicios}</a>
          <a href="#doctora" style={navLink}>{c.nav.doctora}</a>
          <a href="#resultados" style={navLink}>{c.nav.resultados}</a>
          <a href="#faq" style={navLink}>{c.nav.faq}</a>
          <a href="#agendar" style={{ fontSize: 13, letterSpacing: '.08em', color: '#0a0d12', background: ACCENT, padding: '10px 20px', borderRadius: 100, textDecoration: 'none', fontWeight: 600 }}>{c.nav.cta}</a>
        </nav>
        {/* Menú hamburguesa (móvil) */}
        <div className="dnav-only" style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            style={{ width: 42, height: 42, borderRadius: 100, border: `1px solid ${ACCENT}66`, background: 'rgba(9,12,17,.4)', color: '#f6f2ec', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, lineHeight: 1 }}
          >
            {menuOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>}
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', top: 54, right: 0, minWidth: 220, background: 'rgba(14,17,22,.98)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${ACCENT}33`, borderRadius: 16, boxShadow: '0 26px 56px -20px rgba(0,0,0,.7)', padding: 10, zIndex: 70, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <a href="#servicios" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 10 }}>{c.nav.servicios}</a>
              <a href="#doctora" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 10 }}>{c.nav.doctora}</a>
              <a href="#resultados" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 10 }}>{c.nav.resultados}</a>
              <a href="#faq" onClick={() => setMenuOpen(false)} style={{ ...navLink, padding: '13px 14px', borderRadius: 10 }}>{c.nav.faq}</a>
              <a href="#agendar" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, letterSpacing: '.08em', color: '#0a0d12', background: ACCENT, padding: '13px 20px', borderRadius: 100, textDecoration: 'none', fontWeight: 600, textAlign: 'center', marginTop: 6 }}>{c.nav.cta}</a>
            </div>
          )}
        </div>
      </header>

      {/* HERO PORTAL */}
      <section ref={heroEl} style={{ position: 'relative', height: '340vh', background: '#080b0f' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#0e1116' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '-3%', background: 'url(/showcase/img/recepcion.webp) center/cover', transform: 'scale(calc(1.02 + var(--door,0) * 0.14))' }} />
            <div style={{ position: 'absolute', left: '50%', top: '9%', transform: 'translateX(-50%)', textAlign: 'center', opacity: 'clamp(0, calc((var(--door,0) - 0.5) / 0.4), 1)' as unknown as number }}>
              <div style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(30px,4.2vw,58px)', letterSpacing: '.36em', color: '#ac8b4c', paddingLeft: '.36em', lineHeight: 1, textShadow: '0 2px 22px rgba(255,244,214,.55)' }}>AURA</div>
              <div style={{ marginTop: 9, fontSize: 'clamp(9px,1vw,12px)', letterSpacing: '.42em', color: '#ac8b4c', textTransform: 'uppercase' }}>{c.tagline}</div>
            </div>
          </div>

          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 'calc(2% + var(--door,0) * 42%)', transform: 'translateX(-50%)', pointerEvents: 'none', background: 'radial-gradient(closest-side, rgba(255,247,228,.9), rgba(255,240,214,0) 100%)', filter: 'blur(16px)', opacity: 'calc(0.12 + var(--door,0) * 0.5)' as unknown as number }} />

          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '50.4%', height: '100%', overflow: 'hidden', transform: 'translateX(calc(var(--door,0) * -103%))', boxShadow: '3px 0 34px rgba(0,0,0,.4)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '198.4%', height: '100%', background: 'url(/showcase/img/puerta.webp) center/cover' }}>
                <DoorText tagline={c.tagline} />
              </div>
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0, width: '50.4%', height: '100%', overflow: 'hidden', transform: 'translateX(calc(var(--door,0) * 103%))', boxShadow: '-3px 0 34px rgba(0,0,0,.4)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '198.4%', height: '100%', background: 'url(/showcase/img/puerta.webp) center/cover' }}>
                <DoorText tagline={c.tagline} />
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(46% 50% at 50% 46%, rgba(255,255,255,.7), rgba(255,255,255,0) 72%)', opacity: 'var(--flare,0)' as unknown as number }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(100% 100% at 50% 50%, rgba(5,7,10,0) 45%, rgba(5,7,10,.72) 100%)' }} />

          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11, pointerEvents: 'none', opacity: 'var(--heroText,1)' as unknown as number }}>
            <span style={{ fontSize: 11, letterSpacing: '.34em', color: 'rgba(255,255,255,.9)', textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,.55)' }}>{c.scrollHint}</span>
            <div style={{ width: 26, height: 44, border: '1px solid rgba(255,255,255,.55)', borderRadius: 16, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', width: 4, height: 8, borderRadius: 3, background: '#c8a86c', animation: 'scrollDot 1.8s ease-in-out infinite' }} />
            </div>
          </div>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 'var(--enterText,0)' as unknown as number }}>
            <div style={{ fontSize: 12, letterSpacing: '.42em', color: '#b08f52', textTransform: 'uppercase', marginBottom: 16 }}>{c.enterBadge}</div>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05, color: '#2b2419', margin: 0, maxWidth: '14ch' }}>{c.enterTitle}</h2>
            <p style={{ maxWidth: 400, fontSize: 15, lineHeight: 1.7, color: '#6a5c44', margin: '20px auto 0' }}>{c.enterDesc}</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
              <a href="#agendar" style={{ fontSize: 13, letterSpacing: '.05em', color: '#f6f2ec', background: '#2b2419', padding: '14px 26px', borderRadius: 100, textDecoration: 'none', fontWeight: 600 }}>{c.ctaBook}</a>
              <a href="#servicios" style={{ fontSize: 13, letterSpacing: '.05em', color: '#2b2419', background: 'transparent', border: '1px solid rgba(43,36,25,.35)', padding: '14px 26px', borderRadius: 100, textDecoration: 'none', fontWeight: 500 }}>{c.ctaTreat}</a>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section style={{ background: '#f6f2ec', padding: '96px 34px 40px' }}>
        <div data-reveal className="dcol-2" style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: 50, alignItems: 'center' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ fontSize: 12, letterSpacing: '.32em', color: '#a07f47', textTransform: 'uppercase', marginBottom: 18 }}>{c.introEyebrow}</div>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(30px,4vw,50px)', lineHeight: 1.12, color: '#20211f', margin: '0 0 34px', textWrap: 'balance' as CSSProperties['textWrap'] }}>{c.introTitle}</h2>
            <div style={{ display: 'flex', gap: 44 }}>
              <div><div style={{ fontFamily: "'Marcellus',serif", fontSize: 42, color: '#20211f' }}>12+</div><div style={{ fontSize: 13, color: '#71767c', marginTop: 4 }}>{c.statsExp}</div></div>
              <div><div style={{ fontFamily: "'Marcellus',serif", fontSize: 42, color: '#20211f' }}>8k+</div><div style={{ fontSize: 13, color: '#71767c', marginTop: 4 }}>{c.statsPat}</div></div>
            </div>
          </div>
          <div style={{ position: 'relative', height: 440, background: 'transparent', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <ConsultorioScene />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ background: '#f6f2ec', padding: '70px 34px 100px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 46 }}>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(28px,3.4vw,42px)', color: '#20211f', margin: 0 }}>{c.servicesTitle}</h2>
            <span style={{ fontSize: 13, color: '#71767c', letterSpacing: '.04em' }}>{c.servicesNote}</span>
          </div>
          <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {c.services.map((s, i) => (
              <div key={i} data-reveal style={{ background: '#fbf9f4', border: '1px solid rgba(20,25,30,.08)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform .5s cubic-bezier(.16,1,.3,1),box-shadow .5s cubic-bezier(.16,1,.3,1)' }}>
                <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: 'linear-gradient(135deg,#e7dfce,#d8c3a0)' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${SERVICE_IMG[i]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(14,19,26,0) 52%,rgba(14,19,26,.42))' }} />
                  <span style={{ position: 'absolute', top: 15, left: 15, fontFamily: "'Marcellus',serif", fontSize: 13, letterSpacing: '.14em', color: '#fff', background: 'rgba(20,15,8,.42)', padding: '5px 12px', borderRadius: 100, backdropFilter: 'blur(4px)' }}>{SERVICE_META[i].n}</span>
                  <span style={{ position: 'absolute', bottom: 13, right: 16, fontSize: 11, letterSpacing: '.05em', color: '#fff', opacity: .92 }}>{SERVICE_META[i].dur}</span>
                </div>
                <div style={{ padding: '26px 26px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: "'Marcellus',serif", fontSize: 23, color: '#20211f', margin: '0 0 10px' }}>{s.t}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: '#6a6f75', margin: '0 0 20px', fontWeight: 300, flex: 1 }}>{s.d}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(20,25,30,.08)', paddingTop: 16 }}>
                    <span style={{ fontSize: 13, color: '#20211f', fontWeight: 500 }}>{s.price}</span>
                    <a href="#agendar" style={{ fontSize: 12, letterSpacing: '.06em', color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>{c.bookShort}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORA */}
      <section id="doctora" style={{ background: '#0e131a', padding: '110px 34px', color: '#f6f2ec' }}>
        <div className="dcol-2" style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'center' }}>
          <div data-reveal style={{ aspectRatio: '4/5', borderRadius: 8, border: '1px solid rgba(194,162,116,.25)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: 22, background: '#1a2028 url(/showcase/img/portrait.webp) center/cover' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80" alt={c.portraitAlt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,19,26,0) 45%, rgba(14,19,26,.55))' }} />
            <span style={{ position: 'relative', fontFamily: 'ui-monospace,monospace', fontSize: 11, letterSpacing: '.06em', color: '#fff', background: 'rgba(20,15,8,.4)', padding: '5px 11px', borderRadius: 100, backdropFilter: 'blur(4px)' }}>{DOCTOR_NAME}</span>
            <div style={{ position: 'absolute', top: 20, right: 20, width: 46, height: 46, border: `1px solid ${ACCENT}`, borderRadius: '50%', animation: 'auraSpin 14s linear infinite' }} />
          </div>
          <div data-reveal>
            <div style={{ fontSize: 12, letterSpacing: '.32em', color: ACCENT, textTransform: 'uppercase', marginBottom: 18 }}>{c.doctoraEyebrow}</div>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1.08, margin: '0 0 20px' }}>{DOCTOR_NAME}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(246,242,236,.7)', fontWeight: 300, maxWidth: 560, margin: '0 0 26px' }}>{c.doctoraBio}</p>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 26 }}>
              <div><div style={{ fontSize: 13, color: 'rgba(246,242,236,.5)', marginBottom: 4 }}>{c.certLabel}</div><div style={{ fontFamily: "'Marcellus',serif", fontSize: 18 }}>{c.cert}</div></div>
              <div><div style={{ fontSize: 13, color: 'rgba(246,242,236,.5)', marginBottom: 4 }}>{c.formLabel}</div><div style={{ fontFamily: "'Marcellus',serif", fontSize: 18 }}>{c.form}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADOS / GALERÍA */}
      <section id="resultados" style={{ background: '#f6f2ec', padding: '100px 34px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 12, letterSpacing: '.32em', color: '#a07f47', textTransform: 'uppercase', marginBottom: 16 }}>{c.resultsEyebrow}</div>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(28px,3.4vw,42px)', color: '#20211f', margin: 0, maxWidth: '16ch' }}>{c.resultsTitle}</h2>
          </div>
          <div data-reveal className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: 200, gap: 14 }}>
            {GALLERY_IMG.map((g, i) => (
              <div key={i} style={{ gridColumn: g.span ? 'span 2' : undefined, gridRow: g.span ? 'span 2' : undefined, borderRadius: 8, background: `url(https://images.unsplash.com/photo-${g.unsplash}) center/cover, #e7dfce url(/showcase/img/${g.local}) center/cover`, border: '1px solid rgba(20,25,30,.08)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: g.span ? 18 : 16 }}>
                <span style={label}>{c.gallery[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ background: '#f6f2ec', padding: '20px 34px 100px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 data-reveal style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(28px,3.4vw,42px)', color: '#20211f', margin: '0 0 44px' }}>{c.testimonialsTitle}</h2>
          <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {c.testimonials.map((t, i) => (
              <div key={i} data-reveal style={{ background: '#fbf9f4', border: '1px solid rgba(20,25,30,.08)', borderRadius: 10, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 250 }}>
                <div style={{ fontFamily: "'Marcellus',serif", fontSize: 44, lineHeight: 0, color: ACCENT, height: 22 }}>&ldquo;</div>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3e43', fontWeight: 300, margin: '0 0 24px' }}>{t.q}</p>
                <div style={{ borderTop: '1px solid rgba(20,25,30,.08)', paddingTop: 18 }}>
                  <div style={{ fontFamily: "'Marcellus',serif", fontSize: 17, color: '#20211f' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: '#8a8f95', marginTop: 2 }}>{t.treat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: '#0e131a', padding: '100px 34px', color: '#f6f2ec' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ fontSize: 12, letterSpacing: '.32em', color: ACCENT, textTransform: 'uppercase', marginBottom: 16 }}>{c.faqEyebrow}</div>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(28px,3.6vw,44px)', margin: 0 }}>{c.faqTitle}</h2>
          </div>
          <div data-reveal>
            {faqItems.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                <button onClick={f.toggle} style={{ width: '100%', background: 'none', border: 'none', color: '#f6f2ec', textAlign: 'left', padding: '26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, cursor: 'pointer', fontFamily: "'Manrope',sans-serif" }}>
                  <span style={{ fontSize: 18, fontWeight: 500 }}>{f.q}</span>
                  <span style={{ fontFamily: "'Marcellus',serif", fontSize: 26, color: ACCENT, flexShrink: 0, transition: 'transform .3s', transform: f.rot }}>+</span>
                </button>
                {f.open && (
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(246,242,236,.66)', fontWeight: 300, margin: 0, padding: '0 0 28px', maxWidth: 640 }}>{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENDAR */}
      <section id="agendar" style={{ background: '#f6f2ec', padding: '100px 34px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ fontSize: 12, letterSpacing: '.32em', color: '#a07f47', textTransform: 'uppercase', marginBottom: 16 }}>{c.agendarEyebrow}</div>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(30px,4vw,50px)', color: '#20211f', margin: 0 }}>{c.agendarTitle}</h2>
          </div>
          <div data-reveal className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 1, background: 'rgba(20,25,30,.1)', border: '1px solid rgba(20,25,30,.1)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: '#fbf9f4', padding: 38 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
                <button onClick={() => setMonthOffset((v) => Math.max(0, v - 1))} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(20,25,30,.15)', background: 'none', cursor: 'pointer', fontSize: 18, color: '#20211f' }}>‹</button>
                <div style={{ fontFamily: "'Marcellus',serif", fontSize: 20, color: '#20211f', textTransform: 'capitalize' }}>{monthLabel}</div>
                <button onClick={() => setMonthOffset((v) => Math.min(4, v + 1))} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(20,25,30,.15)', background: 'none', cursor: 'pointer', fontSize: 18, color: '#20211f' }}>›</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
                {c.weekdays.map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: 11, color: i === 6 ? '#c9b48a' : '#a0a5ab', letterSpacing: '.05em' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                {calendar.map((cell) => (
                  <button key={cell.key} disabled={cell.disabled} onClick={() => { if (!cell.disabled && cell.iso) { setSelDate(cell.iso); setSelTime(null) } }} style={{ aspectRatio: '1', border: 'none', borderRadius: 8, cursor: cell.cursor, fontFamily: "'Manrope',sans-serif", fontSize: 14, background: cell.bg, color: cell.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cell.d}</button>
                ))}
              </div>
            </div>
            <div style={{ background: '#ffffff', padding: 38, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 13, letterSpacing: '.04em', color: '#71767c', marginBottom: 14, textTransform: 'capitalize' }}>{dateSummary}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
                {times.map((tm) => (
                  <button key={tm.t} onClick={() => setSelTime(tm.t)} style={{ padding: '9px 15px', borderRadius: 100, border: `1px solid ${tm.sel ? '#20211f' : 'rgba(20,25,30,.18)'}`, background: tm.sel ? '#20211f' : '#fff', color: tm.sel ? '#f6f2ec' : '#3a3e43', fontSize: 13, cursor: 'pointer', fontFamily: "'Manrope',sans-serif" }}>{tm.t}</button>
                ))}
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={c.namePh} style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(20,25,30,.15)', borderRadius: 8, fontSize: 14, marginBottom: 12, fontFamily: "'Manrope',sans-serif", color: '#20211f', background: '#fbf9f4', outline: 'none' }} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={c.phonePh} style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(20,25,30,.15)', borderRadius: 8, fontSize: 14, marginBottom: 18, fontFamily: "'Manrope',sans-serif", color: '#20211f', background: '#fbf9f4', outline: 'none' }} />
              <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 16, borderRadius: 100, textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: '.03em', background: confirmBg, color: confirmColor, pointerEvents: canConfirm ? 'auto' : 'none', transition: 'opacity .3s' }}>
                <WaIcon />
                {confirmLabel}
              </a>
              <div style={{ fontSize: 12, color: '#a0a5ab', textAlign: 'center', marginTop: 12 }}>{c.agendarNote}</div>
            </div>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section id="contacto" style={{ background: '#0e131a', color: '#f6f2ec' }}>
        <div className="dcol-2" style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'stretch' }}>
          <div style={{ padding: '90px 40px 90px 34px' }}>
            <div style={{ fontSize: 12, letterSpacing: '.32em', color: ACCENT, textTransform: 'uppercase', marginBottom: 18 }}>{c.locEyebrow}</div>
            <h2 style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(28px,3.4vw,42px)', margin: '0 0 30px' }}>{c.locTitle}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 400 }}>
              <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20 }}><div style={{ fontSize: 13, color: 'rgba(246,242,236,.5)', marginBottom: 5 }}>{c.addrLabel}</div><div style={{ fontSize: 16 }}>{c.addr.split('|')[0]}<br />{c.addr.split('|')[1]}</div></div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20 }}><div style={{ fontSize: 13, color: 'rgba(246,242,236,.5)', marginBottom: 5 }}>{c.hoursLabel}</div><div style={{ fontSize: 16 }}>{c.hours.split('|')[0]}<br />{c.hours.split('|')[1]}</div></div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20 }}><div style={{ fontSize: 13, color: 'rgba(246,242,236,.5)', marginBottom: 5 }}>{c.contactLabel}</div><div style={{ fontSize: 16 }}>{WA_NUMBER}<br />hola@auraderma.mx</div></div>
              <a href={MAPS_SEARCH} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, alignSelf: 'flex-start', marginTop: 6, background: ACCENT, color: '#0a0d12', fontSize: 13, fontWeight: 600, letterSpacing: '.03em', padding: '13px 22px', borderRadius: 100, textDecoration: 'none' }}>{c.directions} <span style={{ fontSize: 15 }}>→</span></a>
            </div>
          </div>
          <div style={{ minHeight: 460, position: 'relative', background: '#0a0d12', overflow: 'hidden' }}>
            <iframe title="AURA map" src="https://maps.google.com/maps?q=Paseo%20de%20las%20Palmas%20340%2C%20Lomas%20de%20Chapultepec%2C%20CDMX&t=&z=15&ie=UTF8&iwloc=&output=embed" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, filter: 'grayscale(.25) contrast(1.05)' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <a href={MAPS_SEARCH} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', bottom: 18, left: 18, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#20211f', fontSize: 13, fontWeight: 600, padding: '11px 16px', borderRadius: 100, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.28)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill={ACCENT}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" /></svg>
              {c.viewMaps}
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#080b0f', color: 'rgba(246,242,236,.55)', padding: '50px 34px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Marcellus',serif", fontSize: 22, letterSpacing: '.34em', color: '#f6f2ec', marginBottom: 14 }}>AURA</div>
        <div style={{ fontSize: 13, letterSpacing: '.04em' }}>{c.footerTagline}</div>
        <div style={{ fontSize: 12, marginTop: 18, color: 'rgba(246,242,236,.35)' }}>{c.footerRights}</div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href={waFloat} target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: 26, right: 26, zIndex: 70, width: 58, height: 58, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(37,211,102,.4)', textDecoration: 'none', color: '#fff' }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #25D366', animation: 'waRing 2.2s ease-out infinite' }} />
        <WaIcon size={30} />
      </a>
    </div>
  )
}

function DoorText({ tagline }: { tagline: string }) {
  return (
    <div style={{ position: 'absolute', left: '50%', top: '37%', transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
      <div style={{ fontFamily: "'Marcellus',serif", fontSize: 'clamp(48px,7.6vw,126px)', letterSpacing: '.34em', paddingLeft: '.34em', color: '#ffffff', lineHeight: 1, textShadow: '0 3px 24px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.45)' }}>AURA</div>
      <div style={{ marginTop: 16, fontSize: 'clamp(10px,1.3vw,15px)', letterSpacing: '.5em', color: 'rgba(255,255,255,.96)', textTransform: 'uppercase', textShadow: '0 1px 10px rgba(0,0,0,.55)' }}>{tagline}</div>
    </div>
  )
}
