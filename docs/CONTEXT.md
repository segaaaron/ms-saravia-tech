# CONTEXT — MS Saravia Tech Stack LLC (web)

> Fuente de verdad compartida por el equipo de skills (`mss-product-owner`,
> `mss-nextjs-senior`, `mss-qa-elite`). Leer ANTES de cualquier trabajo.

## Producto
Sitio web de **MS Saravia Tech Stack LLC** — agencia de software con base en USA
(SaaS, apps móviles iOS/Android, agentes de IA, consultoría / CTO fraccional).
Es un **sitio de marketing + captación de leads**, no un producto transaccional.
Objetivo de negocio: convertir visitantes en leads calificados vía formulario de
contacto. Idiomas: **inglés (default) + español**.

## Stack real
- **Next.js 15.3** App Router + Turbopack
- **React 19** + TypeScript 5
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **next-intl 3** — i18n `localePrefix: 'as-needed'` (en sin prefijo, es → `/es`)
- **framer-motion 12**, **GSAP** (scroll/animación). GSAP se importa **dinámico** en `Process.tsx`.
  `@studio-freight/lenis` y `@gsap/react` fueron **desinstalados** (solo los usaba código muerto).
- **three.js 0.176** + `@react-three/fiber` + `drei` (hero 3D, partículas)
- **Resend 4** — envío de emails del formulario de contacto
- **zod 3** — validación del form
- **sonner** — toasts
- **Docker** — `Dockerfile` multi-stage sobre `node:22-alpine` (existe y está trackeado, junto a
  `.dockerignore`). ⚠️ Usa `npm install`, no pnpm: ignora el `pnpm-lock.yaml` versionado y puede
  resolver un árbol de dependencias distinto al de local. El deploy real hoy es el VPS standalone.
- **Gestor de paquetes: `pnpm`** (`pnpm-lock.yaml` versionado; `package-lock.json` en `.gitignore`).
  NO correr `npm install` / `npm uninstall`: rompe el lockfile y deja `node_modules` en estado mixto.
- **Sin runner de e2e**: Playwright fue desinstalado (no tenía config ni un solo `.spec.ts`).

## Formulario de contacto (email-solo, SIN base de datos)
- `POST /api/contact`: valida con **zod** → **rate-limit in-memory por IP** (5/min) →
  envía email vía **Resend**. HTML del email escapado (anti-inyección).
- Acepta `source` opcional (`demo_<slug>`, `solution_<slug>`, `contact_form`) — se muestra
  como referencia en el email de notificación (atribución de origen), NO se persiste.
- **NO hay DB.** Cada envío es un email; si Resend falla se responde error (no hay respaldo).

## Estimador de costo de apps (`/estimate`) — lead magnet
- Página propia **`/[locale]/estimate`** (server). Home tiene solo una **card CTA** (`EstimateCta`)
  que lleva ahí; nav "Cotizar"/"Estimate" → `/estimate`; banner también en `/demos`.
- Página: **back button "← Inicio"** (NO breadcrumb), h1 único, canonical self-ref + hreflang + metadata.
- Componente `src/components/sections/AppCostEstimator.tsx` (client). Lógica pura en
  **`src/lib/estimate.ts`** (sin UI/i18n). Controles: región (solo lectura), categoría (11),
  plataforma (7), tier, diseño, compliance, features. Total 39 `aria-pressed`.
- **Modelo de precio**: `hours = (base_tier × categoríaMult + featuresHoras) × plataformaMult ×
  diseñoMult + complianceHoras`; `mid = hours × tarifaRegión`; `low = mid×0.78`, `high = mid×1.12`,
  `maintenance = mid×0.18`. **Redondeo adaptativo**: <$3k→$100, <$15k→$500, resto→$1000 (+spread garantizado).
- **Tarifas región**: LATAM $30/h, US $65/h. **Plataformas**: landing 0.15, webapp 0.7, hybrid 1.0,
  ios/android 1.1, native 1.75, **aiagent 0.28** (asistente/agente básico). **Categorías**: saas 0.4,
  other 1.0 … ondemand 1.45. Todo calibrado a foros 2026 (Topflight, Business of Apps, ab4cus, etc.),
  lado accesible. Rangos objetivo del dueño: landing LATAM $700-1200/US $1500-2500; SaaS std LATAM
  $7-10k/US $15-21k; agente IA básico LATAM $1.2-2.5k/US $3.5-10k.
- **Geo por IP (región FIJA, sin toggle)** — `src/lib/geo.ts`: en `/estimate` (server) lee header de
  país del proxy (`cf-ipcountry` / `x-country-code`) y si no, hace lookup vía **country.is** con la
  IP del cliente (`x-forwarded-for`). US/CA/GB → precio USA (no pueden ver LATAM); LATAM → precio LATAM;
  desconocido → fallback por locale. Muestra el **país** (Intl.DisplayNames), solo lectura. 0 RAM, sin key.
- **Mercados target (SEO geo)**: USA, Canadá, UK, Europa, LATAM. Idiomas soportados = SOLO en/es
  (el inglés es universal, cubre Europa; NO se agregan idiomas nuevos). Señales aplicadas —
  `areaServed` (US/CA/UK/Europe/LatAm) en JSON-LD Org+ProfessionalService; hreflang `en`/`en-GB`/`en-CA`/`es`
  (los 3 EN → misma URL inglesa, patrón válido) + `x-default`; og `alternateLocale` en_GB/en_CA/es.
  Contenido real solo en/es (no hay copy localizado por país). GB añadido a la región de precios US.
  **Nota estratégica (PO)**: el hreflang geo sin contenido diferenciado es housekeeping, impacto BAJO
  en leads. Lo que mueve la aguja: case studies con results+testimonial reales, copy de timezone
  overlap ("US/UK/CA teams"), sitemap→GSC. Pendientes de contenido, no de código.
- **FAQPage JSON-LD = SOLO en la home** (`components/seo/FaqJsonLd.tsx`, co-ubicado con `<Faq/>`).
  NO va en el JsonLd global del layout: emitir FAQPage en rutas sin FAQ visible viola guideline de
  Google. `areaServed` centralizado en `lib/seo.ts` (`AREA_SERVED`) → usado por Org, ProfessionalService
  y los Service de `/services` y `/solutions` (antes hardcodeaban 'US', ya alineados a las 5 regiones).
  `Post.updated?` opcional → `dateModified` real cuando se edita un post (si falta, = `date`).

## i18n routing + toggle de idioma
- `src/i18n/routing.ts` (`defineRouting`) es la **config única** (locales, defaultLocale en,
  `localePrefix: 'as-needed'`, `localeDetection: true`). El middleware usa `createMiddleware(routing)`.
- `src/i18n/navigation.ts` (`createNavigation(routing)`) exporta `Link/useRouter/usePathname` locale-aware.
  **En client components usar estos, NO `next/navigation` crudo** para cambiar idioma.
- **Toggle** (`nav/LocaleToggle.tsx`): un solo botón que muestra el idioma DESTINO (globo + código) y alterna.
  Setea cookie `NEXT_LOCALE` **explícito** antes de `router.replace(pathname,{locale})` — si no, al volver al
  default (`/`) el `localeDetection` rebota por Accept-Language (bug ya resuelto, probado en navegador).
- **Auto-detección**: navegador en → inglés `/`; es → `/es`; otro (ja/fr…) → default inglés; la cookie
  (elección manual) gana sobre Accept-Language.

## Lo que NO hay (no inventar)
- ❌ **Base de datos / Prisma / persistencia de leads** — el form es email-solo (Resend).
  NO añadir DB, migraciones ni ORM salvo que el usuario lo pida explícitamente.
- ❌ Auth / sesiones / NextAuth — no hay panel admin
- ❌ Colas / websockets / backend transaccional

## Arquitectura
- `src/app/[locale]/` — layout + page (home de una sola página, secciones)
- `src/app/api/contact/route.ts` — endpoint del form (zod + rate-limit + Resend, sin DB)
- `src/app/robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, `apple-icon.tsx`, `manifest.ts`, `not-found.tsx`
- `src/components/` — `sections/`, `hero/`, `nav/`, `fx/`, `ui/`, `seo/`
- `src/content/` — datos compartidos (`faq.ts`, `socials.ts`, `projects.ts`) — fuente única para UI + JSON-LD
- `src/i18n/en.json`, `es.json` — mensajes; `src/i18n.ts`, `src/middleware.ts`
- `src/components/seo/JsonLd.tsx` — schema.org graph
- Canónico de host: apex → `www.ms-tech-stack.cloud` (308 en middleware)
- **Middleware limpia tracking social**: `fbclid`/`igshid`/`mibextid` → **307 a URL limpia**
  (Facebook/IG los agregan al clickear). NO toca `utm_*`/`gclid` (atribución analytics/ads).
  Nota: el 404 de FB en móvil que reportó el dueño era **caché de FB de un scrape viejo/roto**
  (el server ya devuelve 200 para `/es?fbclid=…`, verificado con UA de FB) → se arregla con
  "Scrape Again" en el FB Sharing Debugger tras redeploy, NO es bug del código.

## ⚠️ Deploy (VPS, output: standalone) — CRÍTICO
- `next.config` usa **`output: 'standalone'`**. En el VPS se arranca con
  **`node .next/standalone/server.js`**, NUNCA `next start` (con standalone `next start` da **500**
  en páginas dinámicas como `/estimate`). Tras el build copiar assets:
  `cp -r .next/static .next/standalone/.next/static` y `cp -r public .next/standalone/public`.
- Para que el **geo** funcione, nginx debe pasar `X-Forwarded-For` / `X-Real-IP` (estándar).
  Si algún día se pone Cloudflare delante, `cf-ipcountry` se usa primero (aún mejor).
- **QA hygiene**: hay zombies de `next-server`/`pnpm start`/`standalone` que sirven HTML STALE.
  Antes de cada probe: `pkill -9 -f next-server; pkill -9 -f standalone; pkill -9 -f "pnpm start"`,
  verificar 0 listeners, UN solo server, matar al final. Para probar `/estimate` usar el standalone
  server (no `next start`). El sweep SEO del resto de rutas sí sirve con `next start`.

## Riesgos técnicos conocidos (prioridad real)
1. **Core Web Vitals**: hero carga framer + GSAP + canvas de partículas → First Load de `/[locale]`
   **210 kB** (102 kB compartidos), medido en build de producción. Esa es la línea base contra la
   que comparar regresiones.
   LCP/INP en móvil es el riesgo #1. Partículas ya van con `dynamic()`.
2. **i18n drift**: claves faltantes/desalineadas entre `en.json` y `es.json`. **Drift actual: 0.**
   El total depende de cómo se cuente, así que declaralo al reportar: **263/263** contando cada
   array como una clave, **351/351** expandiendo los índices de array. Ambos dan drift 0.
3. **Animación que nunca se detiene**: framer anima por rAF en el hilo principal y NO para sola al
   salir de pantalla ni con la pestaña de fondo. Patrones ya corregidos, no reintroducir:
   `repeat: Infinity` sin pausa (usar keyframes CSS, que además respetan `prefers-reduced-motion`);
   `AnimatePresence mode="wait"` para swaps (serializa salida+entrada, cuesta el doble);
   `transition-all` sobre algo que anima por JS; `setState` en `mousemove`/`pointermove`
   (`pointermove` también dispara con el dedo → re-renders durante el scroll móvil);
   `setInterval` permanente en los demos (usar `src/app/demos/useVisibleInterval.tsx`).
4. **SEO regression**: canonical/hreflang/JSON-LD/FAQ visible deben mantenerse
   sincronizados (ver historial: FAQ schema debe tener FAQ visible). Sitemap actual: **52 URLs**.
5. **Botones**: color sólido índigo `#4F46E5` + texto blanco por **style inline** (el JIT de Tailwind
   no genera fiable las clases de color arbitrarias). No volver a gradiente ni a clase de color.

## Convenciones
- Env: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (opcional, default hardcoded), `NEXT_PUBLIC_GA_ID` (opcional)
- Secretos: solo en `.env*` (gitignored). `.env.example` = placeholders. NUNCA commitear claves reales.
- Datos duplicados (FAQ, servicios, socials): una sola fuente en `src/content/*`.

## Dominio / URLs
- Prod: `https://www.ms-tech-stack.cloud` (www es el canónico)
- Sitemap: `/sitemap.xml` (**52 URLs**) · Robots: `/robots.txt`
- GSC: propiedad verificada (Prefijo URL, etiqueta HTML)

## Pendientes (próxima sesión)
- **Case studies** `/work/[slug]`: `results` (métricas) + `testimonial` siguen VACÍOS — solo el dueño
  los provee (van en `caseStudy.items.<slug>` en/es). challenge/solution ya poblados.
- **GSC**: enviar `sitemap.xml` (token ya en layout). **CONTACT_FROM_EMAIL**: dominio verificado en Resend
  para deliverability.
- Sin commitear (working tree): cambios recientes del estimador/i18n/toggle. El dueño hace deploy manual.
- Estado: estimador + geo + i18n toggle **validados por QA, APTO PROD**. Requieren redeploy para verse en vivo.
