import type { Metadata } from 'next'
import NotFoundContent from './_not-found-content'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud',
  ),
  title: 'Page not found — MS Saravia Tech Stack',
  robots: { index: false, follow: false },
}

/**
 * Root not-found: renderiza FUERA del árbol [locale], por eso trae su propio html/body y NO hay
 * contexto de next-intl aquí. Se mantiene como Server Component (preserva el status 404 y el
 * metadata; un not-found client con html propio rompe). El copy visible y el `lang` se localizan
 * en el cliente por la URL (/es) vía <NotFoundContent> — antes el 404 salía siempre en inglés,
 * también bajo /es.
 */
export default function NotFound() {
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
          gap: 20,
          background: '#05060A',
          color: '#EEF3F8',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <NotFoundContent />
      </body>
    </html>
  )
}
