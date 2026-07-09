import { defineRouting } from 'next-intl/routing'

// Config única de i18n (usada por el middleware Y la navegación locale-aware).
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
})
