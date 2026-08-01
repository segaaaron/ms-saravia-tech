'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import Image from 'next/image'
import type { DemoLang } from '../types'

/* ============================================================================
   SAVERA GT — landing premium de superdeportivo (demo de portafolio, ficticia).
   Scroll cinematográfico con FOTOS REALES (Unsplash) + secciones editoriales.
   Bilingüe es/en.

   El scroll manda una secuencia de cross-fades full-bleed (hero → cabina →
   motor → aero) con Ken Burns sutil, y revela/oculta las cards glassmorphism
   de cada fase. El progreso (0→1) NO pasa por React state: se escribe en CSS
   vars (opacidad + zoom de cada foto, opacidad de cada card) leídas por el
   layout. Cero re-render por scroll — el handler solo toca `style` en rAF.

   Fotos por next/image (host images.unsplash.com ya whitelisteado): el hero
   con `priority` (es el LCP), el resto lazy. Sin three.js: la versión 3D
   procedural low-poly no daba el nivel premium.
   ============================================================================ */

const ROSSO = '#e50914'
const ROSSO_HOT = '#ff2800'
const CHALK = '#f5f5f7'
const CARBON = '#0b0b0b'

// Fotos de supercar (Unsplash, licencia libre). Orden = fases del scroll.
const HERO_IMG = 'https://images.unsplash.com/photo-1626002595481-688505bc19ba'
const PHASE_IMG = [
  'https://images.unsplash.com/photo-1616322956281-ae8fe364daa7', // F1 cabina / cockpit
  'https://images.unsplash.com/photo-1610531526986-af419fe24501', // F2 motor / V12
  'https://images.unsplash.com/photo-1628890954311-74476fcbf0d4', // F3 chasis / aero
]
const STAGE_IMG = [HERO_IMG, ...PHASE_IMG]
// Origen de zoom por foto → cada Ken Burns entra distinto (no todos al centro).
const KB_ORIGIN = ['50% 42%', '38% 50%', '58% 46%', '46% 58%']
// Foto real de rin/freno para la sección de ingeniería (reemplaza el 3D procedural).
const WHEEL_IMG = 'https://images.unsplash.com/photo-1444947295498-07f60c19a4ff'

// Visually-hidden accesible (para el valor real de los contadores animados).
const SR_ONLY: CSSProperties = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }

type TechIconName = 'aero' | 'engine' | 'gearbox' | 'brake' | 'vector' | 'chassis'
type Phase = { badge: string; title: string; body: string; specs: { k: string; v: string }[] }
type Spec = { label: string; value: string; unit: string; note: string }
type Content = {
  nav: { models: string; engineering: string; experience: string; contact: string }
  cta: string
  heroModel: string
  heroTagline: string
  heroSub: string
  scrollHint: string
  phases: Phase[]
  imgAlt: string[]
  manifesto: { eyebrow: string; title: string; paras: string[]; sign: string }
  telemetry: {
    eyebrow: string
    title: string
    sub: string
    metrics: { to: number; decimals?: number; prefix?: string; suffix: string; label: string }[]
  }
  wheel: { eyebrow: string; title: string; body: string; points: { k: string; v: string }[]; hint: string }
  editions: {
    eyebrow: string
    title: string
    sub: string
    cta: string
    items: { name: string; tag: string; price: string; tagline: string; specs: { k: string; v: string }[] }[]
  }
  tech: { eyebrow: string; title: string; sub: string; items: { icon: TechIconName; title: string; body: string }[] }
  atelier: { eyebrow: string; title: string; sub: string; groups: { title: string; items: string[] }[] }
  fullspec: { eyebrow: string; title: string; sub: string; groups: { title: string; rows: { k: string; v: string }[] }[] }
  owner: { eyebrow: string; title: string; sub: string; perks: { title: string; body: string }[] }
  press: { eyebrow: string; title: string; quotes: { quote: string; author: string; source: string }[] }
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] }
  specsEyebrow: string
  specsTitle: string
  specsSub: string
  specCards: Spec[]
  contactEyebrow: string
  contactTitle: string
  contactSub: string
  form: { name: string; email: string; phone: string; dealer: string; message: string }
  send: string
  sending: string
  sent: string
  sentNote: string
  legal: string[]
  rights: string
  builtBy: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    nav: { models: 'Modelos', engineering: 'Ingeniería', experience: 'Experiencia', contact: 'Contacto' },
    cta: 'Reservar Test Drive',
    heroModel: 'SAVERA SV-12 Stradale',
    heroTagline: 'El silencio antes de la tormenta',
    heroSub: 'Doce cilindros forjados a mano. Una carrocería nacida en el túnel de viento. Un manifiesto de ingeniería italiana llevado a su forma más pura.',
    scrollHint: 'Scroll para explorar',
    imgAlt: [
      'SAVERA SV-12 Stradale, exterior de superdeportivo',
      'Cabina de carreras del SAVERA SV-12, cockpit',
      'Motor V12 biturbo del SAVERA SV-12',
      'Chasis y aerodinámica en fibra de carbono',
    ],
    phases: [
      {
        badge: 'Fase 01 · Habitáculo',
        title: 'Puertas ala-de-gaviota',
        body: 'Se abren hacia el cielo y revelan una cabina envuelta en Alcántara. Volante de carreras aplanado, cluster OLED curvo y control háptico donde antes hubo botones.',
        specs: [
          { k: 'Volante', v: 'Carreras · aplanado' },
          { k: 'Instrumentación', v: 'OLED curvo 12,3"' },
          { k: 'Tapizado', v: 'Alcántara & fibra' },
        ],
      },
      {
        badge: 'Fase 02 · Corazón V12',
        title: '6.5L V12 Biturbo',
        body: 'La cubierta se levanta sobre un bloque forjado que respira por doce gargantas. Respuesta instantánea, corte a 9.500 rpm y una banda sonora que no pide disculpas.',
        specs: [
          { k: 'Potencia', v: '980 CV' },
          { k: '0–100 km/h', v: '2,5 s' },
          { k: 'V. máx', v: '> 340 km/h' },
        ],
      },
      {
        badge: 'Fase 03 · Chasis & Aero',
        title: 'Monocasco de fibra de carbono',
        body: 'Un chasis de 1.380 kg tallado en carbono, alerón activo retráctil y difusor de doble plano. Frenos carbo-cerámicos que detienen el tiempo tanto como la velocidad.',
        specs: [
          { k: 'Chasis', v: 'Monocasco carbono' },
          { k: 'Frenos', v: 'Carbo-cerámicos' },
          { k: 'Aero', v: 'Alerón activo' },
        ],
      },
    ],
    manifesto: {
      eyebrow: 'Manifiesto',
      title: 'No perseguimos el récord. Perseguimos la emoción de estar vivo a 300 km/h.',
      paras: [
        'Fundada en 1963 al pie de los Apeninos, SAVERA nació de una obsesión sencilla y peligrosa: que una máquina pudiera hacerte sentir. Cada SV-12 se ensambla a mano en Maranello por doce artesanos que firman el bloque antes de cerrarlo.',
        'No fabricamos coches en serie. Fabricamos capítulos. El SV-12 Stradale es el más reciente: 199 unidades, doce cilindros aspirando el aire de la Emilia-Romaña, y una única promesa — que ninguna curva vuelva a sentirse igual.',
      ],
      sign: 'Ettore Savera · Fundador',
    },
    telemetry: {
      eyebrow: 'Telemetría',
      title: 'Prestaciones, medidas en pista',
      sub: 'Cifras verificadas en el circuito de pruebas de Nardò. Neumático slick, tanque medio, piloto de fábrica.',
      metrics: [
        { to: 2.5, decimals: 1, suffix: ' s', label: '0–100 km/h' },
        { to: 6.9, decimals: 1, suffix: ' s', label: '0–200 km/h' },
        { to: 9.7, decimals: 1, suffix: ' s', label: '400 m salida parada' },
        { to: 1.6, decimals: 1, suffix: ' g', label: 'Aceleración lateral' },
        { to: 342, suffix: ' km/h', label: 'Velocidad máxima' },
        { to: 390, suffix: ' kg', label: 'Carga aero a 250 km/h' },
      ],
    },
    wheel: {
      eyebrow: 'Ingeniería · Tren rodante',
      title: 'Rin forjado monobloque de 21″',
      body: 'Una sola pieza de aleación forjada, mecanizada a partir de un tocho macizo para eliminar 3,2 kg de masa no suspendida por esquina. Detrás, el disco carbo-cerámico de 410 mm y la pinza monobloque de seis pistones en Rosso Corsa.',
      points: [
        { k: 'Medida', v: '21″ · forjado monobloque' },
        { k: 'Disco', v: 'Carbo-cerámico 410 mm' },
        { k: 'Pinza', v: 'Monobloque · 6 pistones' },
        { k: 'Masa no susp.', v: '−3,2 kg por esquina' },
      ],
      hint: 'Rin forjado 21″ · disco carbo-cerámico',
    },
    editions: {
      eyebrow: 'Ediciones',
      title: 'Tres interpretaciones del mismo instinto',
      sub: 'Del asfalto abierto al ápice de la pista. Cada edición redefine el equilibrio entre confort y pura intención.',
      cta: 'Configurar',
      items: [
        {
          name: 'Stradale',
          tag: 'Gran Turismo de calle',
          price: 'desde € 2,4 M',
          tagline: 'El SV-12 en su forma más habitable, sin renunciar a un ápice de teatro.',
          specs: [
            { k: 'Potencia', v: '980 CV' },
            { k: 'Peso seco', v: '1.380 kg' },
            { k: '0–100 km/h', v: '2,5 s' },
            { k: 'Unidades', v: '199' },
          ],
        },
        {
          name: 'Corsa',
          tag: 'Homologada pista',
          price: 'desde € 3,1 M',
          tagline: 'Aero fija, suspensión de altura variable y 50 kg menos. Nacida para el cronómetro.',
          specs: [
            { k: 'Potencia', v: '1.030 CV' },
            { k: 'Peso seco', v: '1.290 kg' },
            { k: '0–100 km/h', v: '2,3 s' },
            { k: 'Unidades', v: '99' },
          ],
        },
        {
          name: 'Edizione',
          tag: 'Serie Aniversario',
          price: 'bajo consulta',
          tagline: 'Carrocería íntegra en carbono visto y librea a mano. La expresión definitiva.',
          specs: [
            { k: 'Potencia', v: '1.030 CV' },
            { k: 'Peso seco', v: '1.270 kg' },
            { k: 'Carga aero', v: '+18%' },
            { k: 'Unidades', v: '40' },
          ],
        },
      ],
    },
    tech: {
      eyebrow: 'Tecnología',
      title: 'Ingeniería sin atajos',
      sub: 'Seis sistemas que convierten 980 caballos en una coreografía, no en un caos.',
      items: [
        { icon: 'aero', title: 'Aerodinámica activa', body: 'Alerón trasero y flaps de suelo que se reconfiguran en 0,2 s según velocidad, ángulo de dirección y frenada.' },
        { icon: 'engine', title: 'V12 6.5L biturbo', body: 'Bloque de aluminio forjado, corte a 9.500 rpm y dos turbos de baja inercia. 980 CV entregados con voz propia.' },
        { icon: 'gearbox', title: 'DCT de 8 marchas', body: 'Doble embrague con cambios en 40 ms y estrategia predictiva ligada al GPS del circuito cargado.' },
        { icon: 'brake', title: 'Freno carbo-cerámico', body: 'Discos de 410/390 mm con refrigeración por canal cerrado. Cero fatiga tras vueltas de resistencia.' },
        { icon: 'vector', title: 'Torque vectoring', body: 'Reparto de par por rueda vía diferencial electrónico y frenado selectivo. El coche gira contigo, no contra ti.' },
        { icon: 'chassis', title: 'Monocasco de carbono', body: 'Célula de fibra de 1.380 kg con subchasis de aluminio. Rigidez torsional un 22% superior a la generación previa.' },
      ],
    },
    atelier: {
      eyebrow: 'Atelier Savera',
      title: 'Suyo, hasta el último hilo',
      sub: 'Un programa de personalización sin catálogo cerrado. Si puede imaginarlo, nuestro taller puede tallarlo.',
      groups: [
        { title: 'Pinturas', items: ['Rosso Corsa histórico', 'Grigio Nardò mate', 'Blu Notte metalizado', 'Muestra a medida (su color)'] },
        { title: 'Cabina', items: ['Alcántara bicolor', 'Cuero curado vegetal', 'Cinturones de arnés a juego', 'Bordado del monograma'] },
        { title: 'Fibra & detalles', items: ['Carbono visto satinado', 'Carbono forjado', 'Titanio pulido', 'Placa numerada grabada'] },
        { title: 'Dinámica', items: ['Kit de pista Corsa', 'Suspensión de altura variable', 'Escape en titanio', 'Rines forjados a medida'] },
      ],
    },
    fullspec: {
      eyebrow: 'Ficha técnica completa',
      title: 'Cada tornillo, documentado',
      sub: 'SAVERA SV-12 Stradale · especificación de homologación europea 2026.',
      groups: [
        {
          title: 'Motor',
          rows: [
            { k: 'Arquitectura', v: 'V12 60° biturbo' },
            { k: 'Cilindrada', v: '6.498 cm³' },
            { k: 'Potencia máx.', v: '980 CV @ 9.000 rpm' },
            { k: 'Par máx.', v: '760 Nm @ 6.500 rpm' },
            { k: 'Corte de encendido', v: '9.500 rpm' },
          ],
        },
        {
          title: 'Transmisión',
          rows: [
            { k: 'Caja', v: 'DCT 8 marchas doble embrague' },
            { k: 'Tracción', v: 'Trasera + torque vectoring' },
            { k: 'Diferencial', v: 'Electrónico E-Diff' },
          ],
        },
        {
          title: 'Chasis y frenos',
          rows: [
            { k: 'Estructura', v: 'Monocasco fibra de carbono' },
            { k: 'Suspensión', v: 'Doble triángulo, amortiguación adaptativa' },
            { k: 'Frenos del.', v: 'Carbo-cerámico 410 mm, 6 pistones' },
            { k: 'Frenos tras.', v: 'Carbo-cerámico 390 mm, 4 pistones' },
            { k: 'Neumáticos', v: '265/35 ZR21 · 325/30 ZR21' },
          ],
        },
        {
          title: 'Dimensiones y pesos',
          rows: [
            { k: 'Longitud', v: '4.710 mm' },
            { k: 'Batalla', v: '2.700 mm' },
            { k: 'Peso en seco', v: '1.380 kg' },
            { k: 'Reparto de peso', v: '41 / 59 %' },
            { k: 'Depósito', v: '78 L' },
          ],
        },
        {
          title: 'Prestaciones',
          rows: [
            { k: '0–100 km/h', v: '2,5 s' },
            { k: '0–200 km/h', v: '6,9 s' },
            { k: 'Velocidad máx.', v: '> 340 km/h' },
            { k: 'Carga aero @ 250', v: '390 kg' },
          ],
        },
      ],
    },
    owner: {
      eyebrow: 'Programa de propietario',
      title: 'La entrega de la llave es el comienzo',
      sub: 'Ser propietario de un SAVERA es ingresar a un círculo. Estos son algunos de sus privilegios.',
      perks: [
        { title: 'Concierge 24/7', body: 'Un gestor dedicado, disponible en cualquier huso horario, para todo lo relacionado con su vehículo y sus viajes.' },
        { title: 'Corso Pilota', body: 'Tres jornadas anuales de conducción en circuitos homologados FIA, con instructores de competición de fábrica.' },
        { title: 'Garantía & mantenimiento', body: 'Siete años de cobertura integral y servicio a domicilio con técnico e ingeniero de SAVERA.' },
        { title: 'Atelier privado', body: 'Acceso reservado al taller de Maranello para reconfigurar, restaurar o crear una segunda librea.' },
        { title: 'Cronologia Eventi', body: 'Invitaciones a estrenos mundiales, subastas selectas y concentraciones de coleccionistas por temporada.' },
        { title: 'Certificato di Autenticità', body: 'Registro de por vida en el archivo histórico SAVERA, con trazabilidad de cada componente firmado.' },
      ],
    },
    press: {
      eyebrow: 'Prensa',
      title: 'Lo que dijeron al bajarse',
      quotes: [
        { quote: 'El V12 no acelera: te reordena las prioridades. No he conducido nada tan honesto en una década.', author: 'Marco Devienne', source: 'Corsa & Strada' },
        { quote: 'Un hipercar que recuerda que el objetivo no era el dato, sino la sonrisa. El Stradale es una carta de amor a la carretera.', author: 'Helena Ward', source: 'Apex Journal' },
        { quote: 'Frena desde 300 con la compostura de un coche de calle y gira con la de un prototipo. Brujería de ingeniería.', author: 'Takeshi Ono', source: 'Velocità Magazine' },
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Antes de reservar',
      items: [
        { q: '¿Cuál es el plazo de entrega?', a: 'La producción del SV-12 Stradale está asignada hasta 14 meses. Al confirmar la configuración recibirá una fecha de entrega en firme y acceso al seguimiento del ensamblaje.' },
        { q: '¿El vehículo está homologado para calle?', a: 'Sí. Las ediciones Stradale y Edizione cumplen la homologación europea y estadounidense. La edición Corsa es exclusiva de pista.' },
        { q: '¿Cómo funciona el mantenimiento?', a: 'Cada SAVERA incluye siete años de servicio integral. Un técnico y un ingeniero de fábrica pueden desplazarse a su domicilio para las revisiones programadas.' },
        { q: '¿Puedo personalizarlo por completo?', a: 'El Atelier Savera no trabaja con catálogo cerrado: pintura, materiales, fibra y dinámica se definen contigo en una sesión privada en Maranello.' },
        { q: '¿Ofrecen prueba dinámica?', a: 'Sí. Nuestro concierge coordina una jornada de conducción en circuito antes de cualquier compromiso de compra.' },
        { q: '¿Existe financiación o leasing?', a: 'SAVERA Financial Services ofrece esquemas a medida, incluyendo leasing de colección y planes con valor residual garantizado.' },
      ],
    },
    specsEyebrow: 'Ficha técnica',
    specsTitle: 'Cifras que definen el mito',
    specsSub: 'Cada número es una decisión de ingeniería. Ninguno es casualidad.',
    specCards: [
      { label: 'Potencia', value: '980', unit: 'CV @ 9.000 rpm', note: 'V12 6.5L biturbo, bloque de aluminio' },
      { label: 'Peso', value: '1.380', unit: 'kg en seco', note: 'Monocasco de fibra de carbono' },
      { label: 'Aero', value: '390', unit: 'kg de carga a 250', note: 'Alerón activo + difusor de doble plano' },
      { label: 'Transmisión', value: '8', unit: 'velocidades DCT', note: 'Doble embrague, cambio en 40 ms' },
    ],
    contactEyebrow: 'VIP Concierge',
    contactTitle: 'Reserve su encuentro privado',
    contactSub: 'Un especialista de SAVERA le contactará para coordinar una prueba dinámica y una configuración a medida. Cupos limitados por temporada.',
    form: { name: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono', dealer: 'Concesionario / País', message: 'Cuéntenos qué busca' },
    send: 'Solicitar invitación',
    sending: 'Enviando…',
    sent: 'Solicitud recibida',
    sentNote: 'Gracias. Nuestro concierge le contactará en menos de 24 horas. (Demo — no se envía nada real.)',
    legal: ['Aviso legal', 'Privacidad', 'Cookies'],
    rights: '© 2026 SAVERA GT. Marca ficticia. Todos los derechos reservados.',
    builtBy: 'Demo construida por MS Tech Stack',
  },
  en: {
    nav: { models: 'Models', engineering: 'Engineering', experience: 'Experience', contact: 'Contact' },
    cta: 'Book a Test Drive',
    heroModel: 'SAVERA SV-12 Stradale',
    heroTagline: 'The silence before the storm',
    heroSub: 'Twelve hand-forged cylinders. A body born in the wind tunnel. A manifesto of Italian engineering distilled to its purest form.',
    scrollHint: 'Scroll to explore',
    imgAlt: [
      'SAVERA SV-12 Stradale, supercar exterior',
      'SAVERA SV-12 racing cabin, cockpit',
      'SAVERA SV-12 twin-turbo V12 engine',
      'Carbon-fibre chassis and aerodynamics',
    ],
    phases: [
      {
        badge: 'Phase 01 · Cockpit',
        title: 'Gullwing doors',
        body: 'They rise toward the sky and reveal a cabin wrapped in Alcántara. Flat-bottomed racing wheel, curved OLED cluster and haptic control where buttons used to live.',
        specs: [
          { k: 'Wheel', v: 'Racing · flat-bottom' },
          { k: 'Cluster', v: 'Curved 12.3" OLED' },
          { k: 'Trim', v: 'Alcántara & carbon' },
        ],
      },
      {
        badge: 'Phase 02 · V12 Heart',
        title: '6.5L V12 Biturbo',
        body: 'The cover lifts over a forged block that breathes through twelve throats. Instant response, a 9,500 rpm redline and a soundtrack that offers no apologies.',
        specs: [
          { k: 'Power', v: '980 HP' },
          { k: '0–100 km/h', v: '2.5 s' },
          { k: 'Top speed', v: '> 340 km/h' },
        ],
      },
      {
        badge: 'Phase 03 · Chassis & Aero',
        title: 'Carbon-fibre monocoque',
        body: 'A 1,380 kg chassis carved from carbon, a retractable active wing and a dual-plane diffuser. Carbon-ceramic brakes that stop time as much as speed.',
        specs: [
          { k: 'Chassis', v: 'Carbon monocoque' },
          { k: 'Brakes', v: 'Carbon-ceramic' },
          { k: 'Aero', v: 'Active wing' },
        ],
      },
    ],
    manifesto: {
      eyebrow: 'Manifesto',
      title: 'We do not chase the record. We chase the feeling of being alive at 300 km/h.',
      paras: [
        'Founded in 1963 at the foot of the Apennines, SAVERA was born from one simple, dangerous obsession: that a machine could make you feel. Every SV-12 is hand-assembled in Maranello by twelve craftsmen who sign the block before it is sealed.',
        'We do not build cars in series. We build chapters. The SV-12 Stradale is the latest: 199 units, twelve cylinders breathing the air of Emilia-Romagna, and a single promise — that no corner will ever feel the same again.',
      ],
      sign: 'Ettore Savera · Founder',
    },
    telemetry: {
      eyebrow: 'Telemetry',
      title: 'Performance, measured on track',
      sub: 'Figures verified at the Nardò proving ground. Slick tyres, half tank, factory driver.',
      metrics: [
        { to: 2.5, decimals: 1, suffix: ' s', label: '0–100 km/h' },
        { to: 6.9, decimals: 1, suffix: ' s', label: '0–200 km/h' },
        { to: 9.7, decimals: 1, suffix: ' s', label: 'Quarter mile' },
        { to: 1.6, decimals: 1, suffix: ' g', label: 'Lateral acceleration' },
        { to: 342, suffix: ' km/h', label: 'Top speed' },
        { to: 390, suffix: ' kg', label: 'Downforce @ 250 km/h' },
      ],
    },
    wheel: {
      eyebrow: 'Engineering · Running gear',
      title: 'Forged 21″ monobloc wheel',
      body: 'A single piece of forged alloy, machined from a solid billet to strip 3.2 kg of unsprung mass per corner. Behind it, the 410 mm carbon-ceramic disc and the six-piston monobloc caliper in Rosso Corsa.',
      points: [
        { k: 'Size', v: '21″ · forged monobloc' },
        { k: 'Disc', v: 'Carbon-ceramic 410 mm' },
        { k: 'Caliper', v: 'Monobloc · 6 pistons' },
        { k: 'Unsprung mass', v: '−3.2 kg per corner' },
      ],
      hint: 'Forged 21″ wheel · carbon-ceramic disc',
    },
    editions: {
      eyebrow: 'Editions',
      title: 'Three readings of the same instinct',
      sub: 'From open tarmac to the apex of the track. Each edition redraws the balance between comfort and pure intent.',
      cta: 'Configure',
      items: [
        {
          name: 'Stradale',
          tag: 'Road Grand Tourer',
          price: 'from € 2.4 M',
          tagline: 'The SV-12 at its most liveable, without surrendering an ounce of theatre.',
          specs: [
            { k: 'Power', v: '980 HP' },
            { k: 'Dry weight', v: '1,380 kg' },
            { k: '0–100 km/h', v: '2.5 s' },
            { k: 'Units', v: '199' },
          ],
        },
        {
          name: 'Corsa',
          tag: 'Track-homologated',
          price: 'from € 3.1 M',
          tagline: 'Fixed aero, ride-height adjustable suspension and 50 kg less. Built for the clock.',
          specs: [
            { k: 'Power', v: '1,030 HP' },
            { k: 'Dry weight', v: '1,290 kg' },
            { k: '0–100 km/h', v: '2.3 s' },
            { k: 'Units', v: '99' },
          ],
        },
        {
          name: 'Edizione',
          tag: 'Anniversary Series',
          price: 'on request',
          tagline: 'Full exposed-carbon body and a hand-painted livery. The definitive expression.',
          specs: [
            { k: 'Power', v: '1,030 HP' },
            { k: 'Dry weight', v: '1,270 kg' },
            { k: 'Downforce', v: '+18%' },
            { k: 'Units', v: '40' },
          ],
        },
      ],
    },
    tech: {
      eyebrow: 'Technology',
      title: 'Engineering without shortcuts',
      sub: 'Six systems that turn 980 horsepower into choreography, not chaos.',
      items: [
        { icon: 'aero', title: 'Active aerodynamics', body: 'Rear wing and floor flaps that reconfigure in 0.2 s based on speed, steering angle and braking.' },
        { icon: 'engine', title: 'V12 6.5L biturbo', body: 'Forged aluminium block, a 9,500 rpm redline and two low-inertia turbos. 980 HP delivered with a voice of its own.' },
        { icon: 'gearbox', title: '8-speed DCT', body: 'Dual-clutch with 40 ms shifts and a predictive strategy tied to the loaded circuit GPS.' },
        { icon: 'brake', title: 'Carbon-ceramic brakes', body: '410/390 mm discs with closed-channel cooling. Zero fade after endurance laps.' },
        { icon: 'vector', title: 'Torque vectoring', body: 'Per-wheel torque split via electronic differential and selective braking. The car turns with you, not against you.' },
        { icon: 'chassis', title: 'Carbon monocoque', body: 'A 1,380 kg fibre cell with aluminium subframes. Torsional rigidity 22% higher than the previous generation.' },
      ],
    },
    atelier: {
      eyebrow: 'Atelier Savera',
      title: 'Yours, down to the last thread',
      sub: 'A personalisation programme with no closed catalogue. If you can imagine it, our workshop can carve it.',
      groups: [
        { title: 'Paint', items: ['Historic Rosso Corsa', 'Matte Grigio Nardò', 'Metallic Blu Notte', 'Bespoke sample (your colour)'] },
        { title: 'Cabin', items: ['Two-tone Alcántara', 'Vegetable-tanned leather', 'Matching harness belts', 'Monogram embroidery'] },
        { title: 'Fibre & details', items: ['Satin exposed carbon', 'Forged carbon', 'Polished titanium', 'Engraved numbered plate'] },
        { title: 'Dynamics', items: ['Corsa track kit', 'Ride-height adjustable suspension', 'Titanium exhaust', 'Bespoke forged wheels'] },
      ],
    },
    fullspec: {
      eyebrow: 'Full technical sheet',
      title: 'Every bolt, documented',
      sub: 'SAVERA SV-12 Stradale · 2026 European homologation specification.',
      groups: [
        {
          title: 'Engine',
          rows: [
            { k: 'Architecture', v: 'V12 60° biturbo' },
            { k: 'Displacement', v: '6,498 cc' },
            { k: 'Max power', v: '980 HP @ 9,000 rpm' },
            { k: 'Max torque', v: '760 Nm @ 6,500 rpm' },
            { k: 'Redline', v: '9,500 rpm' },
          ],
        },
        {
          title: 'Transmission',
          rows: [
            { k: 'Gearbox', v: '8-speed dual-clutch DCT' },
            { k: 'Drive', v: 'Rear + torque vectoring' },
            { k: 'Differential', v: 'Electronic E-Diff' },
          ],
        },
        {
          title: 'Chassis & brakes',
          rows: [
            { k: 'Structure', v: 'Carbon-fibre monocoque' },
            { k: 'Suspension', v: 'Double wishbone, adaptive damping' },
            { k: 'Front brakes', v: 'Carbon-ceramic 410 mm, 6-piston' },
            { k: 'Rear brakes', v: 'Carbon-ceramic 390 mm, 4-piston' },
            { k: 'Tyres', v: '265/35 ZR21 · 325/30 ZR21' },
          ],
        },
        {
          title: 'Dimensions & weights',
          rows: [
            { k: 'Length', v: '4,710 mm' },
            { k: 'Wheelbase', v: '2,700 mm' },
            { k: 'Dry weight', v: '1,380 kg' },
            { k: 'Weight distribution', v: '41 / 59 %' },
            { k: 'Fuel tank', v: '78 L' },
          ],
        },
        {
          title: 'Performance',
          rows: [
            { k: '0–100 km/h', v: '2.5 s' },
            { k: '0–200 km/h', v: '6.9 s' },
            { k: 'Top speed', v: '> 340 km/h' },
            { k: 'Downforce @ 250', v: '390 kg' },
          ],
        },
      ],
    },
    owner: {
      eyebrow: 'Owner programme',
      title: 'Handing over the key is the beginning',
      sub: 'Owning a SAVERA means joining a circle. These are a few of its privileges.',
      perks: [
        { title: 'Concierge 24/7', body: 'A dedicated manager, reachable in any time zone, for everything related to your car and your travels.' },
        { title: 'Corso Pilota', body: 'Three annual driving days at FIA-homologated circuits, with factory competition instructors.' },
        { title: 'Warranty & servicing', body: 'Seven years of full coverage and at-home service with a SAVERA technician and engineer.' },
        { title: 'Private atelier', body: 'Reserved access to the Maranello workshop to reconfigure, restore or create a second livery.' },
        { title: 'Cronologia Eventi', body: 'Invitations to world premieres, select auctions and collector gatherings every season.' },
        { title: 'Certificato di Autenticità', body: 'Lifetime registration in the SAVERA historical archive, with traceability of every signed component.' },
      ],
    },
    press: {
      eyebrow: 'Press',
      title: 'What they said as they stepped out',
      quotes: [
        { quote: 'The V12 does not accelerate: it reorders your priorities. I have not driven anything this honest in a decade.', author: 'Marco Devienne', source: 'Corsa & Strada' },
        { quote: 'A hypercar that remembers the goal was never the number, but the smile. The Stradale is a love letter to the road.', author: 'Helena Ward', source: 'Apex Journal' },
        { quote: 'It brakes from 300 with the composure of a road car and turns like a prototype. Engineering witchcraft.', author: 'Takeshi Ono', source: 'Velocità Magazine' },
      ],
    },
    faq: {
      eyebrow: 'Frequently asked',
      title: 'Before you reserve',
      items: [
        { q: 'What is the delivery lead time?', a: 'SV-12 Stradale production is allocated up to 14 months out. Once you confirm the configuration you receive a firm delivery date and access to assembly tracking.' },
        { q: 'Is the car road-legal?', a: 'Yes. The Stradale and Edizione editions meet European and US homologation. The Corsa edition is track-only.' },
        { q: 'How does servicing work?', a: 'Every SAVERA includes seven years of full service. A factory technician and engineer can travel to your home for scheduled maintenance.' },
        { q: 'Can I fully personalise it?', a: 'Atelier Savera works without a closed catalogue: paint, materials, fibre and dynamics are defined with you in a private session in Maranello.' },
        { q: 'Do you offer a dynamic drive?', a: 'Yes. Our concierge arranges a circuit driving day before any purchase commitment.' },
        { q: 'Is financing or leasing available?', a: 'SAVERA Financial Services offers bespoke schemes, including collection leasing and guaranteed residual-value plans.' },
      ],
    },
    specsEyebrow: 'Technical sheet',
    specsTitle: 'The numbers behind the myth',
    specsSub: 'Every figure is an engineering decision. None of them is an accident.',
    specCards: [
      { label: 'Power', value: '980', unit: 'HP @ 9,000 rpm', note: '6.5L twin-turbo V12, aluminium block' },
      { label: 'Weight', value: '1,380', unit: 'kg dry', note: 'Carbon-fibre monocoque' },
      { label: 'Aero', value: '390', unit: 'kg downforce @ 250', note: 'Active wing + dual-plane diffuser' },
      { label: 'Gearbox', value: '8', unit: 'speed DCT', note: 'Dual-clutch, 40 ms shifts' },
    ],
    contactEyebrow: 'VIP Concierge',
    contactTitle: 'Reserve your private encounter',
    contactSub: 'A SAVERA specialist will reach out to arrange a dynamic drive and a bespoke configuration. Seasonal seats are limited.',
    form: { name: 'Full name', email: 'Email address', phone: 'Phone', dealer: 'Dealership / Country', message: 'Tell us what you are after' },
    send: 'Request invitation',
    sending: 'Sending…',
    sent: 'Request received',
    sentNote: 'Thank you. Our concierge will contact you within 24 hours. (Demo — nothing is actually sent.)',
    legal: ['Legal notice', 'Privacy', 'Cookies'],
    rights: '© 2026 SAVERA GT. Fictional brand. All rights reserved.',
    builtBy: 'Demo built by MS Tech Stack',
  },
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
/* opacidad triangular: sube a→b, mantiene b→c, baja c→d */
const winOp = (p: number, a: number, b: number, c: number, d: number) => {
  if (p <= a || p >= d) return 0
  if (p < b) return (p - a) / (b - a)
  if (p > c) return 1 - (p - c) / (d - c)
  return 1
}

const glassCard: CSSProperties = {
  background: 'linear-gradient(150deg, rgba(26,26,30,.72), rgba(11,11,11,.6))',
  border: '1px solid rgba(255,255,255,.14)',
  borderRadius: 20,
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  boxShadow: '0 30px 80px -40px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.08)',
}

const Social = ({ d, label }: { d: string; label: string }) => (
  <a href="#top" aria-label={label} className="sv-social" style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(245,245,247,.7)' }}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
  </a>
)
const IG = 'M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.3.07 1.68.07 4.9s0 3.6-.07 4.9c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.3.06-1.68.07-4.9.07s-3.6 0-4.9-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.98c-3.15 0-3.52.01-4.76.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7-.06 1.24-.07 1.6-.07 4.76s.01 3.52.07 4.76c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.6.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.6.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32-1.24-.06-1.6-.07-4.76-.07Zm0 3.37a4.45 4.45 0 1 1 0 8.9 4.45 4.45 0 0 1 0-8.9Zm0 7.34a2.89 2.89 0 1 0 0-5.78 2.89 2.89 0 0 0 0 5.78Zm5.66-7.55a1.04 1.04 0 1 1-2.08 0 1.04 1.04 0 0 1 2.08 0Z'
const YT = 'M23.5 6.5a3 3 0 0 0-2.11-2.13C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.39.51A3 3 0 0 0 .5 6.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.5 3 3 0 0 0 2.11 2.13c1.89.51 9.39.51 9.39.51s7.5 0 9.39-.51a3 3 0 0 0 2.11-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z'
const X = 'M18.9 2H22l-7.1 8.1L23.3 22h-6.6l-5.2-6.8L5.6 22H2.5l7.6-8.7L1 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z'
const LI = 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z'

/* Contador 0→valor al entrar en viewport. Animación FINITA (una vez, rAF con easing),
   no un loop infinito. Respeta prefers-reduced-motion: muestra el valor final directo. */
function Counter({ to, decimals = 0, prefix = '', suffix = '', lang }: { to: number; decimals?: number; prefix?: string; suffix?: string; lang: DemoLang }) {
  const ref = useRef<HTMLSpanElement>(null)
  const nf = useMemo(
    () => new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [lang, decimals],
  )
  const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(to); return }
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const dur = 1400
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(to * eased)
        if (p < 1) raf = requestAnimationFrame(tick)
        else setVal(to)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to])
  // Sizer invisible que FIJA la caja (ancho + salto de línea) para que la cuenta no
  // reflowee cada frame. Syncopate no tiene cifras tabulares y sus dígitos varían mucho
  // de ancho ('0' es el más ancho, '1' el más angosto), así que reservar el valor FINAL
  // no basta: un intermedio como "288" es más ancho que "342" y se desbordaba. Reservamos
  // con '0' en cada posición → la caja cubre CUALQUIER combinación de dígitos del rango.
  const finalStr = `${prefix}${nf.format(to)}${suffix}`
  const sizerStr = finalStr.replace(/[0-9]/g, '0')
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* accesible: valor final real para lectores de pantalla */}
      <span style={SR_ONLY}>{finalStr}</span>
      {/* reserva el máximo ancho posible (dígitos '0'), invisible */}
      <span aria-hidden style={{ opacity: 0 }}>{sizerStr}</span>
      {/* valor animado, absoluto encima — nunca afecta el layout */}
      <span aria-hidden style={{ position: 'absolute', inset: 0 }}>{prefix}{nf.format(val)}{suffix}</span>
    </span>
  )
}

/* Card con tilt 3D real siguiendo el puntero (perspective + rotateX/Y). Solo ratón:
   `pointermove` también dispara con el dedo, así que filtramos por pointerType para
   no meter re-renders durante el scroll táctil; sin `pointerleave` en touch, el reset
   viviría trabado. Las capas internas con translateZ dan el parallax. */
function Tilt({ children, style, className, ...rest }: { children: ReactNode; style?: CSSProperties; className?: string } & Record<string, unknown>) {
  const [t, setT] = useState({ rx: 0, ry: 0, hover: false })
  const [gp, setGp] = useState({ x: '50%', y: '50%' })
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setGp({ x: `${(px * 100).toFixed(1)}%`, y: `${(py * 100).toFixed(1)}%` })
    setT({ rx: (0.5 - py) * 9, ry: (px - 0.5) * 11, hover: true })
  }
  const onLeave = () => setT({ rx: 0, ry: 0, hover: false })
  return (
    <div
      {...rest}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: t.hover
          ? `perspective(1000px) rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(2)}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s',
        ...style,
      }}
    >
      <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', background: `radial-gradient(circle 320px at ${gp.x} ${gp.y}, rgba(229,9,20,.22), transparent 60%)`, opacity: t.hover ? 1 : 0, transition: 'opacity .3s', zIndex: 2 }} />
      {children}
    </div>
  )
}

const TECH_PATHS: Record<TechIconName, string> = {
  aero: 'M3 8h18M6 8c0 4 3 6 6 9M18 8c0 4-3 6-6 9M3 14h6M15 14h6',
  engine: 'M4 9v6M4 12h3l2-3h4l2 3h3a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-3M9 9V6h4v3M7 17h6',
  gearbox: 'M12 8v8M8 8v4a4 4 0 0 0 4 4M16 8v4a4 4 0 0 1-4 4M8 6h0M12 6h0M16 6h0',
  brake: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 3v2M12 19v2M3 12h2M19 12h2',
  vector: 'M12 21V7M12 7l-4 4M12 7l4 4M5 5l2 2M19 5l-2 2',
  chassis: 'M4 17l4-10h8l4 10M7 17l1.5-4h7L17 17M4 17h16M8 17v2M16 17v2',
}
function TechIcon({ name }: { name: TechIconName }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ROSSO} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={TECH_PATHS[name]} />
    </svg>
  )
}

export default function SaveraClient({ lang }: { lang: DemoLang }) {
  const c = CONTENT[lang]
  const rootEl = useRef<HTMLDivElement>(null)
  const trackEl = useRef<HTMLElement>(null)
  const stageEl = useRef<HTMLDivElement>(null)

  const [reduced, setReduced] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')


  useEffect(() => {
    const host = rootEl.current
    if (!host) return
    const r = host.style
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(rm)

    // Reduced-motion: sin scroll-driving. Hero fijo, track colapsado a una pantalla y
    // las fases se muestran como secciones apiladas normales (cada foto con su card).
    if (rm) {
      if (trackEl.current) trackEl.current.style.height = '100svh'
      r.setProperty('--heroText', '1')
      r.setProperty('--hint', '0')
      r.setProperty('--o0', '1')
      return
    }

    let ticking = false
    const update = () => {
      const t = trackEl.current
      if (!t) return
      // Altura del stage sticky REAL (svh constante), no innerHeight: en móvil la barra
      // de URL cambia innerHeight a mitad de scroll y desincroniza el progreso.
      const stageH = stageEl.current?.offsetHeight || window.innerHeight
      const total = t.offsetHeight - stageH
      const scrolled = Math.min(Math.max(-t.getBoundingClientRect().top, 0), Math.max(total, 1))
      const p = total > 0 ? scrolled / total : 0
      // opacidad de las 4 fotos (cross-fade encadenado)
      r.setProperty('--o0', (1 - ramp(p, 0.2, 0.28)).toFixed(3))
      r.setProperty('--o1', winOp(p, 0.2, 0.28, 0.46, 0.54).toFixed(3))
      r.setProperty('--o2', winOp(p, 0.46, 0.54, 0.7, 0.78).toFixed(3))
      r.setProperty('--o3', ramp(p, 0.7, 0.78).toFixed(3))
      // Ken Burns: cada foto crece 1.0→1.08 a lo largo de su permanencia
      r.setProperty('--z0', (1 + ramp(p, 0, 0.3) * 0.08).toFixed(4))
      r.setProperty('--z1', (1 + ramp(p, 0.24, 0.54) * 0.08).toFixed(4))
      r.setProperty('--z2', (1 + ramp(p, 0.5, 0.78) * 0.08).toFixed(4))
      r.setProperty('--z3', (1 + ramp(p, 0.72, 1) * 0.08).toFixed(4))
      // textos
      r.setProperty('--heroText', (1 - ramp(p, 0.04, 0.14)).toFixed(3))
      r.setProperty('--hint', (1 - ramp(p, 0.02, 0.08)).toFixed(3))
      r.setProperty('--c1', winOp(p, 0.28, 0.33, 0.43, 0.48).toFixed(3))
      r.setProperty('--c2', winOp(p, 0.54, 0.59, 0.67, 0.72).toFixed(3))
      r.setProperty('--c3', winOp(p, 0.78, 0.83, 0.93, 0.98).toFixed(3))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { update(); ticking = false })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    // Reveal progresivo de las secciones normales
    const reveals = [...host.querySelectorAll<HTMLElement>('[data-reveal]')]
    reveals.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)'
    })
    const rio = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          ;(en.target as HTMLElement).style.opacity = '1'
          ;(en.target as HTMLElement).style.transform = 'none'
          rio.unobserve(en.target)
        }
      })
    }, { threshold: 0.14 })
    reveals.forEach((el) => rio.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      rio.disconnect()
    }
  }, [])

  const onSubmit = (e: FormEvent) => {
    // Mock: como el resto de demos, NO cablea envío real. Simula latencia y confirma.
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1100)
  }

  const op = (v: string, fb = 0): CSSProperties => ({ opacity: `var(${v},${fb})` as unknown as number })

  return (
    <div ref={rootEl} id="top" style={{ position: 'relative', background: CARBON, color: CHALK, fontFamily: "'Inter',system-ui,sans-serif", overflowX: 'clip' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" />
      <style>{`
        @keyframes svDot { 0%{transform:translateY(0);opacity:0} 30%{opacity:1} 70%{opacity:1} 100%{transform:translateY(18px);opacity:0} }
        .sv-social{ transition: color .25s, border-color .25s, background .25s }
        .sv-social:hover{ color:#fff; border-color:${ROSSO}; background:rgba(229,9,20,.12) }
        .sv-cta{ transition: box-shadow .3s, transform .2s, background .3s }
        .sv-cta:hover{ transform:translateY(-2px); box-shadow:0 16px 40px -12px rgba(229,9,20,.7); background:${ROSSO_HOT} }
        .sv-spec{ transition: transform .45s cubic-bezier(.16,1,.3,1), border-color .45s, box-shadow .45s }
        .sv-spec:hover{ transform:translateY(-8px); border-color:rgba(229,9,20,.5); box-shadow:0 26px 60px -30px rgba(229,9,20,.5) }
        .sv-nav a{ transition: color .2s } .sv-nav a:hover{ color:#fff }
        .sv-input{ transition: border-color .2s, background .2s }
        .sv-input:focus{ border-color:${ROSSO}; background:rgba(255,255,255,.05); outline:none }
        .sv-input::placeholder{ color:rgba(245,245,247,.4) }
        .sv-img{ object-fit:cover }
        .sv-edition{ transition: border-color .4s, box-shadow .4s }
        .sv-tech{ transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, background .4s }
        .sv-tech:hover{ transform:translateY(-6px); border-color:rgba(229,9,20,.4); background:rgba(255,255,255,.03) }
        .sv-specrow{ transition: background .25s } .sv-specrow:hover{ background:rgba(255,255,255,.03) }
        .sv-perk{ transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .4s } .sv-perk:hover{ transform:translateY(-5px); border-color:rgba(229,9,20,.35) }
        .sv-faq summary{ cursor:pointer; list-style:none } .sv-faq summary::-webkit-details-marker{ display:none }
        .sv-faq[open] .sv-faq-x{ transform:rotate(45deg) }
        @media (max-width:820px){ .sv-desknav{ display:none!important } .sv-menu-btn{ display:flex!important } .sv-phase-card{ right:16px!important; left:16px!important; max-width:none!important; width:auto!important } .sv-specgrid{ grid-template-columns:1fr 1fr!important } .sv-contact-grid{ grid-template-columns:1fr!important } .sv-telemetry{ grid-template-columns:1fr 1fr!important } .sv-wheel-grid{ grid-template-columns:1fr!important } .sv-editions{ grid-template-columns:1fr!important } .sv-techgrid{ grid-template-columns:1fr!important } .sv-atelier{ grid-template-columns:1fr!important } .sv-fullspec{ grid-template-columns:1fr!important } .sv-owner{ grid-template-columns:1fr!important } .sv-press{ grid-template-columns:1fr!important } .sv-wheel-canvas{ height:360px!important; order:-1 } }
        @media (max-width:560px){ .sv-telemetry{ grid-template-columns:1fr!important } .sv-specgrid{ grid-template-columns:1fr!important } .sv-form-row{ grid-template-columns:1fr!important } }
        @media (min-width:821px){ .sv-menu-btn{ display:none!important } }
      `}</style>

      {/* ---------------- TOP BAR ---------------- */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px clamp(18px,4vw,44px)', background: 'rgba(11,11,11,.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: ROSSO, transform: 'rotate(45deg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 9, height: 9, background: CARBON, transform: 'rotate(-45deg)' }} />
          </span>
          <span style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '.28em', paddingLeft: '.28em', color: CHALK }}>SAVERA</span>
        </a>
        <nav className="sv-nav sv-desknav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#editions" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.models}</a>
          <a href="#engineering" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.engineering}</a>
          <a href="#owner" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.experience}</a>
          <a href="#contact" style={{ fontSize: 13, letterSpacing: '.06em', color: 'rgba(245,245,247,.7)' }}>{c.nav.contact}</a>
          <a href="#contact" className="sv-cta" style={{ fontSize: 12.5, letterSpacing: '.08em', fontWeight: 600, color: CHALK, background: ROSSO, padding: '11px 22px', borderRadius: 100 }}>{c.cta}</a>
        </nav>
        <button className="sv-menu-btn" onClick={() => setMenuOpen((s) => !s)} aria-label="Menu" aria-expanded={menuOpen} style={{ display: 'none', width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,.14)', color: CHALK, alignItems: 'center', justifyContent: 'center' }}>
          {menuOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>}
        </button>
        {menuOpen && (
          <div style={{ position: 'absolute', top: 62, right: 16, minWidth: 210, ...glassCard, padding: 10, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 90 }}>
            {[c.nav.models, c.nav.engineering, c.nav.experience, c.nav.contact].map((label, i) => (
              <a key={i} href={['#editions', '#engineering', '#owner', '#contact'][i]} onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(245,245,247,.8)', padding: '12px 14px', borderRadius: 10 }}>{label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, textAlign: 'center', fontWeight: 600, color: CHALK, background: ROSSO, padding: '12px', borderRadius: 100, marginTop: 6 }}>{c.cta}</a>
          </div>
        )}
      </header>

      {/* ---------------- SCROLL CINEMATOGRÁFICO (fotos reales) ---------------- */}
      {!reduced && (
        <section ref={trackEl} style={{ position: 'relative', height: '460svh', background: CARBON }}>
          <div ref={stageEl} style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden', background: CARBON }}>
            {/* Capas de foto: cross-fade por --o{n}, Ken Burns por --z{n}. next/image fill. */}
            {STAGE_IMG.map((src, i) => (
              <div key={i} style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `scale(var(--z${i},1))`, transformOrigin: KB_ORIGIN[i], willChange: 'transform, opacity', ...op(`--o${i}`, i === 0 ? 1 : 0) }}>
                <Image
                  src={src}
                  alt={c.imgAlt[i]}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  quality={80}
                  className="sv-img"
                />
              </div>
            ))}
            {/* overlay para legibilidad del texto */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(11,11,11,.5) 0%, rgba(11,11,11,.15) 35%, rgba(11,11,11,.55) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(120% 100% at 50% 50%, transparent 45%, rgba(0,0,0,.6) 100%)' }} />

            {/* HERO TEXT */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none', padding: '0 20px', ...op('--heroText', 1) }}>
              <h1 style={{ margin: 0, fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 'clamp(38px,8.5vw,120px)', letterSpacing: '.14em', paddingLeft: '.14em', lineHeight: 1, color: CHALK, textShadow: '0 6px 50px rgba(0,0,0,.7)' }}>SAVERA GT</h1>
              <div style={{ marginTop: 18, fontSize: 'clamp(12px,1.5vw,17px)', letterSpacing: '.42em', textTransform: 'uppercase', color: ROSSO }}>{c.heroTagline}</div>
              <p style={{ maxWidth: 560, margin: '26px auto 0', fontSize: 'clamp(14px,1.4vw,16px)', lineHeight: 1.75, color: 'rgba(245,245,247,.82)', fontWeight: 300, textShadow: '0 2px 20px rgba(0,0,0,.7)' }}>{c.heroSub}</p>
              <div style={{ marginTop: 14, fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.3em', color: 'rgba(245,245,247,.6)' }}>{c.heroModel}</div>
            </div>

            {/* SCROLL HINT */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, pointerEvents: 'none', ...op('--hint', 1) }}>
              <span style={{ fontSize: 10.5, letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(245,245,247,.8)' }}>{c.scrollHint}</span>
              <div style={{ width: 24, height: 40, border: '1px solid rgba(245,245,247,.45)', borderRadius: 14, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '50%', top: 7, transform: 'translateX(-50%)', width: 3, height: 7, borderRadius: 3, background: ROSSO, animation: 'svDot 1.8s ease-in-out infinite' }} />
              </div>
            </div>

            {/* PHASE CARDS (glassmorphism, opacidad por CSS var — no re-render) */}
            {c.phases.map((ph, i) => (
              <div key={i} className="sv-phase-card" style={{ position: 'absolute', right: 'clamp(20px,5vw,72px)', top: '50%', transform: 'translateY(-50%)', maxWidth: 380, width: '42vw', padding: 30, ...glassCard, pointerEvents: 'none', ...op(['--c1', '--c2', '--c3'][i]) }}>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 10.5, letterSpacing: '.24em', color: ROSSO, marginBottom: 16 }}>{ph.badge}</div>
                <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 600, lineHeight: 1.1, margin: '0 0 14px', letterSpacing: '-.01em' }}>{ph.title}</h2>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,245,247,.72)', fontWeight: 300, margin: '0 0 22px' }}>{ph.body}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 18 }}>
                  {ph.specs.map((s) => (
                    <div key={s.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
                      <span style={{ fontSize: 12.5, color: 'rgba(245,245,247,.5)', letterSpacing: '.03em' }}>{s.k}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: CHALK }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reduced-motion: hero fijo + fases como secciones apiladas normales (foto + card) */}
      {reduced && (
        <>
          <section style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: CARBON }}>
            <Image src={HERO_IMG} alt={c.imgAlt[0]} fill priority sizes="100vw" quality={80} className="sv-img" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,11,11,.5), rgba(11,11,11,.2) 40%, rgba(11,11,11,.6))' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
              <h1 style={{ margin: 0, fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 'clamp(38px,8.5vw,120px)', letterSpacing: '.14em', paddingLeft: '.14em', lineHeight: 1, color: CHALK, textShadow: '0 6px 50px rgba(0,0,0,.7)' }}>SAVERA GT</h1>
              <div style={{ marginTop: 18, fontSize: 'clamp(12px,1.5vw,17px)', letterSpacing: '.42em', textTransform: 'uppercase', color: ROSSO }}>{c.heroTagline}</div>
              <p style={{ maxWidth: 560, margin: '26px auto 0', fontSize: 'clamp(14px,1.4vw,16px)', lineHeight: 1.75, color: 'rgba(245,245,247,.82)', fontWeight: 300 }}>{c.heroSub}</p>
              <div style={{ marginTop: 14, fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.3em', color: 'rgba(245,245,247,.6)' }}>{c.heroModel}</div>
            </div>
          </section>
          {c.phases.map((ph, i) => (
            <section key={i} style={{ position: 'relative', minHeight: '80svh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', background: CARBON }}>
              <Image src={PHASE_IMG[i]} alt={c.imgAlt[i + 1]} fill sizes="100vw" quality={80} className="sv-img" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,11,11,.3), rgba(11,11,11,.7))' }} />
              <div className="sv-phase-card" style={{ position: 'relative', margin: 'clamp(20px,4vw,48px)', maxWidth: 420, padding: 30, ...glassCard }}>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 10.5, letterSpacing: '.24em', color: ROSSO, marginBottom: 16 }}>{ph.badge}</div>
                <h2 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 14px' }}>{ph.title}</h2>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,245,247,.72)', fontWeight: 300, margin: '0 0 22px' }}>{ph.body}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 18 }}>
                  {ph.specs.map((s) => (
                    <div key={s.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
                      <span style={{ fontSize: 12.5, color: 'rgba(245,245,247,.5)' }}>{s.k}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: CHALK }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </>
      )}

      {/* ---------------- MANIFIESTO / HERENCIA (editorial) ---------------- */}
      <section id="manifesto" style={{ position: 'relative', padding: 'clamp(90px,12vw,160px) clamp(18px,5vw,44px)', background: 'radial-gradient(120% 80% at 50% 0%, #141418, #0b0b0b 70%)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div data-reveal style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.32em', color: ROSSO, marginBottom: 28, textAlign: 'center' }}>{c.manifesto.eyebrow}</div>
          <h2 data-reveal style={{ fontSize: 'clamp(28px,4.6vw,58px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.14, margin: '0 auto 52px', textAlign: 'center', maxWidth: '20ch', textWrap: 'balance' as CSSProperties['textWrap'] }}>{c.manifesto.title}</h2>
          <div data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(28px,4vw,56px)', maxWidth: 820, margin: '0 auto' }}>
            {c.manifesto.paras.map((p, i) => (
              <p key={i} style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(245,245,247,.66)', fontWeight: 300, margin: 0 }}>{p}</p>
            ))}
          </div>
          <div data-reveal style={{ marginTop: 44, textAlign: 'center', fontFamily: "'Syncopate',sans-serif", fontSize: 11.5, letterSpacing: '.2em', color: 'rgba(245,245,247,.5)' }}>— {c.manifesto.sign}</div>
        </div>
      </section>

      {/* ---------------- SPECS GRID ---------------- */}
      <section id="specs" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: 'linear-gradient(180deg,#0b0b0b,#111114)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.specsEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 16px', maxWidth: '16ch' }}>{c.specsTitle}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 520, margin: 0 }}>{c.specsSub}</p>
          </div>
          <div className="sv-specgrid" data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {c.specCards.map((s) => (
              <div key={s.label} className="sv-spec" style={{ padding: 28, borderRadius: 18, background: 'linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))', border: '1px solid rgba(255,255,255,.1)', minHeight: 220, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 10.5, letterSpacing: '.2em', color: 'rgba(245,245,247,.55)', marginBottom: 'auto' }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 24 }}>
                  <span style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 'clamp(34px,4.4vw,50px)', color: CHALK, lineHeight: 1 }}>{s.value}</span>
                </div>
                <div style={{ fontSize: 13, color: ROSSO, fontWeight: 500, marginTop: 8, letterSpacing: '.02em' }}>{s.unit}</div>
                <div style={{ fontSize: 13, color: 'rgba(245,245,247,.5)', marginTop: 12, lineHeight: 1.5, fontWeight: 300 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TELEMETRÍA (contadores animados) ---------------- */}
      <section style={{ position: 'relative', padding: 'clamp(80px,10vw,120px) clamp(18px,5vw,44px)', background: '#111114', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.telemetry.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 16px', maxWidth: '18ch' }}>{c.telemetry.title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 560, margin: 0 }}>{c.telemetry.sub}</p>
          </div>
          <div className="sv-telemetry" data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, overflow: 'hidden' }}>
            {c.telemetry.metrics.map((m, i) => (
              <div key={i} style={{ background: '#0d0d10', padding: 'clamp(26px,3.4vw,42px)', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150 }}>
                <span style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 'clamp(30px,4vw,46px)', color: CHALK, lineHeight: 1 }}>
                  <Counter to={m.to} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} lang={lang} />
                </span>
                <span style={{ fontSize: 13.5, color: 'rgba(245,245,247,.55)', letterSpacing: '.02em', marginTop: 'auto' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- RIN (foto real, next/image) ---------------- */}
      <section id="engineering" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: 'radial-gradient(90% 90% at 70% 40%, #17171c, #0a0a0c 72%)', overflow: 'hidden' }}>
        <div className="sv-wheel-grid" style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(30px,5vw,70px)', alignItems: 'center' }}>
          <div data-reveal>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.wheel.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.08, margin: '0 0 20px' }}>{c.wheel.title}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(245,245,247,.64)', fontWeight: 300, maxWidth: 460, margin: '0 0 30px' }}>{c.wheel.body}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 460 }}>
              {c.wheel.points.map((p) => (
                <div key={p.k} style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(245,245,247,.5)', letterSpacing: '.03em', marginBottom: 6 }}>{p.k}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: CHALK }}>{p.v}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Foto real de rin/freno (next/image lazy) — reemplazó al rin 3D procedural. */}
          <div data-reveal className="sv-wheel-canvas" style={{ position: 'relative', height: 480, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', background: CARBON, boxShadow: '0 40px 90px -50px rgba(0,0,0,.9)' }}>
            <Image src={WHEEL_IMG} alt={c.wheel.title} fill sizes="(max-width:820px) 100vw, 560px" quality={82} className="sv-img" style={{ objectPosition: '55% 50%' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(85% 85% at 55% 42%, transparent 42%, rgba(0,0,0,.5) 100%), linear-gradient(180deg, rgba(11,11,11,.12), rgba(11,11,11,.5))' }} />
            <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 16, textAlign: 'center', fontSize: 10.5, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(245,245,247,.55)', pointerEvents: 'none' }}>{c.wheel.hint}</span>
          </div>
        </div>
      </section>

      {/* ---------------- EDICIONES (cards 3D tilt) ---------------- */}
      <section id="editions" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: 'linear-gradient(180deg,#0a0a0c,#111114)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 56, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.editions.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 auto 16px', maxWidth: '18ch' }}>{c.editions.title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 560, margin: '0 auto' }}>{c.editions.sub}</p>
          </div>
          <div className="sv-editions" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {c.editions.items.map((ed, i) => (
              <div key={ed.name} data-reveal>
                <Tilt className="sv-edition" style={{ height: '100%', ...glassCard, borderRadius: 22, padding: 'clamp(24px,2.6vw,34px)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, transform: 'translateZ(38px)' }}>
                    <span style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 10, letterSpacing: '.2em', color: ROSSO }}>0{i + 1} · {ed.tag}</span>
                    <span style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 'clamp(22px,2.6vw,30px)', fontWeight: 700, color: CHALK }}>{ed.name}</span>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 15, fontWeight: 500, color: CHALK, letterSpacing: '.01em', transform: 'translateZ(30px)' }}>{ed.price}</div>
                  <p style={{ margin: '14px 0 22px', fontSize: 14, lineHeight: 1.65, color: 'rgba(245,245,247,.62)', fontWeight: 300 }}>{ed.tagline}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 18, marginTop: 'auto' }}>
                    {ed.specs.map((s) => (
                      <div key={s.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
                        <span style={{ fontSize: 12.5, color: 'rgba(245,245,247,.5)' }}>{s.k}</span>
                        <span style={{ fontSize: 13.5, fontWeight: 500, color: CHALK }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#contact" className="sv-cta" style={{ marginTop: 22, textAlign: 'center', fontSize: 12.5, letterSpacing: '.06em', fontWeight: 600, color: CHALK, background: ROSSO, padding: '12px 20px', borderRadius: 100, transform: 'translateZ(24px)' }}>{c.editions.cta}</a>
                </Tilt>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TECNOLOGÍA / INGENIERÍA ---------------- */}
      <section style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: '#0b0b0b' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.tech.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 16px', maxWidth: '16ch' }}>{c.tech.title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 560, margin: 0 }}>{c.tech.sub}</p>
          </div>
          <div className="sv-techgrid" data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {c.tech.items.map((it) => (
              <div key={it.title} className="sv-tech" style={{ padding: 28, borderRadius: 18, background: 'rgba(255,255,255,.015)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(229,9,20,.1)', border: '1px solid rgba(229,9,20,.25)', marginBottom: 22 }}>
                  <TechIcon name={it.icon} />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 600, margin: '0 0 10px', letterSpacing: '-.01em' }}>{it.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(245,245,247,.58)', fontWeight: 300, margin: 0 }}>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ATELIER / PERSONALIZACIÓN ---------------- */}
      <section style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: 'linear-gradient(180deg,#0b0b0b,#141418)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.atelier.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 16px', maxWidth: '16ch' }}>{c.atelier.title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 560, margin: 0 }}>{c.atelier.sub}</p>
          </div>
          <div className="sv-atelier" data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {c.atelier.groups.map((g) => (
              <div key={g.title} style={{ padding: 26, borderRadius: 18, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.1)' }}>
                <h3 style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 12, letterSpacing: '.12em', color: CHALK, margin: '0 0 20px' }}>{g.title}</h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {g.items.map((o) => (
                    <li key={o} style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 14, lineHeight: 1.5, color: 'rgba(245,245,247,.66)', fontWeight: 300 }}>
                      <span style={{ flex: '0 0 auto', width: 5, height: 5, borderRadius: '50%', background: ROSSO, transform: 'translateY(-2px)' }} />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FICHA TÉCNICA COMPLETA ---------------- */}
      <section style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: '#0b0b0b' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.fullspec.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 16px', maxWidth: '16ch' }}>{c.fullspec.title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 560, margin: 0 }}>{c.fullspec.sub}</p>
          </div>
          <div className="sv-fullspec" data-reveal style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,56px) clamp(40px,6vw,80px)' }}>
            {c.fullspec.groups.map((g) => (
              <div key={g.title}>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.16em', color: ROSSO, paddingBottom: 14, marginBottom: 4, borderBottom: '1px solid rgba(229,9,20,.3)' }}>{g.title}</div>
                {g.rows.map((row) => (
                  <div key={row.k} className="sv-specrow" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '14px 8px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <span style={{ fontSize: 14, color: 'rgba(245,245,247,.55)', fontWeight: 300 }}>{row.k}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: CHALK, textAlign: 'right' }}>{row.v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROGRAMA DE PROPIETARIO ---------------- */}
      <section id="owner" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: 'radial-gradient(100% 80% at 30% 0%, #141418, #0b0b0b 70%)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.owner.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 16px', maxWidth: '16ch' }}>{c.owner.title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,.6)', fontWeight: 300, maxWidth: 560, margin: 0 }}>{c.owner.sub}</p>
          </div>
          <div className="sv-owner" data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {c.owner.perks.map((p, i) => (
              <div key={p.title} className="sv-perk" style={{ padding: 28, borderRadius: 18, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 12, color: 'rgba(245,245,247,.35)', marginBottom: 18 }}>0{i + 1}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 10px', letterSpacing: '-.01em' }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(245,245,247,.58)', fontWeight: 300, margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRENSA / TESTIMONIOS ---------------- */}
      <section style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: '#0b0b0b' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.press.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,54px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.05, margin: 0, maxWidth: '16ch' }}>{c.press.title}</h2>
          </div>
          <div className="sv-press" data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {c.press.quotes.map((q) => (
              <figure key={q.author} style={{ margin: 0, padding: 30, borderRadius: 18, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column' }}>
                <div aria-hidden style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 40, lineHeight: 1, color: 'rgba(229,9,20,.55)', marginBottom: 14 }}>&ldquo;</div>
                <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: 'rgba(245,245,247,.8)', fontWeight: 300 }}>{q.quote}</blockquote>
                <figcaption style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: CHALK }}>{q.author}</span>
                  <span style={{ fontSize: 12.5, color: ROSSO, letterSpacing: '.04em' }}>{q.source}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ (crawlable) ---------------- */}
      <section id="faq" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: 'linear-gradient(180deg,#0b0b0b,#0a0a0c)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div data-reveal style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.faq.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,50px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.06, margin: 0 }}>{c.faq.title}</h2>
          </div>
          <div data-reveal>
            {c.faq.items.map((f, i) => (
              <details key={i} className="sv-faq" style={{ borderTop: '1px solid rgba(255,255,255,.1)', ...(i === c.faq.items.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,.1)' } : {}) }}>
                <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '22px 4px', fontSize: 'clamp(16px,2vw,19px)', fontWeight: 500, color: CHALK }}>
                  {f.q}
                  <span className="sv-faq-x" aria-hidden style={{ flex: '0 0 auto', display: 'inline-flex', transition: 'transform .3s', color: ROSSO }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </span>
                </summary>
                <p style={{ margin: '0 4px', padding: '0 0 24px', maxWidth: '64ch', fontSize: 15, lineHeight: 1.75, color: 'rgba(245,245,247,.62)', fontWeight: 300 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTACTO VIP ---------------- */}
      <section id="contact" style={{ position: 'relative', padding: 'clamp(80px,10vw,130px) clamp(18px,5vw,44px)', background: '#0b0b0b', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle,rgba(229,9,20,.16),transparent 68%)', pointerEvents: 'none' }} />
        <div className="sv-contact-grid" data-reveal style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Syncopate',sans-serif", fontSize: 11, letterSpacing: '.28em', color: ROSSO, marginBottom: 18 }}>{c.contactEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,4.4vw,52px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.06, margin: '0 0 20px' }}>{c.contactTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(245,245,247,.62)', fontWeight: 300, maxWidth: 440 }}>{c.contactSub}</p>
          </div>

          {status === 'sent' ? (
            <div style={{ ...glassCard, padding: 'clamp(32px,4vw,48px)', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(229,9,20,.14)', border: `1px solid ${ROSSO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ROSSO} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 12px' }}>{c.sent}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(245,245,247,.65)', fontWeight: 300, margin: 0 }}>{c.sentNote}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ ...glassCard, padding: 'clamp(26px,3.4vw,40px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="sv-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="sv-input" required placeholder={c.form.name} style={inputStyle} />
                <input className="sv-input" required type="email" placeholder={c.form.email} style={inputStyle} />
              </div>
              <div className="sv-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="sv-input" placeholder={c.form.phone} style={inputStyle} />
                <input className="sv-input" placeholder={c.form.dealer} style={inputStyle} />
              </div>
              <textarea className="sv-input" rows={4} placeholder={c.form.message} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              <button type="submit" disabled={status === 'sending'} className="sv-cta" style={{ marginTop: 6, padding: 16, borderRadius: 100, background: ROSSO, color: CHALK, fontSize: 14, fontWeight: 600, letterSpacing: '.06em', fontFamily: "'Syncopate',sans-serif" }}>
                {status === 'sending' ? c.sending : c.send}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,.07)', padding: 'clamp(48px,6vw,72px) clamp(18px,5vw,44px) 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: ROSSO, transform: 'rotate(45deg)' }} />
            <span style={{ fontFamily: "'Syncopate',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '.26em', paddingLeft: '.26em' }}>SAVERA GT</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {c.legal.map((l) => (
              <a key={l} href="#top" style={{ fontSize: 13, color: 'rgba(245,245,247,.55)' }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Social d={IG} label="Instagram" />
            <Social d={YT} label="YouTube" />
            <Social d={X} label="X" />
            <Social d={LI} label="LinkedIn" />
          </div>
        </div>
        <div style={{ maxWidth: 1180, margin: '34px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', fontSize: 12.5, color: 'rgba(245,245,247,.4)' }}>
          <span>{c.rights}</span>
          <span>{c.builtBy}</span>
        </div>
      </footer>
    </div>
  )
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(255,255,255,.03)',
  border: '1px solid rgba(255,255,255,.13)',
  borderRadius: 12,
  color: '#f5f5f7',
  fontSize: 14,
  fontFamily: "'Inter',sans-serif",
}
