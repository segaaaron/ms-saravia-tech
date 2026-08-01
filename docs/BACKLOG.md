# Backlog — pendientes que requieren input del dueño

Items del audit SEO/marketing (PO) que NO son código o que están bloqueados esperando
datos/decisión del dueño. El código de soporte ya existe o es directo de agregar cuando
llegue el input. Ordenado por ROI.

---

## 1. Case studies: `results` + `testimonial` (🔴 máximo ROI de confianza)
- **Qué falta:** los 3 case studies en `/work/[slug]` tienen `results` (métricas) y `testimonial`
  VACÍOS. Bloquea toda la prueba social real del sitio.
- **Impacto:** afecta CADA página de servicio (las enlaza vía `relatedCaseStudies`). Un comprador
  US/CA sin evidencia de resultados no confía.
- **Input necesario del dueño:** por cada proyecto → 3 métricas reales (ej. "+40% conversión",
  "de idea a App Store en 8 semanas") + 1 cita de cliente con nombre/cargo/empresa.
- **Dónde va (código):** `caseStudy.items.<slug>` en `src/content/seo.ts` + i18n en/es.
- **Esfuerzo:** cero ingeniería una vez hay el input. Solo poblar contenido.

## 2. WhatsApp: número de la agencia
- **Qué falta:** canal de contacto alternativo. Hoy el form es email-solo vía Resend; si Resend
  falla, el lead se pierde (sin fallback).
- **Impacto:** WhatsApp es el canal dominante en LATAM; para US/CA es un fallback de captura de lead.
- **Input necesario:** número de WhatsApp Business de la agencia (o link de Calendly).
- **Dónde va (código):** botón/CTA en `Contact.tsx` (sección trust) + posible fallback visible en el
  estado de error del form. La sección trust ya existe; solo falta el enlace real.
- **Esfuerzo:** bajo.

## 3. EEAT: author persona real en el blog
- **Qué falta:** hoy el `author` de los posts es `Organization` (JSON-LD en `blog/[slug]/page.tsx:64`).
  Google valora más un autor persona con credenciales en contenido técnico (EEAT).
- **Impacto:** ranking (EEAT) + credibilidad de venta (el comprador ve quién está detrás).
- **Decisión del dueño:** ¿sale con nombre/cara? Si sí → nombre, foto, 1-2 líneas de bio.
- **Dónde va (código):** JSON-LD `author` tipo `Person` + sección bio de autor en el post + posible
  página `/about` con el fundador.
- **Esfuerzo:** medio (schema + componente bio + i18n).

## 4. Migración de dominio `.cloud` → `.com`
- **Qué falta:** `siteUrl = https://www.ms-tech-stack.cloud`. TLD `.cloud` resta confianza a un
  comprador enterprise US vs `.com`.
- **Decisión del dueño:** comprar el `.com` (el dueño lo agregará después — pospuesto a propósito).
- **Trabajo (cuando toque):** comprar dominio → 301 permanente `.cloud` → `.com` → actualizar
  `NEXT_PUBLIC_SITE_URL` (afecta canonical, hreflang, sitemap, robots, JSON-LD por ser fuente única
  en `src/lib/seo.ts`) → nueva propiedad + migración de cambio de dominio en Search Console.
- **Esfuerzo:** medio, mayormente infra + GSC. El código está centralizado (una env var).

---

## Post-deploy (acciones en GSC, ~5 min, no código)
- Solicitar indexación de `/nearshore` + `/services/saas` + `/es/solutions/ecommerce-store` +
  `/blog/app-development-cost-guide` + `/es/blog/when-to-hire-fractional-cto`.
- Re-enviar `sitemap.xml` (creció a ~78 URLs).
- Las 39 "sin indexar" son sitio nuevo + `.cloud` de baja confianza — se resuelven con tiempo +
  autoridad (backlinks: LinkedIn del fundador, Clutch, directorios), NO con código.

## Seguridad
- Rotar `RESEND_API_KEY` si apareció en screenshots del dueño y no se ha rotado.

## Perf (ya hecho, seguimiento opcional)
- CWV home ya optimizado (First Load 218 → 199 kB, LazyMotion + dynamic imports). Medir LCP/INP real
  en móvil con Lighthouse post-deploy para confirmar el impacto en runtime (el -19 kB es del build).
