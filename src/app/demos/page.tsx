import type { Metadata } from 'next'
import Link from 'next/link'
import { getDemoLang, type DemoLang } from './lang'

export const metadata: Metadata = {
  title: 'MSS · Showcase — Demo gallery',
  robots: { index: false, follow: false },
}

type CardCopy = { vertical: string; name: string; desc: string; tags: string[] }
type Demo = {
  slug: string
  accent: string
  accent2: string
  i18n: Record<DemoLang, CardCopy>
}

const DEMOS: Demo[] = [
  {
    slug: 'aura',
    accent: '#c2a274',
    accent2: '#86bfb7',
    i18n: {
      es: { vertical: 'Estética', name: 'AURA · Clínica de piel', desc: 'Landing de clínica dermoestética con escena 3D, resultados, doctora y agenda por WhatsApp.', tags: ['3D', 'Agenda WA', 'Marcellus'] },
      en: { vertical: 'Aesthetics', name: 'AURA · Skin Clinic', desc: 'Dermato-aesthetic clinic landing with a 3D scene, results, doctor and WhatsApp booking.', tags: ['3D', 'WA Booking', 'Marcellus'] },
    },
  },
  {
    slug: 'brasa',
    accent: '#a53d1e',
    accent2: '#e2803f',
    i18n: {
      es: { vertical: 'Restaurante', name: 'BRASA · Web del comensal', desc: 'Brasería boliviana: reserva de mesas, historial y pago con QR sin filas.', tags: ['Reservas', 'Pago QR', 'Fuego'] },
      en: { vertical: 'Restaurant', name: 'BRASA · Guest Web', desc: 'Bolivian grill: table reservations, history and QR payment with no lines.', tags: ['Reservations', 'QR Pay', 'Fire'] },
    },
  },
  {
    slug: 'brasa-panel',
    accent: '#8c7a63',
    accent2: '#c2a274',
    i18n: {
      es: { vertical: 'Restaurante · Panel', name: 'BRASA · Panel operativo', desc: 'Panel de personal del restaurante: el pulso del local en un solo lugar.', tags: ['Backoffice', 'Órdenes', 'Login'] },
      en: { vertical: 'Restaurant · Panel', name: 'BRASA · Operations Panel', desc: 'Restaurant staff panel: the pulse of the venue in one place.', tags: ['Backoffice', 'Orders', 'Login'] },
    },
  },
  {
    slug: 'vesper-dashboard',
    accent: '#7C4DFF',
    accent2: '#00E5FF',
    i18n: {
      es: { vertical: 'Analytics', name: 'VESPER · Dashboard', desc: 'Panel de rendimiento de la tienda VESPER con métricas y rangos de fecha.', tags: ['KPIs', 'Charts', 'Dark'] },
      en: { vertical: 'Analytics', name: 'VESPER · Dashboard', desc: 'Performance panel for the VESPER store with metrics and date ranges.', tags: ['KPIs', 'Charts', 'Dark'] },
    },
  },
  {
    slug: 'pulse-landing',
    accent: '#3b5bdb',
    accent2: '#22d3ee',
    i18n: {
      es: { vertical: 'Gym · SaaS', name: 'PULSE · Landing', desc: 'Software de gimnasio conectado: check-in, pago y reserva actualizan el panel en vivo.', tags: ['SaaS', 'Realtime', 'Gym'] },
      en: { vertical: 'Gym · SaaS', name: 'PULSE · Landing', desc: 'Connected gym software: check-in, payment and booking update the panel live.', tags: ['SaaS', 'Realtime', 'Gym'] },
    },
  },
  {
    slug: 'pulse-dashboard',
    accent: '#3b5bdb',
    accent2: '#6b8bff',
    i18n: {
      es: { vertical: 'Gym · Panel', name: 'PULSE · Dashboard', desc: 'Panel de administración del gimnasio con socios, clases y métricas.', tags: ['Admin', 'Socios', 'Métricas'] },
      en: { vertical: 'Gym · Panel', name: 'PULSE · Dashboard', desc: 'Gym admin panel with members, classes and metrics.', tags: ['Admin', 'Members', 'Metrics'] },
    },
  },
  {
    slug: 'pulse-login',
    accent: '#3b5bdb',
    accent2: '#22d3ee',
    i18n: {
      es: { vertical: 'Gym · Auth', name: 'PULSE · Login', desc: 'Pantalla de acceso del ecosistema PULSE.', tags: ['Auth', 'Form', 'UI'] },
      en: { vertical: 'Gym · Auth', name: 'PULSE · Login', desc: 'Access screen for the PULSE ecosystem.', tags: ['Auth', 'Form', 'UI'] },
    },
  },
  {
    slug: 'pulse-socio',
    accent: '#3b5bdb',
    accent2: '#6b8bff',
    i18n: {
      es: { vertical: 'Gym · App socio', name: 'PULSE · App del socio', desc: 'App del socio del gimnasio: reserva clases y elige tu horario del día.', tags: ['Clases', 'Reservas', 'Móvil'] },
      en: { vertical: 'Gym · Member app', name: 'PULSE · Member App', desc: 'Gym member app: book classes and pick your daily time slot.', tags: ['Classes', 'Booking', 'Mobile'] },
    },
  },
  {
    slug: 'roman-ashford',
    accent: '#c2a15a',
    accent2: '#e4c86a',
    i18n: {
      es: { vertical: 'Legal', name: 'Roman Ashford · Bufete', desc: 'Landing de bufete: ocho áreas de práctica cubiertas por socios especializados.', tags: ['Legal', 'Serif', 'Práctica'] },
      en: { vertical: 'Legal', name: 'Roman Ashford · Law Firm', desc: 'Law firm landing: eight practice areas covered by specialized partners.', tags: ['Legal', 'Serif', 'Practice'] },
    },
  },
  {
    slug: 'vesper-store',
    accent: '#a855f7',
    accent2: '#e4c86a',
    i18n: {
      es: { vertical: 'E-commerce', name: 'VESPER · Store', desc: 'Tienda online con lista de deseos, catálogo y envío gratis desde $80.', tags: ['Catálogo', 'Wishlist', 'Checkout'] },
      en: { vertical: 'E-commerce', name: 'VESPER · Store', desc: 'Online store with wishlist, catalog and free shipping from $80.', tags: ['Catalog', 'Wishlist', 'Checkout'] },
    },
  },
]

// Imagen de fondo representativa por demo (assets locales /showcase + 1 unsplash del propio demo).
const THUMBS: Record<string, string> = {
  aura: '/showcase/img/recepcion.webp',
  brasa: '/showcase/img/menu/pique.webp',
  'brasa-panel': '/showcase/img/menu/silpancho.webp',
  'vesper-dashboard': '/showcase/img/shot-panel.webp',
  'pulse-landing': '/showcase/uploads/gym_3_web.webp',
  'pulse-dashboard': '/showcase/uploads/gym_4_web.webp',
  'pulse-login': '/showcase/uploads/gym_5_web.webp',
  'pulse-socio': '/showcase/uploads/training_1_web.webp',
  'roman-ashford': '/showcase/img/despacho.webp',
  'vesper-store': 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
}

const COPY = {
  es: {
    back: 'Volver al sitio',
    title: 'Demos en vivo.',
    intro: 'Piezas de portafolio con datos ficticios — animación, objetos 3D y flujos reales. Cada demo termina en un CTA que registra un lead. Construidas por MS Saravia Tech Stack.',
    view: 'Ver demo',
  },
  en: {
    back: 'Back to site',
    title: 'Live product demos.',
    intro: 'Portfolio pieces with fictional data — animation, 3D objects and real flows. Each demo ends in a CTA that captures a lead. Built by MS Saravia Tech Stack.',
    view: 'View demo',
  },
} satisfies Record<DemoLang, { back: string; title: string; intro: string; view: string }>

export default async function DemosGallery({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = await getDemoLang(await searchParams)
  const copy = COPY[lang]

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(60% 50% at 20% 0%, rgba(124,77,255,0.14), transparent 60%), radial-gradient(50% 40% at 90% 10%, rgba(0,229,255,0.1), transparent 60%), #060810',
        color: '#EAF0F7',
        fontFamily: 'var(--font-inter-demo), system-ui, sans-serif',
        padding: 'clamp(32px,4vw,56px) clamp(20px,5vw,64px) clamp(48px,8vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Link
          href={lang === 'es' ? '/es' : '/'}
          className="demos-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 'clamp(28px,4vw,44px)',
            color: '#8FA0B4',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: 'var(--font-manrope), sans-serif',
          }}
        >
          <span className="demos-back-arrow" style={{ transition: 'transform .25s', fontSize: 16 }}>←</span>
          {copy.back}
        </Link>
        <header style={{ maxWidth: 720, marginBottom: 'clamp(40px,6vw,72px)' }}>
          <span
            style={{
              fontFamily: 'var(--font-manrope), monospace',
              fontSize: 12.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#00E5FF',
            }}
          >
            MSS · Showcase
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.2rem,5vw,3.6rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: '18px 0 0',
            }}
          >
            {copy.title}
          </h1>
          <p style={{ color: '#8FA0B4', fontSize: 'clamp(1rem,1.4vw,1.15rem)', margin: '18px 0 0' }}>
            {copy.intro}
          </p>
        </header>

        {/* Banner: estimador de costo → página /estimate */}
        <Link
          href={lang === 'es' ? '/es/estimate' : '/estimate'}
          className="gallery-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            marginBottom: 24,
            padding: '22px 26px',
            borderRadius: 18,
            border: '1px solid rgba(0,229,255,0.25)',
            background: 'linear-gradient(120deg, rgba(0,229,255,0.08), rgba(124,77,255,0.06))',
            textDecoration: 'none',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 700, fontSize: 18, color: '#EAF0F7' }}>
              {lang === 'es' ? '¿Quieres cotizar tu proyecto?' : 'Want to price your project?'}
            </div>
            <div style={{ color: '#8FA0B4', fontSize: 14, marginTop: 4 }}>
              {lang === 'es'
                ? 'Estima el costo de tu app en USD en segundos — gratis, sin registro.'
                : 'Estimate your app cost in USD in seconds — free, no signup.'}
            </div>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 999,
              background: '#4F46E5',
              color: '#FFFFFF',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: 'nowrap',
            }}
          >
            {lang === 'es' ? 'Cotizar mi app' : 'Estimate my app'} →
          </span>
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {DEMOS.map((d) => {
            const c = d.i18n[lang]
            return (
              <Link
                key={d.slug}
                href={`/demos/${d.slug}?lang=${lang}`}
                className="gallery-card"
                style={{ display: 'block' }}
              >
                <article
                  style={{
                    position: 'relative',
                    height: '100%',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid rgba(140,170,210,0.14)',
                    background: 'linear-gradient(180deg, #0E1626, #0A111C)',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      height: 150,
                      backgroundImage: `linear-gradient(180deg, rgba(6,8,16,0.25) 0%, rgba(10,17,28,0.9) 100%), radial-gradient(70% 120% at 30% 0%, ${d.accent}40, transparent 65%), radial-gradient(60% 100% at 90% 100%, ${d.accent2}33, transparent 60%), url('${THUMBS[d.slug]}')`,
                      backgroundSize: 'cover, cover, cover, cover',
                      backgroundPosition: 'center',
                      borderBottom: `1px solid ${d.accent}22`,
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: 20,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-manrope), monospace',
                        fontSize: 11,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#EAF0F7',
                        background: 'rgba(8,12,20,0.55)',
                        border: `1px solid ${d.accent}77`,
                        borderRadius: 999,
                        padding: '5px 12px',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {c.vertical}
                    </span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <h2
                      style={{
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontWeight: 700,
                        fontSize: '1.4rem',
                        letterSpacing: '-0.02em',
                        margin: 0,
                      }}
                    >
                      {c.name}
                    </h2>
                    <p style={{ color: '#8FA0B4', fontSize: 15, margin: '10px 0 18px' }}>{c.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: 'var(--font-manrope), monospace',
                            fontSize: 11.5,
                            color: '#9fb0c4',
                            border: '1px solid rgba(140,170,210,0.16)',
                            borderRadius: 8,
                            padding: '5px 9px',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        color: d.accent,
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {copy.view}
                      <span className="arrow" style={{ transition: 'transform .25s' }}>→</span>
                    </span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        .gallery-card article { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .gallery-card:hover article { transform: translateY(-6px); border-color: rgba(140,170,210,0.3); box-shadow: 0 24px 60px -34px rgba(0,229,255,0.4); }
        .gallery-card:hover .arrow { transform: translateX(5px); }
        .demos-back { transition: color .2s ease; }
        .demos-back:hover { color: #EAF0F7; }
        .demos-back:hover .demos-back-arrow { transform: translateX(-4px); }
      `}</style>
    </main>
  )
}
