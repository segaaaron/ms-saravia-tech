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
  {
    slug: 'high-converting-landing-page',
    date: '2026-07-30',
    cluster: 'saas',
    en: {
      title: 'Anatomy of a Landing Page That Converts',
      excerpt: 'A landing page is not a brochure — it is a decision engine with one job. Here is what actually moves the conversion rate, section by section.',
      body: [
        { type: 'p', text: 'A landing page has exactly one job: turn a visitor into a lead or a sale. Everything that does not serve that job is noise. The pages that convert are rarely the flashiest — they are the clearest.' },
        { type: 'h2', text: 'The sections that carry the weight' },
        { type: 'ul', items: [
          'Hero: one promise, one subhead, one primary call to action — readable in three seconds.',
          'Proof: logos, numbers and testimonials that answer "can I trust this?".',
          'Objection handling: the feature blocks and FAQ that remove hesitation.',
          'A single, repeated call to action — not five competing buttons.',
          'Speed: every 100ms of delay quietly costs you conversions.',
        ] },
        { type: 'h2', text: 'Why speed is a conversion feature' },
        { type: 'p', text: 'We build landing pages static-first with Next.js so the first paint is near-instant and the Core Web Vitals stay green. Heavy 3D, video or animation loads below the fold, never blocking the headline. The result feels premium without punishing mobile users on slow networks.' },
        { type: 'h2', text: 'Measure, then iterate' },
        { type: 'p', text: 'A landing page is never finished. We wire analytics and event tracking from day one so you can see where people drop off and test the parts that matter. Want to see the level we build at? The demos on this site are live landing pages — and our free estimator will price yours in seconds.' },
      ],
    },
    es: {
      title: 'Anatomía de una Landing Page que Convierte',
      excerpt: 'Una landing no es un folleto — es un motor de decisión con un solo trabajo. Esto es lo que de verdad mueve la conversión, sección por sección.',
      body: [
        { type: 'p', text: 'Una landing tiene un solo trabajo: convertir un visitante en un lead o una venta. Todo lo que no sirve a ese trabajo es ruido. Las páginas que convierten rara vez son las más vistosas — son las más claras.' },
        { type: 'h2', text: 'Las secciones que cargan el peso' },
        { type: 'ul', items: [
          'Hero: una promesa, un subtítulo, un CTA principal — legible en tres segundos.',
          'Prueba: logos, números y testimonios que responden "¿puedo confiar en esto?".',
          'Manejo de objeciones: los bloques de features y FAQ que quitan la duda.',
          'Un solo CTA repetido — no cinco botones que compiten.',
          'Velocidad: cada 100ms de demora te cuesta conversiones en silencio.',
        ] },
        { type: 'h2', text: 'Por qué la velocidad es una función de conversión' },
        { type: 'p', text: 'Construimos landings static-first con Next.js para que el primer pintado sea casi instantáneo y los Core Web Vitals queden en verde. El 3D, el video o la animación pesada cargan bajo el pliegue, sin bloquear el titular. El resultado se siente premium sin castigar al usuario móvil en redes lentas.' },
        { type: 'h2', text: 'Mide, luego itera' },
        { type: 'p', text: 'Una landing nunca está terminada. Cableamos analítica y tracking de eventos desde el día uno para ver dónde abandona la gente y probar lo que importa. ¿Quieres ver el nivel al que construimos? Las demos de este sitio son landings en vivo — y nuestro estimador gratis cotiza la tuya en segundos.' },
      ],
    },
  },
  {
    slug: 'landing-page-with-dashboard',
    date: '2026-07-29',
    cluster: 'saas',
    en: {
      title: 'From Landing Page to Live Dashboard',
      excerpt: 'The landing captures the lead; the dashboard tells you what to do next. Pairing the two turns a marketing site into a real product.',
      body: [
        { type: 'p', text: 'A landing page that captures leads is only half the system. The other half is the dashboard where those leads, signups and events become numbers you can act on. When the two are built together, the marketing site stops being a billboard and starts being a product.' },
        { type: 'h2', text: 'What the dashboard should show' },
        { type: 'ul', items: [
          'Acquisition: where visitors come from and which campaigns actually convert.',
          'Funnel: the drop-off between visit, signup and paying customer.',
          'Cohorts and retention: whether the people you win actually stay.',
          'Real-time events: signups, payments and bookings as they happen.',
        ] },
        { type: 'h2', text: 'How we build it' },
        { type: 'p', text: 'The public landing is static and fast; the dashboard is an authenticated app behind it, streaming from the same database. We use server components and incremental data loading so a dashboard with dozens of charts still feels instant, and we cache aggressively so heavy queries do not hammer the database on every refresh.' },
        { type: 'h2', text: 'One system, not two vendors' },
        { type: 'p', text: 'Because the site and the panel share a stack, an event on the landing shows up in the dashboard without a fragile integration in between. Our VESPER and PULSE demos show exactly this pairing — a polished front end plus the operational panel behind it. If that is the shape of what you need, our estimator will scope it.' },
      ],
    },
    es: {
      title: 'De la Landing Page al Dashboard en Vivo',
      excerpt: 'La landing captura el lead; el dashboard te dice qué hacer después. Unir ambos convierte un sitio de marketing en un producto real.',
      body: [
        { type: 'p', text: 'Una landing que capta leads es solo la mitad del sistema. La otra mitad es el dashboard donde esos leads, registros y eventos se vuelven números accionables. Cuando se construyen juntos, el sitio de marketing deja de ser una valla y empieza a ser un producto.' },
        { type: 'h2', text: 'Qué debe mostrar el dashboard' },
        { type: 'ul', items: [
          'Adquisición: de dónde vienen los visitantes y qué campañas convierten de verdad.',
          'Embudo: la caída entre visita, registro y cliente que paga.',
          'Cohortes y retención: si la gente que ganas realmente se queda.',
          'Eventos en tiempo real: registros, pagos y reservas a medida que ocurren.',
        ] },
        { type: 'h2', text: 'Cómo lo construimos' },
        { type: 'p', text: 'La landing pública es estática y rápida; el dashboard es una app autenticada detrás, alimentada por la misma base de datos. Usamos server components y carga incremental para que un panel con decenas de gráficos siga sintiéndose instantáneo, y cacheamos con fuerza para que las consultas pesadas no golpeen la base en cada refresco.' },
        { type: 'h2', text: 'Un sistema, no dos proveedores' },
        { type: 'p', text: 'Como el sitio y el panel comparten stack, un evento en la landing aparece en el dashboard sin una integración frágil de por medio. Nuestras demos VESPER y PULSE muestran justo este par — un front pulido más el panel operativo detrás. Si esa es la forma de lo que necesitas, nuestro estimador lo dimensiona.' },
      ],
    },
  },
  {
    slug: 'analytics-dashboard-design',
    date: '2026-07-27',
    cluster: 'saas',
    en: {
      title: 'Analytics Dashboards People Actually Use',
      excerpt: 'Most dashboards drown the user in charts. A good one answers a question in one glance and lets you dig deeper only when you want to.',
      body: [
        { type: 'p', text: 'The failure mode of most dashboards is the same: forty charts, no hierarchy, and no answer to the one question the user opened it for. A dashboard is not a data dump — it is an argument. Every tile should earn its place by helping someone decide something.' },
        { type: 'h2', text: 'Principles we design by' },
        { type: 'ul', items: [
          'Lead with the answer: the three numbers that matter, big, at the top.',
          'Progressive disclosure: summary first, drill-down on demand — not everything at once.',
          'Comparison built in: a number without a trend or a target means nothing.',
          'Readable in light and dark, and legible on a phone, not just a 27-inch monitor.',
        ] },
        { type: 'h2', text: 'Performance is part of the design' },
        { type: 'p', text: 'A dashboard that takes six seconds to load does not get used. We paginate and aggregate on the server, cache expensive queries, and stream tiles in as their data arrives so the page is useful before every chart has finished. Under load, that is the difference between a tool and a spinner.' },
        { type: 'h2', text: 'From data to decisions' },
        { type: 'p', text: 'The point of a dashboard is the action it triggers, not the chart it renders. We design them backwards from the decision the user needs to make. Our VESPER dashboard demo is a working example — and if you want one wired to your real data, that is a conversation worth having.' },
      ],
    },
    es: {
      title: 'Dashboards de Analítica que la Gente Sí Usa',
      excerpt: 'La mayoría de dashboards ahogan al usuario en gráficos. Uno bueno responde una pregunta de un vistazo y te deja profundizar solo si quieres.',
      body: [
        { type: 'p', text: 'El modo de falla de casi todos los dashboards es el mismo: cuarenta gráficos, sin jerarquía, y sin respuesta a la única pregunta por la que el usuario lo abrió. Un dashboard no es un volcado de datos — es un argumento. Cada tile debe ganarse su lugar ayudando a alguien a decidir algo.' },
        { type: 'h2', text: 'Principios con los que diseñamos' },
        { type: 'ul', items: [
          'Arranca con la respuesta: los tres números que importan, grandes, arriba.',
          'Revelación progresiva: resumen primero, detalle bajo demanda — no todo de golpe.',
          'Comparación incorporada: un número sin tendencia ni meta no dice nada.',
          'Legible en claro y oscuro, y en un teléfono, no solo en un monitor de 27 pulgadas.',
        ] },
        { type: 'h2', text: 'El rendimiento es parte del diseño' },
        { type: 'p', text: 'Un dashboard que tarda seis segundos en cargar no se usa. Paginamos y agregamos en el servidor, cacheamos las consultas caras, y hacemos streaming de los tiles a medida que llegan sus datos para que la página sea útil antes de que cada gráfico termine. Bajo carga, esa es la diferencia entre una herramienta y un spinner.' },
        { type: 'h2', text: 'De datos a decisiones' },
        { type: 'p', text: 'El punto de un dashboard es la acción que dispara, no el gráfico que dibuja. Los diseñamos al revés, desde la decisión que el usuario necesita tomar. Nuestra demo del dashboard VESPER es un ejemplo funcionando — y si quieres uno conectado a tus datos reales, vale la pena conversarlo.' },
      ],
    },
  },
  {
    slug: 'restaurant-online-ordering',
    date: '2026-07-26',
    cluster: 'saas',
    en: {
      title: 'Online Ordering and Reservations for Restaurants',
      excerpt: 'QR menus, table booking, and a kitchen panel that keeps up with the rush — the software a modern restaurant runs on, without the per-cover fees.',
      body: [
        { type: 'p', text: 'Most restaurant tech is rented: a third-party ordering app that owns your customers, hides their data and takes a cut of every cover. Building your own guest web flips that — the relationship, the data and the margin stay with the restaurant.' },
        { type: 'h2', text: 'What the guest side needs' },
        { type: 'ul', items: [
          'A QR menu that loads instantly at the table, with photos and modifiers.',
          'Table reservations with real-time availability, not a phone tag.',
          'Order-and-pay from the phone so the queue at the till disappears.',
          'Order history so regulars reorder their usual in two taps.',
        ] },
        { type: 'h2', text: 'The panel behind the pass' },
        { type: 'p', text: 'The kitchen and floor need the other half: a live operations panel where orders land the moment they are placed, tables update, and staff can see the pulse of the venue in one screen. During a Friday rush that panel is the product — it has to stay fast when a hundred orders hit at once.' },
        { type: 'h2', text: 'Built to your brand' },
        { type: 'p', text: 'Our BRASA demo shows both halves: the guest web that takes reservations and QR payments, and the staff panel that runs the floor. It is a template for exactly this kind of build — restyled and extended for your restaurant. Price a version for your venue with our estimator.' },
      ],
    },
    es: {
      title: 'Pedidos Online y Reservas para Restaurantes',
      excerpt: 'Menús QR, reserva de mesas y un panel de cocina que aguanta la hora pico — el software con el que opera un restaurante moderno, sin comisiones por cubierto.',
      body: [
        { type: 'p', text: 'Casi toda la tecnología de restaurantes es alquilada: una app de pedidos de terceros que se queda con tus clientes, esconde sus datos y toma una tajada de cada cubierto. Construir tu propia web del comensal lo da vuelta — la relación, los datos y el margen se quedan en el restaurante.' },
        { type: 'h2', text: 'Qué necesita el lado del comensal' },
        { type: 'ul', items: [
          'Un menú QR que carga al instante en la mesa, con fotos y modificadores.',
          'Reserva de mesas con disponibilidad en tiempo real, no llamadas de ida y vuelta.',
          'Pedir y pagar desde el teléfono para que desaparezca la fila en caja.',
          'Historial de pedidos para que el cliente frecuente repita su usual en dos toques.',
        ] },
        { type: 'h2', text: 'El panel detrás del pase' },
        { type: 'p', text: 'La cocina y el salón necesitan la otra mitad: un panel operativo en vivo donde los pedidos aparecen apenas se hacen, las mesas se actualizan, y el personal ve el pulso del local en una pantalla. En un viernes lleno ese panel es el producto — tiene que seguir rápido cuando entran cien pedidos a la vez.' },
        { type: 'h2', text: 'Hecho a tu marca' },
        { type: 'p', text: 'Nuestra demo BRASA muestra ambas mitades: la web del comensal que toma reservas y pagos con QR, y el panel de personal que opera el salón. Es una plantilla para justo este tipo de build — rediseñada y ampliada para tu restaurante. Cotiza una versión para tu local con nuestro estimador.' },
      ],
    },
  },
  {
    slug: 'gym-management-saas',
    date: '2026-07-24',
    cluster: 'saas',
    en: {
      title: 'Gym SaaS: Memberships, Classes and Check-ins',
      excerpt: 'A connected gym runs on software: check-in, payment and class booking that all update one live panel. Here is how that system fits together.',
      body: [
        { type: 'p', text: 'A gym is a subscription business with a physical door. The software that runs it has to handle both worlds — recurring billing and a turnstile — and keep them in sync in real time. When it works, the front desk stops chasing spreadsheets and starts running the floor.' },
        { type: 'h2', text: 'The moving parts' },
        { type: 'ul', items: [
          'Memberships and recurring billing, with pauses, upgrades and failed-payment recovery.',
          'Class schedules with capacity, waitlists and self-service booking from the member app.',
          'Check-in that ties a visit to a membership in real time.',
          'An admin panel with members, classes and the metrics that predict churn.',
        ] },
        { type: 'h2', text: 'Members expect an app' },
        { type: 'p', text: 'The member-facing side is now table stakes: book a class, see your schedule, manage your plan from a phone. Behind it, the same events feed the owner dashboard so a check-in, a payment and a booking all land in one place without a fragile integration between four tools.' },
        { type: 'h2', text: 'A working blueprint' },
        { type: 'p', text: 'Our PULSE demo is exactly this ecosystem — landing, member app, admin dashboard and login, all sharing one stack. It is the blueprint we start from and shape to your gym. Use the estimator to price your version.' },
      ],
    },
    es: {
      title: 'SaaS de Gimnasio: Membresías, Clases y Check-in',
      excerpt: 'Un gimnasio conectado corre sobre software: check-in, pago y reserva de clases que actualizan un panel en vivo. Así encaja ese sistema.',
      body: [
        { type: 'p', text: 'Un gimnasio es un negocio de suscripción con una puerta física. El software que lo opera tiene que manejar ambos mundos — cobro recurrente y torniquete — y mantenerlos sincronizados en tiempo real. Cuando funciona, la recepción deja de perseguir hojas de cálculo y empieza a operar el local.' },
        { type: 'h2', text: 'Las piezas en movimiento' },
        { type: 'ul', items: [
          'Membresías y cobro recurrente, con pausas, upgrades y recuperación de pagos fallidos.',
          'Horarios de clases con capacidad, lista de espera y reserva self-service desde la app del socio.',
          'Check-in que liga una visita a una membresía en tiempo real.',
          'Un panel admin con socios, clases y las métricas que predicen la baja.',
        ] },
        { type: 'h2', text: 'El socio espera una app' },
        { type: 'p', text: 'El lado del socio ya es lo mínimo: reservar una clase, ver tu horario, manejar tu plan desde el teléfono. Detrás, los mismos eventos alimentan el dashboard del dueño para que un check-in, un pago y una reserva caigan en un solo lugar sin una integración frágil entre cuatro herramientas.' },
        { type: 'h2', text: 'Un plano que funciona' },
        { type: 'p', text: 'Nuestra demo PULSE es justo este ecosistema — landing, app del socio, dashboard admin y login, todos compartiendo un stack. Es el plano del que partimos y moldeamos a tu gimnasio. Usa el estimador para cotizar tu versión.' },
      ],
    },
  },
  {
    slug: 'custom-crm-vs-off-the-shelf',
    date: '2026-07-22',
    cluster: 'saas',
    en: {
      title: 'Custom CRM vs Off-the-Shelf: When to Build Your Own',
      excerpt: 'Salesforce and HubSpot are excellent — until your process does not fit their boxes. Here is how to tell when a custom CRM pays for itself.',
      body: [
        { type: 'p', text: 'For most teams, an off-the-shelf CRM is the right call: it is cheap to start, well supported and good enough. The question is not "is Salesforce good?" — it is "does my process fit inside someone else’s product, or am I paying per seat to fight it every day?".' },
        { type: 'h2', text: 'Signs you have outgrown off-the-shelf' },
        { type: 'ul', items: [
          'You maintain a maze of custom fields, automations and plugins to force it to behave.',
          'Per-seat pricing punishes you for growing the team.',
          'Your real workflow lives in spreadsheets alongside the CRM, not inside it.',
          'The data you need is locked in a format you cannot query or export cleanly.',
        ] },
        { type: 'h2', text: 'What building your own buys you' },
        { type: 'p', text: 'A custom CRM models your actual pipeline — your stages, your objects, your rules — instead of bending your business to fit a template. You own the data, integrations are first-class rather than bolted on, and there is no per-seat tax as you scale. The cost is that you own it: it needs to be built and maintained.' },
        { type: 'h2', text: 'The pragmatic middle' },
        { type: 'p', text: 'Often the right answer is a hybrid: keep the commodity parts off-the-shelf and build the one workflow that is your competitive edge. We help teams draw that line so they build only what genuinely pays for itself. If you are weighing it, our estimator will scope a custom build in minutes.' },
      ],
    },
    es: {
      title: 'CRM a Medida vs de Estante: Cuándo Construir el Tuyo',
      excerpt: 'Salesforce y HubSpot son excelentes — hasta que tu proceso no entra en sus casillas. Así sabes cuándo un CRM a medida se paga solo.',
      body: [
        { type: 'p', text: 'Para la mayoría de equipos, un CRM de estante es la decisión correcta: barato para empezar, bien soportado y suficiente. La pregunta no es "¿es bueno Salesforce?" — es "¿mi proceso entra dentro del producto de otro, o pago por usuario para pelearme con él todos los días?".' },
        { type: 'h2', text: 'Señales de que ya te quedó chico' },
        { type: 'ul', items: [
          'Mantienes un laberinto de campos, automatizaciones y plugins para forzar que se comporte.',
          'El precio por usuario te castiga por hacer crecer al equipo.',
          'Tu flujo real vive en hojas de cálculo al lado del CRM, no dentro de él.',
          'Los datos que necesitas quedan atrapados en un formato que no puedes consultar ni exportar limpio.',
        ] },
        { type: 'h2', text: 'Qué te compra construir el tuyo' },
        { type: 'p', text: 'Un CRM a medida modela tu pipeline real — tus etapas, tus objetos, tus reglas — en vez de doblar tu negocio a una plantilla. Eres dueño de los datos, las integraciones son de primera clase en vez de atornilladas, y no hay impuesto por usuario al escalar. El costo es que es tuyo: hay que construirlo y mantenerlo.' },
        { type: 'h2', text: 'El medio pragmático' },
        { type: 'p', text: 'A menudo la respuesta correcta es híbrida: deja las partes de commodity en un producto de estante y construye el único flujo que es tu ventaja competitiva. Ayudamos a los equipos a trazar esa línea para que solo construyan lo que de verdad se paga solo. Si lo estás sopesando, nuestro estimador dimensiona un build a medida en minutos.' },
      ],
    },
  },
  {
    slug: 'ecommerce-storefront-done-right',
    date: '2026-07-20',
    cluster: 'saas',
    en: {
      title: 'E-commerce Done Right: Speed, Trust and Checkout',
      excerpt: 'Online stores are won and lost on three things: how fast pages load, how much a visitor trusts you, and how little friction stands between them and checkout.',
      body: [
        { type: 'p', text: 'An online store lives or dies on conversion, and conversion comes down to three levers: speed, trust and checkout friction. Get those right and a modest catalog outsells a beautiful store that is slow, sketchy or annoying to buy from.' },
        { type: 'h2', text: 'Speed is revenue' },
        { type: 'p', text: 'Every extra second on a product page measurably drops conversion. We build storefronts on Next.js with statically rendered catalog pages, optimized images and lazy-loaded everything below the fold, so the product is on screen before a shopper loses patience — on a phone, on mobile data.' },
        { type: 'h2', text: 'Trust and a checkout that gets out of the way' },
        { type: 'ul', items: [
          'Clear pricing, shipping and returns — no surprises at the last step.',
          'Social proof: reviews and stock signals where the decision happens.',
          'A short checkout with saved details, wallets and Stripe doing the heavy lifting.',
          'A wishlist and order history so returning buyers convert in seconds.',
        ] },
        { type: 'h2', text: 'A storefront you own' },
        { type: 'p', text: 'Our VESPER store demo shows the shape: a fast catalog, wishlist and a checkout flow that does not fight the buyer — all on a stack you own rather than rent. Want a store built to convert and to scale? Price it with our estimator.' },
      ],
    },
    es: {
      title: 'E-commerce Bien Hecho: Velocidad, Confianza y Checkout',
      excerpt: 'Las tiendas online se ganan o se pierden en tres cosas: qué tan rápido cargan, cuánto confía el visitante en ti, y cuánta fricción hay entre él y el checkout.',
      body: [
        { type: 'p', text: 'Una tienda online vive o muere por la conversión, y la conversión se reduce a tres palancas: velocidad, confianza y fricción de checkout. Acierta en esas y un catálogo modesto vende más que una tienda hermosa que es lenta, dudosa o molesta para comprar.' },
        { type: 'h2', text: 'La velocidad es ingreso' },
        { type: 'p', text: 'Cada segundo extra en una página de producto baja la conversión de forma medible. Construimos tiendas en Next.js con páginas de catálogo renderizadas estáticas, imágenes optimizadas y todo lo de bajo del pliegue en lazy, para que el producto esté en pantalla antes de que el comprador pierda la paciencia — en un teléfono, con datos móviles.' },
        { type: 'h2', text: 'Confianza y un checkout que se quita del camino' },
        { type: 'ul', items: [
          'Precio, envío y devoluciones claros — sin sorpresas en el último paso.',
          'Prueba social: reseñas y señales de stock donde ocurre la decisión.',
          'Un checkout corto con datos guardados, wallets y Stripe haciendo el trabajo pesado.',
          'Lista de deseos e historial para que el comprador que vuelve convierta en segundos.',
        ] },
        { type: 'h2', text: 'Una tienda que es tuya' },
        { type: 'p', text: 'Nuestra demo de la tienda VESPER muestra la forma: catálogo rápido, wishlist y un flujo de checkout que no pelea con el comprador — todo sobre un stack que es tuyo en vez de alquilado. ¿Quieres una tienda hecha para convertir y escalar? Cotízala con nuestro estimador.' },
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
