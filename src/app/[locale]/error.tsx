'use client'

import { useEffect } from 'react'
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
 * Route-level error boundary del árbol [locale]. Captura excepciones de cliente (p. ej. un
 * fetch RSC que falla por CORS al quedar el documento en el apex) y, en vez de la pantalla
 * negra "Application error", muestra una UI de marca con recuperación.
 *
 * Auto-recuperación one-shot: si el documento está en el apex sin-www, un hard-reload cae en
 * www vía el 308 canónico y el error desaparece. Se marca en sessionStorage para no ciclar
 * si el error persistiera en www.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const t = pathname?.startsWith('/es') ? COPY.es : COPY.en

  useEffect(() => {
    if (typeof window === 'undefined') return
    const KEY = 'mss_err_recover'
    const alreadyTried = sessionStorage.getItem(KEY) === '1'
    if (location.hostname === 'ms-tech-stack.cloud' && !alreadyTried) {
      sessionStorage.setItem(KEY, '1')
      location.replace(
        'https://www.ms-tech-stack.cloud' +
          location.pathname +
          location.search +
          location.hash,
      )
    }
  }, [error])

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
