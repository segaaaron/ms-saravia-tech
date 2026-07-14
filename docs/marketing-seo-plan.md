# Plan de Marketing y SEO — MS Saravia Tech Stack LLC

**Mercado:** USA (primario) · LATAM (secundario)
**Servicios:** SaaS · Apps móviles (iOS/Android) · Agentes de IA · Consultoría / Fractional CTO
**Sitio:** https://www.ms-tech-stack.cloud (bilingüe en/es)
**Meta:** generar leads B2B de founders/empresas que buscan construir producto.

---

## 0. Estado técnico SEO (ya implementado en el repo)

| Item | Estado |
|------|--------|
| `robots.txt` real | ✅ |
| `sitemap.xml` con hreflang | ✅ |
| Canonical por locale | ✅ |
| hreflang en/es/x-default | ✅ |
| OG image (preview social) | ✅ arreglada (era 502) |
| JSON-LD: Organization, WebSite, ProfessionalService, FAQPage | ✅ |
| Keywords/title/description por locale | ✅ |
| Security headers (HSTS, etc.) | ✅ |
| Redirect apex→www (canónico) | ✅ (falta dominio en Dokploy) |

**Pendiente técnico (fuera de repo):**
- Dokploy: agregar dominio apex + cert Let's Encrypt.
- Google Search Console + Bing Webmaster: verificar propiedad, subir sitemap.
- Google Business Profile (aunque sea remoto, ayuda a "software agency near me").
- Refrescar cache OG en Facebook Debugger tras deploy.

---

## 1. Keyword research (intención de compra)

### Inglés (USA) — prioridad alta, CPC alto, ticket alto
| Keyword | Intención | Dificultad |
|---------|-----------|------------|
| saas development company | comercial | media-alta |
| app development agency | comercial | alta |
| hire app developers | transaccional | media |
| build a saas platform | comercial | media |
| mvp development company | comercial | media |
| ai agent development | comercial | **baja** (oportunidad) |
| ai automation agency | comercial | baja-media |
| fractional cto services | comercial | baja |
| custom software development company | comercial | alta |
| how much does it cost to build an app | informacional | media |

### Español (LATAM) — menos competencia
| Keyword | Intención | Dificultad |
|---------|-----------|------------|
| desarrollo de software a medida | comercial | media |
| crear una app | comercial | media |
| cuánto cuesta hacer una app | informacional | baja |
| agencia de desarrollo de apps | comercial | media |
| desarrollo de saas | comercial | **baja** |
| agentes de ia para empresas | comercial | **baja** |
| automatizar procesos con ia | informacional | baja |

**Estrategia de dificultad:** atacar primero las de **baja competencia** (AI agents, fractional CTO, SaaS en español). Ganar rápido, construir autoridad, luego ir por las cabezas duras.

---

## 2. Arquitectura de contenido (SEO on-page)

Landing actual = 1 página. Para rankear por 4 servicios se necesitan **páginas dedicadas** (silo por servicio):

```
/                         (home — marca + resumen)
/services/saas            "SaaS Development Company"
/services/mobile-apps     "Mobile App Development Agency"
/services/ai-agents       "AI Agent Development"   ← gancho 2026
/services/consulting      "Fractional CTO & Tech Consulting"
/work/[case]              casos de estudio (Yasmin, ReadyCV, NOVA)
/blog/[slug]              motor de contenido
/pricing                  "How much does it cost..." (captura informacional)
```

Cada página de servicio: H1 con keyword exacta, 800-1500 palabras, FAQ propia (FAQ schema), CTA, 2-3 casos relacionados, enlazado interno.

**Fase 1 (ahora):** home optimizada (hecho) + 4 páginas de servicio.
**Fase 2:** casos de estudio como contenido.
**Fase 3:** blog.

---

## 3. Motor de contenido (blog) — calendario editorial

Formato: MDX en Next (`/blog`). 2 posts/mes al inicio. Mezcla intención informacional (top funnel) + comparativas (mid funnel).

**Primeros 12 títulos (EN + traducir a ES):**
1. How Much Does It Cost to Build a SaaS in 2026? (real breakdown)
2. MVP vs Full Product: What to Build First (and Why)
3. What Are AI Agents? A Founder's Guide to Automating Your Business
4. React Native vs Native: Choosing Your Mobile Stack in 2026
5. How to Hire a Software Development Agency (10 questions to ask)
6. Fractional CTO: When You Need One and When You Don't
7. From Idea to App Store: The Real Timeline
8. 7 Signs Your SaaS Needs an Architecture Review
9. Building AI Agents with Claude vs GPT: A Practical Comparison
10. The True Cost of Cheap Development (technical debt case study)
11. Stripe Integration for SaaS: Subscriptions Done Right
12. Case Study: How We Shipped ReadyCV (AI resume builder)

Cada post: 1200+ palabras, 1 keyword objetivo, imagen OG propia, CTA a contacto, enlace interno a página de servicio relevante.

---

## 4. SEO off-page (autoridad / backlinks)

- **Directorios de agencias** (alto ROI, backlink + leads):
  - Clutch.co, GoodFirms, DesignRush, The Manifest, Sortlist.
  - Perfiles con reviews de Yasmin / ReadyCV.
- **GitHub**: repos públicos + perfil de la agencia (link a sitio).
- **Product Hunt**: lanzar NOVA Nutrition cuando salga → tráfico + backlinks.
- **Guest posts** en blogs dev/startup (dev.to, Hashnode, Medium con canonical al blog propio).
- **LinkedIn**: publicar casos y snippets técnicos 2-3x/semana (mayor canal B2B).
- **Testimonios/reviews** de clientes actuales → schema Review + prueba social.

---

## 5. Paid / demand-gen (opcional, acelera)

| Canal | Uso | Presupuesto sugerido inicio |
|-------|-----|------------------------------|
| Google Ads (Search) | keywords transaccionales EN ("hire app developer") | $500-1500/mes, USA |
| LinkedIn Ads | targeting founders/CTOs USA | $500/mes (caro pero preciso) |
| Meta/Facebook | retargeting + LATAM founders | $300/mes |
| Retargeting (pixel) | visitantes que no convirtieron | 20% del budget |

Instalar: Google Analytics 4 + Meta Pixel + LinkedIn Insight Tag. Medir conversión = envío de formulario de contacto.

---

## 6. Funnel de conversión

```
Descubrimiento (SEO/ads/social)
   → Landing / página de servicio
      → Caso de estudio (prueba)
         → CTA "Start your project" / cotización
            → Formulario contacto (ya existe /api/contact)
               → Email + calendario (agregar Cal.com/Calendly)
                  → Llamada de discovery → propuesta → cierre
```

**Mejoras de conversión a implementar:**
- Botón "Book a call" con Cal.com embed (además del form).
- Prueba social arriba: logos/nº proyectos/uptime (ya hay stats en hero).
- Lead magnet: "Free project estimate in 24h" o guía PDF "SaaS cost calculator".

---

## 7. KPIs y medición

| Métrica | Herramienta | Meta 6 meses |
|---------|-------------|--------------|
| Impresiones orgánicas | Search Console | +300% |
| Keywords en top 10 | Search Console / Ahrefs | 15+ |
| Tráfico orgánico/mes | GA4 | 1.000+ |
| Leads (form + call) / mes | GA4 + CRM | 10-20 |
| Tasa conversión landing | GA4 | 2-4% |
| Backlinks (dominios ref.) | Ahrefs | 30+ |

Revisión mensual: qué keywords suben, qué páginas convierten, ajustar contenido.

---

## 8. Roadmap por fases

**Mes 1 — Fundaciones (mayor parte YA hecha en repo)**
- [x] SEO técnico: sitemap, robots, canonical, hreflang, JSON-LD, OG, headers.
- [ ] Deploy + dominio apex en Dokploy.
- [ ] Search Console + Bing + GA4 + sitemap enviado.
- [ ] Alta en Clutch/GoodFirms/DesignRush.
- [ ] Cal.com integrado en contacto.

**Mes 2-3 — Contenido core**
- [ ] 4 páginas de servicio (SaaS, Mobile, AI, Consulting).
- [ ] 3 casos de estudio (Yasmin, ReadyCV, NOVA al lanzar).
- [ ] Blog con primeros 4 posts.
- [ ] LinkedIn activo 2-3x/semana.

**Mes 4-6 — Escala**
- [ ] 8+ posts totales, EN+ES.
- [ ] Backlinks de directorios + guest posts.
- [ ] Google Ads en keywords transaccionales.
- [ ] Optimizar según datos de Search Console.

---

## 9. Diferenciador de posicionamiento (mensaje)

En un mar de agencias genéricas, el ángulo ganador 2026:

> **"AI-native software agency"** — no solo construimos apps, integramos agentes de IA como capacidad central. De idea a producción, con un equipo que ya opera con IA.

Esto ataca la keyword caliente y poco competida (AI agents) y diferencia de agencias tradicionales. Es coherente con el copy actual del sitio ("Intelligence Built In").
