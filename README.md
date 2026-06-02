# MS Saravia Tech Stack LLC — Landing Page

Landing page premium para **MS SARAVIA TECH STACK LLC**, empresa tecnológica con sede en USA. Bilingüe EN/ES, diseño dark futurista, animaciones avanzadas.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript, Server Components) |
| Estilos | Tailwind CSS v4 (CSS-first, `@theme`) |
| Animaciones UI | Framer Motion v12 |
| Animaciones scroll | GSAP v3 + ScrollTrigger |
| 3D | React Three Fiber v9 + drei |
| Smooth scroll | Lenis (`@studio-freight/lenis`) |
| i18n | next-intl v3 |
| Emails | Resend v4 |
| Fuentes | Space Grotesk + Inter (next/font) |
| Iconos | lucide-react |
| Toasts | Sonner |

---

## Estructura

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx        # fonts, providers, Lenis, Navbar, Footer
│   │   ├── page.tsx          # ensambla todas las secciones
│   │   └── globals.css       # tokens, keyframes, utilidades
│   └── api/contact/route.ts  # POST → Resend → techstackmssaravia@gmail.com
├── components/
│   ├── nav/
│   │   ├── Navbar.tsx        # sticky, blur on scroll, locale toggle
│   │   └── LocaleToggle.tsx  # toggle EN ↔ ES
│   ├── hero/
│   │   ├── Hero.tsx          # layout 2 columnas, copy + stats
│   │   ├── ReactorVisual.tsx # reactor animado (anillos CSS + Framer Motion)
│   │   ├── Orb3D.tsx         # torus knot R3F (no usado en hero actual)
│   │   └── Spotlight.tsx     # spotlight mouse tracking
│   ├── sections/
│   │   ├── Services.tsx      # 4 cards glassmorphism con HologramCard
│   │   ├── StackMarquee.tsx  # marquee tecnologías
│   │   ├── AIShowcase.tsx    # banda IA con feature pills
│   │   ├── HoloDashboard.tsx # métricas animadas + cubo CSS 3D
│   │   ├── Work.tsx          # 3 proyectos (Yasmin, ReadyCV, NOVA)
│   │   ├── Process.tsx       # timeline GSAP scroll-pinned
│   │   ├── About.tsx         # stats animados + grid tech logos
│   │   ├── Contact.tsx       # formulario → API route
│   │   └── Footer.tsx        # wordmark, links, copyright
│   ├── ui/
│   │   ├── HologramCard.tsx  # card con scanlines, tilt 3D, edge glow
│   │   ├── MagneticButton.tsx# botón magnético cursor (primary/ghost)
│   │   ├── GradientText.tsx  # texto con gradiente cyan→violet
│   │   ├── AnimatedCounter.tsx # contador animado con useInView
│   │   ├── GlassCard.tsx     # card glass básica
│   │   ├── MarqueeLogos.tsx  # marquee genérico
│   │   └── SectionLabel.tsx  # etiqueta de sección // LABEL
│   └── fx/
│       ├── AuroraBackground.tsx  # fondo aurora CSS (3 blobs animados)
│       └── InteractiveParticles.tsx # canvas 140 partículas, repulsión mouse
├── lib/
│   ├── motion.ts   # Framer Motion variants reutilizables
│   ├── resend.ts   # helper Resend (init lazy dentro del handler)
│   └── utils.ts    # cn() helper
├── i18n/
│   ├── en.json     # todas las cadenas en inglés
│   └── es.json     # todas las cadenas en español
├── content/
│   └── projects.ts # data de proyectos (Yasmin, ReadyCV, NOVA)
├── i18n.ts         # next-intl getRequestConfig
└── middleware.ts   # routing next-intl, locales: ['en','es']
```

---

## Secciones de la página

| Orden | Sección | Descripción |
|---|---|---|
| 1 | Hero | Headline, lead, CTA dual, stats (+40 / 99.9% / 8+), ReactorVisual |
| 2 | Services | 4 cards: SaaS, Mobile, AI Agents, Consulting |
| 3 | StackMarquee | Marquee tecnologías con hover cyan |
| 4 | AIShowcase | Banda "Intelligence Built In", feature pills |
| 5 | HoloDashboard | Panel métricas en vivo + cubo CSS 3D |
| 6 | Work | Proyectos: Yasmin Medrano, ReadyCV, NOVA Nutrition |
| 7 | Process | Timeline 5 pasos con GSAP horizontal scroll |
| 8 | About | Stats animados + grid stack tecnológico |
| 9 | Contact | Formulario (nombre/email/empresa/mensaje) vía Resend |

---

## Variables de entorno

Copiar `.env.example` → `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key de [resend.com](https://resend.com) |
| `CONTACT_TO_EMAIL` | Destino del formulario (`techstackmssaravia@gmail.com`) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio para OG tags |

---

## Desarrollo local

```bash
# Instalar dependencias
pnpm install

# Dev server con Turbopack
pnpm dev
# → http://localhost:3000  (redirige a /en o /es según Accept-Language)

# Build de producción
pnpm build

# Iniciar producción local
pnpm start
```

---

## i18n (Bilingüe)

- Rutas: `/en/*` y `/es/*`
- Middleware detecta idioma del navegador y redirige automáticamente
- Toggle manual en la navbar (EN / ES)
- Todas las cadenas en `src/i18n/en.json` y `src/i18n/es.json`
- Para agregar texto nuevo: editar ambos JSON con la misma clave

---

## Formulario de contacto

`POST /api/contact` recibe `{ name, email, company, message }` y envía email vía Resend a `CONTACT_TO_EMAIL`.

Validación con Zod. Resend se inicializa lazy (dentro del handler) para evitar errores en build sin env vars.

---

## ReactorVisual

El objeto animado del hero es un reactor CSS puro con Framer Motion:

| Elemento | Color | Animación |
|---|---|---|
| Anillo o1 (360px) | `#2FF5E0` cyan (top+bottom) | 6s clockwise |
| Anillo o2 (72%) | `#4D7CFF` blue (left+right) | 4s counter-clockwise |
| Anillo o3 (44%) | `#9B6CFF` violet (top+left) | 8s clockwise |
| Core (20%) | Gradiente cyan→blue→violet | glow pulsante |
| Outer dashed | `rgba(120,200,255,0.2)` | 30s clockwise |
| Dot A | `#2FF5E0` cyan | orbita 12s |
| Dot B | `#9B6CFF` violet | orbita 18s reverse |

Gradiente de marca: `linear-gradient(120deg, #2FF5E0 0%, #4D7CFF 50%, #9B6CFF 100%)`

---

## Deploy en Dokploy (VPS)

### Dockerfile

Build multi-stage incluido. Usa `output: 'standalone'` en Next.js.

```bash
# Build local para verificar
docker build -t ms-web .
docker run -p 3000:3000 --env-file .env.local ms-web
```

### Pasos en Dokploy

1. Crear app tipo **Docker / Dockerfile**
2. Conectar repo
3. Agregar variables de entorno en la UI de Dokploy:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL=techstackmssaravia@gmail.com`
   - `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com`
4. Asignar dominio custom → Traefik gestiona Let's Encrypt automáticamente
5. Deploy → healthcheck en `GET /` espera 200

---

## Proyectos mostrados en Work

| Proyecto | Categoría | URL | Estado |
|---|---|---|---|
| Yasmin Medrano | Aesthetic Medical Clinic | yasminmedrano.com | Live |
| ReadyCV | AI Resume Builder | readycvv.com | Live |
| NOVA Nutrition | iOS & Android App | — | Coming Soon |

Para agregar proyectos: editar `src/content/projects.ts` y `src/i18n/en.json` + `src/i18n/es.json` bajo la clave `work.projects`.

---

## Contacto

**techstackmssaravia@gmail.com**
