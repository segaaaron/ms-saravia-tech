'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import type { DemoLang } from '../lang'

/* ============================================================
   PULSE / FITLIFE GYM — vista Socio (demo). Port nativo
   Next.js del diseño original .dc.html, misma info y mismo
   diseño. Bilingüe (es/en) según el sitio. Assets locales
   viven en /showcase/uploads (public).
   ============================================================ */

const slot = (p: string) => `/showcase/${p}`

/* ---- iconos (lucide) reproducidos como SVG inline ---- */
const ICONS: Record<string, ReactNode> = {
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  home: (
    <>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  'calendar-days': (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </>
  ),
  'credit-card': (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </>
  ),
  bell: (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </>
  ),
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  'check-circle-2': (
    <>
      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
      <path d="m9 11 3 3L22 4" />
    </>
  ),
  'heart-pulse': (
    <>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  circle: <circle cx="12" cy="12" r="10" />,
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  receipt: (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </>
  ),
}

function Icon({ name, size = 16, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {ICONS[name]}
    </svg>
  )
}

/* ---- image-slot resuelto a imagen real (cover) ---- */
function Slot({ src, style }: { src: string; style: CSSProperties }) {
  return <div style={{ backgroundImage: `url(${slot(src)})`, backgroundSize: 'cover', backgroundPosition: 'center', ...style }} />
}

type ClassItem = { name: string; coach: string; time: string; cap: number; taken: number; booked: boolean; waitlisted?: boolean }
type Exercise = { n: string; d: boolean }
type Routine = { name: string; focus: string; level: string; dur: string; icon: string; ex: Exercise[] }

/* ---- datos NO traducibles (logica, nombres propios, fotos) ---- */
const CLASS_STATS: Omit<ClassItem, 'name'>[] = [
  { coach: 'Nadia', time: '07:00', cap: 20, taken: 14, booked: false },
  { coach: 'Bruno', time: '08:30', cap: 24, taken: 22, booked: false },
  { coach: 'Elena', time: '12:00', cap: 16, taken: 16, booked: false },
  { coach: 'Mora', time: '18:00', cap: 18, taken: 10, booked: true },
  { coach: 'Iván', time: '19:00', cap: 20, taken: 17, booked: false },
  { coach: 'Leo', time: '20:30', cap: 14, taken: 6, booked: false },
]

const ROUTINE_META: { dur: string; icon: string; done: boolean[] }[] = [
  { dur: '52 min', icon: 'dumbbell', done: [true, true, false, false] },
  { dur: '58 min', icon: 'flame', done: [false, false, false, false] },
  { dur: '35 min', icon: 'heart-pulse', done: [true, false, false, false] },
]

const CLASS_PHOTOS = ['uploads/training_1_web.png', 'uploads/gym_5_web.png', 'uploads/gym_4_web.png', 'uploads/training_1_web.png', 'uploads/gym_3_web.png', 'uploads/training_1_web.png']
const EX_PHOTOS = ['uploads/gym_4_web.png', 'uploads/gym_3_web.png', 'uploads/training_1_web.png', 'uploads/gym_5_web.png']
const R_ICON: Record<string, { bg: string; c: string }> = { dumbbell: { bg: '#e8effd', c: '#3b5bdb' }, flame: { bg: '#fdeee2', c: '#d97706' }, 'heart-pulse': { bg: '#e7f6ec', c: '#16a34a' } }

const GYM_AREA_META = [
  { slotId: 'area-musculacion', photo: 'uploads/gym_4_web.png' },
  { slotId: 'area-funcional', photo: 'uploads/training_1_web.png' },
  { slotId: 'area-cardio', photo: 'uploads/gym_5_web.png' },
  { slotId: 'area-clases', photo: 'uploads/gym_3_web.png' },
]

type Content = {
  socio: string
  nav: { inicio: string; clases: string; rutina: string; pagos: string }
  memberName: string
  planTag: string
  greeting: string
  streakPre: string
  streakDays: string
  streakPost: string
  bannerKicker: string
  bannerTitle: string
  membershipLabel: string
  membershipStatus: string
  planElite: string
  nextChargeCard: string
  verPagos: string
  rachaActual: string
  dias: string
  mejorMarca: string
  metaSemanal: string
  rutinaHoy: string
  verRutina: string
  proximaClase: string
  proximaClaseCoach: string
  reservado: string
  reservarMas: string
  tuGimnasio: string
  instalaciones: string
  areas: { name: string; detail: string }[]
  classesTitle: string
  classesSub: string
  classDur: string
  classes: string[]
  btnReservado: string
  btnEnEspera: string
  btnUnirse: string
  btnReservar: string
  sinLugares: string
  lugaresLibres: string
  rutinaTitle: string
  rutinaSub: string
  marcarCompletado: string
  routines: { name: string; focus: string; level: string; ex: string[] }[]
  pagosTitle: string
  pagosSub: string
  tuPlan: string
  planName: string
  perMonth: string
  nextChargeLabel: string
  nextChargeDate: string
  cambiarMetodo: string
  cambiarPlan: string
  alDiaBig: string
  ultimaCuota: string
  historial: string
  thConcepto: string
  thFecha: string
  thMonto: string
  thEstado: string
  payments: { concept: string; date: string; amount: string }[]
  pagado: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    socio: 'Socio',
    nav: { inicio: 'Inicio', clases: 'Clases', rutina: 'Mi rutina', pagos: 'Mis pagos' },
    memberName: 'Sofía Marín',
    planTag: 'Plan Elite',
    greeting: 'Hola, Sofía 👋',
    streakPre: 'Llevás ',
    streakDays: '12 días',
    streakPost: ' de racha. Hoy toca tren superior.',
    bannerKicker: 'Iron House · Sede Centro',
    bannerTitle: 'Hoy hay mucho ambiente 💪',
    membershipLabel: 'Tu membresía',
    membershipStatus: 'Al día',
    planElite: 'Plan Elite',
    nextChargeCard: 'Próximo cobro: 5 ago · $89',
    verPagos: 'Ver mis pagos',
    rachaActual: 'Racha actual',
    dias: 'días',
    mejorMarca: '¡Tu mejor marca! 🔥',
    metaSemanal: 'Meta semanal',
    rutinaHoy: 'Tu rutina de hoy · Tren superior',
    verRutina: 'Ver rutina',
    proximaClase: 'Tu próxima clase',
    proximaClaseCoach: 'Mora · 50 min',
    reservado: 'Reservado',
    reservarMas: 'Reservar más clases',
    tuGimnasio: 'Tu gimnasio',
    instalaciones: 'Instalaciones y equipamiento',
    areas: [
      { name: 'Sala de musculación', detail: 'Peso libre y máquinas' },
      { name: 'Zona funcional', detail: 'Cross training y libres' },
      { name: 'Cardio', detail: 'Cintas, bici y elíptica' },
      { name: 'Salón de clases', detail: 'Yoga, spinning y HIIT' },
    ],
    classesTitle: 'Reservar clases',
    classesSub: 'Clases de hoy · elegí tu horario',
    classDur: '50 min',
    classes: ['Funcional HIIT', 'Spinning', 'CrossFit WOD', 'Yoga Flow', 'Fuerza total', 'Boxeo'],
    btnReservado: '✓ Reservado',
    btnEnEspera: '✓ En lista de espera',
    btnUnirse: 'Unirse a lista de espera',
    btnReservar: 'Reservar lugar',
    sinLugares: 'Sin lugares',
    lugaresLibres: 'lugares libres',
    rutinaTitle: 'Mi rutina',
    rutinaSub: 'Asignada por tu coach · tocá para marcar completado',
    marcarCompletado: 'Marcar completado',
    routines: [
      { name: 'Tren superior', focus: 'Pecho · Espalda', level: 'Intermedio', ex: ['Press de banca 4×8', 'Remo con barra 4×10', 'Press militar 4×8', 'Dominadas 3×máx'] },
      { name: 'Piernas', focus: 'Cuádriceps · Glúteo', level: 'Avanzado', ex: ['Sentadilla 5×5', 'Peso muerto 4×6', 'Prensa 4×12', 'Zancadas 3×12'] },
      { name: 'Core & Cardio', focus: 'Abdomen', level: 'Principiante', ex: ['Plancha 3×60s', 'Russian twist 3×20', 'Mountain climber 3×30', 'Bicicleta 3×20'] },
    ],
    pagosTitle: 'Mis pagos',
    pagosSub: 'Tu membresía y tu historial de cobros',
    tuPlan: 'Tu plan',
    planName: 'Elite',
    perMonth: '· $89/mes',
    nextChargeLabel: 'Próximo cobro:',
    nextChargeDate: '5 ago 2026',
    cambiarMetodo: 'Cambiar método',
    cambiarPlan: 'Cambiar plan',
    alDiaBig: 'Estás al día',
    ultimaCuota: 'Tu última cuota se pagó el 5 jul',
    historial: 'Historial de pagos',
    thConcepto: 'Concepto',
    thFecha: 'Fecha',
    thMonto: 'Monto',
    thEstado: 'Estado',
    payments: [
      { concept: 'Cuota mensual · Elite', date: '5 jul 2026', amount: '$89' },
      { concept: 'Cuota mensual · Elite', date: '5 jun 2026', amount: '$89' },
      { concept: 'Cuota mensual · Elite', date: '5 may 2026', amount: '$89' },
      { concept: 'Cuota mensual · Pro', date: '5 abr 2026', amount: '$59' },
      { concept: 'Matrícula de ingreso', date: '2 abr 2026', amount: '$40' },
    ],
    pagado: 'Pagado',
  },
  en: {
    socio: 'Member',
    nav: { inicio: 'Home', clases: 'Classes', rutina: 'My workout', pagos: 'My payments' },
    memberName: 'Sofía Marín',
    planTag: 'Elite Plan',
    greeting: 'Hi, Sofía 👋',
    streakPre: "You're on a ",
    streakDays: '12-day',
    streakPost: ' streak. Upper body today.',
    bannerKicker: 'Iron House · Downtown Location',
    bannerTitle: "It's buzzing today 💪",
    membershipLabel: 'Your membership',
    membershipStatus: 'Up to date',
    planElite: 'Elite Plan',
    nextChargeCard: 'Next charge: Aug 5 · $89',
    verPagos: 'View my payments',
    rachaActual: 'Current streak',
    dias: 'days',
    mejorMarca: 'Your best yet! 🔥',
    metaSemanal: 'Weekly goal',
    rutinaHoy: "Today's workout · Upper body",
    verRutina: 'View workout',
    proximaClase: 'Your next class',
    proximaClaseCoach: 'Mora · 50 min',
    reservado: 'Booked',
    reservarMas: 'Book more classes',
    tuGimnasio: 'Your gym',
    instalaciones: 'Facilities & equipment',
    areas: [
      { name: 'Weight room', detail: 'Free weights & machines' },
      { name: 'Functional zone', detail: 'Cross training & open floor' },
      { name: 'Cardio', detail: 'Treadmills, bike & elliptical' },
      { name: 'Studio', detail: 'Yoga, spinning & HIIT' },
    ],
    classesTitle: 'Book classes',
    classesSub: 'Today’s classes · pick your time',
    classDur: '50 min',
    classes: ['Functional HIIT', 'Spinning', 'CrossFit WOD', 'Yoga Flow', 'Total Strength', 'Boxing'],
    btnReservado: '✓ Booked',
    btnEnEspera: '✓ On waitlist',
    btnUnirse: 'Join waitlist',
    btnReservar: 'Book a spot',
    sinLugares: 'Full',
    lugaresLibres: 'spots left',
    rutinaTitle: 'My workout',
    rutinaSub: 'Assigned by your coach · tap to mark complete',
    marcarCompletado: 'Mark complete',
    routines: [
      { name: 'Upper body', focus: 'Chest · Back', level: 'Intermediate', ex: ['Bench press 4×8', 'Barbell row 4×10', 'Overhead press 4×8', 'Pull-ups 3×max'] },
      { name: 'Legs', focus: 'Quads · Glutes', level: 'Advanced', ex: ['Squat 5×5', 'Deadlift 4×6', 'Leg press 4×12', 'Lunges 3×12'] },
      { name: 'Core & Cardio', focus: 'Abs', level: 'Beginner', ex: ['Plank 3×60s', 'Russian twist 3×20', 'Mountain climber 3×30', 'Bicycle crunch 3×20'] },
    ],
    pagosTitle: 'My payments',
    pagosSub: 'Your membership and billing history',
    tuPlan: 'Your plan',
    planName: 'Elite',
    perMonth: '· $89/mo',
    nextChargeLabel: 'Next charge:',
    nextChargeDate: 'Aug 5, 2026',
    cambiarMetodo: 'Change method',
    cambiarPlan: 'Change plan',
    alDiaBig: "You're all set",
    ultimaCuota: 'Your last payment was on Jul 5',
    historial: 'Payment history',
    thConcepto: 'Concept',
    thFecha: 'Date',
    thMonto: 'Amount',
    thEstado: 'Status',
    payments: [
      { concept: 'Monthly fee · Elite', date: 'Jul 5, 2026', amount: '$89' },
      { concept: 'Monthly fee · Elite', date: 'Jun 5, 2026', amount: '$89' },
      { concept: 'Monthly fee · Elite', date: 'May 5, 2026', amount: '$89' },
      { concept: 'Monthly fee · Pro', date: 'Apr 5, 2026', amount: '$59' },
      { concept: 'Enrollment fee', date: 'Apr 2, 2026', amount: '$40' },
    ],
    pagado: 'Paid',
  },
}

export default function PulseSocioClient({ lang }: { lang: DemoLang }) {
  const t = CONTENT[lang]
  const [view, setView] = useState<'inicio' | 'clases' | 'rutina' | 'pagos'>('inicio')
  const [classes, setClasses] = useState<ClassItem[]>(() => CLASS_STATS.map((s, i) => ({ ...s, name: t.classes[i] })))
  const [routines, setRoutines] = useState<Routine[]>(() =>
    t.routines.map((r, ri) => ({
      name: r.name,
      focus: r.focus,
      level: r.level,
      dur: ROUTINE_META[ri].dur,
      icon: ROUTINE_META[ri].icon,
      ex: r.ex.map((n, ei) => ({ n, d: ROUTINE_META[ri].done[ei] })),
    })),
  )

  const nav = (v: typeof view) => setView(v)

  const book = (i: number) =>
    setClasses((s) => {
      const cl = s.slice()
      const c = { ...cl[i] }
      if (!c.booked && c.taken < c.cap) {
        c.taken++
        c.booked = true
      } else if (c.taken >= c.cap && !c.booked && !c.waitlisted) {
        c.waitlisted = true
      }
      cl[i] = c
      return cl
    })

  const toggleEx = (ri: number, ei: number) =>
    setRoutines((s) => {
      const rs = s.slice()
      const r = { ...rs[ri] }
      const ex = r.ex.slice()
      ex[ei] = { ...ex[ei], d: !ex[ei].d }
      r.ex = ex
      rs[ri] = r
      return rs
    })

  /* ---------- renderVals ---------- */
  const circ = 2 * Math.PI * 40
  const pct = 80
  const ringCirc = circ
  const ringOffset = circ * (1 - pct / 100)

  const tab = (k: typeof view, label: string, icon: string) => {
    const a = view === k
    return { key: k, label, icon, onClick: () => nav(k), bg: a ? '#fff' : 'transparent', color: a ? '#3b5bdb' : '#6b7280', weight: a ? '700' : '600' }
  }
  const tabs = [tab('inicio', t.nav.inicio, 'home'), tab('clases', t.nav.clases, 'calendar-days'), tab('rutina', t.nav.rutina, 'dumbbell'), tab('pagos', t.nav.pagos, 'credit-card')]

  const classesView = classes.map((c, i) => {
    const full = c.taken >= c.cap
    const p = Math.round((c.taken / c.cap) * 100)
    const spots = c.cap - c.taken
    let btnLabel: string, btnBg: string, btnColor: string, btnBorder: string, cursor: string
    if (c.booked) {
      btnLabel = t.btnReservado
      btnBg = '#e7f6ec'
      btnColor = '#16a34a'
      btnBorder = '#bfe6cb'
      cursor = 'default'
    } else if (c.waitlisted) {
      btnLabel = t.btnEnEspera
      btnBg = '#fdeee2'
      btnColor = '#d97706'
      btnBorder = '#f3d3a6'
      cursor = 'default'
    } else if (full) {
      btnLabel = t.btnUnirse
      btnBg = '#fff'
      btnColor = '#d97706'
      btnBorder = '#f3d3a6'
      cursor = 'pointer'
    } else {
      btnLabel = t.btnReservar
      btnBg = '#3b5bdb'
      btnColor = '#fff'
      btnBorder = '#3b5bdb'
      cursor = 'pointer'
    }
    const barBg = full ? '#dc2626' : p > 80 ? '#d97706' : '#3b5bdb'
    const cardBorder = c.booked ? '#bfe6cb' : c.waitlisted ? '#f3d3a6' : '#e6e8ec'
    return { name: c.name, coach: c.coach, time: c.time, cap: c.cap, taken: c.taken, pct: p + '%', spotsLabel: full ? t.sinLugares : spots + ' ' + t.lugaresLibres, btnLabel, btnBg, btnColor, btnBorder, cursor, barBg, cardBorder, slotId: 'clase-' + i, photo: CLASS_PHOTOS[i], photoHint: c.name, onBook: () => book(i) }
  })

  const routinesView = routines.map((r, ri) => {
    const done = r.ex.filter((e) => e.d).length
    const p = Math.round((done / r.ex.length) * 100)
    const ic = R_ICON[r.icon]
    return {
      name: r.name,
      focus: r.focus,
      level: r.level,
      dur: r.dur,
      icon: r.icon,
      iconBg: ic.bg,
      iconColor: ic.c,
      pct: p + '%',
      progressLabel: done + '/' + r.ex.length,
      exercises: r.ex.map((e, ei) => ({
        n: e.n,
        slotId: 'ex-' + ri + '-' + ei,
        photo: EX_PHOTOS[ei % 4],
        onToggle: () => toggleEx(ri, ei),
        bg: e.d ? '#f7faf8' : '#fff',
        border: e.d ? '#dcefe1' : '#eceef1',
        checkBg: e.d ? '#16a34a' : '#fff',
        checkBorder: e.d ? '#16a34a' : '#cbd0d6',
        checkIcon: e.d ? 'check' : 'circle',
        textColor: e.d ? '#9aa0a8' : '#171a1f',
        deco: e.d ? 'line-through' : 'none',
      })),
    }
  })

  const r0 = routines[0]
  const todayRoutine = r0.ex.map((e, ei) => ({
    name: e.n.replace(/ [\d×].*$/, ''),
    detail: e.n.match(/[\d×].*$/) ? e.n.match(/[\d×].*$/)![0] : '',
    onToggle: () => toggleEx(0, ei),
    bg: e.d ? '#f7faf8' : '#fff',
    border: e.d ? '#dcefe1' : '#eceef1',
    checkBg: e.d ? '#16a34a' : '#fff',
    checkBorder: e.d ? '#16a34a' : '#cbd0d6',
    checkIcon: e.d ? 'check' : 'circle',
    nameColor: e.d ? '#9aa0a8' : '#171a1f',
    deco: e.d ? 'line-through' : 'none',
  }))

  const showInicio = view === 'inicio'
  const showClases = view === 'clases'
  const showRutina = view === 'rutina'
  const showPagos = view === 'pagos'

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#f5f6f8', color: '#171a1f', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes growWide{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes ringDraw40{from{stroke-dashoffset:251.3px}}
      `}</style>

      {/* TOP BAR */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '14px 40px', background: '#fff', borderBottom: '1px solid #e6e8ec' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#3b5bdb', display: 'grid', placeItems: 'center' }}>
            <Icon name="activity" size={19} style={{ color: '#fff', width: 19, height: 19 }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.01em' }}>
            FITLIFE <span style={{ color: '#3b5bdb' }}>GYM</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', background: '#f0f1f4', padding: '4px 9px', borderRadius: 20, marginLeft: 4 }}>{t.socio}</span>
        </div>
        <nav style={{ display: 'flex', gap: 4, background: '#f5f6f8', padding: 4, borderRadius: 12 }}>
          {tabs.map((t) => (
            <div key={t.key} onClick={t.onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: t.weight, color: t.color, background: t.bg }}>
              <Icon name={t.icon} size={16} style={{ width: 16, height: 16 }} /> {t.label}
            </div>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e2e5e9', display: 'grid', placeItems: 'center', color: '#6b7280', cursor: 'pointer' }}>
            <Icon name="bell" size={18} style={{ width: 18, height: 18 }} />
            <span style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: '50%', background: '#3b5bdb', border: '1.5px solid #fff' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#e8effd', color: '#3b5bdb', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>SM</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.memberName}</div>
              <div style={{ fontSize: 11, color: '#9aa0a8' }}>{t.planTag}</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, maxWidth: 1080, width: '100%', margin: '0 auto', padding: '28px 40px 48px' }}>
        {/* ===== INICIO ===== */}
        {showInicio && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp .35s ease both' }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>{t.greeting}</h1>
              <p style={{ fontSize: 15, color: '#6b7280', marginTop: 4 }}>
                {t.streakPre}<b style={{ color: '#171a1f' }}>{t.streakDays}</b>{t.streakPost}
              </p>
            </div>

            <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', border: '1px solid #e6e8ec' }}>
              <Slot src="uploads/gym_3_web.png" style={{ width: '100%', height: 240, display: 'block' }} />
              <div style={{ position: 'absolute', left: 24, bottom: 20, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.5)', pointerEvents: 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.9 }}>{t.bannerKicker}</div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{t.bannerTitle}</div>
              </div>
            </div>

            <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>
              <div style={{ background: '#3b5bdb', borderRadius: 16, padding: 22, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  <span style={{ fontSize: 13, color: '#c7d0f5', fontWeight: 600 }}>{t.membershipLabel}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,.18)', padding: '4px 10px', borderRadius: 20 }}>{t.membershipStatus}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 14, position: 'relative' }}>{t.planElite}</div>
                <div style={{ fontSize: 13, color: '#dbe2fb', marginTop: 4, position: 'relative' }}>{t.nextChargeCard}</div>
                <button onClick={() => nav('pagos')} style={{ marginTop: 18, padding: '10px 16px', border: 'none', borderRadius: 10, background: '#fff', color: '#3b5bdb', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', position: 'relative' }}>{t.verPagos}</button>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{t.rachaActual}</span>
                  <Icon name="flame" size={18} style={{ width: 18, height: 18, color: '#d97706' }} />
                </div>
                <div>
                  <span style={{ fontSize: 38, fontWeight: 800 }}>12</span>
                  <span style={{ fontSize: 14, color: '#9aa0a8', marginLeft: 5 }}>{t.dias}</span>
                </div>
                <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>{t.mejorMarca}</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: 22, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 8 }}>{t.metaSemanal}</div>
                <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto' }}>
                  <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#eef0f3" strokeWidth="9" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#3b5bdb" strokeWidth="9" strokeLinecap="round" strokeDasharray={ringCirc} strokeDashoffset={ringOffset} style={{ animation: 'ringDraw40 1.1s ease .15s both' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 }}>4/5</div>
                </div>
              </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
              <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '22px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t.rutinaHoy}</h3>
                  <span onClick={() => nav('rutina')} style={{ fontSize: 13, color: '#3b5bdb', cursor: 'pointer', fontWeight: 600 }}>{t.verRutina}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {todayRoutine.map((ex, i) => (
                    <div key={i} onClick={ex.onToggle} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 11, cursor: 'pointer', background: ex.bg, border: `1px solid ${ex.border}` }}>
                      <div style={{ width: 24, height: 24, borderRadius: 7, display: 'grid', placeItems: 'center', background: ex.checkBg, border: `1.5px solid ${ex.checkBorder}`, color: '#fff' }}>
                        <Icon name={ex.checkIcon} size={14} style={{ width: 14, height: 14 }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: ex.nameColor, textDecoration: ex.deco }}>{ex.name}</div>
                      </div>
                      <div style={{ fontSize: 13, color: '#9aa0a8', fontWeight: 600 }}>{ex.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '22px 24px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{t.proximaClase}</h3>
                <div style={{ border: '1px solid #e6e8ec', borderRadius: 13, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Yoga Flow</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#3b5bdb' }}>18:00</div>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="user" size={14} style={{ width: 14, height: 14 }} /> {t.proximaClaseCoach}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16a34a', fontWeight: 600, marginTop: 12 }}>
                    <Icon name="check-circle-2" size={14} style={{ width: 14, height: 14 }} /> {t.reservado}
                  </div>
                </div>
                <button onClick={() => nav('clases')} style={{ width: '100%', marginTop: 14, padding: 11, border: '1px solid #dbe2fb', borderRadius: 11, background: '#eef1fd', color: '#3b5bdb', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>{t.reservarMas}</button>
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t.tuGimnasio}</h3>
                <span style={{ fontSize: 13, color: '#9aa0a8' }}>{t.instalaciones}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                {GYM_AREA_META.map((a, i) => (
                  <div key={a.slotId} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e6e8ec', background: '#fff' }}>
                    <Slot src={a.photo} style={{ width: '100%', height: 130, display: 'block' }} />
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{t.areas[i].name}</div>
                      <div style={{ fontSize: 12, color: '#9aa0a8', marginTop: 2 }}>{t.areas[i].detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===== CLASES ===== */}
        {showClases && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{t.classesTitle}</h1>
              <p style={{ fontSize: 14, color: '#6b7280', marginTop: 3 }}>{t.classesSub}</p>
            </div>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {classesView.map((c) => (
                <div key={c.slotId} style={{ background: '#fff', border: `1px solid ${c.cardBorder}`, borderRadius: 14, overflow: 'hidden' }}>
                  <Slot src={c.photo} style={{ width: '100%', height: 140, display: 'block', borderBottom: '1px solid #eceef1' }} />
                  <div style={{ padding: '18px 20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
                          <Icon name="user" size={14} style={{ width: 14, height: 14 }} /> {c.coach}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#3b5bdb' }}>{c.time}</div>
                        <div style={{ fontSize: 12, color: '#9aa0a8' }}>{t.classDur}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 7 }}>
                        <span>{c.spotsLabel}</span>
                        <span style={{ fontWeight: 600 }}>{c.taken}/{c.cap}</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 20, background: '#eef0f3', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: c.pct, borderRadius: 20, background: c.barBg, transformOrigin: 'left', animation: 'growWide .8s ease both' }} />
                      </div>
                    </div>
                    <button onClick={c.onBook} style={{ width: '100%', padding: 11, borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: c.cursor, background: c.btnBg, color: c.btnColor, border: `1px solid ${c.btnBorder}` }}>{c.btnLabel}</button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* ===== RUTINA ===== */}
        {showRutina && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{t.rutinaTitle}</h1>
              <p style={{ fontSize: 14, color: '#6b7280', marginTop: 3 }}>{t.rutinaSub}</p>
            </div>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {routinesView.map((r, ri) => (
                <div key={ri} style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: '#9aa0a8', marginTop: 3 }}>{r.focus} · {r.level} · {r.dur}</div>
                    </div>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: r.iconBg, display: 'grid', placeItems: 'center', color: r.iconColor }}>
                      <Icon name={r.icon} size={20} style={{ width: 20, height: 20 }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 16px' }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 20, background: '#eef0f3', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: r.pct, borderRadius: 20, background: '#3b5bdb', transformOrigin: 'left', animation: 'growWide .8s ease both' }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>{r.progressLabel}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {r.exercises.map((ex, ei) => (
                      <div key={ei} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 11px', borderRadius: 10, background: ex.bg, border: `1px solid ${ex.border}` }}>
                        <Slot src={ex.photo} style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 8 }} />
                        <span style={{ flex: 1, fontSize: 14, color: ex.textColor, textDecoration: ex.deco }}>{ex.n}</span>
                        <div onClick={ex.onToggle} title={t.marcarCompletado} style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', cursor: 'pointer', background: ex.checkBg, border: `1.5px solid ${ex.checkBorder}`, color: '#fff', flexShrink: 0 }}>
                          <Icon name={ex.checkIcon} size={15} style={{ width: 15, height: 15 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* ===== PAGOS (solo del socio) ===== */}
        {showPagos && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{t.pagosTitle}</h1>
              <p style={{ fontSize: 14, color: '#6b7280', marginTop: 3 }}>{t.pagosSub}</p>
            </div>
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{t.tuPlan}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 28, fontWeight: 800 }}>{t.planName}</span>
                  <span style={{ fontSize: 15, color: '#9aa0a8' }}>{t.perMonth}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 14, color: '#2d3138' }}>
                  <Icon name="calendar" size={16} style={{ width: 16, height: 16, color: '#6b7280' }} /> {t.nextChargeLabel} <b>{t.nextChargeDate}</b>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 14, color: '#2d3138' }}>
                  <Icon name="credit-card" size={16} style={{ width: 16, height: 16, color: '#6b7280' }} /> Visa •••• 4291
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button style={{ padding: '10px 16px', border: '1px solid #e2e5e9', borderRadius: 10, background: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{t.cambiarMetodo}</button>
                  <button style={{ padding: '10px 16px', border: '1px solid #e2e5e9', borderRadius: 10, background: '#fff', color: '#6b7280', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{t.cambiarPlan}</button>
                </div>
              </div>
              <div style={{ background: '#e7f6ec', border: '1px solid #bfe6cb', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#16a34a', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Icon name="check" size={26} style={{ width: 26, height: 26 }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, marginTop: 14, color: '#14663f' }}>{t.alDiaBig}</div>
                <div style={{ fontSize: 13, color: '#2f7a56', marginTop: 4 }}>{t.ultimaCuota}</div>
              </div>
            </section>
            <section style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #eceef1', fontSize: 16, fontWeight: 700 }}>{t.historial}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 16, padding: '12px 22px', fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: '#9aa0a8', fontWeight: 700, borderBottom: '1px solid #f0f1f4', background: '#fafbfc' }}>
                <span>{t.thConcepto}</span>
                <span>{t.thFecha}</span>
                <span>{t.thMonto}</span>
                <span>{t.thEstado}</span>
              </div>
              {t.payments.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 16, alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid #f2f3f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#e8effd', display: 'grid', placeItems: 'center', color: '#3b5bdb' }}>
                      <Icon name="receipt" size={17} style={{ width: 17, height: 17 }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{p.concept}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{p.date}</span>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{p.amount}</span>
                  <span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#16a34a', background: '#e7f6ec' }}>
                      <Icon name="check" size={13} style={{ width: 13, height: 13 }} /> {t.pagado}
                    </span>
                  </span>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
