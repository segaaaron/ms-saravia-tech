'use client'

import { useState, type CSSProperties } from 'react'
import type { DemoLang } from '../lang'

/* ============================================================
   PULSE — FITLIFE GYM (landing demo). Port nativo Next.js del
   diseño original .dc.html, misma info y mismo diseño.
   Bilingüe (es/en) según el sitio.
   Assets locales viven en /showcase (public).
   ============================================================ */

/* ---- lucide icons como SVG inline (sin dependencias) ---- */
const ICON_PATHS: Record<string, string> = {
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'log-in':
    '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'credit-card':
    '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  'calendar-days':
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  dumbbell:
    '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
  'bar-chart-3': '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
}

function Icon({ name, size = 24, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] ?? '' }}
    />
  )
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="#f5b93f"
      stroke="#f5b93f"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

/* ---- assets locales ---- */
const IMG = (p: string) => `/showcase/${p}`

/* ---- data estática (no textual) ---- */
const LOGOS = ['IronHouse', 'FitZone', 'La Fábrica', 'Peak Club', 'Titan']

/* icon + color por feature; los textos viven en CONTENT */
const FEATURE_META: { icon: string; bg: string; color: string }[] = [
  { icon: 'users', bg: '#e8effd', color: '#3b5bdb' },
  { icon: 'credit-card', bg: '#e7f6ec', color: '#16a34a' },
  { icon: 'calendar-days', bg: '#fdeee2', color: '#d97706' },
  { icon: 'dumbbell', bg: '#f3ebfd', color: '#7c3aed' },
  { icon: 'log-in', bg: '#e8effd', color: '#3b5bdb' },
  { icon: 'bar-chart-3', bg: '#e7f6ec', color: '#16a34a' },
]

/* slot + foto + span por instalación; los labels viven en CONTENT */
const GALLERY_META: { slotId: string; span: number; photo: string }[] = [
  { slotId: 'inst-musculacion', span: 4, photo: 'uploads/gym_3_web.webp' },
  { slotId: 'inst-pesolibre', span: 2, photo: 'uploads/gym_4_web.webp' },
  { slotId: 'inst-cardio', span: 2, photo: 'uploads/gym_5_web.webp' },
  { slotId: 'inst-funcional', span: 4, photo: 'uploads/training_1_web.webp' },
  { slotId: 'inst-clases', span: 3, photo: 'uploads/training_1_web.webp' },
  { slotId: 'inst-recepcion', span: 3, photo: 'uploads/gym_5_web.webp' },
]

/* slot + foto + autor por testimonio; las citas viven en CONTENT */
const TESTIMONIAL_META: { name: string; gym: string; slotId: string; photo: string }[] = [
  { name: 'Marcos C.', gym: 'FITLIFE GYM', slotId: 'testi-1', photo: 'img/portrait.webp' },
  { name: 'Aisha K.', gym: 'FITLIFE GYM', slotId: 'testi-2', photo: 'uploads/gym_4_web.webp' },
  { name: 'Sofía L.', gym: 'FITLIFE GYM', slotId: 'testi-3', photo: 'uploads/gym_5_web.webp' },
]

const STARS = [1, 1, 1, 1, 1]

/* precio + destacado por plan; nombres/features viven en CONTENT */
const PLAN_META: { m: number; featured: boolean }[] = [
  { m: 29, featured: false },
  { m: 59, featured: true },
  { m: 99, featured: false },
]

type Content = {
  nav: { producto: string; funciones: string; precios: string; clientes: string }
  navLogin: string
  navTry: string
  heroBadge: string
  heroTitleL1: string
  heroTitleL2: string
  heroSub: string
  heroCta1: string
  heroCta2: string
  heroNote: string
  checkinsToday: string
  weeklyGoal: string
  sessionsProgress: string
  bookingConfirmed: string
  logosHeading: string
  featuresEyebrow: string
  featuresTitle: string
  featuresSub: string
  features: { title: string; desc: string }[]
  cobrosEyebrow: string
  cobrosTitle: string
  cobrosDesc: string
  cobrosImgAlt: string
  checks: string[]
  clasesEyebrow: string
  clasesTitle: string
  clasesDesc: string
  classChecks: string[]
  facilitiesEyebrow: string
  facilitiesTitle: string
  facilitiesSub: string
  gallery: string[]
  pricingEyebrow: string
  pricingTitle: string
  monthly: string
  annual: string
  perMonth: string
  billingAnnual: string
  billingMonthly: string
  mostChosen: string
  ctaFeatured: string
  ctaRegular: string
  plans: { name: string; tagline: string; features: string[] }[]
  testimonialsTitle: string
  testimonials: string[]
  ctaTitle: string
  ctaDesc: string
  ctaButton: string
  footerLinks: { producto: string; precios: string; login: string }
  footerRights: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    nav: { producto: 'Producto', funciones: 'Funciones', precios: 'Precios', clientes: 'Clientes' },
    navLogin: 'Ingresar',
    navTry: 'Probar gratis',
    heroBadge: 'El sistema operativo de tu gimnasio',
    heroTitleL1: 'Todo tu gimnasio,',
    heroTitleL2: 'en una sola pantalla.',
    heroSub: 'Cobros automáticos, control de asistencia, clases con cupo y rutinas — sin planillas ni tres apps distintas. Simple para el dueño, prolijo para el socio.',
    heroCta1: 'Empezar gratis 14 días',
    heroCta2: 'Ver demo del panel',
    heroNote: 'Sin tarjeta · configurás tu gimnasio en 10 minutos',
    checkinsToday: 'Check-ins hoy',
    weeklyGoal: 'Meta semanal',
    sessionsProgress: '4 de 5 sesiones',
    bookingConfirmed: 'Reserva confirmada · ',
    logosHeading: 'Usado por gimnasios de toda la región',
    featuresEyebrow: 'FUNCIONES',
    featuresTitle: 'Reemplazá 4 herramientas por una',
    featuresSub: 'Todo conectado: cuando un socio hace check-in, paga o reserva, el panel se actualiza solo.',
    features: [
      { title: 'Miembros y CRM', desc: 'Ficha de cada socio, historial de visitas, plan y estado en un vistazo.' },
      { title: 'Cobros automáticos', desc: 'Débito recurrente, recordatorios y control de morosidad sin planillas.' },
      { title: 'Clases con cupo', desc: 'Reservas online, listas de espera y ocupación en tiempo real.' },
      { title: 'Rutinas y programas', desc: 'Armá rutinas, asignalas a socios y seguí su progreso ejercicio a ejercicio.' },
      { title: 'Check-in en recepción', desc: 'Acceso con QR o huella y conteo de asistencia al instante.' },
      { title: 'Reportes claros', desc: 'Ingresos, retención y ocupación en gráficos que se entienden solos.' },
    ],
    cobrosEyebrow: 'COBROS',
    cobrosTitle: 'Cobrá a tiempo, sin perseguir a nadie',
    cobrosDesc: 'Débito automático, recordatorios y aviso de vencimientos. Vas a saber en segundos quién está al día y quién no.',
    cobrosImgAlt: 'Panel de pagos de PULSE',
    checks: [
      'Débito automático con tarjeta y transferencia',
      'Recordatorios antes del vencimiento',
      'Estado de cada socio: al día, por vencer o vencido',
    ],
    clasesEyebrow: 'CLASES',
    clasesTitle: 'Llená tus clases, sin overbooking',
    clasesDesc: 'Tus socios reservan desde el celu, con cupo y lista de espera. Vos ves la ocupación en vivo y los profes saben quién viene.',
    classChecks: [
      'Reserva online con cupo y lista de espera',
      'Ocupación de cada clase en tiempo real',
      'Aviso automático si se libera un lugar',
    ],
    facilitiesEyebrow: 'INSTALACIONES',
    facilitiesTitle: 'Un gimnasio, todo el equipamiento',
    facilitiesSub: 'Mostrá tus salas y máquinas. Estas fotos son las de tu propio gimnasio.',
    gallery: ['Sala de musculación', 'Peso libre', 'Cardio', 'Zona funcional', 'Salón de clases', 'Recepción y vestuarios'],
    pricingEyebrow: 'PRECIOS',
    pricingTitle: 'Un plan para cada etapa',
    monthly: 'Mensual',
    annual: 'Anual',
    perMonth: '/mes',
    billingAnnual: 'facturado anual',
    billingMonthly: 'facturado mensual',
    mostChosen: 'Más elegido',
    ctaFeatured: 'Probar gratis',
    ctaRegular: 'Elegir plan',
    plans: [
      { name: 'Básico', tagline: 'Para arrancar a ordenarte', features: ['Hasta 150 socios', 'Cobros y recordatorios', 'Control de asistencia', '1 sede'] },
      { name: 'Pro', tagline: 'El favorito de los gimnasios', features: ['Socios ilimitados', 'Clases con reservas', 'Rutinas y programas', 'Reportes avanzados', '3 sedes'] },
      { name: 'Elite', tagline: 'Para cadenas y franquicias', features: ['Todo lo de Pro', 'Sedes ilimitadas', 'App con tu marca', 'Roles y permisos', 'Soporte prioritario'] },
    ],
    testimonialsTitle: 'Lo que dicen los dueños',
    testimonials: [
      'Bajé la morosidad un 30% el primer mes. Ahora sé exactamente quién debe y el sistema le avisa solo.',
      'Pasamos de tres planillas a una sola pantalla. Recepción ahora tarda segundos en registrar a alguien.',
      'Las reservas de clases se llenan solas y ya no hay overbooking. Los profes lo aman.',
    ],
    ctaTitle: 'Empezá a ordenar tu gimnasio hoy',
    ctaDesc: '14 días gratis. Sin tarjeta. Cancelás cuando quieras.',
    ctaButton: 'Crear mi cuenta',
    footerLinks: { producto: 'Producto', precios: 'Precios', login: 'Ingresar' },
    footerRights: '© 2026 FITLIFE GYM · Hecho para gimnasios',
  },
  en: {
    nav: { producto: 'Product', funciones: 'Features', precios: 'Pricing', clientes: 'Customers' },
    navLogin: 'Log in',
    navTry: 'Start free',
    heroBadge: 'The operating system for your gym',
    heroTitleL1: 'Your whole gym,',
    heroTitleL2: 'on a single screen.',
    heroSub: 'Automatic billing, attendance tracking, capacity-based classes and workouts — no spreadsheets, no three separate apps. Simple for the owner, polished for the member.',
    heroCta1: 'Start free for 14 days',
    heroCta2: 'See the dashboard demo',
    heroNote: 'No card required · set up your gym in 10 minutes',
    checkinsToday: 'Check-ins today',
    weeklyGoal: 'Weekly goal',
    sessionsProgress: '4 of 5 sessions',
    bookingConfirmed: 'Booking confirmed · ',
    logosHeading: 'Trusted by gyms across the region',
    featuresEyebrow: 'FEATURES',
    featuresTitle: 'Replace 4 tools with one',
    featuresSub: 'Everything connected: when a member checks in, pays or books, the dashboard updates itself.',
    features: [
      { title: 'Members & CRM', desc: 'Every member’s profile, visit history, plan and status at a glance.' },
      { title: 'Automatic billing', desc: 'Recurring charges, reminders and overdue tracking — no spreadsheets.' },
      { title: 'Classes with capacity', desc: 'Online booking, waitlists and real-time occupancy.' },
      { title: 'Workouts & programs', desc: 'Build workouts, assign them to members and track progress exercise by exercise.' },
      { title: 'Front-desk check-in', desc: 'QR or fingerprint entry and instant attendance counts.' },
      { title: 'Clear reports', desc: 'Revenue, retention and occupancy in charts that explain themselves.' },
    ],
    cobrosEyebrow: 'BILLING',
    cobrosTitle: 'Get paid on time, without chasing anyone',
    cobrosDesc: 'Automatic charges, reminders and due-date alerts. You’ll know in seconds who’s paid up and who isn’t.',
    cobrosImgAlt: 'PULSE payments dashboard',
    checks: [
      'Automatic charges by card and bank transfer',
      'Reminders before the due date',
      'Each member’s status: paid, due soon or overdue',
    ],
    clasesEyebrow: 'CLASSES',
    clasesTitle: 'Fill your classes, without overbooking',
    clasesDesc: 'Your members book from their phone, with capacity and a waitlist. You see occupancy live and instructors know who’s coming.',
    classChecks: [
      'Online booking with capacity and waitlist',
      'Real-time occupancy for every class',
      'Automatic alert when a spot opens up',
    ],
    facilitiesEyebrow: 'FACILITIES',
    facilitiesTitle: 'One gym, all the equipment',
    facilitiesSub: 'Show off your rooms and machines. These photos are from your own gym.',
    gallery: ['Weight room', 'Free weights', 'Cardio', 'Functional zone', 'Class studio', 'Reception & locker rooms'],
    pricingEyebrow: 'PRICING',
    pricingTitle: 'A plan for every stage',
    monthly: 'Monthly',
    annual: 'Annual',
    perMonth: '/mo',
    billingAnnual: 'billed annually',
    billingMonthly: 'billed monthly',
    mostChosen: 'Most popular',
    ctaFeatured: 'Start free trial',
    ctaRegular: 'Choose plan',
    plans: [
      { name: 'Basic', tagline: 'To start getting organized', features: ['Up to 150 members', 'Billing and reminders', 'Attendance tracking', '1 location'] },
      { name: 'Pro', tagline: 'The gyms’ favorite', features: ['Unlimited members', 'Classes with booking', 'Workouts and programs', 'Advanced reports', '3 locations'] },
      { name: 'Elite', tagline: 'For chains and franchises', features: ['Everything in Pro', 'Unlimited locations', 'White-label app', 'Roles and permissions', 'Priority support'] },
    ],
    testimonialsTitle: 'What owners say',
    testimonials: [
      'I cut overdue payments by 30% the first month. Now I know exactly who owes and the system reminds them on its own.',
      'We went from three spreadsheets to a single screen. The front desk now takes seconds to check someone in.',
      'Class bookings fill up on their own and there’s no more overbooking. The instructors love it.',
    ],
    ctaTitle: 'Start organizing your gym today',
    ctaDesc: '14 days free. No card. Cancel anytime.',
    ctaButton: 'Create my account',
    footerLinks: { producto: 'Product', precios: 'Pricing', login: 'Log in' },
    footerRights: '© 2026 FITLIFE GYM · Built for gyms',
  },
}

type Plan = {
  name: string
  tagline: string
  price: string
  billing: string
  features: string[]
  featured: boolean
  cardBg: string
  cardBorder: string
  nameColor: string
  subColor: string
  priceColor: string
  featColor: string
  checkColor: string
  cta: string
  btnBg: string
  btnColor: string
  btnBorder: string
}

export default function PulseLandingClient({ lang }: { lang: DemoLang }) {
  const c = CONTENT[lang]
  const [annual, setAnnual] = useState(false)

  const price = (m: number) => (annual ? '$' + Math.round(m * 0.8) : '$' + m)
  const plan = (name: string, tagline: string, m: number, feats: string[], featured: boolean): Plan => ({
    name,
    tagline,
    price: price(m),
    billing: annual ? c.billingAnnual : c.billingMonthly,
    features: feats,
    featured: !!featured,
    cardBg: featured ? '#3b5bdb' : '#fff',
    cardBorder: featured ? '#3b5bdb' : '#e6e8ec',
    nameColor: featured ? '#fff' : '#171a1f',
    subColor: featured ? '#c7d0f5' : '#9aa0a8',
    priceColor: featured ? '#fff' : '#171a1f',
    featColor: featured ? '#eef1fd' : '#2d3138',
    checkColor: featured ? '#fff' : '#16a34a',
    cta: featured ? c.ctaFeatured : c.ctaRegular,
    btnBg: featured ? '#fff' : '#eef1fd',
    btnColor: featured ? '#3b5bdb' : '#3b5bdb',
    btnBorder: featured ? '#fff' : '#dbe2fb',
  })

  const monBg = annual ? 'transparent' : '#fff'
  const monColor = annual ? '#6b7280' : '#171a1f'
  const annBg = annual ? '#fff' : 'transparent'
  const annColor = annual ? '#171a1f' : '#6b7280'

  const plans: Plan[] = c.plans.map((pd, i) =>
    plan(pd.name, pd.tagline, PLAN_META[i].m, pd.features, PLAN_META[i].featured),
  )

  return (
    <div style={{ width: '100%', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: '#171a1f', background: '#fff' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid #eceef1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#3b5bdb', display: 'grid', placeItems: 'center' }}><Icon name="activity" size={19} style={{ color: '#fff' }} /></div>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>FITLIFE <span style={{ color: '#3b5bdb' }}>GYM</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <a href="#producto" style={{ fontSize: 14, fontWeight: 600, color: '#4b5058' }}>{c.nav.producto}</a>
          <a href="#funciones" style={{ fontSize: 14, fontWeight: 600, color: '#4b5058' }}>{c.nav.funciones}</a>
          <a href="#precios" style={{ fontSize: 14, fontWeight: 600, color: '#4b5058' }}>{c.nav.precios}</a>
          <a href="#clientes" style={{ fontSize: 14, fontWeight: 600, color: '#4b5058' }}>{c.nav.clientes}</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="#" style={{ fontSize: 14, fontWeight: 700, color: '#171a1f' }}>{c.navLogin}</a>
          <a href="#" style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: '#3b5bdb', padding: '10px 18px', borderRadius: 10 }}>{c.navTry}</a>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ padding: '78px 48px 40px', textAlign: 'center', background: 'radial-gradient(900px 420px at 50% -8%, #eef1fd, #fff 70%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: '#eef1fd', color: '#3b5bdb', fontSize: 13, fontWeight: 700, marginBottom: 22 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b5bdb' }} /> {c.heroBadge}</div>
        <h1 style={{ fontSize: 56, lineHeight: 1.06, fontWeight: 800, letterSpacing: '-.03em', maxWidth: 760, margin: '0 auto' }}>{c.heroTitleL1}<br />{c.heroTitleL2}</h1>
        <p style={{ fontSize: 19, color: '#5b616b', lineHeight: 1.6, maxWidth: 560, margin: '22px auto 0' }}>{c.heroSub}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 32 }}>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: '#fff', background: '#3b5bdb', padding: '15px 26px', borderRadius: 12 }}>{c.heroCta1} <Icon name="arrow-right" size={18} /></a>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: '#171a1f', background: '#fff', border: '1px solid #e2e5e9', padding: '15px 24px', borderRadius: 12 }}>{c.heroCta2}</a>
        </div>
        <div style={{ fontSize: 13, color: '#9aa0a8', marginTop: 16 }}>{c.heroNote}</div>

        {/* hero composition: real gym photo + floating product cards */}
        <div style={{ position: 'relative', maxWidth: 1000, margin: '60px auto 0' }}>
          <div style={{ display: 'block', width: '100%', height: 470, borderRadius: 24, boxShadow: '0 40px 80px -40px rgba(23,26,31,.5)', backgroundImage: `url("${IMG('uploads/gym_3_web.webp')}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(115deg,rgba(23,26,31,.34),transparent 46%)', pointerEvents: 'none' }} />

          <div style={{ position: 'absolute', top: 34, left: -16, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '15px 18px', boxShadow: '0 22px 44px -20px rgba(23,26,31,.45)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: '#e8effd', display: 'grid', placeItems: 'center', color: '#3b5bdb' }}><Icon name="log-in" size={22} /></div>
            <div><div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{c.checkinsToday}</div><div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.05 }}>147 <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>+12%</span></div></div>
          </div>

          <div style={{ position: 'absolute', top: 120, right: -16, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: '15px 18px', boxShadow: '0 22px 44px -20px rgba(23,26,31,.45)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
              <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}><circle cx="26" cy="26" r="21" fill="none" stroke="#eef0f3" strokeWidth="6" /><circle cx="26" cy="26" r="21" fill="none" stroke="#3b5bdb" strokeWidth="6" strokeLinecap="round" strokeDasharray="131.9" strokeDashoffset="29" /></svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800 }}>78%</div>
            </div>
            <div><div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{c.weeklyGoal}</div><div style={{ fontSize: 15, fontWeight: 700 }}>{c.sessionsProgress}</div></div>
          </div>

          <div style={{ position: 'absolute', bottom: 26, left: 26, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', border: '1px solid #e6e8ec', borderRadius: 14, padding: '12px 15px', boxShadow: '0 18px 36px -18px rgba(23,26,31,.5)', display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 4px rgba(22,163,74,.15)' }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#171a1f' }}>{c.bookingConfirmed}<b>Spinning 08:30</b></div>
          </div>
        </div>

        {/* logos */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9aa0a8', fontWeight: 700 }}>{c.logosHeading}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 44, marginTop: 20, flexWrap: 'wrap' }}>
            {LOGOS.map((l) => (
              <div key={l} style={{ fontWeight: 800, fontSize: 19, color: '#c1c6ce', letterSpacing: '-.01em' }}>{l}</div>
            ))}
          </div>
        </div>
      </header>

      {/* FEATURES GRID */}
      <section id="funciones" style={{ padding: '80px 48px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 50px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#3b5bdb', letterSpacing: '.02em' }}>{c.featuresEyebrow}</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-.02em', marginTop: 10 }}>{c.featuresTitle}</h2>
          <p style={{ fontSize: 17, color: '#5b616b', marginTop: 14, lineHeight: 1.6 }}>{c.featuresSub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {FEATURE_META.map((f, i) => (
            <div key={c.features[i].title} style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: 26 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: f.bg, display: 'grid', placeItems: 'center', color: f.color }}><Icon name={f.icon} size={22} /></div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 18 }}>{c.features[i].title}</h3>
              <p style={{ fontSize: 14, color: '#5b616b', lineHeight: 1.6, marginTop: 8 }}>{c.features[i].desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHT ROW */}
      <section id="producto" style={{ background: '#f7f8fa', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 72 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#3b5bdb' }}>{c.cobrosEyebrow}</div>
              <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', marginTop: 10, lineHeight: 1.15 }}>{c.cobrosTitle}</h2>
              <p style={{ fontSize: 16, color: '#5b616b', lineHeight: 1.65, marginTop: 16 }}>{c.cobrosDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                {c.checks.map((ck) => (
                  <div key={ck} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 15, color: '#2d3138', fontWeight: 500 }}><span style={{ width: 22, height: 22, borderRadius: 6, background: '#e7f6ec', display: 'grid', placeItems: 'center', color: '#16a34a', flexShrink: 0 }}><Icon name="check" size={14} /></span> {ck}</div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 16, border: '1px solid #e6e8ec', overflow: 'hidden', boxShadow: '0 20px 40px -24px rgba(23,26,31,.25)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG('img/shot-panel.webp')} alt={c.cobrosImgAlt} style={{ display: 'block', width: '100%', height: 'auto' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div style={{ width: '100%', height: 360, display: 'block', border: '1px solid #e6e8ec', borderRadius: 16, backgroundImage: `url("${IMG('uploads/training_1_web.webp')}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#d97706' }}>{c.clasesEyebrow}</div>
              <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', marginTop: 10, lineHeight: 1.15 }}>{c.clasesTitle}</h2>
              <p style={{ fontSize: 16, color: '#5b616b', lineHeight: 1.65, marginTop: 16 }}>{c.clasesDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                {c.classChecks.map((ck) => (
                  <div key={ck} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 15, color: '#2d3138', fontWeight: 500 }}><span style={{ width: 22, height: 22, borderRadius: 6, background: '#fdeee2', display: 'grid', placeItems: 'center', color: '#d97706', flexShrink: 0 }}><Icon name="check" size={14} /></span> {ck}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA / INSTALACIONES */}
      <section id="instalaciones" style={{ padding: '80px 48px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#3b5bdb' }}>{c.facilitiesEyebrow}</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-.02em', marginTop: 10 }}>{c.facilitiesTitle}</h2>
          <p style={{ fontSize: 17, color: '#5b616b', marginTop: 14, lineHeight: 1.6 }}>{c.facilitiesSub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gridAutoRows: 170, gap: 14 }}>
          {GALLERY_META.map((g, i) => (
            <div key={g.slotId} style={{ gridColumn: `span ${g.span}`, position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid #e6e8ec' }}>
              <div style={{ width: '100%', height: '100%', display: 'block', backgroundImage: `url("${IMG(g.photo)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ position: 'absolute', left: 16, bottom: 14, color: '#fff', fontWeight: 700, fontSize: 15, textShadow: '0 2px 8px rgba(0,0,0,.55)', pointerEvents: 'none' }}>{c.gallery[i]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" style={{ padding: '80px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#3b5bdb' }}>{c.pricingEyebrow}</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-.02em', marginTop: 10 }}>{c.pricingTitle}</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 5, background: '#eef0f3', borderRadius: 11, marginTop: 22 }}>
            <button onClick={() => setAnnual(false)} style={{ padding: '9px 18px', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: monBg, color: monColor }}>{c.monthly}</button>
            <button onClick={() => setAnnual(true)} style={{ padding: '9px 18px', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: annBg, color: annColor }}>{c.annual} <span style={{ color: '#16a34a', fontSize: 12 }}>−20%</span></button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
          {plans.map((p) => (
            <div key={p.name} style={{ background: p.cardBg, border: `1.5px solid ${p.cardBorder}`, borderRadius: 18, padding: '30px 26px', position: 'relative' }}>
              {p.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#3b5bdb', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100 }}>{c.mostChosen}</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: p.nameColor }}>{p.name}</div>
              <div style={{ fontSize: 13, color: p.subColor, marginTop: 4 }}>{p.tagline}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 20 }}><span style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-.03em', color: p.priceColor }}>{p.price}</span><span style={{ fontSize: 14, color: p.subColor, marginBottom: 9 }}>{c.perMonth}</span></div>
              <div style={{ fontSize: 12, color: p.subColor, marginTop: 2, minHeight: 16 }}>{p.billing}</div>
              <a href="#" style={{ display: 'block', textAlign: 'center', marginTop: 22, padding: 12, borderRadius: 11, fontWeight: 700, fontSize: 14, background: p.btnBg, color: p.btnColor, border: `1px solid ${p.btnBorder}` }}>{p.cta}</a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                {p.features.map((ft) => (
                  <div key={ft} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: p.featColor }}><Icon name="check" size={16} style={{ color: p.checkColor, flexShrink: 0 }} /> {ft}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="clientes" style={{ background: '#f7f8fa', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', textAlign: 'center', marginBottom: 44 }}>{c.testimonialsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {TESTIMONIAL_META.map((t, i) => (
              <div key={t.slotId} style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 16, padding: 26 }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>{STARS.map((s, j) => <StarIcon key={j} />)}</div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#2d3138' }}>&ldquo;{c.testimonials[i]}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 20 }}><div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: '50%', backgroundImage: `url("${IMG(t.photo)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} /><div><div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div><div style={{ fontSize: 12, color: '#9aa0a8' }}>{t.gym}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', background: '#3b5bdb', borderRadius: 24, padding: '56px 48px', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.02em', position: 'relative' }}>{c.ctaTitle}</h2>
          <p style={{ fontSize: 17, color: '#dbe2fb', marginTop: 14, position: 'relative' }}>{c.ctaDesc}</p>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, fontSize: 16, fontWeight: 700, color: '#3b5bdb', background: '#fff', padding: '15px 28px', borderRadius: 12, position: 'relative' }}>{c.ctaButton} <Icon name="arrow-right" size={18} /></a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #eceef1', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: '#3b5bdb', display: 'grid', placeItems: 'center' }}><Icon name="activity" size={17} style={{ color: '#fff' }} /></div><span style={{ fontWeight: 800, fontSize: 16 }}>FITLIFE GYM</span></div>
          <div style={{ display: 'flex', gap: 26 }}><a href="#producto" style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{c.footerLinks.producto}</a><a href="#precios" style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{c.footerLinks.precios}</a><a href="#" style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{c.footerLinks.login}</a></div>
          <div style={{ fontSize: 13, color: '#9aa0a8' }}>{c.footerRights}</div>
        </div>
      </footer>
    </div>
  )
}
