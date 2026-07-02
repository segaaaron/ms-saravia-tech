import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud',
  ),
  title: 'Page not found — MS Saravia Tech Stack',
  robots: { index: false, follow: false },
}

// Root not-found renders outside the [locale] layout, so it needs its own html/body.
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
        <p style={{ fontSize: 72, fontWeight: 700, margin: 0, color: '#00E5FF' }}>
          404
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
          Page not found
        </h1>
        <p style={{ color: '#8896A6', maxWidth: 420, margin: 0 }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
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
          Back to home
        </Link>
      </body>
    </html>
  )
}
