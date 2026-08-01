# Handoff — MS Saravia Tech Stack web

Repo: `/Users/miguelangelsaraviabelmonte/dev-web/ms-tech-stack-llc-web` · branch `master`
Prod: `https://www.ms-tech-stack.cloud` (www es el canónico)
Último commit: `f3d81bd` · **todo pusheado a `origin/master`.** Working tree limpio.
⚠️ Pusheado ≠ desplegado: prod es un VPS con deploy MANUAL. Ver "Deploy" en `CONTEXT.md`.
🔴 **DEPLOY PENDIENTE**: los 9 commits de la sesión 2026-08-01 están en GitHub pero NO en el VPS.
   Prod sigue con el build viejo (aún muestra "ReadyCV" y "MS Saravia"). Ver sesión abajo.

## Fuente de verdad
- `docs/CONTEXT.md` — stack, límites, convenciones. **LEER PRIMERO.** Sincronizado y sin drift.
- Roadmap del programa de demos (Artifact):
  https://claude.ai/code/artifact/044e267e-ef64-47a9-af6f-235a57cb9938

## Equipo — ahora son SUBAGENTES, no skills
Viven en **`.claude/agents/*.md`**. Se invocan con la herramienta Agent.
⚠️ **NO se versionan**: `.claude/` está en `.gitignore` (línea 69), así que no viajan si clonás
en otra máquina. Para versionarlos haría falta una excepción: `!.claude/agents/`.

| Agente | Rol | `model` | `tools` |
|---|---|---|---|
| `mss-qa-elite` | Auditar y verificar de verdad | `opus` | Bash, Read, Grep, Glob, WebFetch |
| `mss-nextjs-senior` | Implementar / optimizar | `opus` | + Write, Edit |
| `mss-product-owner` | PRDs, roadmap, priorización | `sonnet` | Read, Grep, Glob, WebFetch (solo lectura) |

Las 3 skills `~/.claude/skills/mss-*` **se borraron** al migrar (una skill no puede declarar
`model:`; un agente sí). Backup en `~/.claude/skills-backup-mss-20260725/`.

- QA sin `Edit`/`Write` a propósito: un auditor que puede arreglar deja de auditar.
- PO solo lectura: define el qué/porqué, no toca código.
- **El effort NO se puede fijar por agente** — solo existe a nivel sesión (`effortLevel` en
  `settings.json`, hoy `medium`). Para auditorías críticas, subilo a `high` antes de invocar QA.
- Comparten `docs/CONTEXT.md` como fuente de verdad.

**NO usar** `nextjs-prisma-elite` / `nextjs-qa-elite` (skills globales): apuntan a un stack con
Prisma que este repo no tiene.

Caveman mode activo (respuestas terse). Copy de demos en **español**.

---

## Sesión 2026-08-01 (SEO multi-mercado + conversión + CWV + rebrand)

**Contexto:** el dueño pidió al PO auditar SEO + marketing para US/CA/LATAM. Se ejecutó casi todo
el backlog code-actionable. **9 commits pusheados (`6acfc91`..`f3d81bd`), DEPLOY PENDIENTE.**

### Qué se hizo (todo en `origin/master`, NADA en prod aún)
1. `6acfc91` **fix SEO técnico**: `sitemap.ts` `lastModified` real (posts=`updated??date`, resto
   constante `SITE_CONTENT_UPDATED`); `routing.ts` **`localeDetection: false`** — con `true`, `/`
   con Accept-Language:es daba 307→/es y Google marcaba la home como "Página con redirección".
   Verificado en vivo: `/` con es ahora 200.
2. `d0a9f21` **landing `/nearshore`** (+ /es): ruta indexable, tabla comparativa BOFU, FAQ, JSON-LD
   Service+FAQPage+Breadcrumb, en Navbar + home + sitemap (priority 0.9). + 3 posts de blog.
3. `6587c31` **2 posts de mercado**: Canadá (PIPEDA/CAD) + guía LATAM.
4. `3b4bd91` **internal linking**: campo `Post.spotlight` → los 4 posts nearshore enlazan a
   `/nearshore` desde el CTA. Evento umami `blog-nearshore`.
5. `6423f7a` **conversión**: form de contacto con `budget` + `projectType` (zod enums cerrados,
   email actualizado, sin DB) + **sección trust** en Contact (US LLC, NDA, senior-led, timezone).
6. `98f294e` **`docs/BACKLOG.md`**: pendientes que requieren input del dueño (leer ese archivo).
7. `83bac86` **CWV**: `LazyMotion features={domAnimation} strict` en el layout + 18 componentes
   `motion.*`→`m.*` + 9 secciones bajo el pliegue con `next/dynamic` (SIN ssr:false). First Load
   home **218→199 kB**. QA aprobó (cero regresión visual/SEO). Nota: three.js NO está en el home
   (solo en /demos/aura); el peso era framer-motion.
8. `4ffcb90` **marca visible → "MS Tech Stack"** (se quitó "Saravia" de 20 archivos). PERO
   `legalName` del JSON-LD se preserva `"MS SARAVIA TECH STACK LLC"` (nombre LEGAL de la LLC no
   cambió) y los emails `techstackmssaravia@gmail.com` quedan intactos (cuentas reales).
   + case study `readycvv.com`→`valhallaresume.com`, slug `/work/readycv`→`/work/valhalla-resume`
   con **redirect 301** en `next.config.ts`.
9. `f3d81bd` **rebrand ReadyCV → Valhalla Resume** (display) + copy inglés "CV"→"resume" (español
   mantiene "CV"). `id: 'readycv'` interno se queda (no visible).

### GSC (investigado con el dueño, cerrado)
Las 39 "sin indexar" NO son bug de código — sitio nuevo (~3 semanas) + dominio `.cloud` de baja
confianza. Verificadas las 5 URLs marcadas: canonical/hreflang/200 correctos. Sitemap ya enviado
a GSC (estado Correcto). Acción del dueño: solicitar indexación de /nearshore + páginas clave
post-deploy + construir autoridad (backlinks).

### Pendiente del dueño (ver `docs/BACKLOG.md`)
- **DEPLOY al VPS** (bloqueante — nada en vivo sin esto).
- Case studies `results`+`testimonial` (vacíos, solo el dueño los da) — máximo ROI confianza.
- WhatsApp (número), EEAT author (sí/no+bio), migración `.com` (pospuesta).
- **Setup GSC nueva propiedad `valhallaresume.com`** (dominio del producto Valhalla, sitio APARTE
  de este repo) + Change of Address desde readycvv.com — requiere 301 site-wide en ESE hosting.
- Rotar `RESEND_API_KEY` si apareció en screenshots.

---

## Sesión anterior (perf móvil + limpieza + skills)

### 1. Latencia del menú móvil
El usuario reportó delay al abrir/cerrar. Eran **cinco causas apiladas**. La dominante:
`AnimatePresence mode="wait"` en el botón hamburguesa serializaba salida (0.2s) y entrada (0.2s)
del icono → **400 ms** de hueco vacío tras el tap.

El porqué de cada cambio está en comentarios en español dentro del código. Archivos tocados:
`nav/Navbar.tsx` (el principal), `hero/ReactorVisual.tsx` (framer `repeat: Infinity` → keyframes
CSS pausables con IntersectionObserver + visibilitychange), `fx/InteractiveParticles.tsx`,
`sections/AppCostEstimator.tsx`, `sections/HoloDashboard.tsx`, `ui/MagneticButton.tsx`,
`ui/TiltCard.tsx`.

### 2. Código muerto (−538 líneas)
Herramienta: `npx knip@5`.
Borrados: `src/app/demos/_ui.tsx` (304 líneas, 8 exports sin importar — el `SmoothScroll`/`Reveal`/
`Counter`/`Magnetic` que mencionaba el handoff viejo ya no los usaba nadie),
`src/components/hero/Orb3D.tsx` (183), `src/lib/resend.ts` (2).
Deps desinstaladas: `@gsap/react`, `@studio-freight/lenis`, `playwright`.
Exports demotados a locales: `posts`, `REGION_RATE`, `servicePages`, `solutionPages`, y 6 variants
muertas de `src/lib/motion.ts`.
`three` / `@react-three/*` **se quedan** — `src/app/demos/aura/Scene.tsx` los usa.

### 3. Skills corregidas → convertidas en agentes
Las 3 `mss-*` describían un repo inexistente (Prisma 6, modelo `Lead`, `src/lib/db.ts`, Playwright
instalado, `Orb3D`, Docker). Corregidas en su lugar. Se les añadieron los patrones de perf
encontrados acá como reglas nombradas, y a `mss-qa-elite` dos secciones nuevas:
*"1b. INP y costo permanente de animación"* y *"Trampas de medición"*.

---

## Verificación

- `npx tsc --noEmit` limpio
- `pnpm build` compila, 22 páginas, First Load `/[locale]` **210 kB** (102 kB compartidos)
- `npx eslint src` → **exit 0, sin errores** (se arregló el `no-explicit-any` que era el único
  del repo, tipando `qv` por inferencia con un IIFE)
- i18n drift 0 · Sitemap: 52 URLs
- **Auditado por `mss-qa-elite`**: veredicto APTO PROD. Encontró que `useVisibleInterval.tsx`
  estaba sin trackear (habría roto el build del VPS) y dos bugs reales más; los tres corregidos
  antes del push.
- ReactorVisual confirmado en navegador tras migrar de framer a CSS

**NO verificado:** la latencia del menú **medida en móvil real**. Chrome no aceptó el resize a ancho
móvil y la pestaña quedó en background (timers throttled). El arreglo es analíticamente sólido y el
build pasa, pero falta confirmarlo en un teléfono o con emulación de dispositivo.
**Es lo primero de la próxima sesión.**

---

## Estado previo (hecho y verificado en sesiones anteriores)

- **SEO completo**: metadata/canonical/hreflang/x-default, JSON-LD (Org + WebSite +
  ProfessionalService + FAQPage con FAQ visible), robots, sitemap, opengraph-image, apple-icon,
  manifest, not-found, GA4 (env), GSC verification.
- **SEO geo multi-mercado (USA/Canadá/UK/LATAM)**: hreflang `en`/`en-GB`/`en-CA`/`es`+`x-default`,
  `areaServed` US/CA/UK/LatAm en JSON-LD, og `alternateLocale`, GB en región de precios US. Impacto
  SEO bajo sin contenido de respaldo (ver nota PO en CONTEXT); pendiente: case studies con datos
  reales + copy de timezone overlap. Requiere redeploy.
  GSC: propiedad `https://www.ms-tech-stack.cloud` **verificada** (etiqueta HTML). Token
  hardcodeado como default en `src/app/[locale]/layout.tsx` (es público, ok).
- **Estimador `/estimate` + geo por IP** — validados por QA, aptos PROD. Requieren redeploy.
- **Galería de demos** en `/demos` (noindex, fuera de `[locale]`, excluida del middleware i18n).
  Demos actuales: `aura`, `brasa`, `brasa-panel`, `pulse-landing`, `pulse-login`, `pulse-socio`,
  `pulse-dashboard`, `roman-ashford`, `vesper-store`, `vesper-dashboard`.
  (Los demos `consultorio` y `law-firm` que citaba el handoff anterior **ya no existen**.)

---

## Pendientes

1. **Probar el menú en móvil real.** Único punto sin evidencia empírica.
2. ~~`docs/CONTEXT.md` arrastra drift~~ — **HECHO.** Sincronizado: se quitó `@studio-freight/lenis`
   y `@gsap/react`, se marcó Playwright como desinstalado, se documentó que el gestor es `pnpm`,
   se corrigió el First Load a 210 kB y las claves i18n (263/263 o 351/351 según convención, drift 0), y se añadió un riesgo nuevo
   ("Animación que nunca se detiene") con los patrones a no reintroducir.
   ⚠️ **Corrección de un error mío**: en la sesión afirmé que no existía `Dockerfile`. **Sí existe**
   y está trackeado junto a `.dockerignore` — mi `ls Dockerfile* docker-compose*` abortó entero
   porque zsh mata la línea cuando un glob no matchea, y leí el fallo como ausencia. El
   `Dockerfile` es multi-stage sobre `node:22-alpine`, pero **usa `npm install`**, así que ignora
   el `pnpm-lock.yaml` versionado y puede resolver un árbol distinto al de local. Vale revisarlo.
3. ~~Commit~~ — **HECHO.** Tres commits en `master`, pusheados: `0971e20` (perf móvil),
   `f4ec09e` (código muerto), `d7db724` (perf demos + docs).
   **FALTA EL DEPLOY AL VPS** — verificado con `curl` que prod aún sirve el build viejo.
4. **`packageManager` no está declarado en `package.json`.** El repo usa pnpm pero nada lo fuerza —
   por eso esta sesión ejecutó `npm uninstall` por error. Declararlo lo previene.
5. 🔴 **RESEND_API_KEY apareció en screenshots del usuario** (no en el repo). Se sugirió rotarla
   en una sesión anterior; **sigue sin confirmarse**. Decisión del usuario.
6. **Case studies `/work/[slug]`**: `results` (métricas) y `testimonial` siguen VACÍOS — solo el
   dueño los provee (van en `caseStudy.items.<slug>` en/es).
7. **CONTACT_FROM_EMAIL**: dominio verificado en Resend para deliverability.

---

## Gotchas y trampas de medición

- **`pnpm`, nunca `npm`.** `pnpm-lock.yaml` está versionado, `package-lock.json` gitignoreado.
  Correr `npm uninstall` generó un `package-lock.json` espurio y dejó `node_modules` mixto.
  Se arregló con `rm package-lock.json && pnpm install`.
- **NO mezclar `next build` con `dev`**: corrompe `.next` (ENOENT `_buildManifest.tmp`).
  Tras cualquier build de prueba: `rm -rf .next .turbo` antes de que el usuario corra el dev server.
- **Deploy standalone**: `next.config.ts` usa `output: 'standalone'`. En el VPS se arranca con
  `node .next/standalone/server.js`, **nunca `next start`** (las rutas dinámicas como `/estimate`
  dan 500). Para probar `/estimate` localmente, usar el standalone.
- **Servidores zombi** sirviendo HTML stale. Antes de cada probe:
  `pkill -9 -f next-server; pkill -9 -f standalone`, verificar 0 listeners, UNO solo, matar al final.
- **Regex BSD vs GNU en macOS.** `grep` sin `-E` no soporta `\|`; `sed` no soporta `\?`. Un barrido
  de código muerto devolvió "96 archivos sin usar" (todos) porque el patrón nunca matcheó — un falso
  resultado limpio que parecía real. Usar `knip`, y **verificar sus hallazgos**: marca `src/i18n.ts`
  como no usado, pero `next.config.ts:4` lo referencia **por string**
  (`createNextIntlPlugin('./src/i18n.ts')`) — borrarlo rompe todo el i18n.
- **Medir en pestaña de background da basura.** Chrome ralentiza `setTimeout` a 1s y congela `rAF`.
  Las animaciones de entrada de framer ni corren: los elementos quedan en `opacity: 0` y parecen
  bugs de render (pasó con el ReactorVisual, se diagnosticó mal por un momento).
- **`resize_window` puede devolver éxito sin cambiar el viewport.** Verificar `innerWidth` por JS.
- ESLint del repo **ya funciona** (`npx eslint src`). El gotcha viejo del patch de rushstack quedó
  resuelto: `next.config.ts` tiene `eslint: { ignoreDuringBuilds: true }` y el lint es un gate aparte.

---

## Contexto del usuario

- Escribe en español; responder en español.
- Es explícito con el alcance: pidió corregir skills, **no** crear agentes ni skills nuevas.
  Preguntar antes de crear o borrar archivos fuera de lo pedido.
- Hace el deploy manualmente. **No commitear sin que lo pida.**

## Skills sugeridas para la próxima sesión
`mss-qa-elite` (cerrar el punto 1 — ya tiene la sección con estos patrones exactos),
`mss-nextjs-senior` (ajustar timings si hace falta), `napkin` (se activa sola; las trampas de
arriba merecen entrar en su sección *"Measurement Traps"*).
