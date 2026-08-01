// Capa fina sobre Umami (self-hosted). Dos formas de emitir:
//
//  1) track(event, data)      → eventos de LÓGICA (submit, resultado del estimador, toggles).
//                               Soporta number/boolean/string (el tracker de Umami serializa
//                               con precisión 4 y strings ≤ 500 chars).
//  2) umamiAttrs(event, data) → eventos ESTÁTICOS en links/botones. Devuelve los atributos
//                               `data-umami-event*` que el propio tracker de Umami lee en su
//                               listener de click delegado — más fiable que un onClick cuando
//                               el click navega fuera de la página. Valores SIEMPRE string.
//
// Regla dura: NUNCA PII (email, nombre, mensaje) en `data`. Umami es cookieless/privacy-first
// y así se queda. Solo categóricos y numéricos.

export type UmamiEventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: UmamiEventData) => void
      identify?: (data: UmamiEventData) => void
    }
  }
}

// Catálogo cerrado de eventos del sitio (P0 + P1). Mantener los nombres ESTABLES: la variedad
// va en los params, no en nombres nuevos (recomendación de Umami). Nombre ≤ 50 chars.
export type MssEvent =
  // P0 — esqueleto del embudo
  | 'nav-click'
  | 'cta-click'
  | 'service-open'
  | 'demo-open'
  | 'estimate-complete'
  | 'estimate-cta-click'
  | 'contact-submit'
  | 'lead'
  | 'contact-error'
  // P1 — comportamiento
  | 'menu-open'
  | 'lang-switch'
  | 'work-open'
  | 'work-all'
  | 'demos-all'
  | 'estimate-change'
  | 'estimate-feature'
  | 'faq-open'
  | 'email-click'
  | 'social-click'
  | 'blog-open'
  | 'blog-cta'
  | 'blog-service'
  | 'blog-nearshore'
  | 'nearshore-click'

/** Emite un evento por JS. No-op en SSR o si el tracker aún no cargó (fire-and-forget). */
export function track(event: MssEvent, data?: UmamiEventData): void {
  if (typeof window === 'undefined') return
  try {
    window.umami?.track(event, data)
  } catch {
    // El analytics jamás debe romper la UI.
  }
}

/**
 * Atributos `data-umami-event*` para spread en un elemento estático (<a>, <Link>, <button>).
 * Ej: <a {...umamiAttrs('email-click', { placement: 'footer' })} href="mailto:…" />
 */
export function umamiAttrs(
  event: MssEvent,
  data?: Record<string, string>,
): Record<string, string> {
  const attrs: Record<string, string> = { 'data-umami-event': event }
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      attrs[`data-umami-event-${key}`] = value
    }
  }
  return attrs
}
