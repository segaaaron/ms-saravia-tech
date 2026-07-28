import type { Metadata } from 'next'

// Root layout is intentionally a pass-through: the <html>/<body> live in
// app/[locale]/layout.tsx (locale-aware), and app/not-found.tsx renders its own.
// This root exists only so the global not-found has a root layout to attach to.
// metadataBase vive aquí para que el opengraph-image root (app/opengraph-image.tsx)
// resuelva a URL absoluta y no caiga a localhost en build.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ms-tech-stack.cloud',
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
