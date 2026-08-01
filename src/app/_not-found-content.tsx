'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// Copy del 404 raíz. Vive fuera del árbol [locale] (sin next-intl), así que se resuelve el idioma
// por la URL en el cliente (/es → español) y se corrige el `lang` del <html>.
const COPY = {
  es: {
    title: 'Página no encontrada',
    body: 'La página que buscas no existe o fue movida.',
    home: 'Volver al inicio',
  },
  en: {
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has been moved.',
    home: 'Back to home',
  },
} as const

export default function NotFoundContent() {
  // SSR pinta inglés (default); al montar en cliente detecta /es, cambia el copy y el lang.
  const [isEs, setIsEs] = useState(false)
  useEffect(() => {
    const es = window.location.pathname.startsWith('/es')
    setIsEs(es)
    document.documentElement.lang = es ? 'es' : 'en'
  }, [])
  const t = isEs ? COPY.es : COPY.en

  return (
    <>
      <p style={{ fontSize: 72, fontWeight: 700, margin: 0, color: '#00E5FF' }}>404</p>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t.title}</h1>
      <p style={{ color: '#8896A6', maxWidth: 420, margin: 0 }}>{t.body}</p>
      <Link
        href={isEs ? '/es' : '/'}
        style={{
          marginTop: 8,
          padding: '10px 20px',
          borderRadius: 10,
          border: '1px solid rgba(0,229,255,0.4)',
          color: '#00E5FF',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        {t.home}
      </Link>
    </>
  )
}
