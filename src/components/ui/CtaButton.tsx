import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// CTA primario del sitio marketing. Color ENTERO de marca (cyan #2FF5E0) + texto oscuro
// sólido → legible siempre (sin el problema de contraste del gradiente cyan→violet) +
// glow elegante. Consistente en TODAS las páginas del SaaS (no aplica a los demos).
export default function CtaButton({
  href,
  children,
  className = '',
  size = 'md',
  external = false,
  hardNav = false,
  dataUmami,
}: {
  href: string
  children: React.ReactNode
  className?: string
  size?: 'md' | 'lg'
  external?: boolean
  // hardNav: navegación de documento completo en la MISMA pestaña (sin target=_blank).
  // Necesario al cruzar a otro root layout (p. ej. /demos): un <Link> soft-nav rompería
  // el DOM entre los dos <html>. external abre en pestaña nueva; hardNav no.
  hardNav?: boolean
  // Atributos data-umami-event* (usar umamiAttrs()). Umami los envía en su propio listener de
  // click → fiable incluso cuando el CTA navega (hard-nav a /demos, /estimate, etc).
  dataUmami?: Record<string, string>
}) {
  const pad = size === 'lg' ? 'px-8 py-4 text-base' : 'px-7 py-3.5 text-sm'
  const inner = (
    <>
      {children}
      <ArrowRight size={size === 'lg' ? 18 : 16} className="transition-transform duration-200 group-hover:translate-x-1" />
    </>
  )
  const cls = `group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] ${pad} ${className}`
  // Índigo suave + texto blanco (elegante, sin fatiga visual). Color por style inline
  // para garantizar contraste (no depende del JIT de Tailwind).
  const style = {
    background: '#4F46E5',
    color: '#FFFFFF',
    boxShadow: '0 8px 24px -8px rgba(79,70,229,0.5)',
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style} {...dataUmami}>
        {inner}
      </a>
    )
  }
  if (hardNav) {
    return (
      <a href={href} className={cls} style={style} {...dataUmami}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} style={style} {...dataUmami}>
      {inner}
    </Link>
  )
}
