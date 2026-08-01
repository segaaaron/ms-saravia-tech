'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import type { DemoLang } from '../types'

/* ============================================================
   PULSE — FITLIFE GYM · Panel de gestión (demo).
   Port nativo Next.js del diseño original .dc.html, misma
   info y mismo diseño. Iconos lucide reproducidos como SVG
   inline (sin dependencias nuevas).
   ============================================================ */

const USER_NAME = 'Roman'

/* ---- lucide icons (inline SVG, viewBox 0 0 24 24) ---- */
const ICON_PATHS: Record<string, ReactNode> = {
  activity: <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />,
  'layout-dashboard': (
    <>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
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
      <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" />
      <path d="m2.5 21.5 1.4-1.4" />
      <path d="m20.1 3.9 1.4-1.4" />
      <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" />
      <path d="m9.6 14.4 4.8-4.8" />
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
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  'log-in': (
    <>
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </>
  ),
  'dollar-sign': (
    <>
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  gauge: (
    <>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  'user-plus': (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </>
  ),
  'user-check': (
    <>
      <path d="m16 11 2 2 4-4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  'user-x': (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" x2="22" y1="8" y2="13" />
      <line x1="22" x2="17" y1="8" y2="13" />
    </>
  ),
  'alert-triangle': (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </>
  ),
  'calendar-check': (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  flame: <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />,
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  circle: <circle cx="12" cy="12" r="10" />,
  search: (
    <>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </>
  ),
  'more-horizontal': (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  'heart-pulse': (
    <>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      <path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  'check-circle-2': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'qr-code': (
    <>
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
}

function Icon({ name, size = 24, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

/* ---- data ---- */
type StatusKey = 'activo' | 'nuevo' | 'vencido' | 'congelado'
type Member = { n: string; e: string; plan: string; st: StatusKey; last: string; a: number }
type GymClass = { name: string; coach: string; time: string; cap: number; taken: number; booked: boolean; waitlisted?: boolean }
type Exercise = { n: string; d: boolean }
type Routine = { name: string; focus: string; level: string; dur: string; icon: string; ex: Exercise[] }

const AV = [
  { bg: '#e8effd', color: '#3b5bdb' },
  { bg: '#e7f6ec', color: '#16a34a' },
  { bg: '#fdeee2', color: '#d97706' },
  { bg: '#f3ebfd', color: '#7c3aed' },
  { bg: '#fdecec', color: '#dc2626' },
]

const ST: Record<StatusKey, { c: string; bg: string }> = {
  activo: { c: '#16a34a', bg: '#e7f6ec' },
  nuevo: { c: '#3b5bdb', bg: '#e8effd' },
  vencido: { c: '#dc2626', bg: '#fdecec' },
  congelado: { c: '#6b7280', bg: '#f1f2f4' },
}

/* ---- bilingual content (es/en) según el sitio ---- */
type Content = {
  brandSub: string
  menu: string
  role: string
  nav: { panel: string; miembros: string; agenda: string; rutinas: string; pagos: string }
  titles: Record<'panel' | 'miembros' | 'agenda' | 'rutinas' | 'pagos', string>
  ctas: Record<'panel' | 'miembros' | 'agenda' | 'rutinas' | 'pagos', string>
  days: string[]
  months: string[]
  weekdaysShort: string[]
  status: Record<StatusKey, string>
  plans: Record<string, string>
  classNames: Record<string, string>
  routineNames: Record<string, string>
  focus: Record<string, string>
  levels: Record<string, string>
  exercises: Record<string, string>
  kpiLabels: { checkins: string; revenue: string; occupancy: string; activeMembers: string }
  kpiDeltas: { checkins: string; revenue: string; occupancy: string; activeMembers: string }
  weeklyAttendance: string
  checkinsPerDay: string
  last7Days: string
  weeklyGoal: string
  goalSessions: string
  goalAheadPre: string
  goalAheadBold: string
  goalAheadPost: string
  todayRoutinePrefix: string
  library: string
  upcomingClasses: string
  viewSchedule: string
  tagFull: string
  tagAlmost: string
  tagAvailable: string
  memberStats: { active: string; new: string; expired: string; total: string }
  atRiskTitle: string
  atRiskDesc: (n: number) => string
  lastVisit: string
  contact: string
  searchMembers: string
  membersCount: string
  colMember: string
  colPlan: string
  colStatus: string
  colLastVisit: string
  noResults: (q: string) => string
  weeklyCalendar: string
  currentWeek: string
  todayClasses: string
  roomFull: string
  spotsLeft: (n: number) => string
  btnBooked: string
  btnWaitlisted: string
  btnJoinWaitlist: string
  btnBook: string
  min: string
  tapExercises: string
  mrrDelta: string
  collectedThisMonth: string
  successfulCharges: string
  pending: string
  overduePayments: string
  recentTransactions: string
  colAmount: string
  txPaid: string
  txOverdue: string
  planTag: (plan: string) => string
  visitsMonth: string
  streakDays: string
  memberSince: (last: string) => string
  recentPayments: string
  feeLabel: (plan: string) => string
  recordCharge: string
  message: string
  memberCheckin: string
  scanQr: string
  orSearchName: string
  recentCheckins: string
  searchMemberKiosk: string
  notifications: string
  markRead: string
  notifTitles: string[]
  rel: (s: string) => string
}

const IDENTITY = <T extends Record<string, string>>(o: T): T => o

const esClassNames = IDENTITY({ 'Funcional HIIT': 'Funcional HIIT', Spinning: 'Spinning', 'CrossFit WOD': 'CrossFit WOD', 'Yoga Flow': 'Yoga Flow', 'Fuerza total': 'Fuerza total', Boxeo: 'Boxeo' })
const enClassNames = { 'Funcional HIIT': 'Functional HIIT', Spinning: 'Spinning', 'CrossFit WOD': 'CrossFit WOD', 'Yoga Flow': 'Yoga Flow', 'Fuerza total': 'Total Strength', Boxeo: 'Boxing' }

const CONTENT: Record<DemoLang, Content> = {
  es: {
    brandSub: 'Panel de gestión',
    menu: 'Menú',
    role: 'Admin · Sede Centro',
    nav: { panel: 'Panel', miembros: 'Miembros', agenda: 'Agenda', rutinas: 'Rutinas', pagos: 'Pagos' },
    titles: { panel: 'Panel general', miembros: 'Miembros', agenda: 'Agenda de clases', rutinas: 'Rutinas & programas', pagos: 'Pagos & suscripciones' },
    ctas: { panel: 'Registrar check-in', miembros: 'Nuevo miembro', agenda: 'Nueva clase', rutinas: 'Crear rutina', pagos: 'Registrar cobro' },
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    weekdaysShort: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    status: { activo: 'Activo', nuevo: 'Nuevo', vencido: 'Vencido', congelado: 'Congelado' },
    plans: { Elite: 'Elite', Pro: 'Pro', 'Básico': 'Básico' },
    classNames: esClassNames,
    routineNames: { 'Tren superior': 'Tren superior', Piernas: 'Piernas', 'Core & Cardio': 'Core & Cardio', 'Full body express': 'Full body express' },
    focus: { 'Pecho · Espalda': 'Pecho · Espalda', 'Cuádriceps · Glúteo': 'Cuádriceps · Glúteo', Abdomen: 'Abdomen', 'Todo el cuerpo': 'Todo el cuerpo' },
    levels: { Intermedio: 'Intermedio', Avanzado: 'Avanzado', Principiante: 'Principiante' },
    exercises: {
      'Press de banca 4×8': 'Press de banca 4×8', 'Remo con barra 4×10': 'Remo con barra 4×10', 'Press militar 4×8': 'Press militar 4×8', 'Dominadas 3×máx': 'Dominadas 3×máx',
      'Sentadilla 5×5': 'Sentadilla 5×5', 'Peso muerto 4×6': 'Peso muerto 4×6', 'Prensa 4×12': 'Prensa 4×12', 'Zancadas 3×12': 'Zancadas 3×12',
      'Plancha 3×60s': 'Plancha 3×60s', 'Russian twist 3×20': 'Russian twist 3×20', 'Mountain climber 3×30': 'Mountain climber 3×30', 'Bicicleta 3×20': 'Bicicleta 3×20',
      'Thruster 4×10': 'Thruster 4×10', 'Burpees 4×12': 'Burpees 4×12', 'Kettlebell swing 4×15': 'Kettlebell swing 4×15', 'Remo 500m': 'Remo 500m',
    },
    kpiLabels: { checkins: 'Check-ins hoy', revenue: 'Ingresos del día', occupancy: 'Ocupación clases', activeMembers: 'Miembros activos' },
    kpiDeltas: { checkins: '+12% vs ayer', revenue: '+5% vs ayer', occupancy: 'Pico 19:00', activeMembers: '2 nuevos hoy' },
    weeklyAttendance: 'Asistencia semanal',
    checkinsPerDay: 'Check-ins por día',
    last7Days: 'Últimos 7 días',
    weeklyGoal: 'Meta semanal',
    goalSessions: '4 de 5 sesiones',
    goalAheadPre: 'Vas',
    goalAheadBold: '1 sesión',
    goalAheadPost: 'por encima del plan 👏',
    todayRoutinePrefix: 'Rutina de hoy',
    library: 'Biblioteca',
    upcomingClasses: 'Próximas clases',
    viewSchedule: 'Ver agenda',
    tagFull: 'Completa',
    tagAlmost: 'Casi llena',
    tagAvailable: 'Disponible',
    memberStats: { active: 'Total activos', new: 'Nuevos (mes)', expired: 'Vencidos', total: 'Base total' },
    atRiskTitle: 'Socios en riesgo de baja',
    atRiskDesc: (n) => `${n} socios sin venir hace más de 10 días — contactalos antes de que cancelen`,
    lastVisit: 'Última visita',
    contact: 'Contactar',
    searchMembers: 'Buscar por nombre, email o plan…',
    membersCount: 'miembros',
    colMember: 'Miembro',
    colPlan: 'Plan',
    colStatus: 'Estado',
    colLastVisit: 'Última visita',
    noResults: (q) => `Sin resultados para "${q}"`,
    weeklyCalendar: 'Calendario semanal',
    currentWeek: 'Semana actual',
    todayClasses: 'Clases de hoy · reservá tu lugar',
    roomFull: 'Sala completa · lista de espera',
    spotsLeft: (n) => `${n} lugares libres`,
    btnBooked: '✓ Reservado',
    btnWaitlisted: '✓ En lista de espera',
    btnJoinWaitlist: 'Unirse a lista de espera',
    btnBook: 'Reservar lugar',
    min: 'min',
    tapExercises: 'Tocá los ejercicios para marcarlos completados',
    mrrDelta: '+6.4% mensual',
    collectedThisMonth: 'Cobrado este mes',
    successfulCharges: '312 cobros exitosos',
    pending: 'Pendiente',
    overduePayments: '14 pagos vencidos',
    recentTransactions: 'Transacciones recientes',
    colAmount: 'Monto',
    txPaid: 'Pagado',
    txOverdue: 'Vencido',
    planTag: (plan) => `Plan ${plan}`,
    visitsMonth: 'Visitas / mes',
    streakDays: 'Racha (días)',
    memberSince: (last) => `Miembro desde mar 2025 · última visita ${last}`,
    recentPayments: 'Últimos pagos',
    feeLabel: (plan) => `Cuota ${plan}`,
    recordCharge: 'Registrar cobro',
    message: 'Mensaje',
    memberCheckin: 'Check-in de socios',
    scanQr: 'Escaneá tu QR para ingresar',
    orSearchName: 'o buscá al socio por nombre →',
    recentCheckins: 'Ingresos recientes',
    searchMemberKiosk: 'Buscar socio por nombre…',
    notifications: 'Notificaciones',
    markRead: 'Marcar leídas',
    notifTitles: ['Nuevo socio: Valentina Ruiz', 'Pago vencido · Martín Gómez', 'CrossFit WOD 12:00 completó el cupo', 'Sofía Marín alcanzó 12 días de racha'],
    rel: (s) => s,
  },
  en: {
    brandSub: 'Management panel',
    menu: 'Menu',
    role: 'Admin · Downtown branch',
    nav: { panel: 'Dashboard', miembros: 'Members', agenda: 'Schedule', rutinas: 'Routines', pagos: 'Payments' },
    titles: { panel: 'Overview', miembros: 'Members', agenda: 'Class schedule', rutinas: 'Routines & programs', pagos: 'Payments & subscriptions' },
    ctas: { panel: 'Log check-in', miembros: 'New member', agenda: 'New class', rutinas: 'Create routine', pagos: 'Record payment' },
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: { activo: 'Active', nuevo: 'New', vencido: 'Expired', congelado: 'Frozen' },
    plans: { Elite: 'Elite', Pro: 'Pro', 'Básico': 'Basic' },
    classNames: enClassNames,
    routineNames: { 'Tren superior': 'Upper body', Piernas: 'Legs', 'Core & Cardio': 'Core & Cardio', 'Full body express': 'Full body express' },
    focus: { 'Pecho · Espalda': 'Chest · Back', 'Cuádriceps · Glúteo': 'Quads · Glutes', Abdomen: 'Abs', 'Todo el cuerpo': 'Full body' },
    levels: { Intermedio: 'Intermediate', Avanzado: 'Advanced', Principiante: 'Beginner' },
    exercises: {
      'Press de banca 4×8': 'Bench press 4×8', 'Remo con barra 4×10': 'Barbell row 4×10', 'Press militar 4×8': 'Overhead press 4×8', 'Dominadas 3×máx': 'Pull-ups 3×max',
      'Sentadilla 5×5': 'Squat 5×5', 'Peso muerto 4×6': 'Deadlift 4×6', 'Prensa 4×12': 'Leg press 4×12', 'Zancadas 3×12': 'Lunges 3×12',
      'Plancha 3×60s': 'Plank 3×60s', 'Russian twist 3×20': 'Russian twist 3×20', 'Mountain climber 3×30': 'Mountain climber 3×30', 'Bicicleta 3×20': 'Bicycle crunch 3×20',
      'Thruster 4×10': 'Thruster 4×10', 'Burpees 4×12': 'Burpees 4×12', 'Kettlebell swing 4×15': 'Kettlebell swing 4×15', 'Remo 500m': 'Row 500m',
    },
    kpiLabels: { checkins: 'Check-ins today', revenue: "Today's revenue", occupancy: 'Class occupancy', activeMembers: 'Active members' },
    kpiDeltas: { checkins: '+12% vs yesterday', revenue: '+5% vs yesterday', occupancy: 'Peak 19:00', activeMembers: '2 new today' },
    weeklyAttendance: 'Weekly attendance',
    checkinsPerDay: 'Check-ins per day',
    last7Days: 'Last 7 days',
    weeklyGoal: 'Weekly goal',
    goalSessions: '4 of 5 sessions',
    goalAheadPre: "You're",
    goalAheadBold: '1 session',
    goalAheadPost: 'above plan 👏',
    todayRoutinePrefix: "Today's routine",
    library: 'Library',
    upcomingClasses: 'Upcoming classes',
    viewSchedule: 'View schedule',
    tagFull: 'Full',
    tagAlmost: 'Almost full',
    tagAvailable: 'Available',
    memberStats: { active: 'Total active', new: 'New (month)', expired: 'Expired', total: 'Total base' },
    atRiskTitle: 'Members at risk of churn',
    atRiskDesc: (n) => `${n} members haven't shown up in over 10 days — reach out before they cancel`,
    lastVisit: 'Last visit',
    contact: 'Contact',
    searchMembers: 'Search by name, email or plan…',
    membersCount: 'members',
    colMember: 'Member',
    colPlan: 'Plan',
    colStatus: 'Status',
    colLastVisit: 'Last visit',
    noResults: (q) => `No results for "${q}"`,
    weeklyCalendar: 'Weekly calendar',
    currentWeek: 'Current week',
    todayClasses: "Today's classes · book your spot",
    roomFull: 'Room full · waitlist',
    spotsLeft: (n) => `${n} spots left`,
    btnBooked: '✓ Booked',
    btnWaitlisted: '✓ On waitlist',
    btnJoinWaitlist: 'Join waitlist',
    btnBook: 'Book spot',
    min: 'min',
    tapExercises: 'Tap exercises to mark them complete',
    mrrDelta: '+6.4% monthly',
    collectedThisMonth: 'Collected this month',
    successfulCharges: '312 successful charges',
    pending: 'Pending',
    overduePayments: '14 overdue payments',
    recentTransactions: 'Recent transactions',
    colAmount: 'Amount',
    txPaid: 'Paid',
    txOverdue: 'Overdue',
    planTag: (plan) => `${plan} plan`,
    visitsMonth: 'Visits / month',
    streakDays: 'Streak (days)',
    memberSince: (last) => `Member since Mar 2025 · last visit ${last}`,
    recentPayments: 'Recent payments',
    feeLabel: (plan) => `${plan} fee`,
    recordCharge: 'Record payment',
    message: 'Message',
    memberCheckin: 'Member check-in',
    scanQr: 'Scan your QR to check in',
    orSearchName: 'or search the member by name →',
    recentCheckins: 'Recent check-ins',
    searchMemberKiosk: 'Search member by name…',
    notifications: 'Notifications',
    markRead: 'Mark as read',
    notifTitles: ['New member: Valentina Ruiz', 'Overdue payment · Martín Gómez', 'CrossFit WOD 12:00 reached capacity', 'Sofía Marín hit a 12-day streak'],
    rel: (s) => {
      if (s === 'hoy') return 'today'
      if (s === 'ayer') return 'yesterday'
      const m = s.match(/^hace (\d+) (h|d|min)$/)
      if (m) return m[2] === 'min' ? `${m[1]} min ago` : `${m[1]}${m[2]} ago`
      const m2 = s.match(/^(\d+) d$/)
      if (m2) return `${m2[1]}d`
      return s
    },
  },
}

const CHECKINS = 147
const REVENUE = 2840
const OCC = 83
const RING_PCT = 78

const MEMBERS: Member[] = [
  { n: 'Sofía Marín', e: 'sofia.marin@mail.com', plan: 'Elite', st: 'activo', last: 'hace 2 h', a: 0 },
  { n: 'Diego Torres', e: 'd.torres@mail.com', plan: 'Pro', st: 'activo', last: 'hace 1 d', a: 1 },
  { n: 'Valentina Ruiz', e: 'vale.ruiz@mail.com', plan: 'Básico', st: 'nuevo', last: 'hace 30 min', a: 2 },
  { n: 'Martín Gómez', e: 'm.gomez@mail.com', plan: 'Pro', st: 'vencido', last: 'hace 12 d', a: 3 },
  { n: 'Camila Rossi', e: 'cami.rossi@mail.com', plan: 'Elite', st: 'activo', last: 'hace 4 h', a: 4 },
  { n: 'Lucas Fernández', e: 'lucasf@mail.com', plan: 'Pro', st: 'congelado', last: 'hace 20 d', a: 1 },
  { n: 'Julieta Paz', e: 'juli.paz@mail.com', plan: 'Básico', st: 'activo', last: 'hace 1 d', a: 0 },
  { n: 'Nicolás Vega', e: 'nico.vega@mail.com', plan: 'Elite', st: 'nuevo', last: 'hace 1 h', a: 2 },
  { n: 'Florencia Díaz', e: 'flor.diaz@mail.com', plan: 'Pro', st: 'activo', last: 'hace 6 h', a: 3 },
  { n: 'Tomás Herrera', e: 'tomash@mail.com', plan: 'Básico', st: 'vencido', last: 'hace 9 d', a: 4 },
]

const INITIAL_CLASSES: GymClass[] = [
  { name: 'Funcional HIIT', coach: 'Nadia', time: '07:00', cap: 20, taken: 14, booked: false },
  { name: 'Spinning', coach: 'Bruno', time: '08:30', cap: 24, taken: 22, booked: false },
  { name: 'CrossFit WOD', coach: 'Elena', time: '12:00', cap: 16, taken: 16, booked: false },
  { name: 'Yoga Flow', coach: 'Mora', time: '18:00', cap: 18, taken: 9, booked: false },
  { name: 'Fuerza total', coach: 'Iván', time: '19:00', cap: 20, taken: 17, booked: false },
  { name: 'Boxeo', coach: 'Leo', time: '20:30', cap: 14, taken: 6, booked: false },
]

const INITIAL_ROUTINES: Routine[] = [
  { name: 'Tren superior', focus: 'Pecho · Espalda', level: 'Intermedio', dur: '52 min', icon: 'dumbbell', ex: [{ n: 'Press de banca 4×8', d: true }, { n: 'Remo con barra 4×10', d: true }, { n: 'Press militar 4×8', d: false }, { n: 'Dominadas 3×máx', d: false }] },
  { name: 'Piernas', focus: 'Cuádriceps · Glúteo', level: 'Avanzado', dur: '58 min', icon: 'flame', ex: [{ n: 'Sentadilla 5×5', d: false }, { n: 'Peso muerto 4×6', d: false }, { n: 'Prensa 4×12', d: false }, { n: 'Zancadas 3×12', d: false }] },
  { name: 'Core & Cardio', focus: 'Abdomen', level: 'Principiante', dur: '35 min', icon: 'heart-pulse', ex: [{ n: 'Plancha 3×60s', d: true }, { n: 'Russian twist 3×20', d: false }, { n: 'Mountain climber 3×30', d: false }, { n: 'Bicicleta 3×20', d: false }] },
  { name: 'Full body express', focus: 'Todo el cuerpo', level: 'Intermedio', dur: '40 min', icon: 'zap', ex: [{ n: 'Thruster 4×10', d: false }, { n: 'Burpees 4×12', d: false }, { n: 'Kettlebell swing 4×15', d: false }, { n: 'Remo 500m', d: false }] },
]

const initials = (name: string) => name.split(' ').map((x) => x[0]).slice(0, 2).join('')

export default function PulseDashboardClient({ lang }: { lang: DemoLang }) {
  const L = CONTENT[lang]
  const [view, setView] = useState<'panel' | 'miembros' | 'agenda' | 'rutinas' | 'pagos'>('panel')
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState<Member | null>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [kioskOpen, setKioskOpen] = useState(false)
  const [classes, setClasses] = useState<GymClass[]>(INITIAL_CLASSES)
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES)

  const nav = (v: typeof view) => { setView(v); setNotifOpen(false) }
  const openMember = (m: Member) => setSel(m)
  const closeMember = () => setSel(null)
  const toggleNotif = () => setNotifOpen((o) => !o)
  const openKiosk = () => { setKioskOpen(true); setNotifOpen(false) }
  const closeKiosk = () => setKioskOpen(false)
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)
  const book = (i: number) => setClasses((prev) => {
    const cl = prev.slice()
    const c = { ...cl[i] }
    if (!c.booked && c.taken < c.cap) { c.taken++; c.booked = true }
    else if (c.taken >= c.cap && !c.booked && !c.waitlisted) { c.waitlisted = true }
    cl[i] = c
    return cl
  })
  const toggleEx = (ri: number, ei: number) => setRoutines((prev) => {
    const rs = prev.slice()
    const r = { ...rs[ri] }
    const ex = r.ex.slice()
    ex[ei] = { ...ex[ei], d: !ex[ei].d }
    r.ex = ex
    rs[ri] = r
    return rs
  })

  /* ---- derived values (mirror renderVals) ---- */
  const V = view
  const name = USER_NAME
  const now = new Date()
  const days = L.days
  const months = L.months
  const circ = 2 * Math.PI * 66

  const titles = L.titles
  const ctas = L.ctas

  const navItem = (k: typeof view, label: string, icon: string) => {
    const a = V === k
    return { key: k, label, icon, active: a, onClick: () => nav(k), bg: a ? '#eef1fd' : 'transparent', color: a ? '#3b5bdb' : '#4b5058', weight: a ? 700 : 500 }
  }
  const navItems = [
    navItem('panel', L.nav.panel, 'layout-dashboard'),
    navItem('miembros', L.nav.miembros, 'users'),
    navItem('agenda', L.nav.agenda, 'calendar-days'),
    navItem('rutinas', L.nav.rutinas, 'dumbbell'),
    navItem('pagos', L.nav.pagos, 'credit-card'),
  ]

  const activeCount = MEMBERS.filter((m) => m.st === 'activo').length
  const kpis = [
    { label: L.kpiLabels.checkins, value: String(CHECKINS), icon: 'log-in', iconBg: '#e8effd', iconColor: '#3b5bdb', delta: L.kpiDeltas.checkins, deltaColor: '#16a34a', deltaIcon: 'trending-up' },
    { label: L.kpiLabels.revenue, value: '$' + REVENUE.toLocaleString(lang === 'es' ? 'es-AR' : 'en-US'), icon: 'dollar-sign', iconBg: '#e7f6ec', iconColor: '#16a34a', delta: L.kpiDeltas.revenue, deltaColor: '#16a34a', deltaIcon: 'trending-up' },
    { label: L.kpiLabels.occupancy, value: OCC + '%', icon: 'gauge', iconBg: '#fdeee2', iconColor: '#d97706', delta: L.kpiDeltas.occupancy, deltaColor: '#9aa0a8', deltaIcon: 'clock' },
    { label: L.kpiLabels.activeMembers, value: String(activeCount), icon: 'users', iconBg: '#f3ebfd', iconColor: '#7c3aed', delta: L.kpiDeltas.activeMembers, deltaColor: '#16a34a', deltaIcon: 'user-plus' },
  ].map((k, i) => ({ ...k, delay: i * 70 + 'ms' }))

  // weekly schedule (agenda)
  const todayIdx = (now.getDay() + 6) % 7
  const monday = new Date(now); monday.setDate(now.getDate() - todayIdx)
  const dayNames = L.weekdaysShort
  const accentByName: Record<string, string> = { 'Funcional HIIT': '#3b5bdb', Spinning: '#d97706', 'CrossFit WOD': '#7c3aed', 'Yoga Flow': '#16a34a', 'Fuerza total': '#3b5bdb', Boxeo: '#dc2626' }
  const lightByAccent: Record<string, string> = { '#3b5bdb': '#eef1fd', '#d97706': '#fdeee2', '#7c3aed': '#f3ebfd', '#16a34a': '#e7f6ec', '#dc2626': '#fdecec' }
  const sched: { t: string; n: string; c: string }[][] = [
    [{ t: '07:00', n: 'Funcional HIIT', c: 'Nadia' }, { t: '19:00', n: 'Fuerza total', c: 'Iván' }],
    [{ t: '08:30', n: 'Spinning', c: 'Bruno' }, { t: '18:00', n: 'Yoga Flow', c: 'Mora' }],
    [{ t: '12:00', n: 'CrossFit WOD', c: 'Elena' }, { t: '20:30', n: 'Boxeo', c: 'Leo' }],
    [{ t: '07:00', n: 'Funcional HIIT', c: 'Nadia' }, { t: '19:00', n: 'Fuerza total', c: 'Iván' }],
    [{ t: '08:30', n: 'Spinning', c: 'Bruno' }, { t: '18:00', n: 'Yoga Flow', c: 'Mora' }],
    [{ t: '10:00', n: 'CrossFit WOD', c: 'Elena' }, { t: '11:30', n: 'Boxeo', c: 'Leo' }],
    [{ t: '10:00', n: 'Yoga Flow', c: 'Mora' }],
  ]
  const weekSchedule = dayNames.map((dn, i) => {
    const dt = new Date(monday); dt.setDate(monday.getDate() + i); const today = i === todayIdx
    return {
      day: dn, date: dt.getDate(), colBg: today ? '#fbfcff' : '#fff', border: today ? '#c9d3f5' : '#eceef1', headBg: today ? '#eef1fd' : '#fafbfc', headColor: today ? '#3b5bdb' : '#9aa0a8', dateColor: today ? '#3b5bdb' : '#171a1f',
      classes: (sched[i] || []).map((x) => ({ time: x.t, name: L.classNames[x.n] || x.n, coach: x.c, accent: accentByName[x.n] || '#3b5bdb', bg: lightByAccent[accentByName[x.n]] || '#f5f6f8' })),
    }
  })

  // selected member (drawer)
  const sm = sel; const hasSelected = !!sm; const planPrice: Record<string, number> = { Elite: 89, Pro: 59, 'Básico': 29 }
  let selView: {
    name: string; email: string; plan: string; initials: string; avBg: string; avColor: string; statusColor: string; statusBg: string; statusLabel: string; price: string; visits: number; streak: number; since: string; payments: { c: string; d: string; a: string }[]
  } | null = null
  if (sm) {
    const ss = ST[sm.st], av = AV[sm.a], price = planPrice[sm.plan] || 0
    const planLabel = L.plans[sm.plan] || sm.plan
    selView = {
      name: sm.n, email: sm.e, plan: planLabel, initials: initials(sm.n),
      avBg: av.bg, avColor: av.color, statusColor: ss.c, statusBg: ss.bg, statusLabel: L.status[sm.st], price: '$' + price,
      visits: 8 + (sm.n.length % 12), streak: 3 + (sm.n.length % 9), since: L.memberSince(L.rel(sm.last)),
      payments: [{ c: L.feeLabel(planLabel), d: '5 jul 2026', a: '$' + price }, { c: L.feeLabel(planLabel), d: '5 jun 2026', a: '$' + price }, { c: L.feeLabel(planLabel), d: '5 may 2026', a: '$' + price }],
    }
  }

  // week bars
  const bars = [{ v: 112 }, { v: 138 }, { v: 96 }, { v: 154 }, { v: 147, a: true }, { v: 88 }, { v: 41 }]
  const mx = Math.max(...bars.map((b) => b.v))
  const weekBars = bars.map((b, i) => ({ d: L.weekdaysShort[i], val: b.v, h: Math.round((b.v / mx) * 100) + '%', dw: b.a ? 700 : 500, valColor: b.a ? '#3b5bdb' : '#9aa0a8', bg: b.a ? '#3b5bdb' : '#c9d3f5', delay: i * 70 + 'ms' }))

  // upcoming classes (panel)
  const upcoming = classes.slice(0, 4).map((c) => {
    const full = c.taken >= c.cap, pct = c.taken / c.cap
    let tag: string, tagColor: string, tagBg: string
    if (full) { tag = L.tagFull; tagColor = '#dc2626'; tagBg = '#fdecec' }
    else if (pct > 0.8) { tag = L.tagAlmost; tagColor = '#d97706'; tagBg = '#fdeee2' }
    else { tag = L.tagAvailable; tagColor = '#16a34a'; tagBg = '#e7f6ec' }
    return { name: L.classNames[c.name] || c.name, coach: c.coach, time: c.time, taken: c.taken, cap: c.cap, tag, tagColor, tagBg }
  })

  // members
  const q = query.trim().toLowerCase()
  const filteredMembers = MEMBERS.filter((m) => !q || m.n.toLowerCase().includes(q) || m.e.toLowerCase().includes(q) || m.plan.toLowerCase().includes(q)).map((m) => {
    const s = ST[m.st], av = AV[m.a]
    return { name: m.n, email: m.e, plan: L.plans[m.plan] || m.plan, last: L.rel(m.last), avBg: av.bg, avColor: av.color, initials: initials(m.n), statusColor: s.c, statusBg: s.bg, statusLabel: L.status[m.st], onOpen: () => openMember(m) }
  })
  const cnt = (st: StatusKey) => MEMBERS.filter((m) => m.st === st).length
  const memberStats = [
    { label: L.memberStats.active, value: cnt('activo'), color: '#16a34a', iconBg: '#e7f6ec', icon: 'user-check' },
    { label: L.memberStats.new, value: cnt('nuevo'), color: '#3b5bdb', iconBg: '#e8effd', icon: 'user-plus' },
    { label: L.memberStats.expired, value: cnt('vencido'), color: '#dc2626', iconBg: '#fdecec', icon: 'user-x' },
    { label: L.memberStats.total, value: MEMBERS.length, color: '#7c3aed', iconBg: '#f3ebfd', icon: 'users' },
  ]

  // classes
  const classesView = classes.map((c, i) => {
    const full = c.taken >= c.cap, pct = Math.round((c.taken / c.cap) * 100), spots = c.cap - c.taken
    let btnLabel: string, btnBg: string, btnColor: string, btnBorder: string, cursor: string
    if (c.booked) { btnLabel = L.btnBooked; btnBg = '#e7f6ec'; btnColor = '#16a34a'; btnBorder = '#bfe6cb'; cursor = 'default' }
    else if (c.waitlisted) { btnLabel = L.btnWaitlisted; btnBg = '#fdeee2'; btnColor = '#d97706'; btnBorder = '#f3d3a6'; cursor = 'default' }
    else if (full) { btnLabel = L.btnJoinWaitlist; btnBg = '#fff'; btnColor = '#d97706'; btnBorder = '#f3d3a6'; cursor = 'pointer' }
    else { btnLabel = L.btnBook; btnBg = '#3b5bdb'; btnColor = '#fff'; btnBorder = '#3b5bdb'; cursor = 'pointer' }
    const barBg = full ? '#dc2626' : pct > 80 ? '#d97706' : '#3b5bdb'
    const cardBorder = c.booked ? '#bfe6cb' : c.waitlisted ? '#f3d3a6' : '#e6e8ec'
    const spotsLabel = full ? L.roomFull : L.spotsLeft(spots)
    return { name: L.classNames[c.name] || c.name, coach: c.coach, time: c.time, cap: c.cap, taken: c.taken, pct: pct + '%', spotsLabel, btnLabel, btnBg, btnColor, btnBorder, cursor, barBg, cardBorder, onBook: () => book(i) }
  })

  // routines
  const rIcon: Record<string, { bg: string; c: string }> = { dumbbell: { bg: '#e8effd', c: '#3b5bdb' }, flame: { bg: '#fdeee2', c: '#d97706' }, 'heart-pulse': { bg: '#e7f6ec', c: '#16a34a' }, zap: { bg: '#f3ebfd', c: '#7c3aed' } }
  const routinesView = routines.map((r, ri) => {
    const done = r.ex.filter((e) => e.d).length, pct = Math.round((done / r.ex.length) * 100), ic = rIcon[r.icon]
    return {
      name: L.routineNames[r.name] || r.name, focus: L.focus[r.focus] || r.focus, level: L.levels[r.level] || r.level, dur: r.dur, icon: r.icon, iconBg: ic.bg, iconColor: ic.c, pct: pct + '%', progressLabel: done + '/' + r.ex.length,
      exercises: r.ex.map((e, ei) => ({
        n: L.exercises[e.n] || e.n, onToggle: () => toggleEx(ri, ei),
        bg: e.d ? '#f7faf8' : '#fff', border: e.d ? '#dcefe1' : '#eceef1',
        checkBg: e.d ? '#16a34a' : '#fff', checkBorder: e.d ? '#16a34a' : '#cbd0d6', checkIcon: e.d ? 'check' : 'circle',
        textColor: e.d ? '#9aa0a8' : '#171a1f', deco: e.d ? 'line-through' : 'none',
      })),
    }
  })

  // today routine (panel) mirrors first routine
  const r0 = routines[0]
  const todayRoutine = r0.ex.map((e, ei) => {
    const label = L.exercises[e.n] || e.n
    const detailMatch = label.match(/[\d×].*$/)
    return {
      name: label.replace(/ [\d×].*$/, ''), detail: detailMatch ? detailMatch[0] : '', onToggle: () => toggleEx(0, ei),
      bg: e.d ? '#f7faf8' : '#fff', border: e.d ? '#dcefe1' : '#eceef1',
      checkBg: e.d ? '#16a34a' : '#fff', checkBorder: e.d ? '#16a34a' : '#cbd0d6', checkIcon: e.d ? 'check' : 'circle',
      nameColor: e.d ? '#9aa0a8' : '#171a1f', deco: e.d ? 'line-through' : 'none',
    }
  })

  const okBg = '#e7f6ec', okC = '#16a34a', bad = '#fdecec', badC = '#dc2626'
  const transactions = [
    { name: 'Sofía Marín', plan: 'Elite', amount: '$89', date: 'hoy', status: L.txPaid, color: okC, bg: okBg, a: 0 },
    { name: 'Diego Torres', plan: 'Pro', amount: '$59', date: 'hoy', status: L.txPaid, color: okC, bg: okBg, a: 1 },
    { name: 'Valentina Ruiz', plan: 'Básico', amount: '$29', date: 'ayer', status: L.txPaid, color: okC, bg: okBg, a: 2 },
    { name: 'Martín Gómez', plan: 'Pro', amount: '$59', date: '3 d', status: L.txOverdue, color: badC, bg: bad, a: 3 },
    { name: 'Nicolás Vega', plan: 'Elite', amount: '$89', date: '4 d', status: L.txPaid, color: okC, bg: okBg, a: 4 },
    { name: 'Tomás Herrera', plan: 'Básico', amount: '$29', date: '6 d', status: L.txOverdue, color: badC, bg: bad, a: 1 },
  ].map((t) => ({ ...t, plan: L.plans[t.plan] || t.plan, date: L.rel(t.date), initials: initials(t.name), avBg: AV[t.a].bg, avColor: AV[t.a].color }))

  // notificaciones
  const notifTimes = ['hace 30 min', 'hace 2 h', 'hace 3 h', 'ayer']
  const notifs = [
    { icon: 'user-plus', bg: '#e8effd', color: '#3b5bdb' },
    { icon: 'alert-circle', bg: '#fdecec', color: '#dc2626' },
    { icon: 'calendar-check', bg: '#e7f6ec', color: '#16a34a' },
    { icon: 'flame', bg: '#fdeee2', color: '#d97706' },
  ].map((n, i) => ({ ...n, title: L.notifTitles[i], time: L.rel(notifTimes[i]) }))
  // check-ins recientes (kiosco)
  const recentCheckins = [
    { n: 'Sofía Marín', plan: 'Elite', t: '09:41', a: 0 }, { n: 'Diego Torres', plan: 'Pro', t: '09:38', a: 1 },
    { n: 'Camila Rossi', plan: 'Elite', t: '09:33', a: 4 }, { n: 'Julieta Paz', plan: 'Básico', t: '09:27', a: 0 },
    { n: 'Nicolás Vega', plan: 'Elite', t: '09:19', a: 2 },
  ].map((r) => ({ name: r.n, plan: L.planTag(L.plans[r.plan] || r.plan), time: r.t, initials: initials(r.n), avBg: AV[r.a].bg, avColor: AV[r.a].color }))
  // socios en riesgo
  const atRisk = MEMBERS.filter((m) => m.st === 'vencido' || m.st === 'congelado').map((m) => {
    const av = AV[m.a]
    return { name: m.n, plan: L.plans[m.plan] || m.plan, last: L.rel(m.last), initials: initials(m.n), avBg: av.bg, avColor: av.color }
  })

  const initial = name.trim().charAt(0).toUpperCase()
  const dateStr = lang === 'es'
    ? `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} 2026`
    : `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, 2026`
  const viewTitle = titles[V]
  const ctaLabel = ctas[V]
  const ringOffset = circ * (1 - RING_PCT / 100)

  return (
    <div className="pulse-scope" style={{ minHeight: '100vh', width: '100%', background: '#f5f6f8', color: '#171a1f', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", display: 'flex' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      <style>{`
        .pulse-scope *{box-sizing:border-box}
        .pulse-scope ::-webkit-scrollbar{width:9px;height:9px}
        .pulse-scope ::-webkit-scrollbar-thumb{background:#d3d7dd;border-radius:8px}
        .pulse-scope ::-webkit-scrollbar-track{background:transparent}
        .pulse-scope input{font-family:inherit;outline:none}
        .pulse-scope a{color:#3b5bdb;text-decoration:none}
        .pulse-scope a:hover{color:#2f49b8}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes riseIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes growBar{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        @keyframes growWide{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes ringDraw{from{stroke-dashoffset:414.7px}}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes fadeBg{from{opacity:0}to{opacity:1}}
        .pd-h-f3:hover{background:#f3f4f6 !important}
        .pd-h-fa:hover{background:#fafbfc !important}
        .pd-h-blue:hover{background:#2f49b8 !important}
        .pd-h-bd:hover{border-color:#c7ccd3 !important}
        .pd-h-amber:hover{background:#fdf6ec !important}
        .pd-h-gray:hover{background:#f7f8fa !important}
        @media (max-width:900px){
          .pulse-scope > main{max-height:none !important}
        }
      `}</style>

      {/* SIDEBAR */}
      {navOpen && <div className="dshell-backdrop" onClick={() => setNavOpen(false)} />}
      <nav className={`dshell-nav${navOpen ? ' is-open' : ''}`} style={{ width: 238, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '20px 16px', gap: 4, background: '#ffffff', borderRight: '1px solid #e6e8ec' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '6px 8px 20px' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#3b5bdb', display: 'grid', placeItems: 'center' }}><Icon name="activity" size={20} style={{ color: '#fff' }} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.01em' }}>FITLIFE <span style={{ color: '#3b5bdb' }}>GYM</span></div>
            <div style={{ fontSize: 10, letterSpacing: '.14em', color: '#9aa0a8', textTransform: 'uppercase', fontWeight: 600 }}>{L.brandSub}</div>
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9aa0a8', padding: '6px 10px 4px' }}>{L.menu}</div>
        {navItems.map((item) => (
          <div key={item.key} onClick={() => { item.onClick(); setNavOpen(false) }} className="pd-h-f3" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 11px', borderRadius: 10, cursor: 'pointer', transition: 'background .12s', background: item.bg, color: item.color }}>
            <Icon name={item.icon} size={18} />
            <span style={{ fontSize: 14, fontWeight: item.weight }}>{item.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: 12, borderRadius: 12, background: '#f7f8fa', border: '1px solid #eceef1', display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#3b5bdb', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#fff', fontSize: 14 }}>{initial}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name} Ashford</div>
            <div style={{ fontSize: 11, color: '#9aa0a8' }}>{L.role}</div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        <header className="pd-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '22px 34px 18px', flexShrink: 0, background: '#ffffff', borderBottom: '1px solid #e6e8ec' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <button className="dshell-hamb" onClick={() => setNavOpen(true)} aria-label="Menu" aria-expanded={navOpen} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #e2e5e9', background: '#fff', color: '#171a1f', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg></button>
            <div style={{ minWidth: 0 }}>
              <div className="pd-head-date" style={{ fontSize: 12, letterSpacing: '.02em', color: '#9aa0a8', fontWeight: 600 }}>{dateStr}</div>
              <h1 className="pd-head-title" style={{ fontSize: 23, fontWeight: 800, marginTop: 2, letterSpacing: '-.02em' }}>{viewTitle}</h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ position: 'relative' }}>
              <div onClick={toggleNotif} className="pd-h-f3" style={{ position: 'relative', width: 42, height: 42, borderRadius: 10, background: '#fff', border: '1px solid #e2e5e9', display: 'grid', placeItems: 'center', color: '#6b7280', cursor: 'pointer' }}>
                <Icon name="bell" size={18} />
                <span style={{ position: 'absolute', top: 9, right: 10, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 20, background: '#dc2626', border: '1.5px solid #fff', color: '#fff', fontSize: 9, fontWeight: 800, display: 'grid', placeItems: 'center' }}>4</span>
              </div>
              {notifOpen && (
                <div className="pd-drop" style={{ position: 'absolute', top: 52, right: 0, width: 344, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 14, boxShadow: '0 22px 50px -20px rgba(23,26,31,.35)', zIndex: 70, overflow: 'hidden', animation: 'riseIn .22s ease both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #eceef1' }}><span style={{ fontSize: 14, fontWeight: 800 }}>{L.notifications}</span><span style={{ fontSize: 12, color: '#3b5bdb', fontWeight: 600, cursor: 'pointer' }}>{L.markRead}</span></div>
                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {notifs.map((n, i) => (
                      <div key={i} className="pd-h-fa" style={{ display: 'flex', gap: 12, padding: '13px 16px', borderBottom: '1px solid #f2f3f5', cursor: 'pointer' }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: n.bg, display: 'grid', placeItems: 'center', color: n.color, flexShrink: 0 }}><Icon name={n.icon} size={17} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, color: '#171a1f' }}>{n.title}</div><div style={{ fontSize: 12, color: '#9aa0a8', marginTop: 1 }}>{n.time}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={openKiosk} className="pd-h-blue pd-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 17px', border: 'none', borderRadius: 10, background: '#3b5bdb', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}><Icon name="plus" size={17} /> {ctaLabel}</button>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 34px 40px' }}>

          {/* ===== PANEL ===== */}
          {V === 'panel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp .3s ease' }}>
              <section className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {kpis.map((k, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 14, padding: '18px 18px 16px', animation: 'riseIn .5s ease both', animationDelay: k.delay }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{k.label}</span>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: k.iconBg, display: 'grid', placeItems: 'center', color: k.iconColor }}><Icon name={k.icon} size={17} /></div>
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12 }}>{k.value}</div>
                    <div style={{ fontSize: 12, color: k.deltaColor, marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name={k.deltaIcon} size={13} /> {k.delta}</div>
                  </div>
                ))}
              </section>

              <section className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
                <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div><h3 style={{ fontSize: 16, fontWeight: 700 }}>{L.weeklyAttendance}</h3><div style={{ fontSize: 12, color: '#9aa0a8', marginTop: 2 }}>{L.checkinsPerDay}</div></div>
                    <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, background: '#f3f4f6', padding: '6px 11px', borderRadius: 8 }}>{L.last7Days}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, height: 180 }}>
                    {weekBars.map((b, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: b.valColor }}>{b.val}</span>
                        <div style={{ width: '100%', maxWidth: 38, height: b.h, borderRadius: '8px 8px 4px 4px', background: b.bg, transformOrigin: 'bottom', animation: 'growBar .7s cubic-bezier(.2,.8,.2,1) both', animationDelay: b.delay }} />
                        <span style={{ fontSize: 12, color: '#9aa0a8', fontWeight: b.dw }}>{b.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '22px 24px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}><span style={{ fontSize: 15, fontWeight: 700 }}>{L.weeklyGoal}</span><Icon name="target" size={17} style={{ color: '#3b5bdb' }} /></div>
                  <div style={{ position: 'relative', width: 158, height: 158, margin: '6px auto 4px' }}>
                    <svg width="158" height="158" viewBox="0 0 158 158" style={{ transform: 'rotate(-90deg)' }}><circle cx="79" cy="79" r="66" fill="none" stroke="#eef0f3" strokeWidth="12" /><circle cx="79" cy="79" r="66" fill="none" stroke="#3b5bdb" strokeWidth="12" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={ringOffset} style={{ animation: 'ringDraw 1.1s ease .15s both' }} /></svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: 34, fontWeight: 800 }}>{RING_PCT}<span style={{ fontSize: 18 }}>%</span></div><div style={{ fontSize: 12, color: '#9aa0a8' }}>{L.goalSessions}</div></div>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>{L.goalAheadPre} <b style={{ color: '#171a1f' }}>{L.goalAheadBold}</b> {L.goalAheadPost}</div>
                </div>
              </section>

              <section className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
                <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>{L.todayRoutinePrefix} · {L.routineNames['Tren superior']}</h3><span onClick={() => nav('rutinas')} style={{ fontSize: 13, color: '#3b5bdb', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>{L.library} <Icon name="chevron-right" size={15} /></span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {todayRoutine.map((ex, i) => (
                      <div key={i} onClick={ex.onToggle} className="pd-h-bd" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 11, cursor: 'pointer', background: ex.bg, border: `1px solid ${ex.border}` }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, display: 'grid', placeItems: 'center', background: ex.checkBg, border: `1.5px solid ${ex.checkBorder}`, color: '#fff' }}><Icon name={ex.checkIcon} size={14} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 14, color: ex.nameColor, textDecoration: ex.deco }}>{ex.name}</div></div>
                        <div style={{ fontSize: 13, color: '#9aa0a8', fontWeight: 600 }}>{ex.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>{L.upcomingClasses}</h3><span onClick={() => nav('agenda')} style={{ fontSize: 13, color: '#3b5bdb', cursor: 'pointer', fontWeight: 600 }}>{L.viewSchedule}</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {upcoming.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 0', borderBottom: '1px solid #f0f1f4' }}>
                        <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}><div style={{ fontSize: 15, fontWeight: 800, color: '#3b5bdb' }}>{c.time}</div></div>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 12, color: '#9aa0a8' }}>{c.coach} · {c.taken}/{c.cap}</div></div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 20, color: c.tagColor, background: c.tagBg }}>{c.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ===== MIEMBROS ===== */}
          {V === 'miembros' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeUp .3s ease' }}>
              <section className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {memberStats.map((s, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{s.label}</span><div style={{ width: 30, height: 30, borderRadius: 8, background: s.iconBg, display: 'grid', placeItems: 'center', color: s.color }}><Icon name={s.icon} size={16} /></div></div>
                    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{s.value}</div>
                  </div>
                ))}
              </section>
              {atRisk.length > 0 && (
                <section style={{ background: '#fff', border: '1px solid #f3d3a6', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 22px', background: '#fdf6ec', borderBottom: '1px solid #f5e2c3' }}><Icon name="alert-triangle" size={18} style={{ color: '#d97706' }} /><div><div style={{ fontSize: 14, fontWeight: 800, color: '#8a5a12' }}>{L.atRiskTitle}</div><div style={{ fontSize: 12, color: '#a97b3a' }}>{L.atRiskDesc(atRisk.length)}</div></div></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {atRisk.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderBottom: '1px solid #f6efe4' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: m.avBg, color: m.avColor, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{m.initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 12, color: '#9aa0a8' }}>{L.lastVisit} {m.last} · {m.plan}</div></div>
                        <button className="pd-h-amber" style={{ padding: '8px 14px', border: '1px solid #e6c48a', borderRadius: 9, background: '#fff', color: '#8a5a12', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{L.contact}</button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className="dtable-wrap" style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 22px', borderBottom: '1px solid #eceef1' }}>
                  <div className="pd-h-bd" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 10, background: '#f5f6f8', border: '1px solid #e6e8ec', flex: 1, maxWidth: 360 }}>
                    <Icon name="search" size={16} style={{ color: '#9aa0a8' }} />
                    <input value={query} onChange={onSearch} placeholder={L.searchMembers} style={{ background: 'none', border: 'none', color: '#171a1f', fontSize: 14, width: '100%' }} />
                  </div>
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{filteredMembers.length} {L.membersCount}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 1fr 1fr 40px', gap: 16, padding: '12px 22px', fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: '#9aa0a8', fontWeight: 700, borderBottom: '1px solid #f0f1f4', background: '#fafbfc' }}><span>{L.colMember}</span><span>{L.colPlan}</span><span>{L.colStatus}</span><span>{L.colLastVisit}</span><span></span></div>
                {filteredMembers.map((m, i) => (
                  <div key={i} onClick={m.onOpen} className="pd-h-fa" style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 1fr 1fr 40px', gap: 16, alignItems: 'center', padding: '13px 22px', borderBottom: '1px solid #f2f3f5', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}><div style={{ width: 38, height: 38, borderRadius: 10, background: m.avBg, display: 'grid', placeItems: 'center', fontWeight: 700, color: m.avColor, flexShrink: 0, fontSize: 13 }}>{m.initials}</div><div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div><div style={{ fontSize: 12, color: '#9aa0a8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</div></div></div>
                    <span style={{ fontSize: 13, color: '#4b5058', fontWeight: 500 }}>{m.plan}</span>
                    <span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: m.statusColor, background: m.statusBg }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: m.statusColor }} />{m.statusLabel}</span></span>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>{m.last}</span>
                    <span style={{ color: '#9aa0a8', display: 'grid', placeItems: 'center' }}><Icon name="more-horizontal" size={18} /></span>
                  </div>
                ))}
                {filteredMembers.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#9aa0a8', fontSize: 14 }}>{L.noResults(query)}</div>}
              </section>
            </div>
          )}

          {/* ===== AGENDA ===== */}
          {V === 'agenda' && (
            <div style={{ animation: 'fadeUp .3s ease', display: 'flex', flexDirection: 'column', gap: 22 }}>
              <section style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '20px 22px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700 }}><Icon name="calendar-days" size={18} style={{ color: '#3b5bdb' }} /> {L.weeklyCalendar}</div><span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, background: '#f3f4f6', padding: '6px 11px', borderRadius: 8 }}>{L.currentWeek}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(120px,1fr))', gap: 10, minWidth: 900 }}>
                  {weekSchedule.map((d, i) => (
                    <div key={i} style={{ border: `1px solid ${d.border}`, borderRadius: 12, overflow: 'hidden', background: d.colBg }}>
                      <div style={{ padding: 10, textAlign: 'center', borderBottom: '1px solid #f0f1f4', background: d.headBg }}><div style={{ fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: d.headColor, fontWeight: 700 }}>{d.day}</div><div style={{ fontSize: 16, fontWeight: 800, color: d.dateColor, marginTop: 1 }}>{d.date}</div></div>
                      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 7, minHeight: 130 }}>
                        {d.classes.map((c, j) => (
                          <div key={j} style={{ borderRadius: 9, padding: '8px 9px', background: c.bg, borderLeft: `3px solid ${c.accent}` }}><div style={{ fontSize: 12, fontWeight: 700, color: '#3b5bdb' }}>{c.time}</div><div style={{ fontSize: 12, fontWeight: 600, color: '#171a1f', marginTop: 1 }}>{c.name}</div><div style={{ fontSize: 11, color: '#9aa0a8' }}>{c.coach}</div></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <div>
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="zap" size={16} style={{ color: '#3b5bdb' }} /> {L.todayClasses}</div>
                <section className="dcards-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
                  {classesView.map((c, i) => (
                    <div key={i} style={{ background: '#fff', border: `1px solid ${c.cardBorder}`, borderRadius: 14, padding: '20px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div><div style={{ fontSize: 17, fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="user" size={14} /> {c.coach}</div></div>
                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: 18, fontWeight: 800, color: '#3b5bdb' }}>{c.time}</div><div style={{ fontSize: 12, color: '#9aa0a8' }}>50 {L.min}</div></div>
                      </div>
                      <div style={{ marginTop: 16, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 7 }}><span>{c.spotsLabel}</span><span style={{ fontWeight: 600 }}>{c.taken}/{c.cap}</span></div>
                        <div style={{ height: 7, borderRadius: 20, background: '#eef0f3', overflow: 'hidden' }}><div style={{ height: '100%', width: c.pct, borderRadius: 20, background: c.barBg, transformOrigin: 'left', animation: 'growWide .8s ease both' }} /></div>
                      </div>
                      <button onClick={c.onBook} style={{ width: '100%', padding: 11, borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: c.cursor, background: c.btnBg, color: c.btnColor, border: `1px solid ${c.btnBorder}` }}>{c.btnLabel}</button>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          )}

          {/* ===== RUTINAS ===== */}
          {V === 'rutinas' && (
            <div style={{ animation: 'fadeUp .3s ease' }}>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="dumbbell" size={16} style={{ color: '#3b5bdb' }} /> {L.tapExercises}</div>
              <section className="dcards-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
                {routinesView.map((r, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 14, padding: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <div><div style={{ fontSize: 18, fontWeight: 700 }}>{r.name}</div><div style={{ fontSize: 12, color: '#9aa0a8', marginTop: 3 }}>{r.focus} · {r.level} · {r.dur}</div></div>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: r.iconBg, display: 'grid', placeItems: 'center', color: r.iconColor }}><Icon name={r.icon} size={20} /></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 16px' }}><div style={{ flex: 1, height: 6, borderRadius: 20, background: '#eef0f3', overflow: 'hidden' }}><div style={{ height: '100%', width: r.pct, borderRadius: 20, background: '#3b5bdb', transformOrigin: 'left', animation: 'growWide .8s ease both' }} /></div><span style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>{r.progressLabel}</span></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {r.exercises.map((ex, j) => (
                        <div key={j} onClick={ex.onToggle} className="pd-h-bd" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderRadius: 10, cursor: 'pointer', background: ex.bg, border: `1px solid ${ex.border}` }}>
                          <div style={{ width: 22, height: 22, borderRadius: 6, display: 'grid', placeItems: 'center', background: ex.checkBg, border: `1.5px solid ${ex.checkBorder}`, color: '#fff' }}><Icon name={ex.checkIcon} size={14} /></div>
                          <span style={{ fontSize: 14, color: ex.textColor, textDecoration: ex.deco }}>{ex.n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          )}

          {/* ===== PAGOS ===== */}
          {V === 'pagos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeUp .3s ease' }}>
              <section className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                <div style={{ background: '#3b5bdb', borderRadius: 14, padding: 22, color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#c7d0f5', fontWeight: 600 }}>MRR</span><Icon name="repeat" size={18} style={{ color: '#c7d0f5' }} /></div>
                  <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10 }}>$48.2K</div>
                  <div style={{ fontSize: 12, color: '#d7ffe6', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="trending-up" size={13} /> {L.mrrDelta}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{L.collectedThisMonth}</span><div style={{ width: 30, height: 30, borderRadius: 8, background: '#e7f6ec', display: 'grid', placeItems: 'center', color: '#16a34a' }}><Icon name="check-circle-2" size={16} /></div></div>
                  <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10 }}>$52.9K</div>
                  <div style={{ fontSize: 12, color: '#9aa0a8', marginTop: 6 }}>{L.successfulCharges}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{L.pending}</span><div style={{ width: 30, height: 30, borderRadius: 8, background: '#fdecec', display: 'grid', placeItems: 'center', color: '#dc2626' }}><Icon name="alert-circle" size={16} /></div></div>
                  <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10 }}>$3.4K</div>
                  <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{L.overduePayments}</div>
                </div>
              </section>
              <section className="dtable-wrap" style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid #eceef1', fontSize: 16, fontWeight: 700 }}>{L.recentTransactions}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, padding: '12px 22px', fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: '#9aa0a8', fontWeight: 700, borderBottom: '1px solid #f0f1f4', background: '#fafbfc' }}><span>{L.colMember}</span><span>{L.colPlan}</span><span>{L.colAmount}</span><span>{L.colStatus}</span></div>
                {transactions.map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid #f2f3f5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: 9, background: t.avBg, display: 'grid', placeItems: 'center', fontWeight: 700, color: t.avColor, fontSize: 12 }}>{t.initials}</div><span style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</span></div>
                    <span style={{ fontSize: 13, color: '#4b5058' }}>{L.planTag(t.plan)}</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{t.amount}</span>
                    <span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: t.color, background: t.bg }}>{t.status} · {t.date}</span></span>
                  </div>
                ))}
              </section>
            </div>
          )}

          {/* ===== DRAWER FICHA MIEMBRO ===== */}
          {hasSelected && selView && (
            <>
              <div onClick={closeMember} style={{ position: 'fixed', inset: 0, background: 'rgba(23,26,31,.42)', zIndex: 60, animation: 'fadeBg .2s ease both' }} />
              <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, maxWidth: '92vw', background: '#fff', zIndex: 61, boxShadow: '-24px 0 60px -24px rgba(23,26,31,.45)', display: 'flex', flexDirection: 'column', animation: 'slideIn .32s cubic-bezier(.2,.8,.2,1) both' }}>
                <div style={{ padding: '22px 24px', borderBottom: '1px solid #eceef1', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 13, background: selView.avBg, color: selView.avColor, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 17, flexShrink: 0 }}>{selView.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 18, fontWeight: 800 }}>{selView.name}</div><div style={{ fontSize: 13, color: '#9aa0a8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selView.email}</div><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: selView.statusColor, background: selView.statusBg, marginTop: 9 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: selView.statusColor }} />{selView.statusLabel}</span></div>
                  <div onClick={closeMember} className="pd-h-f3" style={{ width: 34, height: 34, borderRadius: 9, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#6b7280', border: '1px solid #e6e8ec' }}><Icon name="x" size={18} /></div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    <div style={{ background: '#f7f8fa', border: '1px solid #eceef1', borderRadius: 12, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800 }}>{selView.visits}</div><div style={{ fontSize: 11, color: '#9aa0a8', fontWeight: 600, marginTop: 2 }}>{L.visitsMonth}</div></div>
                    <div style={{ background: '#f7f8fa', border: '1px solid #eceef1', borderRadius: 12, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800 }}>{selView.streak}</div><div style={{ fontSize: 11, color: '#9aa0a8', fontWeight: 600, marginTop: 2 }}>{L.streakDays}</div></div>
                    <div style={{ background: '#f7f8fa', border: '1px solid #eceef1', borderRadius: 12, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800 }}>{selView.price}</div><div style={{ fontSize: 11, color: '#9aa0a8', fontWeight: 600, marginTop: 2 }}>{L.planTag(selView.plan)}</div></div>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{selView.since}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{L.recentPayments}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selView.payments.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', border: '1px solid #eceef1', borderRadius: 11 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: '#e7f6ec', display: 'grid', placeItems: 'center', color: '#16a34a' }}><Icon name="check" size={15} /></div><div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.c}</div><div style={{ fontSize: 11, color: '#9aa0a8' }}>{p.d}</div></div></div>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{p.a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid #eceef1', display: 'flex', gap: 10 }}>
                  <button className="pd-h-blue" style={{ flex: 1, padding: 11, border: 'none', borderRadius: 10, background: '#3b5bdb', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{L.recordCharge}</button>
                  <button className="pd-h-gray" style={{ padding: '11px 14px', border: '1px solid #e6e8ec', borderRadius: 10, background: '#fff', color: '#4b5058', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{L.message}</button>
                </div>
              </div>
            </>
          )}

          {/* ===== KIOSCO CHECK-IN ===== */}
          {kioskOpen && (
            <div onClick={closeKiosk} style={{ position: 'fixed', inset: 0, background: 'rgba(23,26,31,.5)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeBg .2s ease both' }}>
              <div onClick={(e) => e.stopPropagation()} className="dcol-2" style={{ width: 720, maxWidth: '100%', background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 80px -30px rgba(23,26,31,.5)', animation: 'riseIn .28s ease both', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ background: '#3b5bdb', color: '#fff', padding: '34px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#c7d0f5' }}>{L.memberCheckin}</div>
                  <div style={{ width: 186, height: 186, background: '#fff', borderRadius: 18, margin: '22px 0 16px', display: 'grid', placeItems: 'center', color: '#3b5bdb' }}><Icon name="qr-code" size={120} /></div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{L.scanQr}</div>
                  <div style={{ fontSize: 13, color: '#c7d0f5', marginTop: 4 }}>{L.orSearchName}</div>
                </div>
                <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}><span style={{ fontSize: 15, fontWeight: 800 }}>{L.recentCheckins}</span><div onClick={closeKiosk} className="pd-h-f3" style={{ width: 40, height: 40, borderRadius: 9, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#6b7280', border: '1px solid #e6e8ec' }}><Icon name="x" size={17} /></div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 10, background: '#f5f6f8', border: '1px solid #e6e8ec', marginBottom: 14 }}><Icon name="search" size={16} style={{ color: '#9aa0a8' }} /><input placeholder={L.searchMemberKiosk} style={{ background: 'none', border: 'none', fontSize: 14, width: '100%', color: '#171a1f' }} /></div>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300 }}>
                    {recentCheckins.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', border: '1px solid #eceef1', borderRadius: 11 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: r.avBg, color: r.avColor, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{r.initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: '#9aa0a8' }}>{r.plan}</div></div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#e7f6ec', padding: '4px 9px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="check" size={12} /> {r.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
