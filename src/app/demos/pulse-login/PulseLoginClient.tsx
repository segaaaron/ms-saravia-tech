'use client'

import Link from 'next/link'
import { useState, type CSSProperties, type ReactNode } from 'react'
import type { DemoLang } from '../lang'

/* ============================================================
   PULSE / FITLIFE GYM — Login (demo). Port nativo Next.js del
   diseño original .dc.html, misma info y mismo diseño.
   Bilingüe (es/en) según el sitio.
   Iconos lucide reproducidos inline como SVG (sin dependencias).
   ============================================================ */

type Content = {
  brandHeadline: string
  brandSub: string
  statActive: string
  statRenewal: string
  statRating: string
  testimonial: string
  loginTitle: string
  registerTitle: string
  loginSubtitleSocio: string
  loginSubtitleStaff: string
  registerSubtitle: string
  tabLogin: string
  tabRegister: string
  gymNameLabel: string
  roleLabel: string
  roleSocio: string
  roleSocioDesc: string
  roleStaff: string
  roleStaffDesc: string
  emailLabel: string
  emailPh: string
  passwordLabel: string
  forgotPassword: string
  submitLogin: string
  submitRegister: string
  orContinue: string
  switchTextLogin: string
  switchTextRegister: string
  switchLinkLogin: string
  switchLinkRegister: string
  backHome: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    brandHeadline: 'Gestioná tu gimnasio sin planillas ni caos.',
    brandSub: 'Miembros, cobros, clases y rutinas en un solo lugar. Pensado para dueños de gimnasio, no para ingenieros.',
    statActive: 'gimnasios activos',
    statRenewal: 'renovación',
    statRating: 'valoración',
    testimonial: '“Bajé la morosidad un 30% el primer mes. Ahora sé exactamente quién debe.”',
    loginTitle: 'Bienvenido de vuelta',
    registerTitle: 'Empezá gratis',
    loginSubtitleSocio: 'Entrá a reservar clases y ver tu rutina',
    loginSubtitleStaff: 'Entrá a administrar tu gimnasio',
    registerSubtitle: '14 días de prueba · sin tarjeta',
    tabLogin: 'Ingresar',
    tabRegister: 'Crear cuenta',
    gymNameLabel: 'Nombre del gimnasio',
    roleLabel: 'Ingresar como',
    roleSocio: 'Socio',
    roleSocioDesc: 'Reservar y entrenar',
    roleStaff: 'Staff',
    roleStaffDesc: 'Administrar',
    emailLabel: 'Email',
    emailPh: 'tu@gimnasio.com',
    passwordLabel: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    submitLogin: 'Ingresar',
    submitRegister: 'Crear cuenta',
    orContinue: 'o continuá con',
    switchTextLogin: '¿No tenés cuenta?',
    switchTextRegister: '¿Ya tenés cuenta?',
    switchLinkLogin: 'Creá una gratis',
    switchLinkRegister: 'Ingresá acá',
    backHome: '← Volver al inicio',
  },
  en: {
    brandHeadline: 'Run your gym without spreadsheets or chaos.',
    brandSub: 'Members, payments, classes and workouts in one place. Built for gym owners, not engineers.',
    statActive: 'active gyms',
    statRenewal: 'renewal',
    statRating: 'rating',
    testimonial: '“I cut past-due payments by 30% the first month. Now I know exactly who owes.”',
    loginTitle: 'Welcome back',
    registerTitle: 'Start for free',
    loginSubtitleSocio: 'Sign in to book classes and see your workouts',
    loginSubtitleStaff: 'Sign in to manage your gym',
    registerSubtitle: '14-day trial · no card required',
    tabLogin: 'Sign in',
    tabRegister: 'Create account',
    gymNameLabel: 'Gym name',
    roleLabel: 'Sign in as',
    roleSocio: 'Member',
    roleSocioDesc: 'Book and train',
    roleStaff: 'Staff',
    roleStaffDesc: 'Manage',
    emailLabel: 'Email',
    emailPh: 'you@gym.com',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot your password?',
    submitLogin: 'Sign in',
    submitRegister: 'Create account',
    orContinue: 'or continue with',
    switchTextLogin: "Don't have an account?",
    switchTextRegister: 'Already have an account?',
    switchLinkLogin: 'Create one for free',
    switchLinkRegister: 'Sign in here',
    backHome: '← Back to home',
  },
}

/* --- lucide icons (inline, sin dependencias) --- */
const ICON_PATHS: Record<string, ReactNode> = {
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  'building-2': (
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  apple: (
    <>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </>
  ),
}

function Icon({
  name,
  size = 17,
  style,
  onClick,
}: {
  name: string
  size?: number
  style?: CSSProperties
  onClick?: () => void
}) {
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
      onClick={onClick}
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

export default function PulseLoginClient({ lang }: { lang: DemoLang }) {
  const c = CONTENT[lang]
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState<'socio' | 'staff'>('socio')

  const login = mode === 'login'
  const socio = role === 'socio'

  const isLogin = login
  const isRegister = !login

  const title = login ? c.loginTitle : c.registerTitle
  const subtitle = login
    ? socio
      ? c.loginSubtitleSocio
      : c.loginSubtitleStaff
    : c.registerSubtitle

  const socioBg = socio ? '#eef1fd' : '#fff'
  const socioBorder = socio ? '#3b5bdb' : '#e2e5e9'
  const socioTextColor = socio ? '#3b5bdb' : '#171a1f'
  const socioIconBg = socio ? '#3b5bdb' : '#f0f1f4'
  const socioIconColor = socio ? '#fff' : '#9aa0a8'
  const staffBg = socio ? '#fff' : '#eef1fd'
  const staffBorder = socio ? '#e2e5e9' : '#3b5bdb'
  const staffTextColor = socio ? '#171a1f' : '#3b5bdb'
  const staffIconBg = socio ? '#f0f1f4' : '#3b5bdb'
  const staffIconColor = socio ? '#9aa0a8' : '#fff'

  const loginTabBg = login ? '#fff' : 'transparent'
  const loginTabColor = login ? '#171a1f' : '#6b7280'
  const regTabBg = login ? 'transparent' : '#fff'
  const regTabColor = login ? '#6b7280' : '#171a1f'

  const pwType = showPw ? 'text' : 'password'
  const pwIcon = showPw ? 'eye-off' : 'eye'

  const submitLabel = login ? c.submitLogin : c.submitRegister
  const switchText = login ? c.switchTextLogin : c.switchTextRegister
  const switchLink = login ? c.switchLinkLogin : c.switchLinkRegister

  const togglePw = () => setShowPw((s) => !s)
  const setLogin = () => setMode('login')
  const setRegister = () => setMode('register')
  const setSocio = () => setRole('socio')
  const setStaff = () => setRole('staff')
  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault()
    setMode((m) => (m === 'login' ? 'register' : 'login'))
  }
  const go = () => {
    window.location.href = role === 'staff' ? '/demos/pulse-dashboard' : '/demos/pulse-socio'
  }
  const submit = () => go()

  return (
    <div
      className="pulse-scope"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
        color: '#171a1f',
        background: '#f5f6f8',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .pulse-scope, .pulse-scope *{box-sizing:border-box;margin:0;padding:0}
        .pulse-scope input{font-family:inherit;outline:none}
        .pulse-scope a{color:#3b5bdb;text-decoration:none;font-weight:600}
        .pulse-scope a:hover{color:#2f49b8}
        .pulse-input{border:1px solid #e2e5e9}
        .pulse-input:focus-within{border-color:#3b5bdb}
        .pulse-submit:hover{background:#2f49b8 !important}
        .pulse-soc:hover{background:#f7f8fa !important}
        @media (max-width:820px){
          .pulse-scope{flex-direction:column !important}
          .pulse-scope > div{width:100% !important;flex-shrink:1 !important}
        }
      `}</style>

      {/* BRAND PANEL */}
      <div
        style={{
          width: '44%',
          flexShrink: 0,
          background: '#3b5bdb',
          color: '#fff',
          padding: '44px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -60, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, position: 'relative' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', display: 'grid', placeItems: 'center' }}>
            <Icon name="activity" size={22} style={{ color: '#3b5bdb' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.01em' }}>FITLIFE GYM</div>
        </div>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-.02em' }}>{c.brandHeadline}</div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#dbe2fb', marginTop: 18 }}>
            {c.brandSub}
          </p>
          <div style={{ display: 'flex', gap: 28, marginTop: 34 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>+1.200</div>
              <div style={{ fontSize: 13, color: '#c7d0f5' }}>{c.statActive}</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>98%</div>
              <div style={{ fontSize: 13, color: '#c7d0f5' }}>{c.statRenewal}</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>4.9★</div>
              <div style={{ fontSize: 13, color: '#c7d0f5' }}>{c.statRating}</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,.1)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', color: '#3b5bdb', display: 'grid', placeItems: 'center', fontWeight: 800, flexShrink: 0 }}>MC</div>
          <div>
            <div style={{ fontSize: 14, lineHeight: 1.45, color: '#eef1fd' }}>{c.testimonial}</div>
            <div style={{ fontSize: 12, color: '#c7d0f5', marginTop: 5, fontWeight: 600 }}>Marcos C. · Iron House Gym</div>
          </div>
        </div>
      </div>

      {/* FORM PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>{title}</h1>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>{subtitle}</p>
          </div>

          <div style={{ display: 'flex', gap: 6, padding: 5, background: '#eef0f3', borderRadius: 12, marginBottom: 24 }}>
            <button onClick={setLogin} style={{ flex: 1, padding: 10, border: 'none', borderRadius: 9, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: loginTabBg, color: loginTabColor }}>
              {c.tabLogin}
            </button>
            <button onClick={setRegister} style={{ flex: 1, padding: 10, border: 'none', borderRadius: 9, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: regTabBg, color: regTabColor }}>
              {c.tabRegister}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5058', marginBottom: 7 }}>{c.gymNameLabel}</label>
                <div className="pulse-input" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 11, background: '#fff' }}>
                  <Icon name="building-2" style={{ color: '#9aa0a8' }} />
                  <input placeholder="Iron House Gym" style={{ border: 'none', background: 'none', fontSize: 14, width: '100%', color: '#171a1f' }} />
                </div>
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5058', marginBottom: 7 }}>{c.roleLabel}</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <div onClick={setSocio} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 11, cursor: 'pointer', background: socioBg, border: `1.5px solid ${socioBorder}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: socioIconBg, display: 'grid', placeItems: 'center', color: socioIconColor, flexShrink: 0 }}>
                    <Icon name="user" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: socioTextColor }}>{c.roleSocio}</div>
                    <div style={{ fontSize: 11, color: '#9aa0a8' }}>{c.roleSocioDesc}</div>
                  </div>
                </div>
                <div onClick={setStaff} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 11, cursor: 'pointer', background: staffBg, border: `1.5px solid ${staffBorder}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: staffIconBg, display: 'grid', placeItems: 'center', color: staffIconColor, flexShrink: 0 }}>
                    <Icon name="shield" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: staffTextColor }}>{c.roleStaff}</div>
                    <div style={{ fontSize: 11, color: '#9aa0a8' }}>{c.roleStaffDesc}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5058', marginBottom: 7 }}>{c.emailLabel}</label>
              <div className="pulse-input" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 11, background: '#fff' }}>
                <Icon name="mail" style={{ color: '#9aa0a8' }} />
                <input type="email" placeholder={c.emailPh} style={{ border: 'none', background: 'none', fontSize: 14, width: '100%', color: '#171a1f' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#4b5058' }}>{c.passwordLabel}</label>
                {isLogin && (
                  <a href="#" style={{ fontSize: 12 }}>
                    {c.forgotPassword}
                  </a>
                )}
              </div>
              <div className="pulse-input" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 11, background: '#fff' }}>
                <Icon name="lock" style={{ color: '#9aa0a8' }} />
                <input type={pwType} placeholder="••••••••" style={{ border: 'none', background: 'none', fontSize: 14, width: '100%', color: '#171a1f' }} />
                <Icon name={pwIcon} onClick={togglePw} style={{ color: '#9aa0a8', cursor: 'pointer' }} />
              </div>
            </div>

            <button onClick={submit} className="pulse-submit" style={{ width: '100%', padding: 13, border: 'none', borderRadius: 11, background: '#3b5bdb', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {submitLabel} <Icon name="arrow-right" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e6e8ec' }} />
              <span style={{ fontSize: 12, color: '#9aa0a8' }}>{c.orContinue}</span>
              <div style={{ flex: 1, height: 1, background: '#e6e8ec' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="pulse-soc" style={{ flex: 1, padding: 11, borderRadius: 11, background: '#fff', border: '1px solid #e2e5e9', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icon name="globe" style={{ color: '#6b7280' }} /> Google
              </button>
              <button className="pulse-soc" style={{ flex: 1, padding: 11, borderRadius: 11, background: '#fff', border: '1px solid #e2e5e9', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icon name="apple" style={{ color: '#6b7280' }} /> Apple
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 24 }}>
            {switchText}{' '}
            <a href="#" onClick={toggleMode}>
              {switchLink}
            </a>
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#9aa0a8', marginTop: 28 }}>
            <Link href={`/demos/pulse-landing?lang=${lang}`} style={{ color: '#9aa0a8', fontWeight: 500 }}>
              {c.backHome}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
