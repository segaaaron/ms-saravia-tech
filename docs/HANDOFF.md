# Handoff — MS Saravia Tech Stack web

Repo: `/Users/miguelangelsaraviabelmonte/dev-web/ms-tech-stack-llc-web` · branch `master`
Prod: `https://www.ms-tech-stack.cloud` (www es el canónico)

## Fuente de verdad
- `docs/CONTEXT.md` — stack, límites, backend, convenciones. **LEER PRIMERO.**
- Roadmap del programa de demos (Artifact): https://claude.ai/code/artifact/044e267e-ef64-47a9-af6f-235a57cb9938

## Equipo de skills (usar según tarea)
- `mss-product-owner` — PRDs, roadmap, priorización (no código)
- `mss-nextjs-senior` — implementar/optimizar (Next 15 App Router, r3f, i18n, CWV)
- `mss-qa-elite` — auditar/verificar de verdad (build, CWV, a11y, SEO)
Definiciones en `~/.claude/skills/mss-*/SKILL.md`. Comparten `docs/CONTEXT.md`.
Caveman mode activo (respuestas terse). Copy de demos en **español**.

## Estado hecho + verificado en vivo
1. **SEO completo** (commits `SEO DONE`, `SITEMAP`): metadata/canonical/hreflang/x-default,
   JSON-LD (Org+WebSite+ProfessionalService+FAQPage con FAQ visible), robots, sitemap,
   opengraph-image, apple-icon, manifest, not-found, GA4 (env), GSC verification.
   - GSC: propiedad `https://www.ms-tech-stack.cloud` **verificada** (etiqueta HTML), sitemap enviado
     (estado "No se ha podido obtener" era transitorio; el sitemap sirve 200 OK).
   - Token GSC hardcodeado como default en `src/app/[locale]/layout.tsx` (público, ok).
2. **Backend de leads (Prisma)**: modelo `Lead` (`prisma/schema.prisma`), singleton `src/lib/db.ts`,
   `POST /api/contact` persiste lead SIEMPRE + email best-effort (Resend) + escapa HTML.
   Acepta `source` (default `contact_form`, o `demo_<slug>`). **SQLite en dev** (`prisma/dev.db`),
   **cambiar a Postgres en prod** (provider + `DATABASE_URL`). Scripts: `pnpm db:migrate/deploy/studio`.
   `build` corre `prisma generate` antes de `next build`.
3. **Galería de demos** en `/demos` (noindex, en repo, fuera de `[locale]`, excluida del middleware i18n):
   - `/demos` — índice/galería
   - `/demos/consultorio` — "Clínica Lumen": tema CLARO, ADN 3D (r3f), bento servicios, Manrope
   - `/demos/law-firm` — "Vásquez & Asociados": tema OSCURO oro, balanza 3D, áreas como lista
     numerada editorial, Fraunces serif
   - CTA de cada demo → `Lead` con `source=demo_*` (verificado: fila creada en DB).
   - Helpers compartidos: `src/app/demos/_ui.tsx` (SmoothScroll/Lenis, Reveal, Counter, Magnetic,
     DemoCTA, DemoBadge). Layout propio `src/app/demos/layout.tsx` (html/body, fuentes, noindex).
   - 3D lazy (`ssr:false`); First Load ~157KB.

## Cambios SIN commitear (working tree)
`.env.example`, `.gitignore`, `middleware.ts`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`,
`src/app/[locale]/layout.tsx`, `page.tsx`, `Contact.tsx`, `components/sections/Footer.tsx`,
`components/seo/JsonLd.tsx`, `i18n/{en,es}.json`, `api/contact/route.ts`.
Nuevos sin trackear: `docs/`, `prisma/`, `src/lib/db.ts`, `src/content/{faq,socials,projects}.ts`,
`src/app/apple-icon.tsx`, `layout.tsx`, `manifest.ts`, `not-found.tsx`,
`src/components/sections/{Faq,Analytics}.tsx`, `src/app/demos/**`.
**Nada commiteado de backend/demos aún. El usuario NO ha pedido commit todavía.**

## Última acción de esta sesión
Ajusté el ADN 3D del consultorio (`src/app/demos/consultorio/Scene.tsx`): STEPS 26→20,
cámara z 8.5→11 fov 40→38, Float bob reducido — para que la hélice entre completa (se cortaba).
Antes ya se quitó: caja/glow oscuro, pills "Medicina de precisión" y "4.9 reseñas".

## Gotchas importantes
- **NO mezclar `next build` con `npm run dev`**: corrompe `.next` (ENOENT `_buildManifest.tmp`).
  Tras cualquier build de prueba: `rm -rf .next .turbo` antes de que el usuario corra `npm run dev`.
- Comandos que corran prisma/build necesitan `export DATABASE_URL="file:./dev.db"`.
- ESLint del repo está roto (rushstack patch, pre-existente) — usar `tsc --noEmit` para typecheck.
  Verificar runtime con `next build` + `next start -p <port>` + `curl`.
- drei `Environment` (law-firm gold reflections) baja HDR de CDN en el navegador; sin internet
  renderiza con luces (menos espejado). El usuario sabe; opción de quitarlo si molesta.
- Pendiente menor: RESEND_API_KEY real apareció en screenshots del usuario (no en repo) —
  sugerido rotar; decisión del usuario.

## Pendientes / próximos pasos probables
- Commit de todo (backend + SEO nuevo + demos) cuando el usuario lo pida (excluir `docs/`? preguntó antes).
- Posibles: enlazar galería `/demos` desde navbar del sitio; QA elite (Lighthouse/a11y real) de los demos;
  más demos del roadmap (restaurante, gym, e-commerce con inventario/pagos, consultorio app).
- Migrar DB a Postgres para prod antes de usar leads en real.
- Confirmar con el usuario si demos van en español (actual) o EN (el roadmap decía EN-first).

## Suggested skills next session
`mss-nextjs-senior` (seguir demos), `mss-qa-elite` (auditar), `mss-product-owner` (planificar).
