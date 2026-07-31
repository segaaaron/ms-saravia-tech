import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './demos.css'

// Chrome de las DEMOS (piezas de portafolio). Layout de segmento (NO renderiza <html>/<body>:
// eso vive en el root [locale]/layout.tsx). Vive en el grupo (demos) para NO heredar el
// Navbar/Footer del sitio, que están en (site). El <html>/<body> es compartido con (site) →
// navegar site↔demo es soft-nav, sin el segundo root layout que antes forzaba full-reload.

// Sans clínico/moderno (consultorio) + body neutro. Las fuentes concretas de cada demo
// (Cormorant, Marcellus, Bodoni, DM Sans, Plus Jakarta…) las carga cada client por su cuenta;
// estas dos alimentan la galería (--font-manrope) y el reset del scope (--font-inter-demo).
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter-demo',
  display: 'swap',
})

// Demos = piezas de portafolio (mock). No deben indexarse ni competir con el sitio. Esta
// metadata de segmento cubre a todas las páginas del grupo; cada page la reafirma igual.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'MSS · Showcase Demo',
}

// `data-demo-surface` es el ancla de aislamiento CSS: demos.css scopea TODAS sus reglas de
// elemento (reset, tipografía, focus) bajo este atributo con :where(), así ni las demos sangran
// al sitio ni el reset/Preflight del sitio pisa a las demos. Las variables de fuente de demo se
// aplican aquí (subtree), no en <body>: next/font funciona igual en cualquier contenedor.
export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo-surface className={`${manrope.variable} ${inter.variable}`}>
      {children}
    </div>
  )
}
