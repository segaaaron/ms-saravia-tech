import { defineRouting } from 'next-intl/routing'

// Config única de i18n (usada por el middleware Y la navegación locale-aware).
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // localeDetection: false → `/` SIEMPRE sirve `en` (200, sin redirect). Con `true`, un request
  // a `/` con Accept-Language: es respondía 307 → /es; como Google rastrea geo-distribuido, marcaba
  // la home (URL canónica en/x-default) como "Página con redirección" y no la indexaba bien.
  // hreflang + selector de idioma ya cubren el descubrimiento por locale (recomendación de Google:
  // no auto-redirigir por Accept-Language en URLs indexables).
  localeDetection: false,
})
