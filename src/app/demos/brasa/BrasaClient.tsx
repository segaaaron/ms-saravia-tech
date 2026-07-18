'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import type { DemoLang } from '../lang'

/* ============================================================
   BRASA — Parrilla / cocina cochabambina (demo). Port nativo
   Next.js del diseño original .dc.html, misma info y mismo
   diseño. Imágenes de platos en /showcase/img/menu (public).
   El resto de fotos son de Unsplash (idénticas al original).
   Auth / carrito / cuenta se sincronizan con localStorage
   (prototipo) igual que la fuente, guardado para SSR.
   ============================================================ */

/* ---------------- tipos ---------------- */
interface User { name: string; email: string; phone: string }
interface CartItem { id: string; name: string; price: number; qty: number; cat: string; img: string; note?: string }
interface TabItem { name: string; qty: number; cat: string; price: number; note: string }
interface TabRound { code: string; mode: string; total: number; items: TabItem[]; time: string; table: string }
interface MyRes { code: string; date: string; time: string; party: number; table: string; zone: string }
interface MyOrder { code: string; mode: string; total: number; items: TabItem[]; when: string }
interface ResTable { zone: string; id: string; seats: number }

/* ---------------- helpers ---------------- */
// Precios base están en bolivianos (Bs). Fuera de Bolivia se muestran en USD (conversión
// solo al formatear; la matemática interna del carrito/cuenta sigue en Bs).
import { optimized } from '../unsplash'
import { useLazyBg } from '../useLazyBg'

const BS_PER_USD = 6.9
const usdFromBs = (bs: number) => Math.round(bs / BS_PER_USD)
const moneyFmt = (n: number, locale: string, currency: 'BOB' | 'USD') =>
  currency === 'USD'
    ? '$' + usdFromBs(n).toLocaleString('en-US')
    : 'Bs ' + Math.round(n).toLocaleString(locale)
const img = (id: string, w = 828) => optimized(`https://images.unsplash.com/${id}`, w)

const nowTime = () => {
  const d = new Date()
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
}

/* fecha fija de la fuente (para chips/opciones deterministas) */
const TODAY = new Date('2026-07-03T12:00:00')
const mkDate = (i: number) => {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + i)
  return d
}

/* ---------------- localStorage (prototipo) ---------------- */
type Users = Record<string, { name: string; email: string; phone: string; pass: string; res?: MyRes[]; orders?: MyOrder[] }>
const readUsers = (): Users => { try { return JSON.parse(localStorage.getItem('brasa_users') || '{}') } catch { return {} } }
const writeUsers = (u: Users) => { try { localStorage.setItem('brasa_users', JSON.stringify(u)) } catch { /* noop */ } }
const setSession = (email: string) => { try { localStorage.setItem('brasa_session', email); sessionStorage.removeItem('brasa_demo_logout') } catch { /* noop */ } }
const saveCartLS = (c: CartItem[]) => { try { localStorage.setItem('brasa_cart', JSON.stringify(c)) } catch { /* noop */ } }
const saveTabLS = (t: TabRound[]) => { try { localStorage.setItem('brasa_tab', JSON.stringify(t)) } catch { /* noop */ } }
/* Usuario demo "quemado": el SaaS carga ya con sesión iniciada para que se pueda
   reservar y pedir sin pasar por el registro. Se siembra en brasa_users la primera
   vez y se deja como sesión activa si no hay ninguna. */
const DEMO_USER = { name: 'Camila Rojas', email: 'camila@brasa.bo', phone: '70012345', pass: 'demo' }
const ensureDemoSession = (): string => {
  try {
    const existing = localStorage.getItem('brasa_session')
    if (existing && readUsers()[existing]) return existing
    // Si el usuario cerró sesión a propósito en esta pestaña, NO lo re-logueamos:
    // se respeta el estado guest (para poder mostrar login/registro). El flag vive en
    // sessionStorage → dura hasta cerrar la pestaña; en una visita nueva vuelve el demo.
    if (sessionStorage.getItem('brasa_demo_logout')) return ''
    const users = readUsers()
    if (!users[DEMO_USER.email]) { users[DEMO_USER.email] = { ...DEMO_USER, res: [], orders: [] }; writeUsers(users) }
    localStorage.setItem('brasa_session', DEMO_USER.email)
    return DEMO_USER.email
  } catch { return '' }
}
const pushGlobal = (key: string, obj: unknown) => {
  try {
    const arr = JSON.parse(localStorage.getItem(key) || '[]')
    arr.unshift(obj)
    localStorage.setItem(key, JSON.stringify(arr))
  } catch { /* noop */ }
}
const readMyTable = (user: User | null): string => {
  try {
    if (!user) return ''
    const res = JSON.parse(localStorage.getItem('brasa_reservations') || '[]') as Array<{ email?: string; customer?: string; table?: string }>
    const mine = (res || []).find((r) => r.email && user.email && r.email === user.email) || (res || []).find((r) => r.customer === user.name)
    return mine && mine.table ? mine.table : ''
  } catch { return '' }
}

/* ---------------- QR pseudo-generador ---------------- */
function qrMatrix(seed: number) {
  const N = 25
  const rnd = (i: number) => { const x = Math.sin((seed + i * 12.9898) * 43758.5453); return x - Math.floor(x) }
  const finder = (r: number, c: number, br: number, bc: number): boolean | null => {
    if (r < br || r > br + 6 || c < bc || c > bc + 6) return null
    const dr = r - br, dc = c - bc
    const ring = (dr === 0 || dr === 6 || dc === 0 || dc === 6)
    const core = (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
    return (ring || core)
  }
  const cells: boolean[] = []
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    let v: boolean | null = finder(r, c, 0, 0)
    if (v === null) v = finder(r, c, 0, N - 7)
    if (v === null) v = finder(r, c, N - 7, 0)
    const nearFinder = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8)
    if (v === null) { v = nearFinder ? false : rnd(r * N + c) > 0.52 }
    cells.push(v as boolean)
  }
  return { N, cells }
}
const QR = qrMatrix(7)

function QrGrid({ box }: { box: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${QR.N},1fr)`, width: box, height: box }}>
      {QR.cells.map((on, i) => (
        <span key={i} style={{ background: on ? '#17130f' : 'transparent', width: '100%', aspectRatio: '1' }} />
      ))}
    </div>
  )
}

/* ---------------- iconos (SVG inline, ex-lucide del runtime) ---------------- */
const ICONS: Record<string, ReactNode[]> = {
  flame: [
    <path key="a" d="M12 3s5 4.5 5 9a5 5 0 0 1-10 0c0-1.6.7-2.9 1.4-3.9C9 9.5 9.6 7 12 3z" />,
    <path key="b" d="M12 20a2.4 2.4 0 0 0 2.4-2.4c0-1.6-2.4-3.6-2.4-3.6s-2.4 2-2.4 3.6A2.4 2.4 0 0 0 12 20z" />,
  ],
  sun: [
    <circle key="a" cx={12} cy={12} r={4} />,
    <path key="b" d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />,
  ],
  moon: [<path key="a" d="M20 14.5A8 8 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z" />],
  clock: [<circle key="a" cx={12} cy={12} r={9} />, <path key="b" d="M12 7.5V12l3 2" />],
  grill: [
    <path key="a" d="M4 4v9a8 8 0 0 0 16 0V4" />,
    <path key="b" d="M7 4v6M12 4v6M17 4v6" />,
    <path key="c" d="M9 21l1.5-2M15 21l-1.5-2" />,
  ],
  glass: [<path key="a" d="M6 3h12l-1.5 8a4.5 4.5 0 0 1-9 0z" />, <path key="b" d="M12 15v5" />, <path key="c" d="M8.5 21h7" />],
  chair: [<path key="a" d="M6 3v8h12V3" />, <path key="b" d="M5 11h14" />, <path key="c" d="M7 11l-1 10M17 11l1 10" />, <path key="d" d="M6.5 17h11" />],
  leaf: [<path key="a" d="M4 20C4 10 12 4 20 4c0 10-8 16-16 16z" />, <path key="b" d="M4 20 14 10" />],
  table: [<circle key="a" cx={12} cy={12} r={8} />, <path key="b" d="M12 4v16M4 12h16" />],
  qr: [<path key="a" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />, <path key="b" d="M14 14h3v3h-3zM19 14v6M14 19h6" />],
  users: [<circle key="a" cx={9} cy={8} r={3} />, <path key="b" d="M3.5 20a6 6 0 0 1 11 0" />, <path key="c" d="M16 5.4a3 3 0 0 1 0 5.8" />],
  bag: [<path key="a" d="M6 8h12l-1 12H7z" />, <path key="b" d="M9 8V6a3 3 0 0 1 6 0v2" />],
  plus: [<path key="a" d="M12 5v14M5 12h14" />],
  trash: [<path key="a" d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13h10l1-13" />],
  bike: [<circle key="a" cx={6} cy={18} r={3} />, <circle key="b" cx={18} cy={18} r={3} />, <path key="c" d="M6 18l4-9h5l3 9M9 6h3l2 6" />],
  bagcheck: [<path key="a" d="M6 8h12l-1 12H7z" />, <path key="b" d="M9 8V6a3 3 0 0 1 6 0v2" />, <path key="c" d="M9.5 14l2 2 3.5-4" />],
}
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  )
}

/* hover helper: replica los style-hover del runtime original */
const hover = (base: CSSProperties, over: CSSProperties) => ({
  onMouseEnter: (e: ReactMouseEvent<HTMLElement>) => { Object.assign(e.currentTarget.style, over) },
  onMouseLeave: (e: ReactMouseEvent<HTMLElement>) => { Object.assign(e.currentTarget.style, base) },
})

/* ---------------- datos (verbatim de la fuente) ---------------- */
const turnos: Record<'comida' | 'cena', string[]> = {
  comida: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
  cena: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
}
const takenTimes: Record<string, number> = { '14:00': 1, '21:00': 1, '21:30': 1 }

const zonesData: Array<{ key: string; name: string; icon: string; note: string; tables: Array<{ id: string; seats: number; taken?: boolean }> }> = [
  { key: 'salon', name: 'Salón principal', icon: 'table', note: 'Ambiente cálido junto a la cocina abierta', tables: [
    { id: 'M1', seats: 2 }, { id: 'M2', seats: 2 }, { id: 'M3', seats: 4 }, { id: 'M4', seats: 4, taken: true }, { id: 'M5', seats: 4 }, { id: 'M6', seats: 6 }, { id: 'M7', seats: 2, taken: true }, { id: 'M8', seats: 4 }] },
  { key: 'terraza', name: 'Terraza', icon: 'leaf', note: 'Al aire libre, con braseros', tables: [
    { id: 'T1', seats: 2 }, { id: 'T2', seats: 2 }, { id: 'T3', seats: 4 }, { id: 'T4', seats: 4 }, { id: 'T5', seats: 6, taken: true }, { id: 'T6', seats: 2 }] },
  { key: 'barra', name: 'Barra', icon: 'glass', note: 'Frente al bartender, servicio completo', tables: [
    { id: 'B1', seats: 1 }, { id: 'B2', seats: 1 }, { id: 'B3', seats: 1, taken: true }, { id: 'B4', seats: 1 }, { id: 'B5', seats: 2 }, { id: 'B6', seats: 2 }] },
  { key: 'privado', name: 'Reservado', icon: 'users', note: 'Mesa grande para grupos y eventos', tables: [
    { id: 'P1', seats: 8 }, { id: 'P2', seats: 10, taken: true }] },
]

type Dish = { name: string; price: number; desc: string; img: string; tags: [string, string][] }
const menuData: Record<string, Dish[]> = {
  entrantes: [
    { name: 'Salteñas cochabambinas', price: 18, desc: 'Jugosas de carne o pollo, masa dulce horneada al momento.', img: 'Salteña.jpg', tags: [['Insignia', 'ember']] },
    { name: 'Anticucho de corazón', price: 38, desc: 'Brochetas a la parrilla con papa y salsa de maní.', img: 'Anticucho.jpg', tags: [['A la parrilla', 'ember']] },
    { name: 'Sopa de maní', price: 35, desc: 'El clásico boliviano con carne, papa frita y perejil.', img: 'Sopa de maní.jpg', tags: [] },
    { name: 'Chairo paceño', price: 30, desc: 'Sopa de chuño, cordero y verduras. Reconfortante.', img: 'Chairo paceño.jpg', tags: [] },
    { name: 'Humintas al horno', price: 28, desc: 'Masa de choclo tierno con queso, horneada en hoja.', img: 'Humita.jpg', tags: [['Vegetariano', 'green']] },
  ],
  parrilla: [
    { name: 'Chuleta de cerdo a la BBQ', price: 55, desc: 'Chuleta glaseada, pan, lechuga, tomate, queso y papa frita.', img: 'Churrasco.jpg', tags: [['Insignia', 'ember']] },
    { name: 'Nudos de cordero', price: 65, desc: 'Nudos de cordero al carbón, arroz, papa frita y ensalada.', img: 'Asado de cordero.jpg', tags: [['A la brasa', 'ember']] },
    { name: 'Costillar de cordero', price: 75, desc: 'Costillar asado al fuego lento, arroz y papa frita.', img: 'Asado de cordero.jpg', tags: [['Especialidad', 'ember']] },
    { name: 'Colita de cordero', price: 85, desc: 'Colita de cordero tierna, arroz, papa y ensalada.', img: 'Asado de cordero.jpg', tags: [] },
    { name: 'Brazuelo de cerdo', price: 90, desc: 'Brazuelo horneado hasta desprenderse, con mote y sarza.', img: 'Chicharrón cochabambino.jpg', tags: [['Especialidad', 'ember']] },
    { name: 'Milanesa napolitana', price: 55, desc: 'Milanesa de pollo con jamón y queso, arroz, papa y salsa de tomate.', img: 'Milanesa napolitana.jpg', tags: [] },
    { name: 'Parrillada mixta', price: 180, desc: 'Lomo, pollo, chorizo y morcilla al carbón. Para compartir.', img: 'Parrillada.jpg', tags: [['Para compartir', 'ember']] },
    { name: 'Churrasco de lomo', price: 95, desc: 'Lomo de res a la parrilla, término a elección, con guarnición.', img: 'Churrasco.jpg', tags: [] },
    { name: 'Trucha a la plancha', price: 70, desc: 'Trucha de los lagos, mantequilla de hierbas y papa dorada.', img: 'Trucha frita.jpg', tags: [] },
    { name: 'Chorizo criollo', price: 42, desc: 'Chorizo parrillero con pan y llajua de la casa.', img: 'Chorizo.jpg', tags: [] },
  ],
  principales: [
    { name: 'Silpancho cochabambino', price: 55, desc: 'Milanesa fina sobre arroz y papa, huevo frito y sarza.', img: 'Silpancho cochabambino.jpg', tags: [['Cochabambino', 'ember']] },
    { name: 'Trancapecho', price: 45, desc: 'El silpancho servido en pan, jugoso y para llevar.', img: 'Trancapecho.jpg', tags: [] },
    { name: 'Pique macho medio', price: 65, desc: 'Res y salchicha, papas, huevo, tomate, cebolla y locoto.', img: 'Pique macho Cochabambino.jpg', tags: [['Picante', 'ember']] },
    { name: 'Pique macho grande', price: 90, desc: 'La porción para compartir, colmada y bien servida.', img: 'Pique macho Cochabambino.jpg', tags: [['Para compartir', 'ember'], ['Picante', 'ember']] },
    { name: 'Chicharrón de cerdo', price: 85, desc: 'Cerdo frito en su grasa, con mote, chuño y sarza.', img: 'Chicharrón cochabambino.jpg', tags: [] },
    { name: 'Chicharrón de pollo', price: 55, desc: 'Presas doradas y crocantes, con mote y papa.', img: 'Sajta de pollo.jpg', tags: [] },
    { name: 'Fricasé cochabambino', price: 60, desc: 'Cerdo en caldo de ají amarillo, mote y chuño.', img: 'Fricasé.jpg', tags: [['Picante', 'ember']] },
    { name: 'Charquekan', price: 70, desc: 'Charque de res desmenuzado con mote, huevo y queso.', img: 'Charquekan.jpg', tags: [] },
    { name: 'Sajta de pollo', price: 48, desc: 'Pollo en ají amarillo, chuño phuti y sarza.', img: 'Sajta de pollo.jpg', tags: [['Picante', 'ember']] },
    { name: 'Fritanga', price: 55, desc: 'Cerdo en caldo de ají rojo, mote y maíz. Del valle.', img: 'Fritanga.jpg', tags: [['Picante', 'ember']] },
    { name: 'Mondongo', price: 60, desc: 'Cerdo bañado en ají colorado, mote y papa. De domingo.', img: 'Mondongo.jpg', tags: [['Picante', 'ember']] },
    { name: 'Falso conejo', price: 48, desc: 'Milanesa de res en salsa de ají, arvejas, arroz y papa.', img: 'Milanesa.jpg', tags: [] },
    { name: 'Picante de lengua', price: 55, desc: 'Lengua de res en ají amarillo, papa y arroz graneado.', img: 'Picante mixto.jpg', tags: [['Picante', 'ember']] },
    { name: 'Picante surtido', price: 65, desc: 'Selección de picantes: pollo, lengua y charque en un plato.', img: 'Picante mixto.jpg', tags: [['Para compartir', 'ember'], ['Picante', 'ember']] },
  ],
  postres: [
    { name: 'Cuñapé caliente', price: 20, desc: 'Pancito de queso y almidón de yuca, recién horneado.', img: 'Cuñapé.jpg', tags: [['Insignia', 'ember']] },
    { name: 'Leche asada', price: 22, desc: 'Postre horneado, cremoso y con caramelo tostado.', img: 'Flan casero.jpg', tags: [] },
    { name: 'Helado de canela', price: 25, desc: 'Tradicional, batido a mano, con un toque de clavo.', img: 'Helado.jpg', tags: [] },
    { name: 'Flan de la casa', price: 18, desc: 'Flan de vainilla con caramelo, suave y sedoso.', img: 'Flan casero.jpg', tags: [] },
  ],
}

type Drink = { name: string; price: number; desc: string; img: string; prep: string }
const barData: Record<string, Drink[]> = {
  cocteles: [
    { name: 'Mojito', price: 40, desc: 'Ron, hierbabuena fresca, limón y soda. Refrescante.', img: 'photo-1551024709-8f23befc6f87', prep: 'Al momento' },
    { name: 'Caipiriña', price: 42, desc: 'Cachaça, lima y azúcar. El clásico brasileño.', img: 'photo-1514362545857-3bc16c4c7d1b', prep: 'Al momento' },
    { name: 'Sex on the Beach', price: 45, desc: 'Vodka, licor de durazno, naranja y arándano.', img: 'photo-1536935338788-846bb9981813', prep: 'Coctel' },
    { name: 'Chuflay', price: 38, desc: 'Singani boliviano, ginger ale y limón. De la casa.', img: 'photo-1470337458703-46ad1756a187', prep: 'Nacional' },
    { name: 'Cuba Libre', price: 38, desc: 'Ron, cola y un toque de limón.', img: 'photo-1609951651556-5334e2706168', prep: 'Clásico' },
    { name: 'Piña Colada', price: 44, desc: 'Ron, piña y crema de coco. Batido y cremoso.', img: 'photo-1587223962930-cb7f31384c19', prep: 'Batido' },
    { name: 'Margarita', price: 44, desc: 'Tequila, triple sec y limón, con escarcha de sal.', img: 'photo-1556679343-c7306c1976bc', prep: 'Clásico' },
    { name: 'Tequila Sunrise', price: 44, desc: 'Tequila, jugo de naranja y granadina en degradado.', img: 'photo-1536935338788-846bb9981813', prep: 'Coctel' },
    { name: 'Daiquiri de fresa', price: 44, desc: 'Ron, fresa fresca y limón. Batido con hielo.', img: 'photo-1609951651556-5334e2706168', prep: 'Frozen' },
    { name: 'Gin Tonic de la casa', price: 46, desc: 'Gin premium, tónica y botánicos frescos.', img: 'photo-1514362545857-3bc16c4c7d1b', prep: 'Con botánicos' },
    { name: 'Aperol Spritz', price: 48, desc: 'Aperol, prosecco y soda. Burbujeante y cítrico.', img: 'photo-1470337458703-46ad1756a187', prep: 'Con prosecco' },
    { name: 'Cosmopolitan', price: 46, desc: 'Vodka, triple sec, arándano y limón.', img: 'photo-1551024709-8f23befc6f87', prep: 'Coctel' },
  ],
  cervezas: [
    { name: 'Paceña', price: 22, desc: 'La rubia nacional, ligera y refrescante. Botella 620 ml.', img: 'photo-1608270586620-248524c67de9', prep: 'Nacional' },
    { name: 'Huari', price: 25, desc: 'Cerveza premium boliviana de agua de manantial.', img: 'photo-1600788886242-5c96aabe3757', prep: 'Premium' },
    { name: 'Taquiña', price: 22, desc: 'La cerveza cochabambina por excelencia. Bien fría.', img: 'photo-1618183479302-1e0aa382c36b', prep: 'Cochabambina' },
    { name: 'Corona', price: 30, desc: 'Clara mexicana servida con rodaja de limón.', img: 'photo-1608270586620-248524c67de9', prep: 'Importada' },
    { name: 'Heineken', price: 32, desc: 'Lager holandesa, cuerpo equilibrado. Botella 330 ml.', img: 'photo-1618183479302-1e0aa382c36b', prep: 'Importada' },
    { name: 'Bock Cerveza negra', price: 26, desc: 'Negra boliviana, maltosa y con notas de caramelo.', img: 'photo-1600788886242-5c96aabe3757', prep: 'Negra' },
  ],
  naturales: [
    { name: 'Mocochinchi', price: 15, desc: 'Durazno deshidratado cocido con canela y clavo.', img: 'photo-1600271886742-f049cd451bba', prep: 'De la casa' },
    { name: 'Api morado', price: 20, desc: 'Maíz morado caliente con canela y limón. Con pastel.', img: 'photo-1461023058943-07fcbe16d735', prep: 'Caliente' },
    { name: 'Refresco de tumbo', price: 18, desc: 'Fruta de los valles prensada, ligeramente ácida.', img: 'photo-1610970881699-44a5587cab64', prep: 'Prensado en frío' },
    { name: 'Jugo de durazno', price: 18, desc: 'Durazno de los valles, natural y espeso.', img: 'photo-1622597467836-f3285f2131b8', prep: 'Recién hecho' },
  ],
  vinos: [
    { name: 'Tinto de Tarija', price: 60, desc: 'Tannat del valle de Tarija, intenso y frutal.', img: 'photo-1510812431401-41d2bd2722f3', prep: 'Copa' },
    { name: 'Singani Casa Real', price: 45, desc: 'Nuestra bandera nacional, destilado de uva moscatel.', img: 'photo-1569529465841-dfecdab7503b', prep: 'Trago' },
    { name: 'Blanco de los valles', price: 55, desc: 'Uva criolla, notas cítricas, servido bien frío.', img: 'photo-1553361371-9b22f78e8b1d', prep: 'Copa' },
  ],
  sinalcohol: [
    { name: 'Limonada de la casa', price: 18, desc: 'Limón fresco y hierbabuena, recién exprimida.', img: 'photo-1621263764928-df1444c5e859', prep: 'Al momento' },
    { name: 'Chicha morada', price: 16, desc: 'Maíz morado, piña y especias. Sin alcohol.', img: 'photo-1600271886742-f049cd451bba', prep: 'De la casa' },
    { name: 'Mate de coca', price: 12, desc: 'Infusión tradicional, ideal para la altura.', img: 'photo-1597481499750-3e6b22637e12', prep: 'Caliente' },
  ],
}

const billData = [
  { name: 'Parrillada mixta', qty: 1, price: 180, note: 'Para compartir' },
  { name: 'Silpancho', qty: 1, price: 55, note: 'Con huevo frito' },
  { name: 'Mojito', qty: 2, price: 40, note: 'Bien frío' },
  { name: 'Mocochinchi', qty: 1, price: 15, note: '' },
  { name: 'Cuñapé caliente', qty: 1, price: 20, note: '' },
]

type Almuerzo = { d: string; ent: string; sDet: string; pri: string; priDet: string; pos: string; posDet: string; beb: string; bid: string; desc: string; fin: boolean; precio: number }
const almuerzoData: Almuerzo[] = [
  { d: 'domingo', ent: 'Sopa de maní', sDet: 'Maní tostado y molido, con papa hilada y carne.', pri: 'Chicharrón de cerdo con mote', priDet: 'Presa crocante con mote pelado, llajua y ensalada fresca.', pos: 'Leche asada', posDet: 'Horneada, con caramelo lento de la casa.', beb: 'Refresco de mocochinchi', bid: 'photo-1600271886742-f049cd451bba', desc: 'Chicharrón crocante con mote pelado, llajua de la casa y ensalada fresca.', fin: true, precio: 55 },
  { d: 'lunes', ent: 'Sopa de fideo', sDet: 'Caldo de res con fideo, verduras y hierbabuena.', pri: 'Silpancho cochabambino', priDet: 'Milanesa fina sobre arroz y papa, huevo frito y sarza criolla.', pos: 'Flan de la casa', posDet: 'Suave y cremoso, con caramelo casero.', beb: 'Refresco de tumbo', bid: 'photo-1621263764928-df1444c5e859', desc: 'Milanesa fina sobre arroz y papa, huevo frito y sarza criolla.', fin: false, precio: 45 },
  { d: 'martes', ent: 'Sopa de verduras', sDet: 'Caldo casero de verduras frescas del valle, ligero y reconfortante.', pri: 'Pique macho', priDet: 'Carne, salchicha y papas fritas con huevo, tomate y ají.', pos: 'Helado de canela', posDet: 'Cremoso, hecho en casa.', beb: 'Refresco de mocochinchi', bid: 'photo-1600271886742-f049cd451bba', desc: 'Carne, salchicha y papas fritas con huevo, tomate y ají.', fin: false, precio: 45 },
  { d: 'miércoles', ent: 'Chairo paceño', sDet: 'Sopa espesa de chuño, carne y verduras andinas.', pri: 'Fricasé cochabambino', priDet: 'Cerdo en caldo picante de ají amarillo con mote y chuño.', pos: 'Cuñapé', posDet: 'Pancitos de almidón y queso, recién horneados.', beb: 'Api de la casa', bid: 'photo-1461023058943-07fcbe16d735', desc: 'Cerdo en caldo picante de ají amarillo con mote y chuño.', fin: false, precio: 45 },
  { d: 'jueves', ent: 'Sopa de quinua', sDet: 'Quinua real con verduras frescas del valle.', pri: 'Charque de res', priDet: 'Charque desmenuzado con mote, huevo duro y queso del valle.', pos: 'Leche asada', posDet: 'Caramelo lento de la casa.', beb: 'Jugo de durazno', bid: 'photo-1622597467836-f3285f2131b8', desc: 'Charque desmenuzado con mote, huevo duro y queso del valle.', fin: false, precio: 45 },
  { d: 'viernes', ent: 'Lawa de choclo', sDet: 'Crema espesa de choclo tierno con queso y hierbas.', pri: 'Trancapecho', priDet: 'Silpancho dentro de pan crocante, jugoso y bien contundente.', pos: 'Helado de canela', posDet: 'Refrescante, para cerrar la semana.', beb: 'Refresco de tumbo', bid: 'photo-1621263764928-df1444c5e859', desc: 'Silpancho dentro de pan crocante, jugoso y bien contundente.', fin: false, precio: 45 },
  { d: 'sábado', ent: 'Chaque de trigo', sDet: 'Guiso cochabambino de trigo pelado, carne y verduras.', pri: 'Pollo a la parrilla', priDet: 'Presa jugosa al carbón con guarniciones y llajua.', pos: 'Leche asada', posDet: 'Horneada, con caramelo de la casa.', beb: 'Sangría de la casa', bid: 'photo-1510812431401-41d2bd2722f3', desc: 'Presa jugosa al carbón con guarniciones. Almuerzo de fin de semana.', fin: true, precio: 55 },
]

const carData = [
  { name: 'Silpancho cochabambino', price: 55, meta: 'Plato insignia · Cochabamba',
    story: 'La joya del valle: una milanesa finísima de res que cubre todo el plato, sobre una cama de arroz y papa, coronada con huevo frito y sarza fresca.',
    slug: 'silpancho',
    ing: ['Milanesa de res apanada', 'Arroz graneado', 'Papa en rodajas', 'Huevo frito', 'Sarza de tomate y cebolla', 'Llajua de la casa'] },
  { name: 'Pique macho', price: 90, meta: 'Para compartir · picante',
    story: 'Una montaña de sabor pensada para compartir: lomo de res y salchicha salteados sobre papas fritas, con el toque encendido del locoto.',
    slug: 'pique',
    ing: ['Lomo de res en tiras', 'Salchicha', 'Papas fritas', 'Huevo duro', 'Tomate, cebolla y locoto', 'Llajua'] },
  { name: 'Pollo a la parrilla', price: 75, meta: 'De la brasa',
    story: 'Medio pollo marinado en hierbas y asado al carbón hasta dorar la piel, jugoso por dentro y con ese aroma inconfundible del fuego.',
    slug: 'pollo',
    ing: ['Medio pollo al carbón', 'Papa dorada', 'Ensalada fresca', 'Chimichurri', 'Llajua'] },
  { name: 'Chicharrón de cerdo', price: 85, meta: 'Tradición del valle',
    story: 'Cerdo cocido lentamente en su propia grasa hasta quedar crocante por fuera y tierno por dentro, servido como manda la tradición cochabambina.',
    slug: 'chicharron',
    ing: ['Cerdo frito en su grasa', 'Mote de maíz', 'Chuño', 'Sarza criolla', 'Llajua'] },
  { name: 'Costillar de cordero', price: 75, meta: 'Especialidad · a la brasa',
    story: 'Costillar de cordero asado al fuego lento durante horas: tierno, ahumado y listo para desprenderse del hueso con solo el tenedor.',
    slug: 'charque',
    ing: ['Costillar de cordero', 'Arroz graneado', 'Papa frita', 'Ensalada', 'Chimichurri'] },
]
/* imagen (Unsplash) de cada slide del carrusel — igual que la fuente */
const carImgId: Record<string, string> = {
  'Silpancho cochabambino': 'photo-1562967916-eb82221dfb92',
  'Pique macho': 'photo-1596797038530-2c107229654b',
  'Pollo a la parrilla': 'photo-1532550907401-a500c9a57435',
  'Chicharrón de cerdo': 'photo-1569058242253-92a9c755a0ec',
  'Costillar de cordero': 'photo-1529193591184-b1d58069ecdd',
}

/* almuerzo del día — fecha fija (2026-07-04 = sábado, getDay()=6) */
const WD = new Date('2026-07-04T12:00:00').getDay()
const almToday = almuerzoData[WD]
const dayCap: Record<string, string> = { domingo: 'Domingo', lunes: 'Lunes', martes: 'Martes', 'miércoles': 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', 'sábado': 'Sábado' }
const weekOrder = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const heroSlug: Record<string, string> = { domingo: 'chicharron', lunes: 'silpancho', martes: 'pique', 'miércoles': 'fricase', jueves: 'charque', viernes: 'silpancho', 'sábado': 'pollo' }
// 7 sopas DISTINTAS (una por día, sin repetir) — todas con foto local en /showcase/img/menu.
const sopaSlug: Record<string, string> = { domingo: 'sopa-mani', lunes: 'sopa-fideo', martes: 'sopa-verduras', 'miércoles': 'chairo', jueves: 'sopa-quinua', viernes: 'lawa-choclo', 'sábado': 'chaque-de-trigo' }
// Segundo del almuerzo semanal por slug — solo para los que NO tienen foto local
// (charque, pollo). Los demás (chicharron, silpancho, pique, fricase) usan foto local.
const mainImgId: Record<string, string> = {
  charque: 'photo-1574484284002-952d92456975', pollo: 'photo-1532550907401-a500c9a57435',
}

const menuCatDefs: [string, string][] = [['entrantes', 'Entrantes & sopas'], ['parrilla', 'Platos de fondo'], ['principales', 'Platos bolivianos'], ['postres', 'Postres']]
const barCatDefs: [string, string][] = [['cocteles', 'Cócteles'], ['cervezas', 'Cervezas'], ['naturales', 'Bebidas naturales'], ['vinos', 'Vinos & singani'], ['sinalcohol', 'Sin alcohol']]

const dishDefault = 'photo-1414235077428-338989a2e8c0'
// Una foto DISTINTA y acorde al plato dentro de cada categoría del menú (antes una
// misma imagen genérica se repetía hasta 7 veces y no correspondía al plato).
const dishImg: Record<string, string> = {
  // Entrantes & sopas
  'Salteñas cochabambinas': 'photo-1565299624946-b28f40a0ae38', 'Anticucho de corazón': 'photo-1529193591184-b1d58069ecdd', 'Sopa de maní': 'photo-1476718406336-bb5a9690ee2a', 'Chairo paceño': 'photo-1547592166-23ac45744acd', 'Humintas al horno': 'photo-1547592180-85f173990554',
  // Parrilla / platos de fondo
  'Chuleta de cerdo a la BBQ': 'photo-1432139555190-58524dae6a55', 'Nudos de cordero': 'photo-1558030006-450675393462', 'Costillar de cordero': 'photo-1544025162-d76694265947', 'Colita de cordero': 'photo-1596797038530-2c107229654b', 'Brazuelo de cerdo': 'photo-1504674900247-0877df9cc836', 'Milanesa napolitana': 'photo-1599921841143-819065a55cc6', 'Parrillada mixta': 'photo-1600891964092-4316c288032e', 'Churrasco de lomo': 'photo-1414235077428-338989a2e8c0', 'Trucha a la plancha': 'photo-1519708227418-c8fd9a32b7a2', 'Chorizo criollo': 'photo-1604908176997-125f25cc6f3d',
  // Platos bolivianos
  'Silpancho cochabambino': 'photo-1562967916-eb82221dfb92', 'Trancapecho': 'photo-1551782450-a2132b4ba21d', 'Pique macho medio': 'photo-1512058564366-18510be2db19', 'Pique macho grande': 'photo-1546069901-ba9599a7e63c', 'Chicharrón de cerdo': 'photo-1569058242253-92a9c755a0ec', 'Chicharrón de pollo': 'photo-1562967914-608f82629710', 'Fricasé cochabambino': 'photo-1455619452474-d2be8b1e70cd', 'Charquekan': 'photo-1574484284002-952d92456975', 'Sajta de pollo': 'photo-1532550907401-a500c9a57435', 'Fritanga': 'photo-1596797038530-2c107229654b', 'Mondongo': 'photo-1604908176997-125f25cc6f3d', 'Falso conejo': 'photo-1504674900247-0877df9cc836', 'Picante de lengua': 'photo-1414235077428-338989a2e8c0', 'Picante surtido': 'photo-1544025162-d76694265947',
  // Postres
  'Cuñapé caliente': 'photo-1509440159596-0249088772ff', 'Leche asada': 'photo-1519915028121-7d3463d20b13', 'Helado de canela': 'photo-1497034825429-c343d7c6a68f', 'Flan de la casa': 'photo-1551024506-0bccd828d307',
}

// Fotos REALES del local (subidas por el cliente) en /showcase/img/menu/*.webp.
// Cada plato/sopa con archivo usa la local; el resto cae a Unsplash (dishImg).
const localMenuImg = (slug: string, w = 828) => optimized(`/showcase/img/menu/${slug}.webp`, w)
const localDish: Record<string, string> = {
  'Anticucho de corazón': 'anticucho', 'Sopa de maní': 'sopa-mani', 'Chairo paceño': 'chairo', 'Humintas al horno': 'humintas',
  'Chuleta de cerdo a la BBQ': 'chuleta-cerdo', 'Brazuelo de cerdo': 'brazuelo-cerdo', 'Parrillada mixta': 'parrillada', 'Chorizo criollo': 'chorizo',
  'Silpancho cochabambino': 'silpancho', 'Trancapecho': 'trancapecho', 'Pique macho medio': 'pique', 'Pique macho grande': 'pique', 'Pique macho': 'pique',
  'Chicharrón de cerdo': 'chicharron-cerdo', 'Chicharrón de pollo': 'chicharron-pollo', 'Fricasé cochabambino': 'fricase',
}
const dishImage = (name: string, w = 600) =>
  localDish[name] ? localMenuImg(localDish[name], w) : img(dishImg[name] || dishDefault, w)
// Segundo del almuerzo semanal: local si existe (por slug de heroSlug), si no Unsplash.
const weeklyMainLocal: Record<string, string> = { chicharron: 'chicharron-cerdo', silpancho: 'silpancho', pique: 'pique', fricase: 'fricase' }
const weeklyMainImg = (slug: string) =>
  weeklyMainLocal[slug] ? localMenuImg(weeklyMainLocal[slug]) : img(mainImgId[slug] || dishDefault, 420)

const hoursRows = [{ day: 'Lun – Vie', time: '12:00 – 23:00' }, { day: 'Sábado', time: '12:00 – 23:30' }, { day: 'Domingo', time: '12:00 – 16:00' }]

/* ============================================================
   i18n — textos por idioma (es/en). Los datos (menuData, barData,
   almuerzoData, carData, zonesData, billData…) siguen siendo la
   fuente en español y se referencian desde CONTENT.es; los slugs,
   precios, imágenes y claves de categoría no cambian.
   ============================================================ */
type MenuTxt = { name: string; desc: string; tags: [string, string][] }
type BarTxt = { name: string; desc: string; prep: string }
type AlmTxt = { ent: string; sDet: string; pri: string; priDet: string; pos: string; posDet: string; beb: string; desc: string }
type CarTxt = { name: string; meta: string; story: string; ing: string[] }
type ZoneTxt = { name: string; note: string }
type BillTxt = { name: string; note: string }
type Content = {
  dow: string[]
  mon: string[]
  numLocale: string
  nav: { inicio: string; reservar: string; carta: string; bar: string; cuenta: string }
  header: { login: string; reserveTable: string; themeTitle: string; cartTitle: string }
  acct: { myRes: string; noRes: string; myOrders: string; logout: string; partySuf: string }
  auth: {
    regTitle: string; regDesc: string; loginTitle: string; loginDesc: string
    nameLabel: string; namePh: string; phoneLabel: string; phonePh: string
    emailLabel: string; emailPh: string; passLabel: string; passPh: string
    createBtn: string; loginBtn: string; haveAccount: string; loginLink: string; noAccount: string; registerLink: string
  }
  msg: {
    needName: string; invalidEmail: string; shortPass: string; emailExists: string
    welcome: (n: string) => string; badCreds: string; hiAgain: (n: string) => string; loggedOut: string
    needAccountOrder: string; orderAdded: (code: string) => string; clientFallback: string; tabClosed: string
    pickTime: string; needAccountRes: string; pickTable: string; billSplit: string; paymentReceived: string
  }
  mode: { mesa: string; llevar: string; delivery: string }
  cart: {
    title: string; tabTitle: string; tabSentPre: string; tabSentSuf: string; roundPre: string; tabTotal: string
    addDishes: string; addDishesSub: string; orderDrink: string; orderDrinkSub: string; requestBillPre: string
    payTitle: string; payDesc: string; payTotal: string; payFooter: string; paidClose: string; keepOrdering: string
    emptyTitle: string; emptyDesc: string; viewMenu: string; howWant: string; tableNum: string; mesaPh: string
    oneTabPre: string; oneTabBold: string; oneTabSuf: string; notePh: string; total: string; confirmOrder: string
  }
  home: {
    openBadge: string; heroTitle: string; heroDesc: string; qFecha: string; qComensales: string; qHora: string; searchTable: string
    highlights: { title: string; text: string }[]
    sigEyebrow: string; sigTitle: string; seeFullMenu: string; whatItHas: string
    hoursTitle: string; alwaysTitle: string; alwaysDesc: string; whereTitle: string; reserveNow: string
  }
  hoursRows: { day: string; time: string }[]
  res: {
    eyebrow: string; title: string; steps: string[]; chooseDay: string; comensales: string; moreThan8: string; hora: string
    turnoComida: string; turnoCena: string; chooseTable: string; free: string; selected: string; taken: string
    pickTablePrompt: string; tablePre: string; seatsSuf: string; continueBtn: string; backBtn: string
    yourData: string; fullName: string; yourNamePh: string; phone: string; phonePh: string; email: string; emailPh: string
    noteLabel: string; notePh: string; summary: string; sumFecha: string; sumHora: string; sumComensales: string; sumMesa: string
    holdNote: string; confirmRes: string; changeTable: string; doneTitle: string; doneDesc: string; resCodeLabel: string
    viewMenu: string; newRes: string; today: string; tomorrow: string; todayComma: string; anyTime: string
    personSing: string; personPlur: string; personPlus: string
  }
  zones: ZoneTxt[]
  carta: {
    eyebrow: string; title: string; desc: string; lunchBadge: string; weekTitle: string; fromPre: string; perPersonFull: string
    soupOfDay: string; tagToday: string; tagWeekend: string; sideSegundo: string; sidePostre: string; sideRefresco: string
    refrescoDetail: string; fullMenu: string; lunchIncludes: string; bs: string; perPerson: string; servedNote: string
    orderLunch: string; lunchOnlyToday: string; availOnPre: string; loginToOrder: string; lunchItemPre: string; nightNote: string
    alaCarta: string; addToOrder: string; pricesNote: string
  }
  dayCap: Record<string, string>
  menuCats: string[]
  barCats: string[]
  menu: Record<string, MenuTxt[]>
  bar: Record<string, BarTxt[]>
  alm: AlmTxt[]
  car: CarTxt[]
  bill: BillTxt[]
  barView: { eyebrow: string; title: string; desc: string; addBtn: string }
  acc: {
    eyebrow: string; title: string; desc: string; consumo: string; itemsSuf: string; subtotal: string
    tipPre: string; tipSuf: string; noTip: string; total: string; splitBill: string; payQR: string; callWaiter: string
  }
  pay: { secure: string; scanToPay: string; tablePre: string; waiting: string; simulate: string }
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    dow: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    mon: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    numLocale: 'es-BO',
    nav: { inicio: 'Inicio', reservar: 'Reservar', carta: 'Carta', bar: 'Bar', cuenta: 'Cuenta' },
    header: { login: 'Ingresar', reserveTable: 'Reservar mesa', themeTitle: 'Tema', cartTitle: 'Tu pedido' },
    acct: { myRes: 'Mis reservas', noRes: 'Aún no tienes reservas. Reserva tu mesa y aparecerá aquí.', myOrders: 'Mis pedidos', logout: 'Cerrar sesión', partySuf: 'p' },
    auth: {
      regTitle: 'Crea tu cuenta', regDesc: 'Regístrate para reservar mesas, guardar tu historial y pagar con QR sin filas.',
      loginTitle: 'Bienvenido de vuelta', loginDesc: 'Inicia sesión para ver tus reservas y continuar.',
      nameLabel: 'Nombre completo', namePh: 'Tu nombre', phoneLabel: 'Teléfono', phonePh: 'Ej. 700 12345',
      emailLabel: 'Correo', emailPh: 'tucorreo@ejemplo.com', passLabel: 'Contraseña', passPh: 'Mínimo 4 caracteres',
      createBtn: 'Crear cuenta', loginBtn: 'Ingresar', haveAccount: '¿Ya tienes cuenta? ', loginLink: 'Inicia sesión', noAccount: '¿No tienes cuenta? ', registerLink: 'Regístrate gratis',
    },
    msg: {
      needName: 'Escribe tu nombre', invalidEmail: 'Correo no válido', shortPass: 'La contraseña debe tener al menos 4 caracteres', emailExists: 'Ya existe una cuenta con ese correo. Inicia sesión.',
      welcome: (n) => '¡Bienvenido a BRASA, ' + n + '!', badCreds: 'Correo o contraseña incorrectos', hiAgain: (n) => 'Hola de nuevo, ' + n, loggedOut: 'Sesión cerrada',
      needAccountOrder: 'Crea tu cuenta (o inicia sesión) para enviar tu pedido.', orderAdded: (code) => 'Pedido ' + code + ' agregado a tu cuenta', clientFallback: 'Cliente', tabClosed: 'Cuenta cerrada. ¡Gracias por tu visita!',
      pickTime: 'Elige una hora', needAccountRes: 'Crea tu cuenta (o inicia sesión) para confirmar la reserva.', pickTable: 'Elige una mesa', billSplit: 'Cuenta dividida entre los comensales', paymentReceived: '¡Pago recibido! Gracias por tu visita 🔥',
    },
    mode: { mesa: 'En mesa', llevar: 'Para llevar', delivery: 'Delivery' },
    cart: {
      title: 'Tu pedido', tabTitle: 'Tu cuenta abierta', tabSentPre: 'Pedido ', tabSentSuf: ' enviado a cocina · sigue pidiendo cuando quieras', roundPre: 'Ronda ', tabTotal: 'Total de la cuenta',
      addDishes: 'Agregar platos', addDishesSub: 'Sumar a esta cuenta', orderDrink: 'Pedir un trago', orderDrinkSub: 'Del bar a tu mesa', requestBillPre: 'Pedir la cuenta · ',
      payTitle: 'Paga tu cuenta', payDesc: 'Escanea el QR desde tu banca móvil. Un mesero pasará a confirmar.', payTotal: 'Total a pagar', payFooter: 'BRASA · Pago QR', paidClose: 'Ya pagué · Cerrar cuenta', keepOrdering: 'Seguir pidiendo',
      emptyTitle: 'Tu pedido está vacío', emptyDesc: 'Explora la carta y añade tus platos favoritos para pedir en mesa, para llevar o a domicilio.', viewMenu: 'Ver la carta', howWant: '¿Cómo lo quieres?', tableNum: 'Nº de mesa', mesaPh: 'ej. M3',
      oneTabPre: 'Todos los de tu mesa pagan en ', oneTabBold: 'una sola cuenta', oneTabSuf: '. Cada quien pide lo suyo con este número.', notePh: '✎ Nota para cocina — ej: sin cebolla, sin picante…', total: 'Total', confirmOrder: 'Confirmar pedido',
    },
    home: {
      openBadge: 'Abierto hoy · 13:00 – 23:30', heroTitle: 'Cocina de fuego, mesa de encuentro.', heroDesc: 'Almuerzos caseros que cambian cada día y parrillas al carbón por la noche. Cocina cochabambina, coctelería y bebidas naturales. Abierto también sábados y domingos.',
      qFecha: 'Fecha', qComensales: 'Comensales', qHora: 'Hora', searchTable: 'Buscar mesa',
      highlights: [
        { title: 'De la brasa', text: 'Encino y sarmiento. Carne madurada, pesca del día y verduras al rescoldo.' },
        { title: 'Bar de autor', text: 'Coctelería preparada al momento, fermentos y zumos naturales de la casa.' },
        { title: 'Abierto a diario', text: 'Comida y cena todos los días. Reserva o pide la cuenta por QR sin esperas.' },
      ],
      sigEyebrow: 'De la brasa', sigTitle: 'Platos que definen la casa', seeFullMenu: 'Ver la carta completa →', whatItHas: 'Lo que lleva',
      hoursTitle: 'Horarios', alwaysTitle: 'Siempre a la mesa', alwaysDesc: 'Cocina abierta todos los días. Reserva en segundos o pide la cuenta con un código QR desde tu mesa.', whereTitle: 'Dónde', reserveNow: 'Reservar ahora',
    },
    hoursRows: hoursRows,
    res: {
      eyebrow: 'Reserva', title: 'Reserva tu mesa', steps: ['Fecha y hora', 'Mesa', 'Datos'], chooseDay: 'Elige el día', comensales: 'Comensales', moreThan8: '¿Más de 8? Escríbenos para eventos y mesa privada.', hora: 'Hora',
      turnoComida: 'Comida', turnoCena: 'Cena', chooseTable: 'Elegir mesa →', free: 'Libre', selected: 'Seleccionada', taken: 'Ocupada',
      pickTablePrompt: 'Elige una mesa disponible', tablePre: 'Mesa ', seatsSuf: ' pers', continueBtn: 'Continuar →', backBtn: '← Atrás',
      yourData: 'Tus datos', fullName: 'Nombre completo', yourNamePh: 'Tu nombre', phone: 'Teléfono', phonePh: '55 0000 0000', email: 'Correo', emailPh: 'tu@correo.com',
      noteLabel: 'Nota (alergias, ocasión…)', notePh: 'Cumpleaños, sin gluten, mesa tranquila…', summary: 'Resumen', sumFecha: 'Fecha', sumHora: 'Hora', sumComensales: 'Comensales', sumMesa: 'Mesa',
      holdNote: 'Guardamos tu mesa 15 min. Cancela gratis hasta 3 h antes.', confirmRes: 'Confirmar reserva', changeTable: '← Cambiar mesa', doneTitle: '¡Mesa reservada!', doneDesc: 'Te enviamos la confirmación. Muestra este código al llegar.', resCodeLabel: 'Código de reserva',
      viewMenu: 'Ver la carta', newRes: 'Nueva reserva', today: 'Hoy', tomorrow: 'Mañana', todayComma: 'Hoy, ', anyTime: 'Cualquier hora', personSing: ' persona', personPlur: ' personas', personPlus: '+ personas',
    },
    zones: zonesData,
    carta: {
      eyebrow: 'Carta', title: 'Cocina del valle', desc: 'Cocina boliviana de siempre — a la brasa y al fuego lento. Almuerzo casero cada día y la carta completa por las noches.',
      lunchBadge: 'Almuerzo · de lunes a domingo · 12:00 a 15:00', weekTitle: 'Menú de la semana', fromPre: 'Desde ', perPersonFull: 'por persona · sopa, segundo, postre y refresco',
      soupOfDay: 'Sopa del día', tagToday: 'Hoy', tagWeekend: 'Fin de semana · Especial', sideSegundo: 'Segundo', sidePostre: 'Postre', sideRefresco: 'Refresco', refrescoDetail: 'Bebida natural de la casa.',
      fullMenu: 'Menú completo', lunchIncludes: 'El almuerzo incluye', bs: 'Bs', perPerson: 'por persona', servedNote: 'Servido de 12:00 a 15:00, todos los días.', orderLunch: 'Pedir este almuerzo', lunchOnlyToday: 'Solo puedes pedir el almuerzo del día en curso',
      availOnPre: 'Disponible el ', loginToOrder: 'Inicia sesión para pedir', lunchItemPre: 'Almuerzo · ', nightNote: 'Por las noches servimos la carta completa a la brasa y al carbón.', alaCarta: 'A la carta · todas las noches', addToOrder: 'Agregar al pedido', pricesNote: 'Precios en bolivianos, impuestos incluidos · consulta a tu mesero sobre alérgenos',
    },
    dayCap: dayCap,
    menuCats: menuCatDefs.map(([, l]) => l),
    barCats: barCatDefs.map(([, l]) => l),
    menu: menuData,
    bar: barData,
    alm: almuerzoData,
    car: carData,
    bill: billData,
    barView: { eyebrow: 'Bar', title: 'Barra & bebidas', desc: 'Coctelería de autor preparada al momento, zumos y fermentos naturales de la casa, y una bodega viva.', addBtn: 'Agregar' },
    acc: {
      eyebrow: 'Tu mesa', title: 'Cuenta · Mesa M3', desc: 'Pide la cuenta y paga desde tu móvil con un código QR.', consumo: 'Consumo', itemsSuf: ' artículos', subtotal: 'Subtotal',
      tipPre: 'Propina · opcional (', tipSuf: '%)', noTip: 'Sin propina', total: 'Total', splitBill: 'Dividir cuenta', payQR: 'Pagar con QR', callWaiter: 'También puedes llamar a tu camarero desde aquí.',
    },
    pay: { secure: 'Pago seguro', scanToPay: 'Escanea para pagar', tablePre: 'Mesa ', waiting: 'Esperando el pago…', simulate: 'Simular pago recibido' },
  },
  en: {
    dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    mon: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    numLocale: 'en-US',
    nav: { inicio: 'Home', reservar: 'Reserve', carta: 'Menu', bar: 'Bar', cuenta: 'Tab' },
    header: { login: 'Sign in', reserveTable: 'Book a table', themeTitle: 'Theme', cartTitle: 'Your order' },
    acct: { myRes: 'My reservations', noRes: 'You have no reservations yet. Book your table and it will show up here.', myOrders: 'My orders', logout: 'Sign out', partySuf: 'p' },
    auth: {
      regTitle: 'Create your account', regDesc: 'Sign up to book tables, save your history and pay by QR with no lines.',
      loginTitle: 'Welcome back', loginDesc: 'Sign in to see your reservations and continue.',
      nameLabel: 'Full name', namePh: 'Your name', phoneLabel: 'Phone', phonePh: 'e.g. 700 12345',
      emailLabel: 'Email', emailPh: 'you@example.com', passLabel: 'Password', passPh: 'At least 4 characters',
      createBtn: 'Create account', loginBtn: 'Sign in', haveAccount: 'Already have an account? ', loginLink: 'Sign in', noAccount: "Don't have an account? ", registerLink: 'Sign up free',
    },
    msg: {
      needName: 'Enter your name', invalidEmail: 'Invalid email', shortPass: 'Password must be at least 4 characters', emailExists: 'An account with that email already exists. Sign in.',
      welcome: (n) => 'Welcome to BRASA, ' + n + '!', badCreds: 'Incorrect email or password', hiAgain: (n) => 'Welcome back, ' + n, loggedOut: 'Signed out',
      needAccountOrder: 'Create your account (or sign in) to send your order.', orderAdded: (code) => 'Order ' + code + ' added to your tab', clientFallback: 'Guest', tabClosed: 'Tab closed. Thanks for visiting!',
      pickTime: 'Pick a time', needAccountRes: 'Create your account (or sign in) to confirm the reservation.', pickTable: 'Pick a table', billSplit: 'Bill split between guests', paymentReceived: 'Payment received! Thanks for visiting 🔥',
    },
    mode: { mesa: 'Dine-in', llevar: 'Takeout', delivery: 'Delivery' },
    cart: {
      title: 'Your order', tabTitle: 'Your open tab', tabSentPre: 'Order ', tabSentSuf: ' sent to the kitchen · keep ordering whenever you like', roundPre: 'Round ', tabTotal: 'Tab total',
      addDishes: 'Add dishes', addDishesSub: 'Add to this tab', orderDrink: 'Order a drink', orderDrinkSub: 'From the bar to your table', requestBillPre: 'Request the bill · ',
      payTitle: 'Pay your tab', payDesc: 'Scan the QR from your mobile banking app. A server will come by to confirm.', payTotal: 'Total to pay', payFooter: 'BRASA · QR payment', paidClose: 'I paid · Close tab', keepOrdering: 'Keep ordering',
      emptyTitle: 'Your order is empty', emptyDesc: 'Browse the menu and add your favorite dishes to order at your table, for takeout or delivery.', viewMenu: 'View the menu', howWant: 'How would you like it?', tableNum: 'Table no.', mesaPh: 'e.g. M3',
      oneTabPre: 'Everyone at your table pays on ', oneTabBold: 'a single tab', oneTabSuf: '. Each person orders their own with this number.', notePh: '✎ Note for the kitchen — e.g. no onion, not spicy…', total: 'Total', confirmOrder: 'Confirm order',
    },
    home: {
      openBadge: 'Open today · 1:00 PM – 11:30 PM', heroTitle: 'Fire cooking, a table to gather at.', heroDesc: 'Homestyle lunches that change every day and charcoal grills at night. Cochabamba cuisine, craft cocktails and natural drinks. Open weekends too.',
      qFecha: 'Date', qComensales: 'Guests', qHora: 'Time', searchTable: 'Find a table',
      highlights: [
        { title: 'From the grill', text: 'Oak and vine wood. Aged meat, catch of the day and coal-roasted vegetables.' },
        { title: 'Craft bar', text: 'Cocktails made to order, house ferments and fresh natural juices.' },
        { title: 'Open daily', text: 'Lunch and dinner every day. Reserve or request the bill by QR with no waiting.' },
      ],
      sigEyebrow: 'From the grill', sigTitle: 'Dishes that define the house', seeFullMenu: 'See the full menu →', whatItHas: "What's in it",
      hoursTitle: 'Hours', alwaysTitle: 'Always a seat for you', alwaysDesc: 'Kitchen open every day. Reserve in seconds or request the bill with a QR code right from your table.', whereTitle: 'Where', reserveNow: 'Reserve now',
    },
    hoursRows: [{ day: 'Mon – Fri', time: '12:00 – 23:00' }, { day: 'Saturday', time: '12:00 – 23:30' }, { day: 'Sunday', time: '12:00 – 16:00' }],
    res: {
      eyebrow: 'Reservation', title: 'Book your table', steps: ['Date & time', 'Table', 'Details'], chooseDay: 'Choose the day', comensales: 'Guests', moreThan8: 'More than 8? Write to us for events and private tables.', hora: 'Time',
      turnoComida: 'Lunch', turnoCena: 'Dinner', chooseTable: 'Choose table →', free: 'Free', selected: 'Selected', taken: 'Taken',
      pickTablePrompt: 'Pick an available table', tablePre: 'Table ', seatsSuf: ' seats', continueBtn: 'Continue →', backBtn: '← Back',
      yourData: 'Your details', fullName: 'Full name', yourNamePh: 'Your name', phone: 'Phone', phonePh: '55 0000 0000', email: 'Email', emailPh: 'you@email.com',
      noteLabel: 'Note (allergies, occasion…)', notePh: 'Birthday, gluten-free, quiet table…', summary: 'Summary', sumFecha: 'Date', sumHora: 'Time', sumComensales: 'Guests', sumMesa: 'Table',
      holdNote: 'We hold your table for 15 min. Free cancellation up to 3 h before.', confirmRes: 'Confirm reservation', changeTable: '← Change table', doneTitle: 'Table booked!', doneDesc: 'We sent you the confirmation. Show this code when you arrive.', resCodeLabel: 'Reservation code',
      viewMenu: 'View the menu', newRes: 'New reservation', today: 'Today', tomorrow: 'Tomorrow', todayComma: 'Today, ', anyTime: 'Any time', personSing: ' guest', personPlur: ' guests', personPlus: '+ guests',
    },
    zones: [
      { name: 'Main dining room', note: 'Warm setting next to the open kitchen' },
      { name: 'Terrace', note: 'Outdoors, with fire braziers' },
      { name: 'Bar', note: 'Facing the bartender, full service' },
      { name: 'Private room', note: 'Large table for groups and events' },
    ],
    carta: {
      eyebrow: 'Menu', title: 'Cuisine of the valley', desc: 'Timeless Bolivian cooking — grilled and slow-cooked over fire. Homestyle lunch every day and the full menu at night.',
      lunchBadge: 'Lunch · Monday to Sunday · 12:00 to 15:00', weekTitle: 'Menu of the week', fromPre: 'From ', perPersonFull: 'per person · soup, main, dessert and a drink',
      soupOfDay: 'Soup of the day', tagToday: 'Today', tagWeekend: 'Weekend · Special', sideSegundo: 'Main', sidePostre: 'Dessert', sideRefresco: 'Drink', refrescoDetail: 'House natural drink.',
      fullMenu: 'Full menu', lunchIncludes: 'The lunch includes', bs: 'Bs', perPerson: 'per person', servedNote: 'Served from 12:00 to 15:00, every day.', orderLunch: 'Order this lunch', lunchOnlyToday: "You can only order the current day's lunch",
      availOnPre: 'Available on ', loginToOrder: 'Sign in to order', lunchItemPre: 'Lunch · ', nightNote: 'At night we serve the full menu grilled and over charcoal.', alaCarta: 'À la carte · every night', addToOrder: 'Add to order', pricesNote: 'Prices in bolivianos, taxes included · ask your server about allergens',
    },
    dayCap: { domingo: 'Sunday', lunes: 'Monday', martes: 'Tuesday', 'miércoles': 'Wednesday', jueves: 'Thursday', viernes: 'Friday', 'sábado': 'Saturday' },
    menuCats: ['Starters & soups', 'Main plates', 'Bolivian dishes', 'Desserts'],
    barCats: ['Cocktails', 'Beers', 'Natural drinks', 'Wines & singani', 'Non-alcoholic'],
    menu: {
      entrantes: [
        { name: 'Cochabamba salteñas', desc: 'Juicy beef or chicken, sweet dough baked to order.', tags: [['Signature', 'ember']] },
        { name: 'Beef heart anticucho', desc: 'Grilled skewers with potato and peanut sauce.', tags: [['Grilled', 'ember']] },
        { name: 'Peanut soup', desc: 'The Bolivian classic with beef, shoestring fries and parsley.', tags: [] },
        { name: 'Chairo paceño', desc: 'Freeze-dried potato, lamb and vegetable soup. Comforting.', tags: [] },
        { name: 'Baked humintas', desc: 'Tender corn dough with cheese, baked in the husk.', tags: [['Vegetarian', 'green']] },
      ],
      parrilla: [
        { name: 'BBQ pork chop', desc: 'Glazed chop, bread, lettuce, tomato, cheese and fries.', tags: [['Signature', 'ember']] },
        { name: 'Lamb knots', desc: 'Charcoal-grilled lamb, rice, fries and salad.', tags: [['Over the coals', 'ember']] },
        { name: 'Lamb rack', desc: 'Slow-roasted rack over fire, rice and fries.', tags: [['Specialty', 'ember']] },
        { name: 'Lamb tail', desc: 'Tender lamb tail, rice, potato and salad.', tags: [] },
        { name: 'Pork shoulder', desc: 'Baked until it falls apart, with hominy and sarza.', tags: [['Specialty', 'ember']] },
        { name: 'Milanesa napolitana', desc: 'Chicken milanesa with ham and cheese, rice, fries and tomato sauce.', tags: [] },
        { name: 'Mixed grill', desc: 'Sirloin, chicken, chorizo and blood sausage over charcoal. To share.', tags: [['To share', 'ember']] },
        { name: 'Sirloin churrasco', desc: 'Grilled beef sirloin, cooked to your liking, with a side.', tags: [] },
        { name: 'Griddled trout', desc: 'Lake trout, herb butter and golden potato.', tags: [] },
        { name: 'Criollo chorizo', desc: 'Grilling sausage with bread and house llajua.', tags: [] },
      ],
      principales: [
        { name: 'Cochabamba silpancho', desc: 'Thin milanesa over rice and potato, fried egg and sarza.', tags: [['Cochabambino', 'ember']] },
        { name: 'Trancapecho', desc: 'The silpancho served in bread, juicy and to go.', tags: [] },
        { name: 'Pique macho (medium)', desc: 'Beef and sausage, fries, egg, tomato, onion and locoto.', tags: [['Spicy', 'ember']] },
        { name: 'Pique macho (large)', desc: 'The portion to share, heaping and generously served.', tags: [['To share', 'ember'], ['Spicy', 'ember']] },
        { name: 'Pork chicharrón', desc: 'Pork fried in its own fat, with hominy, chuño and sarza.', tags: [] },
        { name: 'Chicken chicharrón', desc: 'Golden, crispy pieces, with hominy and potato.', tags: [] },
        { name: 'Cochabamba fricasé', desc: 'Pork in a yellow chili broth, hominy and chuño.', tags: [['Spicy', 'ember']] },
        { name: 'Charquekan', desc: 'Shredded beef jerky with hominy, egg and cheese.', tags: [] },
        { name: 'Chicken sajta', desc: 'Chicken in yellow chili, chuño phuti and sarza.', tags: [['Spicy', 'ember']] },
        { name: 'Fritanga', desc: 'Pork in a red chili broth, hominy and corn. From the valley.', tags: [['Spicy', 'ember']] },
        { name: 'Mondongo', desc: 'Pork bathed in red chili, hominy and potato. A Sunday dish.', tags: [['Spicy', 'ember']] },
        { name: 'Falso conejo', desc: 'Beef milanesa in chili sauce, peas, rice and potato.', tags: [] },
        { name: 'Spicy tongue', desc: 'Beef tongue in yellow chili, potato and fluffy rice.', tags: [['Spicy', 'ember']] },
        { name: 'Assorted spicy plate', desc: 'A selection of spicy dishes: chicken, tongue and jerky on one plate.', tags: [['To share', 'ember'], ['Spicy', 'ember']] },
      ],
      postres: [
        { name: 'Warm cuñapé', desc: 'Cheese and cassava-starch rolls, fresh from the oven.', tags: [['Signature', 'ember']] },
        { name: 'Leche asada', desc: 'Baked custard, creamy with toasted caramel.', tags: [] },
        { name: 'Cinnamon ice cream', desc: 'Traditional, hand-churned, with a touch of clove.', tags: [] },
        { name: 'House flan', desc: 'Vanilla flan with caramel, soft and silky.', tags: [] },
      ],
    },
    bar: {
      cocteles: [
        { name: 'Mojito', desc: 'Rum, fresh mint, lime and soda. Refreshing.', prep: 'Made to order' },
        { name: 'Caipirinha', desc: 'Cachaça, lime and sugar. The Brazilian classic.', prep: 'Made to order' },
        { name: 'Sex on the Beach', desc: 'Vodka, peach liqueur, orange and cranberry.', prep: 'Cocktail' },
        { name: 'Chuflay', desc: 'Bolivian singani, ginger ale and lime. House style.', prep: 'National' },
        { name: 'Cuba Libre', desc: 'Rum, cola and a touch of lime.', prep: 'Classic' },
        { name: 'Piña Colada', desc: 'Rum, pineapple and coconut cream. Blended and creamy.', prep: 'Blended' },
        { name: 'Margarita', desc: 'Tequila, triple sec and lime, with a salt rim.', prep: 'Classic' },
        { name: 'Tequila Sunrise', desc: 'Tequila, orange juice and grenadine in a gradient.', prep: 'Cocktail' },
        { name: 'Strawberry Daiquiri', desc: 'Rum, fresh strawberry and lime. Blended with ice.', prep: 'Frozen' },
        { name: 'House Gin & Tonic', desc: 'Premium gin, tonic and fresh botanicals.', prep: 'With botanicals' },
        { name: 'Aperol Spritz', desc: 'Aperol, prosecco and soda. Bubbly and citrusy.', prep: 'With prosecco' },
        { name: 'Cosmopolitan', desc: 'Vodka, triple sec, cranberry and lime.', prep: 'Cocktail' },
      ],
      cervezas: [
        { name: 'Paceña', desc: 'The national lager, light and refreshing. 620 ml bottle.', prep: 'National' },
        { name: 'Huari', desc: 'Premium Bolivian beer made with spring water.', prep: 'Premium' },
        { name: 'Taquiña', desc: 'The Cochabamba beer par excellence. Ice cold.', prep: 'Cochabambina' },
        { name: 'Corona', desc: 'Mexican lager served with a lime wedge.', prep: 'Imported' },
        { name: 'Heineken', desc: 'Dutch lager, balanced body. 330 ml bottle.', prep: 'Imported' },
        { name: 'Bock dark beer', desc: 'Bolivian dark beer, malty with caramel notes.', prep: 'Dark' },
      ],
      naturales: [
        { name: 'Mocochinchi', desc: 'Dried peach simmered with cinnamon and clove.', prep: 'House style' },
        { name: 'Purple api', desc: 'Warm purple corn with cinnamon and lime. With pastry.', prep: 'Hot' },
        { name: 'Tumbo cooler', desc: 'Pressed valley fruit, slightly tart.', prep: 'Cold pressed' },
        { name: 'Peach juice', desc: 'Valley peach, natural and thick.', prep: 'Freshly made' },
      ],
      vinos: [
        { name: 'Tarija red', desc: 'Tannat from the Tarija valley, intense and fruity.', prep: 'Glass' },
        { name: 'Singani Casa Real', desc: 'Our national flagship, distilled from muscat grapes.', prep: 'Shot' },
        { name: 'Valley white', desc: 'Criolla grape, citrus notes, served ice cold.', prep: 'Glass' },
      ],
      sinalcohol: [
        { name: 'House lemonade', desc: 'Fresh lemon and mint, freshly squeezed.', prep: 'Made to order' },
        { name: 'Chicha morada', desc: 'Purple corn, pineapple and spices. Non-alcoholic.', prep: 'House style' },
        { name: 'Coca tea', desc: 'Traditional infusion, ideal for the altitude.', prep: 'Hot' },
      ],
    },
    alm: [
      { ent: 'Peanut soup', sDet: 'Toasted, ground peanuts with shoestring potato and beef.', pri: 'Pork chicharrón with hominy', priDet: 'Crispy cut with peeled hominy, llajua and fresh salad.', pos: 'Leche asada', posDet: 'Baked, with slow house caramel.', beb: 'Mocochinchi cooler', desc: 'Crispy chicharrón with peeled hominy, house llajua and fresh salad.' },
      { ent: 'Noodle soup', sDet: 'Beef broth with noodles, vegetables and mint.', pri: 'Cochabamba silpancho', priDet: 'Thin milanesa over rice and potato, fried egg and criolla sarza.', pos: 'House flan', posDet: 'Soft and creamy, with homemade caramel.', beb: 'Tumbo cooler', desc: 'Thin milanesa over rice and potato, fried egg and criolla sarza.' },
      { ent: 'Vegetable soup', sDet: 'Homestyle broth of fresh valley vegetables, light and comforting.', pri: 'Pique macho', priDet: 'Beef, sausage and fries with egg, tomato and chili.', pos: 'Cinnamon ice cream', posDet: 'Creamy, made in house.', beb: 'Mocochinchi cooler', desc: 'Beef, sausage and fries with egg, tomato and chili.' },
      { ent: 'Chairo paceño', sDet: 'Thick soup of chuño, beef and Andean vegetables.', pri: 'Cochabamba fricasé', priDet: 'Pork in a spicy yellow chili broth with hominy and chuño.', pos: 'Cuñapé', posDet: 'Starch-and-cheese rolls, fresh from the oven.', beb: 'House api', desc: 'Pork in a spicy yellow chili broth with hominy and chuño.' },
      { ent: 'Quinoa soup', sDet: 'Royal quinoa with fresh valley vegetables.', pri: 'Beef jerky', priDet: 'Shredded jerky with hominy, hard-boiled egg and valley cheese.', pos: 'Leche asada', posDet: 'Slow house caramel.', beb: 'Peach juice', desc: 'Shredded jerky with hominy, hard-boiled egg and valley cheese.' },
      { ent: 'Choclo lawa', sDet: 'Thick tender-corn cream with cheese and herbs.', pri: 'Trancapecho', priDet: 'Silpancho inside crispy bread, juicy and truly hearty.', pos: 'Cinnamon ice cream', posDet: 'Refreshing, to close out the week.', beb: 'Tumbo cooler', desc: 'Silpancho inside crispy bread, juicy and truly hearty.' },
      { ent: 'Wheat chaque', sDet: 'Cochabamba stew of peeled wheat, beef and vegetables.', pri: 'Grilled chicken', priDet: 'Juicy charcoal-grilled piece with sides and llajua.', pos: 'Leche asada', posDet: 'Baked, with house caramel.', beb: 'House sangria', desc: 'Juicy charcoal-grilled piece with sides. Weekend lunch.' },
    ],
    car: [
      { name: 'Cochabamba silpancho', meta: 'Signature dish · Cochabamba', story: 'The jewel of the valley: an ultra-thin beef milanesa covering the whole plate, over a bed of rice and potato, crowned with a fried egg and fresh sarza.', ing: ['Breaded beef milanesa', 'Fluffy rice', 'Sliced potato', 'Fried egg', 'Tomato & onion sarza', 'House llajua'] },
      { name: 'Pique macho', meta: 'To share · spicy', story: 'A mountain of flavor made for sharing: beef sirloin and sausage sautéed over fries, with the fiery kick of locoto.', ing: ['Sliced beef sirloin', 'Sausage', 'Fries', 'Hard-boiled egg', 'Tomato, onion & locoto', 'Llajua'] },
      { name: 'Grilled chicken', meta: 'From the grill', story: 'Half a chicken marinated in herbs and charcoal-grilled until the skin is golden, juicy inside and with that unmistakable aroma of fire.', ing: ['Half charcoal chicken', 'Golden potato', 'Fresh salad', 'Chimichurri', 'Llajua'] },
      { name: 'Pork chicharrón', meta: 'Valley tradition', story: 'Pork slowly cooked in its own fat until crispy outside and tender inside, served as Cochabamba tradition demands.', ing: ['Pork fried in its fat', 'Hominy corn', 'Chuño', 'Criolla sarza', 'Llajua'] },
      { name: 'Lamb rack', meta: 'Specialty · from the grill', story: 'Lamb rack roasted over slow fire for hours: tender, smoky and ready to fall off the bone with just a fork.', ing: ['Lamb rack', 'Fluffy rice', 'Fries', 'Salad', 'Chimichurri'] },
    ],
    bill: [
      { name: 'Mixed grill', note: 'To share' },
      { name: 'Silpancho', note: 'With fried egg' },
      { name: 'Mojito', note: 'Ice cold' },
      { name: 'Mocochinchi', note: '' },
      { name: 'Warm cuñapé', note: '' },
    ],
    barView: { eyebrow: 'Bar', title: 'Bar & drinks', desc: 'Craft cocktails made to order, house natural juices and ferments, and a lively cellar.', addBtn: 'Add' },
    acc: {
      eyebrow: 'Your table', title: 'Tab · Table M3', desc: 'Request the bill and pay from your phone with a QR code.', consumo: 'Your order', itemsSuf: ' items', subtotal: 'Subtotal',
      tipPre: 'Tip · optional (', tipSuf: '%)', noTip: 'No tip', total: 'Total', splitBill: 'Split bill', payQR: 'Pay with QR', callWaiter: 'You can also call your server from here.',
    },
    pay: { secure: 'Secure payment', scanToPay: 'Scan to pay', tablePre: 'Table ', waiting: 'Waiting for payment…', simulate: 'Simulate payment received' },
  },
}

/* ============================================================
   COMPONENTE
   ============================================================ */
export default function BrasaClient({ lang, currency = 'BOB' }: { lang: DemoLang; currency?: 'BOB' | 'USD' }) {
  const c = CONTENT[lang]
  const numLocale = c.numLocale
  const money = (n: number) => moneyFmt(n, numLocale, currency)
  const curSym = currency === 'USD' ? '$' : c.carta.bs
  const pricesNote =
    currency === 'USD'
      ? lang === 'es'
        ? 'Precios en USD, impuestos incluidos · consulta a tu mesero sobre alérgenos'
        : 'Prices in USD, taxes included · ask your server about allergens'
      : c.carta.pricesNote
  const dow = c.dow
  const mon = c.mon
  const dateStr = (i: number) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const dw = dow[d.getDay()]
    const mo = mon[d.getMonth()]
    return (i === 0 ? c.res.today : i === 1 ? c.res.tomorrow : dw) + ' ' + d.getDate() + ' ' + mo
  }
  const dateOptions = Array.from({ length: 10 }, (_, i) => {
    const d = mkDate(i)
    return { value: String(i), label: (i === 0 ? c.res.today : i === 1 ? c.res.tomorrow : dow[d.getDay()] + ' ') + ' ' + d.getDate() + ' ' + mon[d.getMonth()] }
  })
  const partyOptions = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: String(n), label: n + (n === 8 ? c.res.personPlus : n === 1 ? c.res.personSing : c.res.personPlur) }))
  const allTimeOptions = [{ value: '', label: c.res.anyTime }].concat(turnos.comida.concat(turnos.cena).map((t) => ({ value: t, label: t })))
  const rootRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const carHover = useRef(false)

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [view, setView] = useState('inicio')
  const [toast, setToast] = useState<string | null>(null)

  const [qDateI, setQDateI] = useState(0)
  const [qParty, setQParty] = useState(2)
  const [qTurno, setQTurno] = useState<'comida' | 'cena'>('cena')
  const [qTime, setQTime] = useState('')

  const [resStep, setResStep] = useState<number | 'done'>(1)
  const [resTable, setResTable] = useState<ResTable | null>(null)
  const [resName, setResName] = useState('')
  const [resPhone, setResPhone] = useState('')
  const [resEmail, setResEmail] = useState('')
  const [resNote, setResNote] = useState('')
  const [resCode, setResCode] = useState('')

  const [menuCat, setMenuCat] = useState('parrilla')
  const [barCat, setBarCat] = useState('cocteles')
  const [carIdx, setCarIdx] = useState(0)
  // Slides cuya foto ya se puede bajar. El carrusel enseña UNA a la vez, pero los 5 fondos
  // estaban en el DOM desde el inicio y sus 302 kB salían junto con el hero, robándole ancho de
  // banda: el hero de 93 kB tardaba 3.2 s en vez de 0.5 s. Se empieza con la visible y se van
  // sumando al avanzar (ver efecto abajo: siempre se precarga la siguiente).
  const [carLoaded, setCarLoaded] = useState<number[]>([0])
  // El carrusel vive bajo el pliegue: hasta que no se acerca, ni su primera foto se pide.
  // Sin esto, silpancho.webp salia a los 476 ms y le robaba ancho de banda a la imagen del LCP.
  const [carRef, carVisible] = useLazyBg<HTMLDivElement>()

  const [tip, setTip] = useState(10)
  const [qrOpen, setQrOpen] = useState(false)

  const [user, setUser] = useState<User | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [auName, setAuName] = useState('')
  const [auEmail, setAuEmail] = useState('')
  const [auPhone, setAuPhone] = useState('')
  const [auPass, setAuPass] = useState('')
  const [authErr, setAuthErr] = useState('')
  const [acctOpen, setAcctOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [myRes, setMyRes] = useState<MyRes[]>([])

  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderMode, setOrderMode] = useState<'mesa' | 'llevar' | 'delivery'>('mesa')
  const [mesaNum, setMesaNum] = useState('')
  const [orderDone, setOrderDone] = useState(false)
  const [orderCode, setOrderCode] = useState('')
  const [myOrders, setMyOrders] = useState<MyOrder[]>([])

  const [tab, setTab] = useState<TabRound[]>([])
  const [billOpen, setBillOpen] = useState(false)
  const [myTable, setMyTable] = useState('')

  const viewRef = useRef(view)
  viewRef.current = view

  /* mount: cargar sesión, carrito, cuenta + autoplay carrusel */
  useEffect(() => {
    try {
      const em = ensureDemoSession() || localStorage.getItem('brasa_session')
      if (em) { const u = readUsers()[em]; if (u) { setUser({ name: u.name, email: u.email, phone: u.phone || '' }); setMyRes(u.res || []); setMyOrders(u.orders || []) } }
    } catch { /* noop */ }
    try { const c = JSON.parse(localStorage.getItem('brasa_cart') || '[]'); if (Array.isArray(c)) setCart(c) } catch { /* noop */ }
    try { const t = JSON.parse(localStorage.getItem('brasa_tab') || '[]'); if (Array.isArray(t) && t.length) { setTab(t); setOrderDone(true); setOrderCode(t[t.length - 1].code) } } catch { /* noop */ }

    const timer = setInterval(() => {
      if (!carHover.current && viewRef.current === 'inicio') setCarIdx((c) => (c + 1) % carData.length)
    }, 6000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setMyTable(readMyTable(user)) }, [user])

  const flash = (m: string) => { setToast(m); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2200) }

  /* -------- navegación / tema -------- */
  const go = (v: string) => { setView(v); setQrOpen(false); try { window.scrollTo(0, 0) } catch { /* noop */ } }
  const goInicio = () => go('inicio')
  const goReservar = () => go('reservar')
  const goCarta = () => go('carta')
  const goBar = () => go('bar')
  const goCuenta = () => go('cuenta')
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  /* -------- auth -------- */
  const openAuth = (mode: 'login' | 'register') => { setAuthOpen(true); setAuthMode(mode || 'login'); setAuthErr('') }
  const openLogin = () => openAuth('login')
  const closeAuth = () => { setAuthOpen(false); setAuthErr('') }
  const applyAuthMode = (m: 'login' | 'register') => { setAuthMode(m); setAuthErr('') }
  const stopProp = (e: ReactMouseEvent) => { e.stopPropagation() }

  const doRegister = () => {
    const em = (auEmail || '').trim().toLowerCase()
    if (!auName.trim()) { setAuthErr(c.msg.needName); return }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { setAuthErr(c.msg.invalidEmail); return }
    if ((auPass || '').length < 4) { setAuthErr(c.msg.shortPass); return }
    const users = readUsers()
    if (users[em]) { setAuthErr(c.msg.emailExists); return }
    users[em] = { name: auName.trim(), email: em, phone: auPhone.trim(), pass: auPass, res: [] }
    writeUsers(users); setSession(em)
    setUser({ name: users[em].name, email: em, phone: users[em].phone }); setMyRes([])
    setAuthOpen(false); setAuName(''); setAuEmail(''); setAuPhone(''); setAuPass(''); setAuthErr('')
    flash(c.msg.welcome(users[em].name.split(' ')[0]))
  }
  const doLogin = () => {
    const em = (auEmail || '').trim().toLowerCase()
    const users = readUsers(); const u = users[em]
    if (!u || u.pass !== auPass) { setAuthErr(c.msg.badCreds); return }
    setSession(em)
    setUser({ name: u.name, email: em, phone: u.phone || '' }); setMyRes(u.res || [])
    setAuthOpen(false); setAuEmail(''); setAuPass(''); setAuthErr('')
    flash(c.msg.hiAgain(u.name.split(' ')[0]))
  }
  const authSubmit = () => { if (authMode === 'register') doRegister(); else doLogin() }
  const logout = () => { try { localStorage.removeItem('brasa_session'); sessionStorage.setItem('brasa_demo_logout', '1') } catch { /* noop */ } setUser(null); setMyRes([]); setMyOrders([]); setAcctOpen(false); flash(c.msg.loggedOut) }
  const toggleAcct = () => setAcctOpen((s) => !s)
  const saveRes = (res: MyRes) => {
    if (!user) return
    const users = readUsers(); const rec = users[user.email]; if (!rec) return
    rec.res = rec.res || []; rec.res.unshift(res); writeUsers(users); setMyRes(rec.res)
  }

  /* -------- carrito / pedidos -------- */
  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    const next = cart.slice(); const ix = next.findIndex((x) => x.id === item.id)
    if (ix >= 0) next[ix] = { ...next[ix], qty: next[ix].qty + 1 }
    else next.push({ ...item, qty: 1 })
    saveCartLS(next); setCart(next); setCartOpen(true); setOrderDone(false)
  }
  const incItem = (id: string) => { const next = cart.map((x) => x.id === id ? { ...x, qty: x.qty + 1 } : x); saveCartLS(next); setCart(next) }
  const decItem = (id: string) => { const next = cart.map((x) => x.id === id ? { ...x, qty: x.qty - 1 } : x).filter((x) => x.qty > 0); saveCartLS(next); setCart(next) }
  const setItemNote = (id: string, e: { target: { value: string } }) => { const note = e.target.value; const next = cart.map((x) => x.id === id ? { ...x, note } : x); saveCartLS(next); setCart(next) }
  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)
  const checkout = () => {
    if (!cart.length) return
    if (!user) { setAuthOpen(true); setAuthMode('register'); setAuthErr(c.msg.needAccountOrder); return }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const code = 'PD-' + Math.floor(1000 + Math.random() * 9000)
    const modeLabel = ({ mesa: c.mode.mesa, llevar: c.mode.llevar, delivery: c.mode.delivery } as Record<string, string>)[orderMode] || c.mode.mesa
    const items: TabItem[] = cart.map((i) => ({ name: i.name, qty: i.qty, cat: i.cat || 'cocina', price: i.price, note: (i.note || '').trim() }))
    const mesaNumVal = (orderMode === 'mesa') ? ((mesaNum || '').trim() || readMyTable(user)) : ''
    const round: TabRound = { code, mode: modeLabel, total, items, time: nowTime(), table: mesaNumVal }
    const nextTab = (tab || []).concat([round]); saveTabLS(nextTab)
    const order: MyOrder = { code, mode: modeLabel, total, items, when: dateStr(0) }
    const users = readUsers(); const rec = users[user.email]
    if (rec) { rec.orders = rec.orders || []; rec.orders.unshift(order); writeUsers(users) }
    const push: Record<string, unknown> = { code, customer: user.name, guest: user.name, mode: modeLabel, total, items, time: nowTime(), ts: Date.now(), status: 'nuevo' }
    if (mesaNumVal) push.table = mesaNumVal
    pushGlobal('brasa_orders', push)
    saveCartLS([])
    setCart([]); setTab(nextTab); setOrderDone(true); setOrderCode(code); setBillOpen(false); setMyOrders((rec && rec.orders) || [])
    flash(c.msg.orderAdded(code))
  }
  const addMore = () => { setOrderDone(false); setCartOpen(false); setView('carta') }
  const orderDrink = () => { setOrderDone(false); setCartOpen(false); setView('bar') }
  const requestBill = () => {
    pushGlobal('brasa_bill_requests', { customer: user ? user.name : c.msg.clientFallback, total: (tab || []).reduce((s, r) => s + r.total, 0), time: nowTime(), ts: Date.now() })
    setBillOpen(true)
  }
  const hideBill = () => setBillOpen(false)
  const closeTab = () => { saveTabLS([]); setTab([]); setBillOpen(false); setOrderDone(false); setOrderCode(''); setCartOpen(false); setView('inicio'); flash(c.msg.tabClosed) }

  /* -------- reservar -------- */
  const onQTime = (v: string) => { const turno = turnos.comida.includes(v) ? 'comida' : 'cena'; setQTime(v); setQTurno(turno) }
  const quickReserve = () => { setView('reservar'); setResStep(qTime ? 2 : 1); try { window.scrollTo(0, 0) } catch { /* noop */ } }
  const pickTurno = (t: 'comida' | 'cena') => { setQTurno(t); setQTime('') }
  const pickTime = (t: string) => { if (takenTimes[t]) return; setQTime(t) }
  const toStep1 = () => setResStep(1)
  const toStep2 = () => { if (!qTime) { flash(c.msg.pickTime); return } setResStep(2); try { window.scrollTo(0, 0) } catch { /* noop */ } }
  const toStep3 = () => {
    if (!resTable) { flash(c.msg.pickTable); return }
    if (user) { if (!resName) setResName(user.name); if (!resEmail) setResEmail(user.email); if (!resPhone) setResPhone(user.phone) }
    setResStep(3); try { window.scrollTo(0, 0) } catch { /* noop */ }
  }
  const pickTable = (zName: string, t: { id: string; seats: number; taken?: boolean }) => { if (t.taken) return; setResTable({ zone: zName, id: t.id, seats: t.seats }) }
  const confirmRes = () => {
    if (!user) { setAuthOpen(true); setAuthMode('register'); setAuthErr(c.msg.needAccountRes); return }
    if (!resName.trim()) { flash(c.msg.needName); return }
    const code = 'BR-' + Math.floor(1000 + Math.random() * 9000)
    const rr: MyRes = { code, date: dateStr(qDateI), time: qTime, party: qParty, table: resTable ? resTable.id : '', zone: resTable ? resTable.zone : '' }
    saveRes(rr)
    pushGlobal('brasa_reservations', { ...rr, customer: user.name, ts: Date.now(), status: 'confirmada' })
    setResStep('done'); setResCode(code); try { window.scrollTo(0, 0) } catch { /* noop */ }
  }
  const resetRes = () => { setResStep(1); setResTable(null); setResName(''); setResPhone(''); setResEmail(''); setResNote(''); setQTime('') }

  /* -------- carrusel / menú / cuenta -------- */
  // Habilita la foto de la slide actual y precarga la siguiente, así al avanzar ya está lista y
  // no se ve un hueco. Nunca quita ninguna: una vez bajada, se queda en cache.
  useEffect(() => {
    const next = (carIdx + 1) % carData.length
    setCarLoaded((prev) =>
      prev.includes(carIdx) && prev.includes(next) ? prev : [...new Set([...prev, carIdx, next])]
    )
  }, [carIdx])

  const carGo = (i: number) => { const n = carData.length; setCarIdx(((i % n) + n) % n) }
  const carNext = () => carGo(carIdx + 1)
  const carPrev = () => carGo(carIdx - 1)
  const splitBill = () => flash(c.msg.billSplit)
  const payQR = () => setQrOpen(true)
  const closeQR = () => setQrOpen(false)
  const confirmPaid = () => { setQrOpen(false); flash(c.msg.paymentReceived) }

  /* ============================================================
     VALORES DERIVADOS (renderVals)
     ============================================================ */
  const active = (on: boolean) => ({ bg: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--bg)' : 'var(--muted)', border: on ? 'var(--ink)' : 'var(--line2)' })

  const navDefs: [string, string, () => void][] = [['inicio', c.nav.inicio, goInicio], ['reservar', c.nav.reservar, goReservar], ['carta', c.nav.carta, goCarta], ['bar', c.nav.bar, goBar], ['cuenta', c.nav.cuenta, goCuenta]]
  const navLinks = navDefs.map(([k, label, fn]) => ({ label, onClick: fn, weight: view === k ? '700' : '500', color: view === k ? 'var(--ink)' : 'var(--muted)' }))

  const highlights = [
    { icon: <Icon name="grill" size={22} />, title: c.home.highlights[0].title, text: c.home.highlights[0].text },
    { icon: <Icon name="glass" size={22} />, title: c.home.highlights[1].title, text: c.home.highlights[1].text },
    { icon: <Icon name="clock" size={22} />, title: c.home.highlights[2].title, text: c.home.highlights[2].text },
  ]

  const cur = resStep === 'done' ? 4 : resStep
  const resSteps = ([[1, c.res.steps[0]], [2, c.res.steps[1]], [3, c.res.steps[2]]] as [number, string][]).map(([n, label], i) => {
    const on = cur >= n
    return { n: String(n), label, hasBar: i < 2, bg: on ? 'var(--ember)' : 'var(--surface2)', color: on ? '#fff' : 'var(--muted2)', textColor: cur === n ? 'var(--ink)' : 'var(--muted)' }
  })
  const dateChips = Array.from({ length: 7 }, (_, i) => {
    const d = mkDate(i); const on = qDateI === i
    return { dow: i === 0 ? c.res.today : dow[d.getDay()], day: String(d.getDate()), mon: mon[d.getMonth()], onClick: () => setQDateI(i), bg: on ? 'var(--ember)' : 'var(--surface2)', color: on ? '#fff' : 'var(--ink)', border: on ? 'var(--ember)' : 'var(--line)' }
  })
  const partyChips = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => { const on = qParty === n; return { label: n === 8 ? '8+' : String(n), onClick: () => setQParty(n), bg: on ? 'var(--ember)' : 'var(--surface2)', color: on ? '#fff' : 'var(--ink)', border: on ? 'var(--ember)' : 'var(--line)' } })
  const turnoTabs = ([['comida', c.res.turnoComida], ['cena', c.res.turnoCena]] as ['comida' | 'cena', string][]).map(([k, l]) => { const on = qTurno === k; return { label: l, onClick: () => pickTurno(k), bg: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--bg)' : 'var(--muted)' } })
  const timeSlots = turnos[qTurno].map((t) => { const taken = !!takenTimes[t]; const sel = qTime === t; return { label: t, onClick: () => pickTime(t), bg: sel ? 'var(--ember)' : 'var(--surface2)', color: taken ? 'var(--muted2)' : (sel ? '#fff' : 'var(--ink)'), border: sel ? 'var(--ember)' : 'var(--line)', cursor: taken ? 'not-allowed' : 'pointer', deco: taken ? 'line-through' : 'none' } })
  const step1Ready = !!qTime
  const step1Bg = step1Ready ? 'var(--ember)' : 'var(--surface3)'; const step1Color = step1Ready ? '#fff' : 'var(--muted2)'; const step1Cursor = step1Ready ? 'pointer' : 'not-allowed'

  const zones = zonesData.map((z, zi) => ({
    name: c.zones[zi].name, note: c.zones[zi].note, icon: <Icon name={z.icon} size={18} />,
    tables: z.tables.map((t) => {
      const sel = !!resTable && resTable.id === t.id; const wide = t.seats >= 6
      return { id: t.id, seatsLabel: t.seats + c.res.seatsSuf, w: wide ? '104px' : '72px', radius: z.key === 'barra' ? '50px' : '13px', onClick: () => pickTable(c.zones[zi].name, t), taken: !!t.taken,
        bg: t.taken ? 'var(--surface3)' : (sel ? 'var(--ember)' : 'var(--surface2)'), color: t.taken ? 'var(--muted2)' : (sel ? '#fff' : 'var(--ink)'), border: sel ? 'var(--ember)' : (t.taken ? 'var(--line)' : 'var(--line2)'), cursor: t.taken ? 'not-allowed' : 'pointer', opacity: t.taken ? '.5' : '1' }
    }),
  }))
  const step2Ready = !!resTable
  const step2Bg = step2Ready ? 'var(--ember)' : 'var(--surface3)'; const step2Color = step2Ready ? '#fff' : 'var(--muted2)'; const step2Cursor = step2Ready ? 'pointer' : 'not-allowed'
  const resSummaryTop = resTable ? (c.res.tablePre + resTable.id + ' · ' + resTable.zone) : c.res.pickTablePrompt
  const selDate = mkDate(qDateI)
  const resSummary = [
    { k: c.res.sumFecha, v: (qDateI === 0 ? c.res.todayComma : '') + selDate.getDate() + ' ' + mon[selDate.getMonth()] },
    { k: c.res.sumHora, v: qTime || '—' },
    { k: c.res.sumComensales, v: qParty + (qParty === 8 ? '+' : '') },
    { k: c.res.sumMesa, v: resTable ? (resTable.id + ' · ' + resTable.zone) : '—' },
  ]

  const weekMenu = weekOrder.map((k) => {
    const ai = almuerzoData.findIndex((x) => x.d === k); const a = almuerzoData[ai]; const ca = c.alm[ai]
    const on = (k === almToday.d); const fin = !!a.fin; const wknd = (k === 'sábado' || k === 'domingo')
    return {
      day: c.dayCap[k], precioNum: currency === 'USD' ? String(usdFromBs(a.precio)) : String(a.precio), heroImg: localMenuImg(sopaSlug[k]), heroName: ca.ent, heroDetail: ca.sDet, heroEyebrow: c.carta.soupOfDay,
      onAddAlmuerzo: () => addToCart({ id: 'alm-' + k, name: c.carta.lunchItemPre + c.dayCap[k], price: a.precio, cat: 'cocina', img: weeklyMainImg(heroSlug[k]) }),
      sides: [
        { label: c.carta.sideSegundo, name: ca.pri, detail: ca.priDet, img: weeklyMainImg(heroSlug[k]), noImg: false },
        { label: c.carta.sidePostre, name: ca.pos, detail: ca.posDet, img: '', noImg: true },
        { label: c.carta.sideRefresco, name: ca.beb, detail: c.carta.refrescoDetail, img: img(a.bid, 420), noImg: false },
      ],
      tag: on ? c.carta.tagToday : (wknd ? c.carta.tagWeekend : ''),
      tagBg: on ? 'var(--ember)' : 'transparent',
      tagColor: on ? '#fff' : '#e8b98a',
      tagBorder: on ? '1px solid transparent' : '1px solid rgba(224,160,110,.5)',
      cardBg: on ? 'linear-gradient(165deg,rgba(200,80,46,.26),rgba(255,255,255,.02))' : (fin ? 'linear-gradient(165deg,rgba(200,80,46,.12),rgba(255,255,255,.015))' : 'linear-gradient(165deg,rgba(255,255,255,.045),rgba(255,255,255,.012))'),
      cardBorder: on ? 'rgba(230,120,70,.6)' : (fin ? 'rgba(220,130,80,.34)' : 'rgba(255,255,255,.09)'),
      glow: on ? '0 26px 52px -28px rgba(200,80,46,.6)' : (fin ? '0 22px 46px -30px rgba(180,90,50,.5)' : '0 18px 42px -30px rgba(0,0,0,.62)'),
      orderAuthed: (!!user && on), disabledDay: (!!user && !on), disabledLabel: c.carta.availOnPre + c.dayCap[k],
    }
  })

  const menuCatIdx = menuCatDefs.findIndex(([k]) => k === menuCat)
  const menuCatLabel = menuCatIdx >= 0 ? c.menuCats[menuCatIdx] : c.carta.alaCarta
  // `img: ''` en las slides aún no habilitadas -> sin URL en el DOM, sin petición. Ver carLoaded.
  const carSlides = carData.map((d, i) => ({ name: c.car[i].name, price: money(d.price), meta: c.car[i].meta, story: c.car[i].story, img: carVisible && carLoaded.includes(i) ? (localDish[d.name] ? localMenuImg(localDish[d.name]) : img(carImgId[d.name] || dishDefault, 828)) : '', ing: c.car[i].ing, op: i === carIdx ? '1' : '0', pe: i === carIdx ? 'auto' : 'none', z: i === carIdx ? 2 : 1 }))
  const carDots = carData.map((d, i) => ({ onClick: () => carGo(i), bg: i === carIdx ? 'var(--ember)' : 'var(--line2)', w: i === carIdx ? '26px' : '9px' }))
  const menuCats = menuCatDefs.map(([k], i) => { const on = menuCat === k; return { label: c.menuCats[i], onClick: () => setMenuCat(k), ...active(on) } })
  const menuItems = (menuData[menuCat] || []).map((m, i) => {
    const mc = c.menu[menuCat][i]
    return {
      name: mc.name, price: money(m.price), desc: mc.desc, img: dishImage(m.name, 600), delay: (i * 0.05) + 's',
      onAdd: () => addToCart({ id: 'm-' + menuCat + '-' + i, name: mc.name, price: m.price, cat: 'cocina', img: dishImage(m.name, 300) }),
      tags: mc.tags.map(([label, kind]) => ({ label, color: kind === 'ember' ? '#fff' : '#2e7d55', bg: kind === 'ember' ? 'var(--ember)' : 'rgba(46,125,85,.14)' })),
    }
  })

  const barCats = barCatDefs.map(([k], i) => { const on = barCat === k; return { label: c.barCats[i], onClick: () => setBarCat(k), ...active(on) } })
  const barItems = (barData[barCat] || []).map((b, i) => { const bc = c.bar[barCat][i]; return { name: bc.name, price: money(b.price), desc: bc.desc, img: img(b.img, 400), prep: bc.prep || '', delay: (i * 0.05) + 's', onAdd: () => addToCart({ id: 'b-' + barCat + '-' + i, name: bc.name, price: b.price, cat: 'bar', img: img(b.img, 300) }) } })

  const billItems = billData.map((b, i) => ({ name: c.bill[i].name, qty: '×' + b.qty, note: c.bill[i].note || '—', lineFmt: money(b.price * b.qty) }))
  const subtotal = billData.reduce((s, b) => s + b.price * b.qty, 0)
  const tipAmt = Math.round(subtotal * tip / 100)
  const tipOptions = [0, 10, 15, 20].map((t) => { const on = tip === t; return { label: t === 0 ? c.acc.noTip : t + '%', onClick: () => setTip(t), bg: on ? 'var(--ember)' : 'var(--surface2)', color: on ? '#fff' : 'var(--ink)', border: on ? 'var(--ember)' : 'var(--line)' } })

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartItems = cart.map((i) => ({ id: i.id, name: i.name, img: i.img, qty: String(i.qty), lineFmt: money(i.price * i.qty), note: i.note || '', setNote: (e: { target: { value: string } }) => setItemNote(i.id, e), inc: () => incItem(i.id), dec: () => decItem(i.id) }))
  const tabRounds = tab.map((r, i) => ({ label: c.cart.roundPre + (i + 1), code: r.code, time: r.time, mode: r.mode, itemsLine: r.items.map((it) => it.qty + '× ' + it.name).join(', '), subtotal: money(r.total) }))
  const tabTotalFmt = money(tab.reduce((s, r) => s + r.total, 0))
  const orderModes = ([['mesa', c.mode.mesa], ['llevar', c.mode.llevar], ['delivery', c.mode.delivery]] as ['mesa' | 'llevar' | 'delivery', string][]).map(([k, l]) => ({ label: l, onClick: () => setOrderMode(k), bg: orderMode === k ? 'var(--ember)' : 'var(--surface2)', color: orderMode === k ? '#fff' : 'var(--ink)', border: orderMode === k ? 'var(--ember)' : 'var(--line)' }))
  const myResLines = myRes.map((r) => ({ code: r.code, line: (r.date || '') + ' · ' + (r.time || '') + ' · ' + r.party + c.acct.partySuf + (r.table ? ' · ' + r.table : '') }))
  const myOrderLines = myOrders.map((o) => ({ code: o.code, line: o.mode + ' · ' + money(o.total) }))

  const isAuthed = !!user; const isGuest = !user
  const userFirst = user ? user.name.split(' ')[0] : ''
  const userInitial = user ? (user.name.trim().charAt(0) || '').toUpperCase() : ''
  const showTab = orderDone && !billOpen
  const showBill = orderDone && billOpen
  const showEmptyCart = !orderDone && cart.length === 0
  const showActiveCart = !orderDone && cart.length > 0
  const mesaPlaceholder = myTable || c.cart.mesaPh
  // Imagen del LCP. Local, NO unsplash: es la misma foto (auto-hospedada), pero optimizar una
  // remota con el cache frio cuesta ~350 ms de servidor contra ~35 ms de una local — o sea que el
  // primer visitante tras cada deploy se comia +315 ms y brasa se pasaba de 2500 ms. Medirlo con
  // el cache caliente lo ocultaba.
  // 828 y no mas: es un fondo oscuro detras de texto, y a 828 cubre una pantalla de 390px a 2x.
  const heroImg = optimized('/showcase/img/parrilla.webp', 828)
  const almuerzoWeekPrice = money(45)

  /* estilos reutilizados */
  const selectStyle: CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 11, padding: '12px 13px', fontSize: 14, cursor: 'pointer', color: 'var(--ink)' }
  const authInput: CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 11, padding: '12px 13px', fontSize: 14, color: 'var(--ink)', width: '100%', boxSizing: 'border-box' }
  const resInput: CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 11, padding: '12px 14px', fontSize: 14, color: 'var(--ink)' }

  return (
    <div ref={rootRef} data-theme={theme} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', transition: 'background .4s' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
      <style>{`
        .brasa *{box-sizing:border-box}
        [data-theme="light"]{--bg:#f7f1e7;--surface:#fffdf8;--surface2:#f1e9db;--surface3:#ece1cd;--line:#e6dcc9;--line2:#d8ccb4;--ink:#241d16;--ink2:#3f362b;--muted:#7d7264;--muted2:#a89a86;--ember:#bf4a26;--gold:#a97e34;--glass:rgba(247,241,231,.82)}
        [data-theme="dark"]{--bg:#15100a;--surface:#1e1710;--surface2:#251d12;--surface3:#2f2416;--line:#352a1b;--line2:#443626;--ink:#f1e8d9;--ink2:#d8ccbb;--muted:#a89a86;--muted2:#7d7264;--ember:#e0663a;--gold:#c8a24e;--glass:rgba(21,16,10,.82)}
        .brasa{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        .brasa ::selection{background:var(--ember);color:#fff}
        .brasa input,.brasa select,.brasa textarea{font-family:inherit;color:var(--ink)}
        .brasa input::placeholder,.brasa textarea::placeholder{color:var(--muted2)}
        .brasa input:focus,.brasa textarea:focus{outline:none;border-color:var(--ember)!important}
        .brasa .serif{font-family:'Cormorant Garamond',serif}
        @keyframes brasaFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes brasaViewIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes brasaRise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes brasaDrawerIn{from{transform:translateY(30px);opacity:.3}to{transform:none;opacity:1}}
        @keyframes brasaEmber{0%,100%{opacity:.75;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}
        @keyframes brasaKenburns{from{transform:scale(1.05)}to{transform:scale(1.16)}}
        @keyframes brasaPop{0%{transform:scale(.9);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        @keyframes brasaToastIn{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
        @keyframes brasaSlideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
      `}</style>

      <div className="brasa">

      {/* ============ HEADER ============ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--glass)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
        <div className="dnav brasa-hd" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 26px', height: 70, display: 'flex', alignItems: 'center', gap: 26 }}>
          <div onClick={goInicio} style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(150deg,var(--ember),#7d2a15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px -6px var(--ember)', color: '#fff' }}><Icon name="flame" size={19} /></span>
            <span className="serif" style={{ fontSize: 25, fontWeight: 600, letterSpacing: '.26em', paddingLeft: '.26em' }}>BRASA</span>
          </div>
          {/* Menú de secciones inline (desktop) */}
          <nav className="dnav-hide" style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            {navLinks.map((n, i) => (
              <button key={i} onClick={n.onClick} {...hover({ color: n.color }, { color: 'var(--ink)' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: Number(n.weight), color: n.color, padding: '9px 14px', borderRadius: 9, transition: 'color .2s' }}>{n.label}</button>
            ))}
          </nav>
          {/* Menú hamburguesa (móvil) — mismas secciones en un desplegable */}
          <div className="dnav-only" style={{ position: 'relative', flexShrink: 0, order: -1 }}>
            <button
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              {...hover({ background: 'var(--surface2)' }, { background: 'var(--surface)' })}
              style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1 }}
            >
              {menuOpen
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>}
            </button>
            {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 59 }} />}
            {menuOpen && (
              <div style={{ position: 'absolute', top: 48, left: 0, minWidth: 210, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, boxShadow: '0 26px 56px -20px rgba(20,14,8,.55)', padding: 8, zIndex: 60, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map((n, i) => (
                  <button key={i} onClick={() => { n.onClick(); setMenuOpen(false) }} style={{ background: view === navDefs[i][0] ? 'var(--surface2)' : 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: Number(n.weight), color: n.color, padding: '12px 14px', borderRadius: 10, textAlign: 'left', transition: 'background .2s,color .2s' }}>{n.label}</button>
                ))}
              </div>
            )}
          </div>
          <div className="dnav-hide" style={{ flex: 1 }} />
          <button onClick={toggleTheme} title={c.header.themeTitle} aria-label={c.header.themeTitle} className="brasa-hd-theme" {...hover({ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' }, { background: 'var(--surface2)', borderColor: 'var(--ember)', color: 'var(--ember)' })} style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .22s, border-color .22s, color .22s', flexShrink: 0 }}>{theme === 'light' ? <Icon name="moon" size={17} /> : <Icon name="sun" size={17} />}</button>
          <button onClick={openCart} title={c.header.cartTitle} aria-label={c.header.cartTitle} className="brasa-hd-cart" {...hover({ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' }, { background: 'var(--surface2)', borderColor: 'var(--ember)', color: 'var(--ember)' })} style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .22s, border-color .22s, color .22s', flexShrink: 0 }}>
            <Icon name="bag" size={18} />
            {cartCount > 0 && <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 19, height: 19, padding: '0 4px', borderRadius: 10, background: 'var(--ember)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: '2px solid var(--surface)' }}>{cartCount}</span>}
          </button>
          {isGuest && (
            <button onClick={openLogin} {...hover({ background: 'var(--surface)' }, { background: 'var(--surface2)' })} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', padding: '10px 17px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="users" size={16} />{c.header.login}</button>
          )}
          {isAuthed && (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button onClick={toggleAcct} {...hover({ background: 'var(--surface)' }, { background: 'var(--surface2)' })} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--surface)', border: '1px solid var(--line)', padding: '5px 14px 5px 5px', borderRadius: 40, cursor: 'pointer' }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(150deg,var(--ember),#7d2a15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{userInitial}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{userFirst}</span>
              </button>
              {acctOpen && (
                <div style={{ position: 'absolute', top: 52, right: 0, width: 288, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, boxShadow: '0 26px 56px -20px rgba(20,14,8,.55)', padding: 17, zIndex: 60 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{user!.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{user!.email}</div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.13em', color: 'var(--muted)', marginBottom: 9 }}>{c.acct.myRes}</div>
                  {myResLines.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                      {myResLines.map((r, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '9px 11px' }}><span style={{ fontSize: 12, color: 'var(--ink)' }}>{r.line}</span><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ember)', whiteSpace: 'nowrap' }}>{r.code}</span></div>
                      ))}
                    </div>
                  )}
                  {myResLines.length === 0 && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14 }}>{c.acct.noRes}</div>}
                  {myOrderLines.length > 0 && (
                    <>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.13em', color: 'var(--muted)', marginBottom: 9 }}>{c.acct.myOrders}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        {myOrderLines.map((o, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '9px 11px' }}><span style={{ fontSize: 12, color: 'var(--ink)' }}>{o.line}</span><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ember)', whiteSpace: 'nowrap' }}>{o.code}</span></div>
                        ))}
                      </div>
                    </>
                  )}
                  <button onClick={logout} {...hover({ background: 'var(--surface2)' }, { background: 'var(--surface3)' })} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--line)', color: 'var(--ink)', padding: 10, borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{c.acct.logout}</button>
                </div>
              )}
            </div>
          )}
          <button onClick={goReservar} className="brasa-hd-reserve" {...hover({ background: 'var(--ink)', color: 'var(--bg)' }, { background: 'var(--ember)', color: '#fff' })} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '11px 20px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, flexShrink: 0 }}>{c.header.reserveTable}</button>
        </div>
      </header>

      {/* ==================== AUTH MODAL ==================== */}
      {authOpen && (
        <div onClick={closeAuth} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(14,9,5,.62)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22, animation: 'brasaFadeUp .25s ease both' }}>
          <div onClick={stopProp} style={{ width: '100%', maxWidth: 430, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, boxShadow: '0 40px 90px -30px rgba(14,9,5,.7)', padding: '30px 30px 26px', animation: 'brasaRise .3s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(150deg,var(--ember),#7d2a15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px -6px var(--ember)', color: '#fff' }}><Icon name="flame" size={19} /></span>
              <span className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '.24em', paddingLeft: '.24em' }}>BRASA</span>
            </div>
            {authMode === 'register' && (<><h2 className="serif" style={{ fontSize: 27, fontWeight: 600, margin: '14px 0 4px' }}>{c.auth.regTitle}</h2><p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>{c.auth.regDesc}</p></>)}
            {authMode === 'login' && (<><h2 className="serif" style={{ fontSize: 27, fontWeight: 600, margin: '14px 0 4px' }}>{c.auth.loginTitle}</h2><p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>{c.auth.loginDesc}</p></>)}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {authMode === 'register' && (
                <>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{c.auth.nameLabel}</span><input value={auName} onChange={(e) => setAuName(e.target.value)} placeholder={c.auth.namePh} style={authInput} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{c.auth.phoneLabel}</span><input value={auPhone} onChange={(e) => setAuPhone(e.target.value)} placeholder={c.auth.phonePh} style={authInput} /></label>
                </>
              )}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{c.auth.emailLabel}</span><input value={auEmail} onChange={(e) => setAuEmail(e.target.value)} type="email" placeholder={c.auth.emailPh} style={authInput} /></label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{c.auth.passLabel}</span><input value={auPass} onChange={(e) => setAuPass(e.target.value)} type="password" placeholder={c.auth.passPh} style={authInput} /></label>
            </div>
            {!!authErr && <div style={{ marginTop: 13, background: 'rgba(200,80,46,.1)', border: '1px solid rgba(200,80,46,.3)', color: 'var(--ember)', borderRadius: 10, padding: '10px 12px', fontSize: 12.5, lineHeight: 1.45 }}>{authErr}</div>}
            <button onClick={authSubmit} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ marginTop: 18, width: '100%', background: 'var(--ember)', color: '#fff', border: 'none', padding: 14, borderRadius: 12, cursor: 'pointer', fontSize: 14.5, fontWeight: 600 }}>{authMode === 'register' ? c.auth.createBtn : c.auth.loginBtn}</button>
            {authMode === 'register' && <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>{c.auth.haveAccount}<button onClick={() => applyAuthMode('login')} style={{ background: 'none', border: 'none', color: 'var(--ember)', fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0 }}>{c.auth.loginLink}</button></div>}
            {authMode === 'login' && <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>{c.auth.noAccount}<button onClick={() => applyAuthMode('register')} style={{ background: 'none', border: 'none', color: 'var(--ember)', fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0 }}>{c.auth.registerLink}</button></div>}
          </div>
        </div>
      )}

      {/* ==================== DRAWER DE PEDIDO ==================== */}
      {cartOpen && (
        <>
          <div onClick={closeCart} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(14,9,5,.5)', backdropFilter: 'blur(3px)', animation: 'brasaFadeUp .2s ease both' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(430px,94vw)', zIndex: 96, background: 'var(--bg)', borderLeft: '1px solid var(--line)', boxShadow: '-30px 0 80px -30px rgba(0,0,0,.55)', display: 'flex', flexDirection: 'column', animation: 'brasaSlideInRight .32s cubic-bezier(.2,.8,.2,1) both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '20px 22px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: 'var(--ember)' }}><Icon name="bag" size={18} /></span><span className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{c.cart.title}</span></div>
              <button onClick={closeCart} {...hover({ background: 'var(--surface)' }, { background: 'var(--surface2)' })} style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', fontSize: 17, lineHeight: 1 }}>✕</button>
            </div>

            {orderDone && (
              <div style={{ flex: 1, overflow: 'auto', padding: '22px 22px 30px' }}>
                {/* ===== CUENTA ABIERTA ===== */}
                {showTab && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20 }}>
                      <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: '50%', background: 'rgba(46,125,85,.14)', color: '#2e7d55', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'brasaPop .4s ease both' }}><Icon name="bagcheck" size={34} /></div>
                      <div><h2 className="serif" style={{ fontSize: 24, fontWeight: 600, margin: 0, lineHeight: 1.05 }}>{c.cart.tabTitle}</h2><p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>{c.cart.tabSentPre}{orderCode}{c.cart.tabSentSuf}</p></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 18 }}>
                      {tabRounds.map((r, i) => (
                        <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '14px 15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ember)' }}>{r.label}</span><span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.mode} · {r.time}</span></div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{r.subtotal}</span>
                          </div>
                          <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{r.itemsLine}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 4px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginBottom: 20 }}>
                      <span style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)' }}>{c.cart.tabTotal}</span>
                      <span className="serif" style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{tabTotalFmt}</span>
                    </div>
                    <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 11 }}>
                      <button onClick={addMore} {...hover({ borderColor: 'var(--line)' }, { borderColor: 'var(--ember)' })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, background: 'var(--surface2)', border: '1px solid var(--line)', color: 'var(--ink)', padding: 15, borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}><span style={{ fontSize: 19 }}>🍽️</span><span style={{ fontSize: 13, fontWeight: 600 }}>{c.cart.addDishes}</span><span style={{ fontSize: 11, color: 'var(--muted)' }}>{c.cart.addDishesSub}</span></button>
                      <button onClick={orderDrink} {...hover({ borderColor: 'var(--line)' }, { borderColor: 'var(--ember)' })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, background: 'var(--surface2)', border: '1px solid var(--line)', color: 'var(--ink)', padding: 15, borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}><span style={{ fontSize: 19 }}>🍸</span><span style={{ fontSize: 13, fontWeight: 600 }}>{c.cart.orderDrink}</span><span style={{ fontSize: 11, color: 'var(--muted)' }}>{c.cart.orderDrinkSub}</span></button>
                    </div>
                    <button onClick={requestBill} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ width: '100%', background: 'var(--ember)', color: '#fff', border: 'none', padding: 15, borderRadius: 13, cursor: 'pointer', fontSize: 14.5, fontWeight: 600 }}>{c.cart.requestBillPre}{tabTotalFmt}</button>
                  </>
                )}

                {/* ===== PAGAR / QR ===== */}
                {showBill && (
                  <div style={{ textAlign: 'center' }}>
                    <h2 className="serif" style={{ fontSize: 26, fontWeight: 600, margin: '0 0 6px' }}>{c.cart.payTitle}</h2>
                    <p style={{ margin: '0 auto 20px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, maxWidth: '34ch' }}>{c.cart.payDesc}</p>
                    <div style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><span style={{ fontSize: 13, color: 'var(--muted)' }}>{c.cart.payTotal}</span><span className="serif" style={{ fontSize: 30, fontWeight: 600 }}>{tabTotalFmt}</span></div>
                      <div style={{ padding: 12, background: '#fff', borderRadius: 12, border: '1px solid var(--line)' }}><QrGrid box={150} /></div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.cart.payFooter}</div>
                    </div>
                    <button onClick={closeTab} {...hover({ filter: 'none' }, { filter: 'brightness(1.08)' })} style={{ marginTop: 18, width: '100%', background: '#2e7d55', color: '#fff', border: 'none', padding: 14, borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{c.cart.paidClose}</button>
                    <button onClick={hideBill} {...hover({ color: 'var(--muted)' }, { color: 'var(--ember)' })} style={{ marginTop: 9, width: '100%', background: 'transparent', color: 'var(--muted)', border: 'none', padding: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{c.cart.keepOrdering}</button>
                  </div>
                )}
              </div>
            )}

            {showEmptyCart && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 30px', gap: 14 }}>
                <span style={{ opacity: .35, transform: 'scale(2.4)', color: 'var(--muted)' }}><Icon name="bag" size={18} /></span>
                <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 14 }}>{c.cart.emptyTitle}</div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, maxWidth: '30ch' }}>{c.cart.emptyDesc}</p>
                <button onClick={goCarta} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ marginTop: 8, background: 'var(--ember)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.cart.viewMenu}</button>
              </div>
            )}

            {showActiveCart && (
              <>
                <div style={{ padding: '16px 22px 8px' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 9 }}>{c.cart.howWant}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {orderModes.map((m, i) => (
                      <button key={i} onClick={m.onClick} style={{ flex: 1, background: m.bg, color: m.color, border: `1px solid ${m.border}`, padding: 10, borderRadius: 11, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>{m.label}</button>
                    ))}
                  </div>
                  {orderMode === 'mesa' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 11 }}>
                        <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{c.cart.tableNum}</span>
                        <input value={mesaNum} onChange={(e) => setMesaNum(e.target.value)} placeholder={mesaPlaceholder} style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: 'var(--ink)' }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted2)', marginTop: 6, lineHeight: 1.4 }}>{c.cart.oneTabPre}<strong style={{ color: 'var(--ink2)' }}>{c.cart.oneTabBold}</strong>{c.cart.oneTabSuf}</div>
                    </>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: '12px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cartItems.map((c) => (
                    <div key={c.id} style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 10, background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.img} alt={c.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25 }}>{c.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--ember)', fontWeight: 700, marginTop: 2 }}>{c.lineFmt}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <button onClick={c.dec} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface2)', color: 'var(--ink)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>−</button>
                          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{c.qty}</span>
                          <button onClick={c.inc} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface2)', color: 'var(--ink)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>+</button>
                        </div>
                      </div>
                      <input value={c.note} onChange={c.setNote} placeholder={CONTENT[lang].cart.notePh} style={{ width: '100%', boxSizing: 'border-box', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 9, padding: '8px 11px', fontSize: 12.5, color: 'var(--ink)', fontFamily: 'inherit' }} />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '18px 22px', borderTop: '1px solid var(--line)', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}><span style={{ fontSize: 13, color: 'var(--muted)' }}>{c.cart.total}</span><span className="serif" style={{ fontSize: 28, fontWeight: 600 }}>{money(cart.reduce((s, i) => s + i.price * i.qty, 0))}</span></div>
                  <button onClick={checkout} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ width: '100%', background: 'var(--ember)', color: '#fff', border: 'none', padding: 15, borderRadius: 12, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>{c.cart.confirmOrder}</button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ==================== INICIO ==================== */}
      {view === 'inicio' && (
        <div key="v-home">
          {/* HERO */}
          {/* Preload de la imagen del LCP. Un `background-image` no se descubre hasta que el
              navegador parsea el CSS, así que arrancaba recién a los 460 ms y encima peleaba con
              los chunks de JS. React 19 sube este <link> al <head>, y fetchPriority alto la pone
              por delante del bundle. */}
          <link rel="preload" as="image" href={heroImg} fetchPriority="high" />
          <section style={{ position: 'relative', height: 'min(86vh,760px)', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ position: 'absolute', inset: 0, background: `url(${heroImg}) center/cover`, animation: 'brasaKenburns 18s ease-in-out infinite alternate' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(20,14,8,.35) 0%,rgba(20,14,8,.2) 40%,rgba(20,14,8,.82) 100%)' }} />
            <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '0 26px 52px', width: '100%', color: '#fff' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,.22)', padding: '7px 15px', borderRadius: 40, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 22, animation: 'brasaFadeUp .7s ease both' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7bd08a', animation: 'brasaEmber 1.6s infinite' }} />{c.home.openBadge}
              </div>
              <h1 className="serif" style={{ fontSize: 'clamp(46px,7vw,86px)', lineHeight: .98, margin: 0, fontWeight: 600, maxWidth: '12ch', letterSpacing: '-.01em', animation: 'brasaFadeUp .8s ease both', animationDelay: '.05s' }}>{c.home.heroTitle}</h1>
              <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', maxWidth: '52ch', margin: '20px 0 0', color: 'rgba(255,255,255,.82)', lineHeight: 1.6, animation: 'brasaFadeUp .9s ease both', animationDelay: '.12s' }}>{c.home.heroDesc}</p>
            </div>
          </section>

          {/* QUICK RESERVE BAR */}
          <section style={{ maxWidth: 1080, margin: '-42px auto 0', padding: '0 26px', position: 'relative', zIndex: 5 }}>
            <div className="dcol-3" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, boxShadow: '0 30px 70px -30px rgba(20,14,8,.4)', padding: '20px 22px', display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr auto', gap: 14, alignItems: 'end', animation: 'brasaRise .7s ease both' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>{c.home.qFecha}</span>
                <select value={String(qDateI)} onChange={(e) => setQDateI(parseInt(e.target.value, 10))} style={selectStyle}>
                  {dateOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select></label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>{c.home.qComensales}</span>
                <select value={String(qParty)} onChange={(e) => setQParty(parseInt(e.target.value, 10))} style={selectStyle}>
                  {partyOptions.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select></label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>{c.home.qHora}</span>
                <select value={qTime} onChange={(e) => onQTime(e.target.value)} style={selectStyle}>
                  {allTimeOptions.map((t) => <option key={t.value || 'any'} value={t.value}>{t.label}</option>)}
                </select></label>
              <button onClick={quickReserve} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ background: 'var(--ember)', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', height: 46 }}>{c.home.searchTable}</button>
            </div>
          </section>

          {/* HIGHLIGHTS */}
          <section style={{ maxWidth: 1240, margin: '0 auto', padding: '72px 26px 20px' }}>
            <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
              {highlights.map((h, i) => (
                <div key={i} {...hover({ borderColor: 'var(--line)' }, { borderColor: 'var(--line2)' })} style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: '28px 26px' }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface2)', color: 'var(--ember)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{h.icon}</span>
                  <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 7 }}>{h.title}</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>{h.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SIGNATURE */}
          <section style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 26px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 26, gap: 20, flexWrap: 'wrap' }}>
              <div><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--ember)', marginBottom: 9 }}>{c.home.sigEyebrow}</div><h2 className="serif" style={{ fontSize: 'clamp(30px,4vw,44px)', margin: 0, fontWeight: 600 }}>{c.home.sigTitle}</h2></div>
              <button onClick={goCarta} {...hover({ background: 'transparent' }, { background: 'var(--surface2)' })} style={{ background: 'none', border: '1px solid var(--line2)', color: 'var(--ink)', padding: '12px 20px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.home.seeFullMenu}</button>
            </div>
            {/* CARRUSEL DE PLATOS */}
            <div onMouseEnter={() => { carHover.current = true }} onMouseLeave={() => { carHover.current = false }} style={{ position: 'relative' }}>
              <div ref={carRef} className="brasa-carousel" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--line)', minHeight: 460, background: 'var(--surface)', boxShadow: '0 30px 60px -36px rgba(0,0,0,.4)' }}>
                {carSlides.map((d, i) => (
                  // El slide activo va EN FLUJO (position:relative) y los demás absolutos encima:
                  // así el contenedor toma la altura del contenido real en vez de depender de un
                  // min-height fijo. Con todos absolutos, el `min-height:660px` de móvil se
                  // quedaba corto y recortaba el precio y el CTA "Reservar mesa".
                  <div key={i} className="brasa-slide" style={{ position: Number(d.op) === 1 ? 'relative' : 'absolute', inset: 0, opacity: Number(d.op), pointerEvents: d.pe as CSSProperties['pointerEvents'], zIndex: d.z, transition: 'opacity .6s ease', display: 'grid', gridTemplateColumns: '1.05fr .95fr' }}>
                    {/* Sin URL -> solo el color de fondo, sin petición. `url()` vacío dispararía
                        una petición a la página misma. */}
                    <div className="brasa-slide-img" style={{ width: '100%', height: '100%', minHeight: 460, background: d.img ? `url(${d.img}) center/cover` : 'var(--surface2)' }} />
                    <div className="brasa-slide-txt" style={{ padding: '44px 42px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--surface)' }}>
                      <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--ember)', marginBottom: 12 }}>{d.meta}</div>
                      <h3 className="serif" style={{ fontSize: 'clamp(30px,3.6vw,44px)', margin: '0 0 12px', fontWeight: 600, lineHeight: 1.05 }}>{d.name}</h3>
                      <p style={{ margin: '0 0 22px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)', maxWidth: '46ch' }}>{d.story}</p>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--ink2)', marginBottom: 11, fontWeight: 600 }}>{c.home.whatItHas}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
                        {d.ing.map((g, gi) => <span key={gi} style={{ fontSize: 12.5, background: 'var(--surface2)', border: '1px solid var(--line)', color: 'var(--ink2)', padding: '7px 13px', borderRadius: 40 }}>{g}</span>)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><div className="serif" style={{ fontSize: 34, fontWeight: 600, color: 'var(--ember)' }}>{d.price}</div><button onClick={goReservar} {...hover({ background: 'var(--ink)', color: 'var(--bg)' }, { background: 'var(--ember)', color: '#fff' })} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '12px 22px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.header.reserveTable}</button></div>
                    </div>
                  </div>
                ))}
                <button onClick={carPrev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 6, width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--glass)', backdropFilter: 'blur(8px)', color: 'var(--ink)', cursor: 'pointer', fontSize: 20, lineHeight: 1, boxShadow: '0 6px 18px -6px rgba(0,0,0,.35)' }}>‹</button>
                <button onClick={carNext} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 6, width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--glass)', backdropFilter: 'blur(8px)', color: 'var(--ink)', cursor: 'pointer', fontSize: 20, lineHeight: 1, boxShadow: '0 6px 18px -6px rgba(0,0,0,.35)' }}>›</button>
              </div>
              {/* El punto sigue midiendo 9px, pero el <button> ocupa 44px de alto con relleno
                  transparente: el área táctil cumple WCAG 2.5.5 sin cambiar el diseño. */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                {carDots.map((t, i) => (
                  <button
                    key={i}
                    onClick={t.onClick}
                    aria-label={`${i + 1}`}
                    style={{ height: 44, padding: '0 8px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <span style={{ display: 'block', height: 9, width: t.w, borderRadius: 20, background: t.bg, transition: 'all .3s' }} />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* HOURS STRIP */}
          <section style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 26px 80px' }}>
            <div className="dcol-3" style={{ background: 'var(--ink)', color: 'var(--bg)', borderRadius: 20, padding: '44px 40px', display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 32 }}>
              <div><div className="serif" style={{ fontSize: 30, fontWeight: 600, marginBottom: 10 }}>{c.home.alwaysTitle}</div><p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, opacity: .72, maxWidth: '34ch' }}>{c.home.alwaysDesc}</p></div>
              <div><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', opacity: .6, marginBottom: 12 }}>{c.home.hoursTitle}</div>
                {c.hoursRows.map((h, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.12)', fontSize: 13.5 }}><span style={{ opacity: .8 }}>{h.day}</span><span>{h.time}</span></div>)}
              </div>
              <div><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', opacity: .6, marginBottom: 12 }}>{c.home.whereTitle}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, opacity: .85 }}>Av. Pando 1187, La Recoleta<br />Cochabamba · Bolivia<br />+591 4 452 8890</div>
                <button onClick={goReservar} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ marginTop: 18, background: 'var(--ember)', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.home.reserveNow}</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== RESERVAR ==================== */}
      {view === 'reservar' && (
        <div key="v-res" style={{ maxWidth: 1080, margin: '0 auto', padding: '44px 26px 90px', animation: 'brasaViewIn .4s ease both' }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--ember)', marginBottom: 10 }}>{c.res.eyebrow}</div><h1 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', margin: 0, fontWeight: 600 }}>{c.res.title}</h1></div>
          {/* stepper */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '26px 0 34px' }}>
            {resSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 700 }}>{s.n}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: s.textColor }}>{s.label}</span>
                {s.hasBar && <span style={{ width: 34, height: 2, background: 'var(--line2)', margin: '0 4px' }} />}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {resStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'brasaViewIn .35s ease both' }}>
              <div style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: 26 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 15 }}>{c.res.chooseDay}</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {dateChips.map((d, i) => (
                    <button key={i} onClick={d.onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 74, padding: '12px 8px', borderRadius: 13, border: `1px solid ${d.border}`, background: d.bg, color: d.color, cursor: 'pointer', transition: 'all .18s' }}><span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', opacity: .75 }}>{d.dow}</span><span className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{d.day}</span><span style={{ fontSize: 10.5, opacity: .7 }}>{d.mon}</span></button>
                  ))}
                </div>
              </div>
              <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
                <div style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: 26 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 15 }}>{c.res.comensales}</div>
                  <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                    {partyChips.map((p, i) => (
                      <button key={i} onClick={p.onClick} style={{ width: 46, height: 46, borderRadius: 12, border: `1px solid ${p.border}`, background: p.bg, color: p.color, cursor: 'pointer', fontSize: 15, fontWeight: 600, transition: 'all .18s' }}>{p.label}</button>
                    ))}
                  </div>
                  <p style={{ margin: '14px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>{c.res.moreThan8}</p>
                </div>
                <div style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{c.res.hora}</div>
                    <div style={{ display: 'flex', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 9, overflow: 'hidden' }}>
                      {turnoTabs.map((t, i) => <button key={i} onClick={t.onClick} style={{ background: t.bg, color: t.color, border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: 12.5, fontWeight: 500 }}>{t.label}</button>)}
                    </div>
                  </div>
                  <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
                    {timeSlots.map((t, i) => (
                      <button key={i} onClick={t.onClick} style={{ padding: '11px 4px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bg, color: t.color, cursor: t.cursor, fontSize: 13, fontWeight: 600, textDecoration: t.deco, transition: 'all .15s' }}>{t.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button onClick={toStep2} style={{ background: step1Bg, color: step1Color, border: 'none', padding: '14px 30px', borderRadius: 40, cursor: step1Cursor, fontSize: 14, fontWeight: 600 }}>{c.res.chooseTable}</button></div>
            </div>
          )}

          {/* STEP 2: FLOOR PLAN */}
          {resStep === 2 && (
            <div style={{ animation: 'brasaViewIn .35s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20, fontSize: 12.5, color: 'var(--muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--surface2)', border: '1px solid var(--line2)' }} />{c.res.free}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--ember)' }} />{c.res.selected}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--surface3)', opacity: .5 }} />{c.res.taken}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--ink)' }}>{resSummaryTop}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {zones.map((z, zi) => (
                  <div key={zi} style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><span style={{ color: 'var(--ember)', display: 'flex' }}>{z.icon}</span><div className="serif" style={{ fontSize: 21, fontWeight: 600 }}>{z.name}</div><span style={{ fontSize: 12, color: 'var(--muted2)' }}>{z.note}</span></div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {z.tables.map((t, ti) => (
                        <button key={ti} onClick={t.onClick} {...(t.taken ? {} : hover({ borderColor: t.border }, { borderColor: 'var(--ember)' }))} style={{ width: t.w, height: 64, borderRadius: t.radius, border: `1.5px solid ${t.border}`, background: t.bg, color: t.color, cursor: t.cursor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, transition: 'all .18s', opacity: Number(t.opacity) }}><span style={{ fontSize: 13, fontWeight: 700 }}>{t.id}</span><span style={{ fontSize: 10.5, opacity: .8 }}>{t.seatsLabel}</span></button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}><button onClick={toStep1} style={{ background: 'transparent', border: '1px solid var(--line2)', color: 'var(--ink)', padding: '14px 26px', borderRadius: 40, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{c.res.backBtn}</button><button onClick={toStep3} style={{ background: step2Bg, color: step2Color, border: 'none', padding: '14px 30px', borderRadius: 40, cursor: step2Cursor, fontSize: 14, fontWeight: 600 }}>{c.res.continueBtn}</button></div>
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {resStep === 3 && (
            <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, animation: 'brasaViewIn .35s ease both' }}>
              <div style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>{c.res.yourData}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{c.res.fullName}</span><input value={resName} onChange={(e) => setResName(e.target.value)} placeholder={c.res.yourNamePh} style={resInput} /></label>
                  <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{c.res.phone}</span><input value={resPhone} onChange={(e) => setResPhone(e.target.value)} placeholder={c.res.phonePh} style={resInput} /></label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{c.res.email}</span><input value={resEmail} onChange={(e) => setResEmail(e.target.value)} placeholder={c.res.emailPh} style={resInput} /></label>
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{c.res.noteLabel}</span><textarea value={resNote} onChange={(e) => setResNote(e.target.value)} rows={3} placeholder={c.res.notePh} style={{ ...resInput, fontSize: 13.5, resize: 'vertical', lineHeight: 1.5 }} /></label>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface2)', padding: 24 }}>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', marginBottom: 14 }}>{c.res.summary}</div>
                  {resSummary.map((r, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: 13.5 }}><span style={{ color: 'var(--muted)' }}>{r.k}</span><span style={{ fontWeight: 600 }}>{r.v}</span></div>)}
                  <p style={{ margin: '14px 0 0', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{c.res.holdNote}</p>
                </div>
                <button onClick={confirmRes} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ background: 'var(--ember)', color: '#fff', border: 'none', padding: 16, borderRadius: 40, cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>{c.res.confirmRes}</button>
                <button onClick={toStep2} style={{ background: 'transparent', border: '1px solid var(--line2)', color: 'var(--ink)', padding: 12, borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.res.changeTable}</button>
              </div>
            </div>
          )}

          {/* STEP DONE */}
          {resStep === 'done' && (
            <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', animation: 'brasaPop .5s cubic-bezier(.2,.7,.2,1) both' }}>
              <div style={{ width: 74, height: 74, margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(123,208,138,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f9d5a', fontSize: 34 }}>✓</div>
              <h2 className="serif" style={{ fontSize: 34, margin: '0 0 8px', fontWeight: 600 }}>{c.res.doneTitle}</h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 22px' }}>{c.res.doneDesc}</p>
              <div style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', padding: 26, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.res.resCodeLabel}</div><div className="serif" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '.06em' }}>{resCode}</div></div>
                  <div style={{ padding: 12, background: '#fff', borderRadius: 12, border: '1px solid var(--line)' }}><QrGrid box={96} /></div>
                </div>
                {resSummary.map((r, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--line)', fontSize: 13.5 }}><span style={{ color: 'var(--muted)' }}>{r.k}</span><span style={{ fontWeight: 600 }}>{r.v}</span></div>)}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}><button onClick={goCarta} {...hover({ background: 'var(--ink)', color: 'var(--bg)' }, { background: 'var(--ember)', color: '#fff' })} style={{ flex: 1, background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: 14, borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.res.viewMenu}</button><button onClick={resetRes} style={{ flex: 1, background: 'transparent', border: '1px solid var(--line2)', color: 'var(--ink)', padding: 14, borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.res.newRes}</button></div>
            </div>
          )}
        </div>
      )}

      {/* ==================== CARTA / MENÚ ==================== */}
      {view === 'carta' && (
        <div key="v-carta" style={{ maxWidth: 1240, margin: '0 auto', padding: '44px 26px 90px', animation: 'brasaViewIn .4s ease both' }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--ember)', marginBottom: 10 }}>{c.carta.eyebrow}</div><h1 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', margin: 0, fontWeight: 600 }}>{c.carta.title}</h1><p style={{ fontSize: 14, color: 'var(--muted)', margin: '12px auto 0', maxWidth: '56ch', lineHeight: 1.6 }}>{c.carta.desc}</p></div>

          {/* MENÚ DE LA SEMANA */}
          <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 22, margin: '34px 0 12px', padding: '38px 32px', background: 'radial-gradient(130% 150% at 0% 0%,#2c1e11,#160e06 72%)', color: '#f4ede1', boxShadow: '0 34px 66px -34px rgba(0,0,0,.55)' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: .05, backgroundImage: 'repeating-linear-gradient(90deg,#000 0 2px,transparent 2px 24px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,73,43,.4),transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.16em', color: '#e5a578', marginBottom: 9 }}>{c.carta.lunchBadge}</div>
                <h2 className="serif" style={{ fontSize: 'clamp(30px,4.6vw,48px)', margin: 0, fontWeight: 600, fontStyle: 'italic', color: '#fbf6ec' }}>{c.carta.weekTitle}</h2>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="serif" style={{ fontSize: 48, fontWeight: 600, lineHeight: 1, color: '#fff' }}>{c.carta.fromPre}{almuerzoWeekPrice}</div>
                <div style={{ fontSize: 11.5, color: '#cdab8f', marginTop: 4 }}>{c.carta.perPersonFull}</div>
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {weekMenu.map((w, wi) => (
                <div key={wi} {...hover({ transform: 'none', boxShadow: w.glow, borderColor: w.cardBorder }, { transform: 'translateY(-4px)', boxShadow: '0 34px 62px -26px rgba(0,0,0,.72)', borderColor: 'rgba(232,140,86,.55)' })} style={{ position: 'relative', border: `1px solid ${w.cardBorder}`, background: w.cardBg, borderRadius: 22, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', transition: 'transform .3s cubic-bezier(.2,.7,.2,1),box-shadow .3s,border-color .3s', boxShadow: w.glow }}>
                  {/* PLATO ESTRELLA (foto grande) */}
                  <div style={{ position: 'relative', flex: '1.1 1 330px', minWidth: 290, minHeight: 330, overflow: 'hidden', background: '#241812' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.heroImg} alt={w.heroName} loading="eager" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .6s ease' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(11,7,3,.94) 4%,rgba(11,7,3,.5) 34%,rgba(11,7,3,.08) 62%,rgba(11,7,3,.28))' }} />
                    <div style={{ position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', background: 'rgba(20,12,6,.5)', backdropFilter: 'blur(5px)', padding: '6px 13px', borderRadius: 20, border: '1px solid rgba(232,140,86,.35)' }}>{w.day}</span>
                      {!!w.tag && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', background: w.tagBg, color: w.tagColor, border: w.tagBorder, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,.4)', backdropFilter: 'blur(4px)' }}>{w.tag}</span>}
                    </div>
                    <div style={{ position: 'absolute', left: 26, right: 26, bottom: 24 }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.2em', color: '#f2b98a', marginBottom: 9, textShadow: '0 1px 6px rgba(0,0,0,.8)' }}>{w.heroEyebrow}</div>
                      <div className="serif" style={{ fontSize: 'clamp(28px,3.4vw,36px)', fontWeight: 600, color: '#fff', lineHeight: 1.02, textShadow: '0 3px 20px rgba(0,0,0,.85)', marginBottom: 8 }}>{w.heroName}</div>
                      <div style={{ fontSize: 12.5, color: '#e4d4c2', lineHeight: 1.5, maxWidth: '38ch', textShadow: '0 1px 8px rgba(0,0,0,.85)' }}>{w.heroDetail}</div>
                    </div>
                  </div>
                  {/* ACOMPAÑAMIENTOS + PRECIO */}
                  <div style={{ flex: '1 1 360px', minWidth: 300, padding: '26px 30px 24px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,rgba(255,255,255,.035),transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, paddingBottom: 16, borderBottom: '1px solid rgba(232,140,86,.3)' }}>
                      <div>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.18em', color: '#d89c6d', marginBottom: 5 }}>{c.carta.fullMenu}</div>
                        <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: '#fff', lineHeight: 1 }}>{c.carta.lunchIncludes}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, justifyContent: 'flex-end' }}><span className="serif" style={{ fontSize: 16, color: '#d89c6d', fontWeight: 600 }}>{curSym}</span><span className="serif" style={{ fontSize: 44, fontWeight: 600, color: '#fff', lineHeight: .82 }}>{w.precioNum}</span></div>
                        <div style={{ fontSize: 9.5, color: '#c3a488', marginTop: 3 }}>{c.carta.perPerson}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingTop: 4 }}>
                      {w.sides.map((s, si) => (
                        <div key={si} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                          {!!s.img && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.img} alt={s.name} loading="eager" style={{ width: 96, height: 74, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(232,140,86,.4)', boxShadow: '0 6px 16px rgba(0,0,0,.45)', background: '#241812' }} />
                          )}
                          {s.noImg && (
                            <div style={{ width: 96, height: 74, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(120% 120% at 50% 30%,rgba(200,80,46,.32),rgba(20,12,6,.4))', border: '1.5px solid rgba(232,140,86,.32)' }}><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f0b483" strokeWidth={1.4} strokeLinejoin="round"><path d="M12 2l1.9 6.1 6.1 1.9-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" /></svg></div>
                          )}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.16em', color: '#e2955f', fontWeight: 700, marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 15, color: '#fbf3e6', fontWeight: 600, lineHeight: 1.2 }}>{s.name}</div>
                            <div style={{ fontSize: 11.5, color: '#c1a888', lineHeight: 1.45, marginTop: 3 }}>{s.detail}</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8fd08a" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" /></svg>
                        <span style={{ fontSize: 11, color: '#a9c9a3', letterSpacing: '.02em' }}>{c.carta.servedNote}</span>
                      </div>
                      {w.orderAuthed && <button onClick={w.onAddAlmuerzo} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ marginTop: 14, width: '100%', background: 'var(--ember)', color: '#fff', border: 'none', padding: 12, borderRadius: 11, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><Icon name="plus" size={15} />{c.carta.orderLunch}</button>}
                      {w.disabledDay && <button disabled title={c.carta.lunchOnlyToday} style={{ marginTop: 14, width: '100%', background: 'var(--surface2)', color: 'var(--muted2)', border: '1px solid var(--line)', padding: 12, borderRadius: 11, cursor: 'not-allowed', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: .7 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>{w.disabledLabel}</button>}
                      {isGuest && <button onClick={openLogin} style={{ marginTop: 14, width: '100%', background: 'transparent', color: '#e2955f', border: '1px dashed rgba(232,140,86,.5)', padding: 12, borderRadius: 11, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>{c.carta.loginToOrder}</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: 'relative', marginTop: 20, fontSize: 12, color: '#c3a488', letterSpacing: '.02em' }}>{c.carta.nightNote}</div>
          </section>

          {/* A LA CARTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '44px 0 22px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--ember)', marginBottom: 7 }}>{c.carta.alaCarta}</div><h2 className="serif" style={{ fontSize: 'clamp(26px,3.6vw,40px)', margin: 0, fontWeight: 600, fontStyle: 'italic' }}>{menuCatLabel}</h2></div>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
          {/* category tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
            {menuCats.map((c, i) => <button key={i} onClick={c.onClick} style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '10px 20px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, transition: 'all .18s' }}>{c.label}</button>)}
          </div>
          <div style={{ position: 'relative' }}>
            <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {menuItems.map((m, i) => (
                <div key={i} {...hover({ transform: 'none' }, { transform: 'translateY(-4px)' })} style={{ border: '1px solid var(--line)', borderRadius: 18, background: 'var(--surface)', overflow: 'hidden', animation: 'brasaViewIn .4s both', animationDelay: m.delay, boxShadow: '0 20px 44px -38px rgba(0,0,0,.5)' }}>
                  <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .55s ease' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 52%,rgba(20,14,8,.34))' }} />
                    <div style={{ position: 'absolute', top: 11, left: 11, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {m.tags.map((t, ti) => <span key={ti} style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: t.color, background: t.bg, backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>{t.label}</span>)}
                    </div>
                  </div>
                  <div style={{ padding: '16px 18px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                      <div className="serif" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.15, color: 'var(--ink)' }}>{m.name}</div>
                      <div className="serif" style={{ fontSize: 19, fontWeight: 700, color: 'var(--ember)', whiteSpace: 'nowrap' }}>{m.price}</div>
                    </div>
                    <p style={{ margin: '7px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{m.desc}</p>
                    {isAuthed && <button onClick={m.onAdd} {...hover({ background: 'var(--surface2)', color: 'var(--ink)', borderColor: 'var(--line2)' }, { background: 'var(--ember)', color: '#fff', borderColor: 'var(--ember)' })} style={{ marginTop: 14, width: '100%', background: 'var(--surface2)', border: '1px solid var(--line2)', color: 'var(--ink)', padding: 11, borderRadius: 11, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><Icon name="plus" size={15} />{c.carta.addToOrder}</button>}
                    {isGuest && <button onClick={openLogin} {...hover({ color: 'var(--muted)', borderColor: 'var(--line2)' }, { color: 'var(--ember)', borderColor: 'var(--ember)' })} style={{ marginTop: 14, width: '100%', background: 'transparent', border: '1px dashed var(--line2)', color: 'var(--muted)', padding: 11, borderRadius: 11, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>{c.carta.loginToOrder}</button>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 30, fontSize: 12, color: 'var(--muted2)', letterSpacing: '.03em' }}>{pricesNote}</div>
          </div>
        </div>
      )}

      {/* ==================== BAR ==================== */}
      {view === 'bar' && (
        <div key="v-bar" style={{ maxWidth: 1240, margin: '0 auto', padding: '44px 26px 90px', animation: 'brasaViewIn .4s ease both' }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--ember)', marginBottom: 10 }}>{c.barView.eyebrow}</div><h1 className="serif" style={{ fontSize: 'clamp(34px,5vw,52px)', margin: 0, fontWeight: 600 }}>{c.barView.title}</h1><p style={{ fontSize: 14, color: 'var(--muted)', margin: '12px auto 0', maxWidth: '52ch' }}>{c.barView.desc}</p></div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', margin: '28px 0' }}>
            {barCats.map((c, i) => <button key={i} onClick={c.onClick} style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '10px 20px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, transition: 'all .18s' }}>{c.label}</button>)}
          </div>
          <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {barItems.map((b, i) => (
              <div key={i} {...hover({ transform: 'none' }, { transform: 'translateY(-3px)' })} style={{ border: '1px solid var(--line)', borderRadius: 16, background: 'var(--surface)', overflow: 'hidden', animation: 'brasaViewIn .35s both', animationDelay: b.delay }}>
                <div style={{ height: 158, background: `url(${b.img}) center/cover`, position: 'relative' }}>{!!b.prep && <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10.5, fontWeight: 600, background: 'rgba(20,14,8,.6)', color: '#fff', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 20 }}>{b.prep}</span>}</div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}><div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{b.name}</div><div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ember)' }}>{b.price}</div></div>
                  <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{b.desc}</p>
                  {isAuthed && <button onClick={b.onAdd} {...hover({ background: 'var(--surface2)', color: 'var(--ink)', borderColor: 'var(--line2)' }, { background: 'var(--ember)', color: '#fff', borderColor: 'var(--ember)' })} style={{ marginTop: 13, width: '100%', background: 'var(--surface2)', border: '1px solid var(--line2)', color: 'var(--ink)', padding: 10, borderRadius: 11, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><Icon name="plus" size={15} />{c.barView.addBtn}</button>}
                  {isGuest && <button onClick={openLogin} {...hover({ color: 'var(--muted)', borderColor: 'var(--line2)' }, { color: 'var(--ember)', borderColor: 'var(--ember)' })} style={{ marginTop: 13, width: '100%', background: 'transparent', border: '1px dashed var(--line2)', color: 'var(--muted)', padding: 10, borderRadius: 11, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{c.carta.loginToOrder}</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== CUENTA / QR ==================== */}
      {view === 'cuenta' && (
        <div key="v-cuenta" style={{ maxWidth: 560, margin: '0 auto', padding: '44px 26px 90px', animation: 'brasaViewIn .4s ease both' }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--ember)', marginBottom: 10 }}>{c.acc.eyebrow}</div><h1 className="serif" style={{ fontSize: 'clamp(32px,5vw,46px)', margin: 0, fontWeight: 600 }}>{c.acc.title}</h1><p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '10px 0 0' }}>{c.acc.desc}</p></div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 18, background: 'var(--surface)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ fontSize: 14, fontWeight: 600 }}>{c.acc.consumo}</div><span style={{ fontSize: 12, color: 'var(--muted2)' }}>{billData.reduce((s, b) => s + b.qty, 0)}{c.acc.itemsSuf}</span></div>
            {billItems.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px', borderBottom: '1px solid var(--line)' }}><span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', width: 20 }}>{b.qty}</span><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 500 }}>{b.name}</div><div style={{ fontSize: 11.5, color: 'var(--muted2)' }}>{b.note}</div></div><span style={{ fontSize: 13.5, fontWeight: 600 }}>{b.lineFmt}</span></div>
            ))}
            <div style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', padding: '5px 0' }}><span>{c.acc.subtotal}</span><span>{money(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', padding: '5px 0' }}><span>{c.acc.tipPre}{tip}{c.acc.tipSuf}</span><span>{money(tipAmt)}</span></div>
              <div style={{ display: 'flex', gap: 8, margin: '12px 0 14px' }}>
                {tipOptions.map((t, i) => <button key={i} onClick={t.onClick} style={{ flex: 1, background: t.bg, color: t.color, border: `1px solid ${t.border}`, padding: 9, borderRadius: 10, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>{t.label}</button>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--line)' }}><span style={{ fontSize: 15, fontWeight: 600 }}>{c.acc.total}</span><span className="serif" style={{ fontSize: 30, fontWeight: 600 }}>{money(subtotal + tipAmt)}</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button onClick={splitBill} {...hover({ background: 'transparent' }, { background: 'var(--surface2)' })} style={{ flex: 1, background: 'transparent', border: '1px solid var(--line2)', color: 'var(--ink)', padding: 15, borderRadius: 40, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{c.acc.splitBill}</button>
            <button onClick={payQR} {...hover({ background: 'var(--ember)' }, { background: '#a53d1e' })} style={{ flex: 1.4, background: 'var(--ember)', color: '#fff', border: 'none', padding: 15, borderRadius: 40, cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}><Icon name="qr" size={17} /> {c.acc.payQR}</button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted2)', marginTop: 14 }}>{c.acc.callWaiter}</p>
        </div>
      )}

      {/* QR MODAL */}
      {qrOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={closeQR} style={{ position: 'absolute', inset: 0, background: 'rgba(20,14,8,.6)', backdropFilter: 'blur(5px)' }} />
          <div style={{ position: 'relative', width: 'min(400px,94vw)', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, padding: 30, textAlign: 'center', animation: 'brasaDrawerIn .35s cubic-bezier(.2,.7,.2,1) both' }}>
            <button onClick={closeQR} {...hover({ background: 'var(--surface2)' }, { background: 'var(--surface3)' })} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--surface2)', color: 'var(--ink)', cursor: 'pointer', fontSize: 15 }}>✕</button>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ember)', marginBottom: 8 }}>{c.pay.secure}</div>
            <h3 className="serif" style={{ fontSize: 28, margin: '0 0 4px', fontWeight: 600 }}>{c.pay.scanToPay}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 20px' }}>{c.pay.tablePre}M3 · {money(subtotal + tipAmt)}</p>
            <div style={{ display: 'inline-block', padding: 16, background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px -12px rgba(20,14,8,.4)' }}><QrGrid box={210} /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '18px 0 6px', fontSize: 13, color: 'var(--muted)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3f9d5a', animation: 'brasaEmber 1.4s infinite' }} />{c.pay.waiting}</div>
            <div style={{ display: 'flex', gap: 9, justifyContent: 'center', marginTop: 14 }}>{['VISA', 'MASTERCARD', 'AMEX', 'SPEI'].map((p, i) => <span key={i} style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', border: '1px solid var(--line)', padding: '5px 10px', borderRadius: 7 }}>{p}</span>)}</div>
            <button onClick={confirmPaid} {...hover({ background: 'var(--ink)', color: 'var(--bg)' }, { background: 'var(--ember)', color: '#fff' })} style={{ width: '100%', marginTop: 20, background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: 14, borderRadius: 40, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{c.pay.simulate}</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {!!toast && (
        <div style={{ position: 'fixed', bottom: 26, left: '50%', background: 'var(--ink)', color: 'var(--bg)', padding: '13px 24px', borderRadius: 40, fontSize: 13.5, zIndex: 90, boxShadow: '0 16px 44px -12px rgba(20,14,8,.5)', display: 'flex', alignItems: 'center', gap: 10, animation: 'brasaToastIn .3s ease both' }}><span style={{ color: '#7bd08a' }}>✓</span>{toast}</div>
      )}

      </div>
    </div>
  )
}
