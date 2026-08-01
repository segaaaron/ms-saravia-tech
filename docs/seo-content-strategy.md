# Estrategia SEO On-Page + Contenidos — MS Saravia Tech Stack

> Adaptada a nuestros **4 pilares reales**: SaaS/Software a medida · Apps Móviles · Agentes de IA · Consultoría Tecnológica.
> E-commerce = **custom** (Next.js propio), NO Shopify/WooCommerce.
> Perfil: LLC US · B2B · US + LATAM · bilingüe en/es.

---

## 1. Arquitectura de Keywords y Search Intent

Intención: **BOFU** (transaccional, listo para comprar) · **MOFU** (comparación) · **TOFU** (informativo).
Tipo: **B2B** · **Internacional (EN)** · **LATAM (ES)** · Local aplica débil (no somos negocio local).

| Servicio | Keyword | Intención | Tipo |
|---|---|---|---|
| SaaS / Software a medida | desarrollo de software a medida | BOFU | LATAM / B2B |
| SaaS / Software a medida | custom SaaS development company | BOFU | Internacional / B2B |
| SaaS / Software a medida | crear plataforma SaaS desde cero | BOFU | LATAM |
| SaaS / Software a medida | cuánto cuesta desarrollar un SaaS | MOFU | LATAM / Int. |
| SaaS / Software a medida | MVP vs producto completo | MOFU | B2B |
| SaaS / Software a medida | qué es una arquitectura multi-tenant | TOFU | B2B |
| Apps Móviles | desarrollo de apps móviles iOS y Android | BOFU | LATAM / B2B |
| Apps Móviles | react native development agency | BOFU | Internacional |
| Apps Móviles | cuánto cuesta desarrollar una app | MOFU | LATAM / Int. |
| Apps Móviles | react native vs nativo | MOFU | B2B |
| Apps Móviles | cómo publicar una app en App Store | TOFU | LATAM |
| E-commerce (custom) | tienda online a medida | BOFU | LATAM |
| E-commerce (custom) | custom e-commerce development | BOFU | Internacional |
| E-commerce (custom) | e-commerce headless Next.js | MOFU | B2B |
| E-commerce (custom) | Shopify vs tienda a medida | MOFU | LATAM / Int. |
| Agentes de IA | desarrollo de agentes de IA | BOFU | LATAM / B2B |
| Agentes de IA | AI agent development company | BOFU | Internacional |
| Agentes de IA | automatización con IA para empresas | BOFU | B2B |
| Agentes de IA | RAG vs fine-tuning | MOFU | B2B |
| Agentes de IA | qué es un agente de IA | TOFU | LATAM |
| Consultoría Tecnológica | fractional CTO | BOFU | Internacional / B2B |
| Consultoría Tecnológica | consultoría tecnológica para startups | BOFU | LATAM |
| Consultoría Tecnológica | auditoría técnica de software | BOFU | B2B |
| Consultoría Tecnológica | cuándo contratar un CTO fraccional | MOFU | B2B |
| Consultoría Tecnológica | cómo modernizar un stack legacy | MOFU | B2B |

---

## 2. Estructura On-Page (optimización de páginas existentes)

> Las páginas `/services/*` ya existen con H1/H2/FAQ + FAQPage schema. Esto es **cómo afinarlas** para keyword + CTR.

### A. Apps Móviles (`/services/mobile-apps`)

**Meta Title** (58 car.):
`Desarrollo de Apps Móviles iOS y Android | MS Saravia`

**Meta Description** (154 car., gatillo = resultado + prueba):
`Apps nativas y multiplataforma que se ven premium y rinden. iOS, Android, React Native y Flutter — del concepto a la tienda. Cotiza gratis en minutos.`

**H1:** `Apps móviles que la gente usa todos los días`

**H2 / H3 (resuelven intenciones secundarias):**
- H2 Qué construimos → H3 Nativo iOS · H3 Nativo Android · H3 Multiplataforma
- H2 Tecnología que usamos (stack senior)
- H2 Cómo trabajamos (proceso ágil, entregas semanales)
- H2 ¿Cuánto cuesta una app? → CTA al estimador
- H2 Proyectos (case studies)
- H2 Preguntas frecuentes (FAQ)

### B. E-commerce a medida (nuevo bloque / `/solutions/ecommerce-store`)

**Meta Title** (57 car.):
`Tiendas Online a Medida — E-commerce Rápido | MS Saravia`

**Meta Description** (156 car.):
`Tiendas headless a medida (Next.js) hechas para convertir: veloces, seguras y sin comisiones por venta. Más control que Shopify. Pide tu cotización gratis.`

**H1:** `E-commerce a medida, hecho para vender`

**H2 / H3:**
- H2 Por qué a medida y no una plantilla → H3 Velocidad · H3 Sin comisiones · H3 Control total
- H2 Qué incluye (catálogo, checkout, wishlist, pagos)
- H2 Shopify vs tienda a medida (comparativa)
- H2 Integraciones (pagos, envíos, analytics)
- H2 Proyectos (VESPER)
- H2 Preguntas frecuentes (FAQ)

### FAQ + Schema (patrón para Featured Snippets)

Respuestas de 40-55 palabras, la respuesta directa en la 1ª frase (formato snippet).

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta desarrollar una app móvil?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un MVP híbrido bien acotado suele caer en decenas de miles de dólares; un producto a medida con backend e integraciones llega a seis cifras. El precio depende de plataforma, alcance, diseño y funciones. Usa nuestro estimador para un rango exacto en segundos."
      }
    },
    {
      "@type": "Question",
      "name": "¿React Native o nativo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "React Native para la mayoría de productos: un solo código, sensación casi nativa y updates OTA. Bajamos a módulos nativos Swift/Kotlin solo donde el profiling muestra que el puente cuesta rendimiento, sin mantener dos apps."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto tarda construir una app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un MVP suele tomar entre 8 y 12 semanas de discovery a tienda. El alcance manda: definimos fases con entregas semanales para que veas avance real y ajustes antes de invertir de más."
      }
    },
    {
      "@type": "Question",
      "name": "¿El código es mío?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. El repositorio, la propiedad intelectual y las cuentas de tienda quedan a tu nombre desde el día uno. No hay lock-in: puedes seguir con nosotros, con tu equipo o con otro proveedor."
      }
    }
  ]
}
```

> Ya renderizamos FAQPage automáticamente en `/services/*`; solo hay que afinar las 4 preguntas al formato snippet de arriba.

---

## 3. Copywriting Persuasivo (Home)

### Hero — fórmula PAS (Problema · Agitación · Solución)

- **Problema:** Tienes una idea de software clara — pero cada agencia te da un precio distinto, plazos vagos y un equipo de ventas en vez de ingenieros.
- **Agitación:** Mientras decides, tu competencia lanza. Y una mala elección técnica hoy se paga en meses de retrabajo, deuda técnica y un producto que no escala.
- **Solución:** Trabajas directo con ingenieros senior que ya lanzaron productos en producción. SaaS, apps móviles y agentes de IA — construidos para escalar, con código que es tuyo y precio claro desde el inicio.

**Headline sugerido:** `Software que escala, hecho por ingenieros senior`
**Sub:** `SaaS, apps móviles y agentes de IA — del concepto a producción, con un stack moderno y a prueba de futuro. Tu código, tu propiedad.`

### 3 variantes de CTA (leads cualificados)

1. **Cotiza tu proyecto gratis** → estimador (BOFU, baja fricción)
2. **Agenda una llamada estratégica** → contacto (MOFU, lead cualificado)
3. **Pide una auditoría técnica gratuita** → contacto (gancho consulting, alto valor percibido)

---

## 4. Inbound / Blog — 5 ideas lead-magnet (frescas, no duplican las 18 actuales)

1. **Cuánto cuesta desarrollar un SaaS en 2026 (desglose real por módulo)** — BOFU, complementa el de apps.
2. **Agencia vs freelancer vs equipo interno: qué te conviene según tu etapa** — BOFU decisión de compra.
3. **Checklist técnico antes de contratar una agencia de desarrollo** — lead magnet descargable, E-E-A-T.
4. **Cómo un agente de IA recorta costos operativos (con ejemplos por área)** — BOFU de IA.
5. **5 señales de que tu software legacy te está costando dinero** — BOFU de consultoría / fractional CTO.

> Cada uno cierra en CTA al estimador o a "auditoría gratuita". Cluster: enlazar cada post a su service pillar (ya lo hace el motor de blog vía `cluster`).

---

## 5. SEO Técnico + E-E-A-T (Experiencia · Autoridad · Confianza)

### Ya lo tenemos ✓
- Canonical self por locale · hreflang recíproco (en/es/x-default) · sitemap sin noindex · robots.txt.
- JSON-LD: Organization, WebSite, ProfessionalService, Service, FAQPage, BlogPosting, BreadcrumbList, CreativeWork.
- `h1` único · OG completo · Core Web Vitals (static-first, next/image, code-split).
- Case studies (`/work/*`) como prueba social · blog cluster enlazado a pilares.

### Gaps a cerrar (prioridad para B2B)
1. **Testimonios reales** — los case studies tienen el campo `testimonial` **vacío**. Conseguir 1-2 quotes reales por cliente (Yasmin, ReadyCV) → activa el `Review` schema que ya está cableado. **Alto impacto en confianza.**
2. **Autoría / byline en el blog** — no hay `Person`/author. Añadir autor con bio + `sameAs` (LinkedIn) y `author` en el JSON-LD de BlogPosting → señal E-E-A-T fuerte para "written by a real engineer".
3. **Prueba social en home** — franja de logos/clientes o métricas reales ("productos en producción", "años de ingeniería") ya insinuada en About; hacerla más visible arriba.
4. **Página About/Founder robusta** — E-E-A-T de "founder-led": experiencia, productos lanzados, stack. Enlazar desde Organization schema (`founder`).
5. **Reseñas externas** — si hay Google/Clutch/LinkedIn recommendations, sumar `aggregateRating` (solo con datos reales; nunca inventados).

### Schemas sugeridos a activar
- `Review` / `aggregateRating` (con testimonios reales) en `/work/*` y home.
- `author` (`Person` + `sameAs`) en `BlogPosting`.
- `founder` en `Organization`.
- `BreadcrumbList` — ya presente en services/work/blog ✓.

---

### Nota de honestidad (marca)
Todo lo persuasivo debe ser **verificable**: no inventar métricas ("+40% ventas") ni testimonios. La confianza B2B se rompe con un dato falso. Preferimos afirmaciones cualitativas ciertas (rápido, propio, sin lock-in, ingenieros senior) + prueba social real cuando la consigas.
