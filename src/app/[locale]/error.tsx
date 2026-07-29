'use client'

import { usePathname } from 'next/navigation'

const COPY = {
  es: {
    title: 'Algo salió mal',
    body: 'Ocurrió un error al cargar esta página. Por lo general se resuelve al recargar.',
    retry: 'Reintentar',
    reload: 'Recargar página',
  },
  en: {
    title: 'Something went wrong',
    body: 'An error occurred while loading this page. Reloading usually fixes it.',
    retry: 'Try again',
    reload: 'Reload page',
  },
} as const

/**
 * Route-level error boundary del árbol [locale]. Ante una excepción de cliente muestra una
 * UI de marca con recuperación (reintentar / recargar) en vez de la pantalla negra de Next.
 * El caso apex→www que lo motivó ya se resuelve en el edge (Traefik).
 */
export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const t = pathname?.startsWith('/es') ? COPY.es : COPY.en

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        textAlign: 'center',
        padding: 24,
        color: '#EEF3F8',
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{t.title}</h1>
      <p style={{ color: '#8896A6', maxWidth: 440, margin: 0 }}>{t.body}</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: '1px solid rgba(0,229,255,0.4)',
            background: 'transparent',
            color: '#00E5FF',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t.retry}
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#00E5FF',
            color: '#05060A',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t.reload}
        </button>
      </div>
    </div>
  )
}
