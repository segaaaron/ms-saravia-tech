// Motor de blog: contenido bilingüe en bloques semánticos (sin dependencia de markdown).
// Cada post se renderiza como HTML semántico real (h2/p/ul) → indexable y accesible.
// El cuerpo largo vive AQUÍ (no en i18n JSON, que es para UI corta). Los slugs de `cluster`
// enlazan cada post con su service pillar (/services/<cluster>) para el internal linking.

export type Locale = 'en' | 'es'

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }

export type PostContent = {
  title: string
  excerpt: string
  body: Block[]
}

export type Post = {
  slug: string
  /** ISO date (publicación). Orden del hub = date desc. */
  date: string
  /** ISO date de última edición. Opcional; si falta, dateModified = date (sin señal de frescura). */
  updated?: string
  /** slug del service pillar relacionado (para CTA + internal link). */
  cluster: string
  en: PostContent
  es: PostContent
}

const posts: Post[] = [
  {
    slug: 'app-development-cost-guide',
    date: '2026-07-05',
    cluster: 'mobile-apps',
    en: {
      title: 'How Much Does It Cost to Build an App in 2026?',
      excerpt: 'A plain-English breakdown of what drives app cost — platform, scope, design, features and region — so the number stops being a mystery.',
      body: [
        { type: 'p', text: 'The honest answer to "how much does an app cost?" is "it depends" — but that is not helpful. What actually matters is understanding the handful of levers that move the number, so you can make trade-offs on purpose instead of being surprised by a quote.' },
        { type: 'h2', text: 'The levers that decide the price' },
        { type: 'ul', items: [
          'Platform: one hybrid codebase (React Native/Flutter) is cheaper than two separate native apps.',
          'Scope: an MVP with a few core screens costs a fraction of a multi-module platform.',
          'Design: a template-based UI is faster; a bespoke, animated brand experience costs more.',
          'Features: auth, payments, chat, maps, AI and offline each add real engineering time.',
          'Region: developer rates vary widely — Latin America is typically 40-60% below US/Canada.',
        ] },
        { type: 'h2', text: 'Ballpark ranges' },
        { type: 'p', text: 'A well-scoped hybrid MVP often lands in the low tens of thousands of dollars; a full custom product with a backend and several integrations runs into six figures. Regulated apps (health, finance) carry extra compliance overhead. The point is not a single magic number — it is knowing which lever to pull for your budget.' },
        { type: 'p', text: 'We built a free estimator on this site that turns those levers into a real range in seconds. Use it to sanity-check any quote you receive — then talk to us for an exact scope.' },
      ],
    },
    es: {
      title: '¿Cuánto Cuesta Crear una App en 2026?',
      excerpt: 'Un desglose claro de qué determina el costo de una app — plataforma, alcance, diseño, funciones y región — para que el número deje de ser un misterio.',
      body: [
        { type: 'p', text: 'La respuesta honesta a "¿cuánto cuesta una app?" es "depende" — pero eso no ayuda. Lo que importa es entender las pocas palancas que mueven el número, para decidir con intención en vez de sorprenderte con una cotización.' },
        { type: 'h2', text: 'Las palancas que deciden el precio' },
        { type: 'ul', items: [
          'Plataforma: un solo código híbrido (React Native/Flutter) es más barato que dos apps nativas separadas.',
          'Alcance: un MVP con pocas pantallas clave cuesta una fracción de una plataforma multi-módulo.',
          'Diseño: una UI basada en plantilla es más rápida; una experiencia de marca a medida y con animaciones cuesta más.',
          'Funciones: login, pagos, chat, mapas, IA y offline suman tiempo de ingeniería real.',
          'Región: las tarifas varían mucho — Latinoamérica suele estar 40-60% por debajo de USA/Canadá.',
        ] },
        { type: 'h2', text: 'Rangos aproximados' },
        { type: 'p', text: 'Un MVP híbrido bien acotado suele caer en decenas de miles de dólares; un producto a medida con backend y varias integraciones llega a seis cifras. Las apps reguladas (salud, finanzas) cargan sobrecosto de cumplimiento. El punto no es un número mágico — es saber qué palanca ajustar según tu presupuesto.' },
        { type: 'p', text: 'Creamos un estimador gratis en este sitio que convierte esas palancas en un rango real en segundos. Úsalo para contrastar cualquier cotización — y luego habla con nosotros para un alcance exacto.' },
      ],
    },
  },
  {
    slug: 'react-native-vs-native',
    date: '2026-06-28',
    cluster: 'mobile-apps',
    en: {
      title: 'React Native vs Native: Which Should You Actually Choose?',
      excerpt: 'Cross-platform or native? The real decision comes down to performance needs, team, timeline and budget — not hype.',
      body: [
        { type: 'p', text: 'The "React Native vs native" debate is usually framed as a religious war. In practice it is a straightforward engineering trade-off, and the right answer depends on your specific product — not on what is trending.' },
        { type: 'h2', text: 'When cross-platform wins' },
        { type: 'p', text: 'React Native (or Flutter) shares one codebase across iOS and Android. For most business apps — marketplaces, dashboards, social, booking, content — that means roughly 30-40% less cost and one team instead of two. Time-to-market is faster and maintenance is simpler.' },
        { type: 'h2', text: 'When native is worth it' },
        { type: 'p', text: 'Go native when you need bleading-edge performance or deep platform APIs: heavy real-time graphics, AR, complex camera or Bluetooth work, or when you already have a strong in-house iOS/Android team. Native gives maximum control at the cost of two codebases.' },
        { type: 'h2', text: 'Our default' },
        { type: 'p', text: 'We start most products in React Native and only drop to native modules where a specific feature demands it. That keeps the budget lean without giving up performance where it matters. If you are unsure, our app cost estimator lets you compare both paths side by side.' },
      ],
    },
    es: {
      title: 'React Native vs Nativo: ¿Cuál Elegir de Verdad?',
      excerpt: '¿Multiplataforma o nativo? La decisión real depende de rendimiento, equipo, tiempo y presupuesto — no del hype.',
      body: [
        { type: 'p', text: 'El debate "React Native vs nativo" suele plantearse como guerra religiosa. En la práctica es un trade-off de ingeniería directo, y la respuesta correcta depende de tu producto — no de lo que esté de moda.' },
        { type: 'h2', text: 'Cuándo gana multiplataforma' },
        { type: 'p', text: 'React Native (o Flutter) comparte un solo código entre iOS y Android. Para la mayoría de apps de negocio — marketplaces, dashboards, social, reservas, contenido — eso significa ~30-40% menos costo y un equipo en vez de dos. Sales al mercado más rápido y mantienes más fácil.' },
        { type: 'h2', text: 'Cuándo vale la pena nativo' },
        { type: 'p', text: 'Ve nativo cuando necesitas rendimiento de punta o APIs profundas de la plataforma: gráficos en tiempo real pesados, AR, trabajo complejo de cámara o Bluetooth, o si ya tienes un equipo iOS/Android fuerte. Nativo da control máximo al costo de dos códigos.' },
        { type: 'h2', text: 'Nuestro default' },
        { type: 'p', text: 'Arrancamos la mayoría de productos en React Native y solo bajamos a módulos nativos donde una función específica lo exige. Eso mantiene el presupuesto ágil sin sacrificar rendimiento donde importa. Si dudas, nuestro estimador te deja comparar ambos caminos.' },
      ],
    },
  },
  {
    slug: 'what-is-an-ai-agent',
    date: '2026-06-24',
    cluster: 'ai-agents',
    en: {
      title: 'What Is an AI Agent — and Does Your Business Need One?',
      excerpt: 'Beyond chatbots: what an AI agent actually is, where it creates value, and how to tell if it fits your operation.',
      body: [
        { type: 'p', text: 'The term "AI agent" gets used loosely. A useful definition: an AI agent is a system that takes a goal, decides on the steps to reach it, calls tools or APIs, and acts — not just answers. That autonomy is what separates an agent from a plain chatbot.' },
        { type: 'h2', text: 'Where agents create real value' },
        { type: 'ul', items: [
          'Support: triaging tickets, drafting replies, pulling answers from your own knowledge base.',
          'Operations: automating multi-step back-office workflows that used to need a human.',
          'Sales: qualifying leads, summarizing calls, keeping the CRM up to date.',
          'Internal tools: letting staff ask questions of your data in plain language.',
        ] },
        { type: 'h2', text: 'When you probably do not need one' },
        { type: 'p', text: 'If the task is simple, deterministic and rarely changes, a normal script or form is cheaper and more reliable than an agent. Agents shine when the work is fuzzy, language-heavy, or spans several systems.' },
        { type: 'p', text: 'The key to a good agent is grounding it in your real data and constraining what it can do. We build agents on OpenAI and Claude wired to your systems — with guardrails — so they are helpful without going off the rails.' },
      ],
    },
    es: {
      title: '¿Qué Es un Agente de IA — y Tu Negocio Necesita Uno?',
      excerpt: 'Más allá del chatbot: qué es realmente un agente de IA, dónde crea valor y cómo saber si encaja en tu operación.',
      body: [
        { type: 'p', text: 'El término "agente de IA" se usa a la ligera. Una definición útil: un agente de IA es un sistema que toma un objetivo, decide los pasos para lograrlo, llama herramientas o APIs, y actúa — no solo responde. Esa autonomía separa al agente de un chatbot común.' },
        { type: 'h2', text: 'Dónde crean valor real' },
        { type: 'ul', items: [
          'Soporte: clasificar tickets, redactar respuestas, sacar respuestas de tu propia base de conocimiento.',
          'Operaciones: automatizar flujos de back-office de varios pasos que antes requerían una persona.',
          'Ventas: calificar leads, resumir llamadas, mantener el CRM al día.',
          'Herramientas internas: que el equipo pregunte a tus datos en lenguaje natural.',
        ] },
        { type: 'h2', text: 'Cuándo probablemente no lo necesitas' },
        { type: 'p', text: 'Si la tarea es simple, determinista y casi no cambia, un script o formulario normal es más barato y confiable que un agente. Los agentes brillan cuando el trabajo es difuso, con mucho lenguaje, o cruza varios sistemas.' },
        { type: 'p', text: 'La clave de un buen agente es anclarlo en tus datos reales y limitar lo que puede hacer. Construimos agentes sobre OpenAI y Claude conectados a tus sistemas — con guardrails — para que sean útiles sin descarrilarse.' },
      ],
    },
  },
  {
    slug: 'validate-app-idea',
    date: '2026-06-20',
    cluster: 'saas',
    en: {
      title: 'How to Validate Your App Idea Before You Build It',
      excerpt: 'The cheapest code is the code you never write. A practical checklist to test demand before investing in development.',
      body: [
        { type: 'p', text: 'Most failed apps did not fail because of bad code — they failed because nobody wanted them. Validation is about buying evidence before you buy engineering. A few weeks of testing can save you months of building the wrong thing.' },
        { type: 'h2', text: 'Cheap ways to test demand' },
        { type: 'ul', items: [
          'A landing page that describes the product and measures sign-ups or waitlist joins.',
          'Ten real conversations with your target user about the problem — not your solution.',
          'A clickable prototype (Figma) you can put in front of people before a line of code.',
          'A tiny paid ad campaign to see if strangers click and convert.',
        ] },
        { type: 'h2', text: 'What "validated" actually looks like' },
        { type: 'p', text: 'You are validated when people take a costly action — join a waitlist, pre-pay, give real time — not when they say "nice idea." Enthusiasm is free; commitment is signal.' },
        { type: 'p', text: 'Once you have signal, an MVP is the fastest way to turn interest into a working product. We help founders scope that first version so it proves the core value without over-building.' },
      ],
    },
    es: {
      title: 'Cómo Validar tu Idea de App Antes de Construirla',
      excerpt: 'El código más barato es el que nunca escribes. Una checklist práctica para probar la demanda antes de invertir en desarrollo.',
      body: [
        { type: 'p', text: 'La mayoría de apps que fallan no fallaron por mal código — fallaron porque nadie las quería. Validar es comprar evidencia antes de comprar ingeniería. Unas semanas de pruebas pueden ahorrarte meses construyendo lo equivocado.' },
        { type: 'h2', text: 'Formas baratas de probar la demanda' },
        { type: 'ul', items: [
          'Una landing que describe el producto y mide registros o lista de espera.',
          'Diez conversaciones reales con tu usuario objetivo sobre el problema — no tu solución.',
          'Un prototipo clickeable (Figma) que puedas mostrar a gente antes de una línea de código.',
          'Una pequeña campaña de anuncios para ver si desconocidos hacen click y convierten.',
        ] },
        { type: 'h2', text: 'Cómo se ve "validado" de verdad' },
        { type: 'p', text: 'Estás validado cuando la gente hace algo costoso — se une a una lista, pre-paga, da tiempo real — no cuando dicen "buena idea". El entusiasmo es gratis; el compromiso es señal.' },
        { type: 'p', text: 'Con señal en mano, un MVP es la forma más rápida de volver el interés en producto funcional. Ayudamos a fundadores a acotar esa primera versión para que pruebe el valor central sin sobre-construir.' },
      ],
    },
  },
  {
    slug: 'mvp-vs-full-product',
    date: '2026-06-16',
    cluster: 'saas',
    en: {
      title: 'MVP vs Full Product: What to Build First',
      excerpt: 'An MVP is not a cheap, broken version of your product. It is the smallest thing that proves the core value. Here is how to scope one.',
      body: [
        { type: 'p', text: 'The most expensive mistake in software is building everything at once. An MVP — minimum viable product — is a discipline: ship the one thing that proves people will use and pay, then expand based on what you learn.' },
        { type: 'h2', text: 'What belongs in an MVP' },
        { type: 'p', text: 'Only the core loop. If you are building a marketplace, that is: list something, find something, transact. Everything else — profiles, ratings, admin dashboards, notifications — waits until the loop works. Cutting scope is not cutting quality; it is focusing it.' },
        { type: 'h2', text: 'What to leave for later' },
        { type: 'ul', items: [
          'Edge-case flows that only 1% of users hit.',
          'Settings and customization nobody has asked for yet.',
          'Scale optimizations before you have users to scale for.',
          'Native apps if a web MVP can validate the idea faster.',
        ] },
        { type: 'p', text: 'A tight MVP typically costs a fraction of a full build and reaches users in weeks, not quarters. Use our estimator to see how scope changes the number — MVP versus standard versus complex — before you commit.' },
      ],
    },
    es: {
      title: 'MVP vs Producto Completo: Qué Construir Primero',
      excerpt: 'Un MVP no es una versión barata y rota de tu producto. Es lo más pequeño que prueba el valor central. Así se acota.',
      body: [
        { type: 'p', text: 'El error más caro en software es construir todo de una vez. Un MVP — producto mínimo viable — es una disciplina: lanza lo único que prueba que la gente usará y pagará, y luego expande según lo que aprendes.' },
        { type: 'h2', text: 'Qué va en un MVP' },
        { type: 'p', text: 'Solo el loop central. Si construyes un marketplace, eso es: publicar algo, encontrar algo, transaccionar. Todo lo demás — perfiles, ratings, paneles admin, notificaciones — espera hasta que el loop funcione. Recortar alcance no es recortar calidad; es enfocarla.' },
        { type: 'h2', text: 'Qué dejar para después' },
        { type: 'ul', items: [
          'Flujos de casos borde que solo toca el 1% de usuarios.',
          'Ajustes y personalización que nadie ha pedido aún.',
          'Optimizaciones de escala antes de tener usuarios para escalar.',
          'Apps nativas si una web MVP valida la idea más rápido.',
        ] },
        { type: 'p', text: 'Un MVP ajustado suele costar una fracción del build completo y llega a usuarios en semanas, no trimestres. Usa nuestro estimador para ver cómo el alcance cambia el número — MVP vs estándar vs complejo — antes de comprometerte.' },
      ],
    },
  },
  {
    slug: 'when-to-hire-fractional-cto',
    date: '2026-06-12',
    cluster: 'tech-consulting',
    en: {
      title: 'When Should a Startup Hire a Fractional CTO?',
      excerpt: 'You may need senior technical leadership long before you can afford a full-time CTO. That is exactly the gap a fractional CTO fills.',
      body: [
        { type: 'p', text: 'A fractional CTO is a senior technical leader who works with you part-time — setting direction, making architecture calls, and keeping engineering honest — without the cost of a full-time executive. For early-stage companies, it is often the highest-leverage hire.' },
        { type: 'h2', text: 'Signs you need one' },
        { type: 'ul', items: [
          'You are making big technical decisions with no senior voice in the room.',
          'You are hiring developers but nobody is defining the standard or reviewing the work.',
          'Your roadmap and your architecture keep drifting apart.',
          'Investors are asking technical diligence questions you cannot confidently answer.',
        ] },
        { type: 'h2', text: 'What it is not' },
        { type: 'p', text: 'A fractional CTO is not a hands-on-keyboard developer for hire, and not a full-time commitment. It is leadership, strategy and accountability — a few days a month — until you are ready to bring the role in-house.' },
        { type: 'p', text: 'We offer fractional CTO and architecture support for founders who need senior judgment without the senior salary. Sometimes the most valuable thing we do is tell you what not to build.' },
      ],
    },
    es: {
      title: '¿Cuándo Contratar un CTO Fraccional?',
      excerpt: 'Puedes necesitar liderazgo técnico senior mucho antes de poder pagar un CTO de tiempo completo. Ese hueco lo llena un CTO fraccional.',
      body: [
        { type: 'p', text: 'Un CTO fraccional es un líder técnico senior que trabaja contigo medio tiempo — marcando dirección, tomando decisiones de arquitectura y manteniendo honesta a la ingeniería — sin el costo de un ejecutivo full-time. Para etapas tempranas, suele ser la contratación de mayor impacto.' },
        { type: 'h2', text: 'Señales de que necesitas uno' },
        { type: 'ul', items: [
          'Tomas decisiones técnicas grandes sin una voz senior en la sala.',
          'Contratas developers pero nadie define el estándar ni revisa el trabajo.',
          'Tu roadmap y tu arquitectura se separan cada vez más.',
          'Inversionistas hacen preguntas de diligencia técnica que no puedes responder con confianza.',
        ] },
        { type: 'h2', text: 'Lo que NO es' },
        { type: 'p', text: 'Un CTO fraccional no es un developer de alquiler, ni un compromiso full-time. Es liderazgo, estrategia y responsabilidad — unos días al mes — hasta que estés listo para el rol interno.' },
        { type: 'p', text: 'Ofrecemos CTO fraccional y soporte de arquitectura para fundadores que necesitan criterio senior sin el salario senior. A veces lo más valioso que hacemos es decirte qué NO construir.' },
      ],
    },
  },
  {
    slug: 'hybrid-vs-web-vs-native',
    date: '2026-06-08',
    cluster: 'mobile-apps',
    en: {
      title: 'Hybrid vs Web App vs Native: Choosing Your Platform',
      excerpt: 'Not every product needs an app store. A quick guide to picking between a web app, a hybrid app and native — by what you actually need.',
      body: [
        { type: 'p', text: 'Before you ask "how much does an app cost?", ask "do I even need a native app?" The platform choice shapes cost, timeline and reach — and the cheapest option is often good enough.' },
        { type: 'h2', text: 'Web app / PWA' },
        { type: 'p', text: 'Runs in the browser, installable, no app stores, one codebase. Fastest and cheapest to ship, easiest to update. Ideal for tools, dashboards and content where you do not need deep device features or store presence.' },
        { type: 'h2', text: 'Hybrid (React Native / Flutter)' },
        { type: 'p', text: 'One codebase, real presence in the App Store and Google Play, access to most device features (camera, push, biometrics). The sweet spot for most consumer and business apps.' },
        { type: 'h2', text: 'Native' },
        { type: 'p', text: 'Two codebases, maximum performance and platform integration. Choose it for graphics-heavy, AR, or hardware-intensive products — accept the higher cost in exchange.' },
        { type: 'p', text: 'Our estimator lets you switch between all four (web, hybrid, iOS, Android, native) and watch the price move — a fast way to sanity-check which platform fits your budget.' },
      ],
    },
    es: {
      title: 'Híbrida vs Web App vs Nativa: Cómo Elegir Plataforma',
      excerpt: 'No todo producto necesita una tienda de apps. Guía rápida para elegir entre web app, híbrida y nativa — según lo que realmente necesitas.',
      body: [
        { type: 'p', text: 'Antes de preguntar "¿cuánto cuesta una app?", pregunta "¿realmente necesito una app nativa?". La elección de plataforma define costo, tiempo y alcance — y la opción más barata suele bastar.' },
        { type: 'h2', text: 'Web app / PWA' },
        { type: 'p', text: 'Corre en el navegador, instalable, sin tiendas, un solo código. Lo más rápido y barato de lanzar, lo más fácil de actualizar. Ideal para herramientas, dashboards y contenido donde no necesitas funciones profundas del dispositivo ni presencia en tiendas.' },
        { type: 'h2', text: 'Híbrida (React Native / Flutter)' },
        { type: 'p', text: 'Un código, presencia real en App Store y Google Play, acceso a la mayoría de funciones del dispositivo (cámara, push, biometría). El punto ideal para la mayoría de apps de consumo y negocio.' },
        { type: 'h2', text: 'Nativa' },
        { type: 'p', text: 'Dos códigos, rendimiento máximo e integración con la plataforma. Elígela para productos con gráficos pesados, AR o hardware intensivo — a cambio del costo más alto.' },
        { type: 'p', text: 'Nuestro estimador te deja cambiar entre las cinco (web, híbrida, iOS, Android, nativa) y ver moverse el precio — forma rápida de validar qué plataforma cabe en tu presupuesto.' },
      ],
    },
  },
  {
    slug: 'reduce-app-cost',
    date: '2026-06-04',
    cluster: 'saas',
    en: {
      title: 'How to Reduce App Development Cost Without Cutting Corners',
      excerpt: 'Cheaper is not the same as worse. Seven ways to lower the bill while keeping quality where it counts.',
      body: [
        { type: 'p', text: 'There is a difference between spending less and building worse. The goal is to remove waste — not quality. Here is where the savings actually live.' },
        { type: 'h2', text: 'Where to save' },
        { type: 'ul', items: [
          'Ship an MVP first — cut features that do not prove the core value.',
          'Go hybrid instead of two native codebases unless you truly need native.',
          'Reuse a proven design system instead of a fully bespoke UI on day one.',
          'Pick a nearshore team (Latin America) for strong talent at 40-60% below US rates.',
          'Use managed services (auth, payments, backend) instead of building them from scratch.',
        ] },
        { type: 'h2', text: 'Where NOT to save' },
        { type: 'p', text: 'Do not cut on security, on a senior reviewing the architecture, or on testing the core flow. Those are the places where "cheap" becomes "expensive" six months later. Save on scope and tooling, never on judgment.' },
        { type: 'p', text: 'Working with a nearshore, senior-led team is one of the biggest levers — you get US-timezone collaboration and senior quality without US-agency pricing.' },
      ],
    },
    es: {
      title: 'Cómo Reducir el Costo de tu App Sin Bajar la Calidad',
      excerpt: 'Más barato no es lo mismo que peor. Siete formas de bajar la cuenta manteniendo la calidad donde importa.',
      body: [
        { type: 'p', text: 'Hay diferencia entre gastar menos y construir peor. El objetivo es quitar desperdicio — no calidad. Aquí es donde viven de verdad los ahorros.' },
        { type: 'h2', text: 'Dónde ahorrar' },
        { type: 'ul', items: [
          'Lanza un MVP primero — corta funciones que no prueban el valor central.',
          'Ve híbrido en vez de dos códigos nativos, salvo que realmente necesites nativo.',
          'Reutiliza un design system probado en vez de una UI totalmente a medida el día uno.',
          'Elige un equipo nearshore (Latinoamérica): buen talento a 40-60% bajo tarifas de USA.',
          'Usa servicios gestionados (auth, pagos, backend) en vez de construirlos desde cero.',
        ] },
        { type: 'h2', text: 'Dónde NO ahorrar' },
        { type: 'p', text: 'No recortes en seguridad, ni en un senior que revise la arquitectura, ni en probar el flujo central. Ahí es donde "barato" se vuelve "caro" seis meses después. Ahorra en alcance y herramientas, nunca en criterio.' },
        { type: 'p', text: 'Trabajar con un equipo nearshore liderado por seniors es una de las palancas más grandes — colaboración en zona horaria de USA y calidad senior sin precio de agencia de USA.' },
      ],
    },
  },
  {
    slug: 'app-compliance-gdpr-hipaa-pci',
    date: '2026-05-30',
    cluster: 'tech-consulting',
    en: {
      title: 'GDPR, HIPAA & PCI: What Compliance Means for Your App Budget',
      excerpt: 'If your app touches health, payment or personal data, compliance is not optional — and it belongs in the budget from day one.',
      body: [
        { type: 'p', text: 'Compliance is the cost founders most often forget until it is expensive. If your app handles sensitive data, the regulations are not a checkbox at the end — they shape architecture, testing and documentation from the start.' },
        { type: 'h2', text: 'The big three' },
        { type: 'ul', items: [
          'GDPR: EU data-privacy rules — consent, data portability, the right to be forgotten. Applies if you have European users.',
          'HIPAA: US health-data protection — encryption, audit trails, strict access control for medical information.',
          'PCI DSS: payment-card security — required the moment you store or process card data (usually handled via Stripe).',
        ] },
        { type: 'h2', text: 'Why it changes the price' },
        { type: 'p', text: 'Compliance adds engineering (encryption, access control, logging), documentation and audit work. A regulated healthcare or fintech app can carry meaningful overhead before feature development even starts. The cheapest path is to design for it early, not retrofit it later.' },
        { type: 'p', text: 'Our estimator includes a security and compliance setting so you can see the impact — none, GDPR-style, or fully regulated — on the total. Plan for it up front and it becomes a line item, not a crisis.' },
      ],
    },
    es: {
      title: 'GDPR, HIPAA y PCI: Qué Significa el Cumplimiento para tu Presupuesto',
      excerpt: 'Si tu app toca datos de salud, pago o personales, el cumplimiento no es opcional — y va en el presupuesto desde el día uno.',
      body: [
        { type: 'p', text: 'El cumplimiento es el costo que los fundadores más olvidan hasta que se vuelve caro. Si tu app maneja datos sensibles, las regulaciones no son un checkbox al final — moldean arquitectura, pruebas y documentación desde el inicio.' },
        { type: 'h2', text: 'Los tres grandes' },
        { type: 'ul', items: [
          'GDPR: reglas de privacidad de la UE — consentimiento, portabilidad de datos, derecho al olvido. Aplica si tienes usuarios europeos.',
          'HIPAA: protección de datos de salud en USA — cifrado, trazas de auditoría, control de acceso estricto para info médica.',
          'PCI DSS: seguridad de tarjetas — requerido apenas almacenas o procesas datos de tarjeta (usualmente vía Stripe).',
        ] },
        { type: 'h2', text: 'Por qué cambia el precio' },
        { type: 'p', text: 'El cumplimiento suma ingeniería (cifrado, control de acceso, logging), documentación y auditoría. Una app regulada de salud o fintech puede cargar un sobrecosto importante antes de siquiera empezar las funciones. El camino más barato es diseñarlo temprano, no adaptarlo después.' },
        { type: 'p', text: 'Nuestro estimador incluye un ajuste de seguridad y cumplimiento para que veas el impacto — ninguno, tipo GDPR, o totalmente regulado — en el total. Planéalo desde el inicio y se vuelve una línea del presupuesto, no una crisis.' },
      ],
    },
  },
  {
    slug: 'idea-to-app-store-process',
    date: '2026-05-26',
    cluster: 'mobile-apps',
    en: {
      title: 'From Idea to App Store: The Process, Step by Step',
      excerpt: 'What actually happens between "I have an app idea" and a live listing on the App Store and Google Play.',
      body: [
        { type: 'p', text: 'Building an app is not one big event — it is a sequence of steps, each de-risking the next. Knowing the path makes the whole thing less intimidating and helps you spot where budgets and timelines really go.' },
        { type: 'h2', text: 'The path' },
        { type: 'ul', items: [
          'Discovery: define the core problem, users and scope. Cut everything that is not essential.',
          'Design: wireframes, then a clickable prototype and the visual system.',
          'Build: the MVP in sprints, with something testable at the end of each.',
          'QA: test the core flows on real devices — not just the happy path.',
          'Launch: App Store and Google Play submission, review, and go-live.',
          'Iterate: measure real usage, fix, and expand based on what users actually do.',
        ] },
        { type: 'h2', text: 'Where timelines slip' },
        { type: 'p', text: 'Most delays come from unclear scope, late feedback, and store review surprises. A tight scope and short feedback loops are the best defense — which is exactly why we start every project by cutting the plan down to its core.' },
        { type: 'p', text: 'Want a real number for your idea? Try the estimator on this site, then reach out for a scoped plan and timeline.' },
      ],
    },
    es: {
      title: 'De la Idea a la App Store: El Proceso, Paso a Paso',
      excerpt: 'Qué pasa realmente entre "tengo una idea de app" y una ficha publicada en App Store y Google Play.',
      body: [
        { type: 'p', text: 'Construir una app no es un gran evento — es una secuencia de pasos, cada uno reduciendo el riesgo del siguiente. Conocer el camino lo hace menos intimidante y ayuda a ver dónde se van de verdad los presupuestos y tiempos.' },
        { type: 'h2', text: 'El camino' },
        { type: 'ul', items: [
          'Discovery: define el problema central, usuarios y alcance. Corta todo lo no esencial.',
          'Diseño: wireframes, luego un prototipo clickeable y el sistema visual.',
          'Build: el MVP en sprints, con algo probable al final de cada uno.',
          'QA: probar los flujos centrales en dispositivos reales — no solo el happy path.',
          'Lanzamiento: envío a App Store y Google Play, revisión y salida en vivo.',
          'Iterar: medir uso real, corregir y expandir según lo que los usuarios hacen.',
        ] },
        { type: 'h2', text: 'Dónde se atrasan los tiempos' },
        { type: 'p', text: 'La mayoría de atrasos vienen de alcance poco claro, feedback tardío y sorpresas en la revisión de tiendas. Un alcance ajustado y loops cortos de feedback son la mejor defensa — por eso arrancamos cada proyecto recortando el plan a su núcleo.' },
        { type: 'p', text: '¿Quieres un número real para tu idea? Prueba el estimador de este sitio y luego escríbenos para un plan y tiempo con alcance.' },
      ],
    },
  },
  {
    slug: 'saas-tech-stack-2026',
    date: '2026-05-20',
    cluster: 'saas',
    en: {
      title: 'The SaaS Tech Stack We Build With in 2026 (and Why)',
      excerpt: 'The exact stack we reach for when building production SaaS — from framework to payments — and the reasoning behind each choice.',
      body: [
        { type: 'p', text: 'Choosing a tech stack is one of the earliest and most consequential decisions in a SaaS build. The wrong pick shows up months later as slow pages, painful hiring, or a rewrite. Here is the stack we default to for production SaaS in 2026, and the reasoning behind each layer.' },
        { type: 'h2', text: 'Framework: Next.js on the App Router' },
        { type: 'p', text: 'We build on Next.js with React Server Components. Server-first rendering keeps the JavaScript shipped to the browser small, which directly protects Core Web Vitals — the metrics that affect both conversion and search ranking. Streaming and Suspense let us send meaningful HTML fast even when data is slow.' },
        { type: 'h2', text: 'Data: PostgreSQL with a typed ORM' },
        { type: 'p', text: 'PostgreSQL remains the pragmatic default: relational integrity, mature tooling, and a clear path to scale. We pair it with a typed ORM so the database schema and the application code never drift, and so migrations are reviewable in version control.' },
        { type: 'h2', text: 'Payments and billing' },
        { type: 'p', text: 'For subscriptions we integrate Stripe. It handles the parts that are easy to get wrong — proration, tax, dunning, webhooks — so the team can focus on the product instead of reinventing billing.' },
        { type: 'h2', text: 'The takeaway' },
        { type: 'p', text: 'A stack is a set of trade-offs, not a trophy. Ours is tuned for teams that need to launch a credible SaaS quickly and then scale it without a rewrite. If you are weighing these decisions for your own product, that is exactly the kind of conversation we like to have.' },
      ],
    },
    es: {
      title: 'El Stack SaaS con el que Construimos en 2026 (y Por Qué)',
      excerpt: 'El stack exacto que usamos para SaaS en producción — del framework a los pagos — y el razonamiento detrás de cada elección.',
      body: [
        { type: 'p', text: 'Elegir el stack tecnológico es una de las decisiones más tempranas e influyentes al construir un SaaS. Una mala elección reaparece meses después como páginas lentas, contrataciones difíciles o una reescritura. Este es el stack que usamos por defecto para SaaS en producción en 2026, con el razonamiento de cada capa.' },
        { type: 'h2', text: 'Framework: Next.js con App Router' },
        { type: 'p', text: 'Construimos sobre Next.js con React Server Components. El renderizado server-first mantiene pequeño el JavaScript que llega al navegador, lo que protege directamente los Core Web Vitals — las métricas que afectan tanto a la conversión como al posicionamiento. Streaming y Suspense nos dejan enviar HTML útil rápido aunque los datos tarden.' },
        { type: 'h2', text: 'Datos: PostgreSQL con un ORM tipado' },
        { type: 'p', text: 'PostgreSQL sigue siendo el default pragmático: integridad relacional, herramientas maduras y un camino claro para escalar. Lo combinamos con un ORM tipado para que el esquema y el código nunca se desalineen, y para que las migraciones sean revisables en control de versiones.' },
        { type: 'h2', text: 'Pagos y facturación' },
        { type: 'p', text: 'Para suscripciones integramos Stripe. Resuelve lo que es fácil equivocar — prorrateo, impuestos, reintentos de cobro, webhooks — para que el equipo se enfoque en el producto en vez de reinventar la facturación.' },
        { type: 'h2', text: 'La conclusión' },
        { type: 'p', text: 'Un stack es un conjunto de compromisos, no un trofeo. El nuestro está afinado para equipos que necesitan lanzar un SaaS creíble rápido y luego escalarlo sin reescribir. Si estás sopesando estas decisiones para tu producto, es justo el tipo de conversación que nos gusta tener.' },
      ],
    },
  },
]

export const postSlugs = posts.map((p) => p.slug)
export const getPost = (slug: string) => posts.find((p) => p.slug === slug)
// Orden de listado: fecha descendente (comparación de strings ISO = orden cronológico).
export const postsByDate = () => [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))

/** Palabras del cuerpo → minutos de lectura (~200 wpm). */
export function readingMinutes(content: PostContent): number {
  const words = content.body.reduce((n, b) => {
    if (b.type === 'ul') return n + b.items.join(' ').split(/\s+/).length
    return n + b.text.split(/\s+/).length
  }, 0)
  return Math.max(1, Math.round(words / 200))
}
