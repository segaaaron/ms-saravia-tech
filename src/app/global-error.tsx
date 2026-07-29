'use client'

/**
 * global-error captura fallos del root layout (fuera del árbol [locale]). Reemplaza <html>
 * completo, por eso trae su propio html/body con estilos inline. Última red de seguridad:
 * evita que un crash de layout muestre la pantalla negra cruda de Next.
 *
 * Idioma: vive fuera del árbol [locale], así que no hay contexto de next-intl. Se resuelve
 * por la URL (/es → español, resto → inglés) para mostrar UN solo idioma, no ambos.
 */
const COPY = {
  es: {
    title: 'Algo salió mal',
    body: 'Ocurrió un error inesperado. Intenta recargar la página.',
    reload: 'Recargar',
  },
  en: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. Please reload the page.',
    reload: 'Reload',
  },
} as const

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isEs =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/es')
  const t = isEs ? COPY.es : COPY.en

  return (
    <html lang={isEs ? 'es' : 'en'} suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          background: '#05060A',
          color: '#EEF3F8',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{t.title}</h1>
        <p style={{ color: '#8896A6', maxWidth: 440, margin: 0 }}>{t.body}</p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: 4,
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
      </body>
    </html>
  )
}
