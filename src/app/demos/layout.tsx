import type { Metadata } from 'next'
import { Manrope, Fraunces, Inter } from 'next/font/google'
import './demos.css'

// Sans clínico/moderno (consultorio) + serif con autoridad (bufete) + body neutro.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter-demo',
  display: 'swap',
})

// Demos = piezas de portafolio (mock). No deben indexarse ni competir con el sitio.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'MSS · Showcase Demo',
}

// El layout raíz (app/layout.tsx) es pass-through, así que /demos trae su propio html/body.
export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
