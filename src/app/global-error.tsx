'use client'

/**
 * global-error captura fallos del root layout (fuera del árbol [locale]). Reemplaza <html>
 * completo, por eso trae su propio html/body con estilos inline. Última red de seguridad:
 * evita que un crash de layout muestre la pantalla negra cruda de Next.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
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
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Something went wrong · Algo salió mal
        </h1>
        <p style={{ color: '#8896A6', maxWidth: 440, margin: 0 }}>
          An unexpected error occurred. Please reload the page.
          <br />
          Ocurrió un error inesperado. Intenta recargar la página.
        </p>
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
          Recargar
        </button>
      </body>
    </html>
  )
}
