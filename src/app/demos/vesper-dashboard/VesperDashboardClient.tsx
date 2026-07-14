'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { DemoLang } from '../lang'

/* ============================================================
   VESPER — Panel de e-commerce (demo). Port nativo Next.js del
   diseño original .dc.html, misma info y mismo diseño.
   Bilingüe (es/en) según el sitio: la data interna se mantiene
   en español (sirve como clave estable) y CONTENT[lang] traduce
   solo lo que se muestra.
   ============================================================ */

/* ---- types ---- */
interface AttrDef { k: string; label: string; opts?: string[]; unit?: string; num?: boolean }
interface ProductType { key: string; label: string; icon: string; sku: string; cat: string; axis: string; attrs: AttrDef[] }
interface Product {
  id: string; name: string; sku: string; cat: string; price: number; compare: number; cost: number
  stock: number; status: string; img: string; sizes: string[]; committed: number; vendor: string
  type?: string; desc?: string; attrs?: Record<string, string>
}
interface Draft {
  id: string | null; type: string; name: string; cat: string; price: string; compare: string; cost: string
  stock: string; sku: string; status: string; sizes: string[]; desc: string; img: string; vendor: string
  variants: Record<string, string>; attrs: Record<string, string>
}
interface MovItem { type: string; label: string; time: string; amount: number }
interface OrderRow { id: string; name: string; items: string; total: number; pay: string; ship: string; time: string }
interface ClientRow { name: string; email: string; seg: string; orders: number; spent: number; last: string }
interface PaymentRow { tx: string; name: string; brand?: string; bc?: string; last4?: string; amt: number; st: string; date: string }

interface PagerNum { label: string; key: string; isDots: boolean; bg: string; color: string; onClick: () => void }
interface PagerData {
  label: string; from: number; to: number; total: number; pages: number; cur: number; single: boolean
  prevColor: string; nextColor: string; onPrev: () => void; onNext: () => void; nums: PagerNum[]
}

/* ---- SVG icon builders ---- */
const P = (d: string, k: number) => <path key={k} d={d} />
const C = (cx: number, cy: number, r: number, k: number) => <circle key={k} cx={cx} cy={cy} r={r} />
const L = (x1: number, y1: number, x2: number, y2: number, k: number) => <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />
const R = (x: number, y: number, w: number, h: number, rx: number, k: number) => <rect key={k} x={x} y={y} width={w} height={h} rx={rx} />

const ICON_PATHS: Record<string, ReactNode[]> = {
  home: [P('M3 11 12 3l9 8', 0), P('M5 9.5V21h14V9.5', 1), P('M9.5 21v-5.5h5V21', 2)],
  bag: [P('M6 8h12l-1 12H7L6 8Z', 0), P('M9 8V6.2A3 3 0 0 1 15 6.2V8', 1)],
  tag: [P('M11.6 3H4v7.6l8.7 8.7a1.6 1.6 0 0 0 2.3 0l4.4-4.4a1.6 1.6 0 0 0 0-2.3z', 0), C(8, 7.2, 1.1, 1)],
  layers: [P('M12 3 3 7.5l9 4.5 9-4.5z', 0), P('M3 12l9 4.5 9-4.5', 1), P('M3 16.5l9 4.5 9-4.5', 2)],
  users: [C(9, 8, 3.2, 0), P('M3.5 20a6 6 0 0 1 11 0', 1), P('M16.5 5.4a3.2 3.2 0 0 1 0 6.1', 2), P('M20.5 20a5.6 5.6 0 0 0-3.6-5.2', 3)],
  card: [R(3, 5.5, 18, 13, 2.2, 0), L(3, 10, 21, 10, 1), L(6.5, 14.5, 10, 14.5, 2)],
  percent: [L(19, 5, 5, 19, 0), C(7.4, 7.4, 2.1, 1), C(16.6, 16.6, 2.1, 2)],
  wallet: [P('M4 7.5A1.5 1.5 0 0 1 5.5 6H18v12H5.5A1.5 1.5 0 0 1 4 16.5z', 0), P('M17 6V4.6a1 1 0 0 0-1.2-1L5 6', 1), C(16.5, 12, 1.2, 2)],
  chart: [P('M4 4v16h16', 0), L(8.5, 20, 8.5, 13, 1), L(13, 20, 13, 9, 2), L(17.5, 20, 17.5, 15, 3)],
  sliders: [L(4, 7, 20, 7, 0), C(9, 7, 2, 1), L(4, 17, 20, 17, 2), C(15, 17, 2, 3)],
  bell: [P('M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z', 0), P('M10 20a2 2 0 0 0 4 0', 1)],
  search: [C(11, 11, 7, 0), L(16.2, 16.2, 21, 21, 1)],
  sun: [C(12, 12, 4, 0), P('M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19', 1)],
  moon: [P('M20 14.5A8 8 0 1 1 9.5 4 6.2 6.2 0 0 0 20 14.5Z', 0)],
  shoe: [P('M3 15l1-5h2.5l2.2 2 3.3-1 5 3.5c1.8.6 3 .9 4 1.1 1.3.3 1.5 2 .2 2.3H3z', 0), P('M6.5 10l.6 2.6', 1)],
  watch: [R(7, 7, 10, 10, 3, 0), P('M9.2 7 8.6 3.6h6.8L14.8 7', 1), P('M9.2 17l-.6 3.4h6.8L14.8 17', 2), P('M12 10v2.2l1.6 1', 3)],
  shirt: [P('M8.5 3 4 5.8l1.8 3L8 8v10.5h8V8l2.2.8L20 5.8 15.5 3a3.5 3.5 0 0 1-7 0z', 0)],
  coat: [P('M8 3 4 5.5 5.5 10 7 9.4V20h10V9.4l1.5.6L20 5.5 16 3l-4 2.4z', 0), L(12, 5.4, 12, 20, 1)],
  glasses: [C(6.5, 14, 3.3, 0), C(17.5, 14, 3.3, 1), P('M9.8 13.2a3 3 0 0 1 4.4 0', 2), P('M3.2 12.4 5 7.4h1.8', 3), P('M20.8 12.4 19 7.4h-1.8', 4)],
  belt: [R(3, 9, 18, 6, 1.6, 0), R(9, 9, 6, 6, 1.2, 1), L(12.6, 12, 15.5, 12, 2)],
  gem: [P('M6 3.5h12l3 4.8-9 12.7L3 8.3z', 0), L(3, 8.3, 21, 8.3, 1), P('M9 3.5 8.2 8.3 12 21l3.8-12.7L15 3.5', 2)],
  bag2: [P('M5 8h14l-1 12H6L5 8Z', 0), P('M8.5 8V6.4A3.5 3.5 0 0 1 15.5 6.4V8', 1)],
  plus: [L(12, 5, 12, 19, 0), L(5, 12, 19, 12, 1)],
  trend: [P('M4 15l5-5 3 3 6-7', 0), P('M18 6h2.5v2.5', 1)],
}

function ic(name: string, size = 17): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name] ?? []}
    </svg>
  )
}

/* ---- formatting helpers ---- */
const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
const fmtK = (n: number) => (n >= 1000 ? '$' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : '$' + n)
const fmtMx = (n: number) => '$' + Math.round(n).toLocaleString('es-MX')
const img = (id: string) => 'https://images.unsplash.com/' + id + '?w=300&q=80'
const initialsOf = (name: string) => {
  const p = name.trim().split(/\s+/)
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase()
}

/* ---- chart data ---- */
const MONTH_LABELS = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
const CUR_SERIES = [142, 158, 150, 171, 168, 190, 205, 198, 224, 238, 229, 262]
const PREV_SERIES = [120, 128, 132, 138, 135, 150, 158, 152, 170, 178, 168, 182]

function spark(vals: number[], close: boolean) {
  const n = vals.length, mx = Math.max(...vals), mn = Math.min(...vals), rng = (mx - mn) || 1
  const pts = vals.map((v, i) => ({ x: (i / (n - 1)) * 100, y: 24 - ((v - mn) / rng) * 22 - 1 }))
  let d = 'M' + pts.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' L')
  if (close) d += ' L100,26 L0,26 Z'
  return d
}

function buildPath(vals: number[], close: boolean) {
  const n = vals.length, mx = Math.max(...CUR_SERIES, ...PREV_SERIES), mn = Math.min(...PREV_SERIES) * 0.82
  const pts = vals.map((v, i) => ({ x: (i / (n - 1)) * 100, y: 100 - ((v - mn) / ((mx - mn) || 1)) * 100 }))
  let d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2)
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6
    d += 'C' + c1x.toFixed(2) + ',' + c1y.toFixed(2) + ' ' + c2x.toFixed(2) + ',' + c2y.toFixed(2) + ' ' + p2.x.toFixed(2) + ',' + p2.y.toFixed(2)
  }
  if (close) d += 'L100,100 L0,100 Z'
  return d
}
function pointAt(i: number) {
  const vals = CUR_SERIES, n = vals.length, mx = Math.max(...CUR_SERIES, ...PREV_SERIES), mn = Math.min(...PREV_SERIES) * 0.82
  return { x: (i / (n - 1)) * 100, y: 100 - ((vals[i] - mn) / ((mx - mn) || 1)) * 100 }
}

/* ---- product type system ---- */
const PRODUCT_TYPES: ProductType[] = [
  { key: 'Calzado', label: 'Tenis / Calzado', icon: 'shoe', sku: 'CAL', cat: 'Calzado', axis: 'shoe',
    attrs: [{ k: 'material', label: 'Material', opts: ['Piel', 'Ante', 'Malla', 'Knit', 'Sintético'] }, { k: 'sole', label: 'Suela', opts: ['Goma', 'Caucho', 'EVA', 'Cuero'] }, { k: 'gender', label: 'Género', opts: ['Hombre', 'Mujer', 'Unisex'] }, { k: 'drop', label: 'Drop', unit: 'mm', num: true }] },
  { key: 'Cartera', label: 'Cartera / Bolso', icon: 'wallet', sku: 'MAR', cat: 'Accesorios', axis: 'color',
    attrs: [{ k: 'material', label: 'Material', opts: ['Piel', 'Piel grano', 'Ante', 'Lona', 'Sintético'] }, { k: 'closure', label: 'Cierre', opts: ['Cremallera', 'Solapa', 'Broche', 'Imán'] }, { k: 'slots', label: 'Ranuras de tarjeta', num: true }, { k: 'strap', label: 'Correa', opts: ['Sin correa', 'Fija', 'Desmontable'] }] },
  { key: 'Reloj', label: 'Reloj', icon: 'watch', sku: 'REL', cat: 'Accesorios', axis: 'color',
    attrs: [{ k: 'movement', label: 'Movimiento', opts: ['Automático', 'Cuarzo', 'Solar', 'Cuerda'] }, { k: 'case', label: 'Material de caja', opts: ['Acero', 'Titanio', 'Oro', 'Cerámica'] }, { k: 'diameter', label: 'Diámetro', unit: 'mm', num: true }, { k: 'wr', label: 'Resistencia al agua', opts: ['3 ATM', '5 ATM', '10 ATM', '20 ATM'] }] },
  { key: 'Ropa', label: 'Ropa', icon: 'shirt', sku: 'PRE', cat: 'Prendas', axis: 'apparel',
    attrs: [{ k: 'material', label: 'Material', opts: ['Algodón', 'Lana', 'Lino', 'Merino', 'Cachemir', 'Denim'] }, { k: 'fit', label: 'Corte', opts: ['Slim', 'Regular', 'Oversize', 'Recto'] }, { k: 'gender', label: 'Género', opts: ['Hombre', 'Mujer', 'Unisex'] }, { k: 'season', label: 'Temporada', opts: ['Primavera/Verano', 'Otoño/Invierno', 'Todo el año'] }] },
  { key: 'Abrigo', label: 'Abrigo', icon: 'coat', sku: 'ABR', cat: 'Abrigos', axis: 'apparel',
    attrs: [{ k: 'material', label: 'Material', opts: ['Lana', 'Cachemir', 'Plumón', 'Gabardina', 'Piel'] }, { k: 'lining', label: 'Forro', opts: ['Sí', 'No', 'Desmontable'] }, { k: 'gender', label: 'Género', opts: ['Hombre', 'Mujer', 'Unisex'] }, { k: 'season', label: 'Temporada', opts: ['Otoño/Invierno', 'Entretiempo'] }] },
  { key: 'Gafas', label: 'Gafas', icon: 'glasses', sku: 'GAF', cat: 'Accesorios', axis: 'color',
    attrs: [{ k: 'frame', label: 'Montura', opts: ['Acetato', 'Metal', 'TR90'] }, { k: 'lens', label: 'Lente', opts: ['Solar', 'Graduable', 'Filtro azul', 'Espejo'] }, { k: 'uv', label: 'Protección', opts: ['UV400', 'Polarizada', 'UV380'] }] },
  { key: 'Cinturón', label: 'Cinturón', icon: 'belt', sku: 'CIN', cat: 'Accesorios', axis: 'apparel',
    attrs: [{ k: 'material', label: 'Material', opts: ['Piel', 'Piel grano', 'Trenzado', 'Lona'] }, { k: 'buckle', label: 'Hebilla', opts: ['Metal', 'Automática', 'Doble anilla'] }, { k: 'width', label: 'Ancho', unit: 'cm', num: true }] },
  { key: 'Joyería', label: 'Joyería', icon: 'gem', sku: 'JOY', cat: 'Accesorios', axis: 'color',
    attrs: [{ k: 'metal', label: 'Metal', opts: ['Oro 18k', 'Plata 925', 'Acero', 'Oro rosa'] }, { k: 'stone', label: 'Piedra', opts: ['Ninguna', 'Diamante', 'Zafiro', 'Perla', 'Circonita'] }, { k: 'weight', label: 'Peso', unit: 'g', num: true }] },
  { key: 'Accesorio', label: 'Otro accesorio', icon: 'bag2', sku: 'ACC', cat: 'Accesorios', axis: 'unica',
    attrs: [{ k: 'material', label: 'Material', opts: ['Algodón', 'Lana', 'Piel', 'Sintético'] }] },
]
const AXIS_PRESETS: Record<string, string[]> = { shoe: ['38', '39', '40', '41', '42', '43', '44', '45'], apparel: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], color: ['Negro', 'Marrón', 'Cognac', 'Marfil', 'Azul', 'Verde oliva'], unica: ['Única'] }
const CAT_TO_TYPE: Record<string, string> = { Calzado: 'Calzado', Prendas: 'Ropa', Abrigos: 'Abrigo', Accesorios: 'Accesorio' }
const typeOf = (key: string) => PRODUCT_TYPES.find((t) => t.key === key) || PRODUCT_TYPES[3]

const DENOM_DEFS = [{ v: 1000 }, { v: 500 }, { v: 200 }, { v: 100 }, { v: 50 }, { v: 20 }, { v: 10 }, { v: 5 }, { v: 2 }, { v: 1 }]
const AV_PALETTE = ['#171717', '#7a5f3a', '#5a6b7a', '#8a5a5a', '#4a6b52']

/* ---- initial + generated data (deterministic) ---- */
const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Abrigo Sculpted Wool', sku: 'VS-ABR-01', cat: 'Abrigos', price: 1290, compare: 0, cost: 520, stock: 14, status: 'Activo', img: 'photo-1539533018447-63fcce2678e3', sizes: ['S', 'M', 'L', 'XL'], committed: 2, vendor: 'VESPER Atelier' },
  { id: 'p2', name: 'Sneaker Aero Knit', sku: 'VS-CAL-04', cat: 'Calzado', price: 420, compare: 520, cost: 150, stock: 3, status: 'Activo', img: 'photo-1600185365483-26d7a4cc7519', sizes: ['40', '41', '42', '43'], committed: 1, vendor: 'VESPER Atelier' },
  { id: 'p3', name: 'Camisa Merino Zero', sku: 'VS-PRE-02', cat: 'Prendas', price: 240, compare: 0, cost: 78, stock: 38, status: 'Activo', img: 'photo-1602810318383-e386cc2a3ccf', sizes: ['S', 'M', 'L'], committed: 4, vendor: 'VESPER Atelier' },
  { id: 'p4', name: 'Pantalón Tailored Flow', sku: 'VS-PRE-07', cat: 'Prendas', price: 320, compare: 0, cost: 110, stock: 22, status: 'Activo', img: 'photo-1594633312681-425c7b97ccd1', sizes: ['S', 'M', 'L', 'XL'], committed: 3, vendor: 'VESPER Atelier' },
  { id: 'p5', name: 'Bolso Structured Tote', sku: 'VS-ACC-03', cat: 'Accesorios', price: 780, compare: 0, cost: 290, stock: 7, status: 'Activo', img: 'photo-1590874103328-eac38a683ce7', sizes: ['Única'], committed: 1, vendor: 'Maison Cuir' },
  { id: 'p6', name: 'Reloj Chrono Steel', sku: 'VS-ACC-09', cat: 'Accesorios', price: 1150, compare: 0, cost: 430, stock: 0, status: 'Borrador', img: 'photo-1523275335684-37898b6baf30', sizes: ['Única'], committed: 0, vendor: 'Horoge' },
  { id: 'p7', name: 'Sneaker Runner Carbon', sku: 'VS-CAL-11', cat: 'Calzado', price: 560, compare: 0, cost: 190, stock: 1, status: 'Activo', img: 'photo-1542291026-7eec264c27ff', sizes: ['41', '42', '43', '44'], committed: 0, vendor: 'VESPER Atelier' },
  { id: 'p8', name: 'Punto Cashmere Fold', sku: 'VS-PRE-15', cat: 'Prendas', price: 390, compare: 0, cost: 140, stock: 0, status: 'Borrador', img: 'photo-1576871337622-98d48d1cf531', sizes: ['S', 'M', 'L', 'XL'], committed: 0, vendor: 'VESPER Atelier' },
]

function buildMoreProducts(): Product[] {
  const seed: [string, string, number, number][] = [
    ['Gabardina Storm Line', 'Abrigos', 890, 340], ['Trench Noir Atelier', 'Abrigos', 1180, 470], ['Parka Alpine Down', 'Abrigos', 960, 360], ['Abrigo Wool Camel', 'Abrigos', 1090, 420], ['Capa Merino Long', 'Abrigos', 740, 280],
    ['Sneaker Court Ivory', 'Calzado', 380, 120], ['Botín Chelsea Leather', 'Calzado', 540, 190], ['Mocasín Suede Tan', 'Calzado', 460, 160], ['Runner Mesh Sky', 'Calzado', 420, 140], ['Sneaker Retro 84', 'Calzado', 350, 110], ['Bota Trail Rugged', 'Calzado', 590, 210],
    ['Camisa Oxford Sky', 'Prendas', 180, 55], ['Jersey Lambswool', 'Prendas', 260, 88], ['Camiseta Pima Core', 'Prendas', 95, 28], ['Chaqueta Denim Raw', 'Prendas', 290, 98], ['Vestido Slip Silk', 'Prendas', 340, 120], ['Falda Plisada Midi', 'Prendas', 220, 72], ['Sudadera Loop Cotton', 'Prendas', 160, 48], ['Polo Piqué Sport', 'Prendas', 130, 40],
    ['Cinturón Cuero Trenzado', 'Accesorios', 140, 42], ['Gorra Baseball Wool', 'Accesorios', 90, 26], ['Bufanda Cashmere Grid', 'Accesorios', 210, 70], ['Gafas Acetato Round', 'Accesorios', 180, 54], ['Cartera Bifold', 'Accesorios', 160, 48], ['Mochila Roll-top', 'Accesorios', 320, 110], ['Guantes Nappa', 'Accesorios', 150, 46], ['Chal Alpaca Weave', 'Accesorios', 230, 80], ['Pañuelo Seda Print', 'Accesorios', 120, 36],
  ]
  const imgs = ['photo-1544022613-e87ca75a784a', 'photo-1591047139829-d91aecb6caea', 'photo-1521572163474-6864f9cf17ab', 'photo-1596755094514-f87e34085b2c', 'photo-1516762689617-e1cffcef479d', 'photo-1560769629-975ec94e6a86', 'photo-1553062407-98eeb64c6a62', 'photo-1611085583191-a3b181a88401', 'photo-1509941943102-10c232535736', 'photo-1434493789847-2f02dc6ca35d']
  const stk = [8, 3, 0, 24, 12, 5, 1, 33, 7, 0, 18, 6, 27, 2, 15, 9, 0, 31, 4, 21, 11, 0, 38, 14, 5, 28, 0, 17]
  const sizesFor: Record<string, string[]> = { Abrigos: ['S', 'M', 'L', 'XL'], Calzado: ['40', '41', '42', '43', '44'], Prendas: ['S', 'M', 'L', 'XL'], Accesorios: ['Única'] }
  const pre: Record<string, string> = { Abrigos: 'ABR', Calzado: 'CAL', Prendas: 'PRE', Accesorios: 'ACC' }
  return seed.map((s, i) => {
    const [name, cat, price, cost] = s
    const stock = stk[i % stk.length]
    return {
      id: 'g' + i, name, sku: 'VS-' + pre[cat] + '-' + String(20 + i).padStart(2, '0'), cat, price, compare: i % 4 === 0 ? Math.round(price * 1.25) : 0, cost, stock,
      status: stock === 0 && i % 2 === 0 ? 'Borrador' : 'Activo', img: imgs[i % imgs.length], sizes: sizesFor[cat], committed: i % 4, vendor: i % 3 === 0 ? 'Maison Cuir' : 'VESPER Atelier',
    }
  })
}

const _FN = ['Elena', 'Marco', 'Lucía', 'Adrián', 'Paula', 'Hugo', 'Valentina', 'Iker', 'Noa', 'Bruno', 'Carla', 'Diego', 'Alba', 'Mateo', 'Julia', 'Pablo', 'Emma', 'Álvaro', 'Daniela', 'Leo', 'Sara', 'Nico', 'Irene', 'Gael', 'Vera', 'Unai', 'Lola', 'Enzo', 'Nora', 'Aitor', 'Chloé', 'Louis', 'Anaïs', 'Lars', 'Freya', 'Milan', 'Ingrid', 'Otto', 'Bianca', 'Timo']
const _LN = ['Serrano', 'Bauer', 'Moreau', 'Costa', 'Navarro', 'Vidal', 'Rossi', 'Berg', 'Duarte', 'Klein', 'Marchetti', 'Fischer', 'Lombardi', 'Nowak', 'Haas', 'Blanco', 'Méndez', 'Roy', 'Sauer', 'Prieto', 'Lindqvist', 'Petit', 'Romano', 'Weber', 'Soto']
const DIACRITICS = /[̀-ͯ]/g
const _cleanEmail = (name: string) => name.toLowerCase().normalize('NFD').replace(DIACRITICS, '').replace(/[^a-z ]/g, '').trim().replace(/ +/g, '.')
const _pname = (i: number) => _FN[i % _FN.length] + ' ' + _LN[(i * 7 + 3) % _LN.length]

function buildMoreClients(): ClientRow[] {
  const segs = ['Recurrente', 'Nuevo', 'VIP', 'Recurrente', 'Nuevo', 'Recurrente']
  const lasts = ['Hoy', 'Ayer', 'Hace 2 d', 'Hace 4 d', 'Hace 1 sem', 'Hace 2 sem', 'Hace 3 sem']
  const out: ClientRow[] = []
  for (let i = 0; i < 40; i++) {
    const name = _pname(i + 5), seg = segs[i % segs.length]
    const orders = seg === 'VIP' ? 9 + (i % 8) : seg === 'Nuevo' ? 1 + (i % 2) : 3 + (i % 6)
    const spent = orders * (190 + ((i * 53) % 560))
    out.push({ name, email: _cleanEmail(name) + '@correo.com', seg, orders, spent, last: lasts[i % lasts.length] })
  }
  return out
}
function buildMoreOrders(): OrderRow[] {
  const items = ['Sneaker Aero Knit ×1', 'Camisa Merino Zero ×2', 'Abrigo Sculpted Wool ×1', 'Bolso Structured Tote ×1', 'Pantalón Tailored Flow ×1', 'Runner Mesh Sky ×1, Gorra Wool', 'Vestido Slip Silk ×1', 'Jersey Lambswool ×2']
  const pays = ['Pagado', 'Pagado', 'Pagado', 'Pendiente', 'Pagado', 'Reembolsado', 'Pagado']
  const ships = ['Entregado', 'Enviado', 'Preparando', 'Sin cumplir', 'Enviado', 'Devuelto', 'Entregado', 'Preparando']
  const out: OrderRow[] = []
  for (let i = 0; i < 22; i++) {
    const name = _pname(i + 2), total = [1290, 840, 560, 1150, 780, 390, 320, 240, 960, 470][i % 10]
    out.push({ id: '#VS-' + (4814 - i), name, items: items[i % items.length], total, pay: pays[i % pays.length], ship: ships[i % ships.length], time: (7 - Math.floor(i / 6)) + ':' + String((59 - i * 7 + 300) % 60).padStart(2, '0') })
  }
  return out
}
function buildMorePayments(): PaymentRow[] {
  const sts = ['Completado', 'Completado', 'Completado', 'Pendiente', 'Completado', 'Reembolsado', 'Completado']
  const out: PaymentRow[] = []
  for (let i = 0; i < 20; i++) {
    const name = _pname(i + 6), amt = [1290, 840, 560, 1150, 780, 390, 320, 240, 960, 470][i % 10]
    out.push({ tx: 'txn_' + (9000 - i * 37).toString(36).toUpperCase() + String.fromCharCode(97 + (i % 26)), name, amt, st: sts[i % sts.length], date: (7 - Math.floor(i / 6)) + ':' + String((51 - i * 5 + 300) % 60).padStart(2, '0') })
  }
  return out
}
const MORE_PRODUCTS = buildMoreProducts()
const MORE_CLIENTS = buildMoreClients()
const MORE_ORDERS = buildMoreOrders()
const MORE_PAYMENTS = buildMorePayments()

const PER = 15
function pager(total: number, page: number, setter: (n: number) => void): PagerData {
  const per = PER, pages = Math.max(1, Math.ceil(total / per)), cur = Math.min(page, pages)
  const from = total === 0 ? 0 : (cur - 1) * per + 1, to = Math.min(cur * per, total)
  const raw: (number | string)[] = []
  for (let i = 1; i <= pages; i++) {
    if (pages <= 7 || i === 1 || i === pages || Math.abs(i - cur) <= 1) raw.push(i)
    else if (raw[raw.length - 1] !== '…') raw.push('…')
  }
  return {
    label: 'Mostrando ' + from + '–' + to + ' de ' + total, from, to, total, pages, cur, single: pages <= 1,
    prevColor: cur <= 1 ? 'var(--muted2)' : 'var(--text)', nextColor: cur >= pages ? 'var(--muted2)' : 'var(--text)',
    onPrev: () => setter(Math.max(1, cur - 1)), onNext: () => setter(Math.min(pages, cur + 1)),
    nums: raw.map((n, i) => ({ label: String(n), key: 'pg' + i, isDots: n === '…', bg: n === cur ? '#171717' : 'transparent', color: n === cur ? '#fff' : 'var(--muted)', onClick: () => { if (n !== '…') setter(n as number) } })),
  }
}
function sliceList<T>(list: T[], page: number): T[] {
  const per = PER, s = (Math.min(page, Math.max(1, Math.ceil(list.length / per))) - 1) * per
  return list.slice(s, s + per)
}

/* ---- reusable pager bar ---- */
function PagerBar({ p }: { p: PagerData }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid var(--line)' }}>
      <span style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{p.label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <button onClick={p.onPrev} className="hv-s3" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: p.prevColor, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        {p.nums.map((pg) => (
          <button key={pg.key} onClick={pg.onClick} className="hv-s3" style={{ minWidth: 32, height: 32, padding: '0 8px', borderRadius: 8, border: '1px solid var(--line)', background: pg.bg, color: pg.color, cursor: 'pointer', fontSize: 12.5, fontWeight: 500 }}>{pg.label}</button>
        ))}
        <button onClick={p.onNext} className="hv-s3" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: p.nextColor, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
      </div>
    </div>
  )
}

/* ---- inline status pill ---- */
function Pill({ text, color, bg, dot = true }: { text: string; color: string; bg: string; dot?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, color, background: bg, padding: '4px 10px', borderRadius: 20 }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />}
      {text}
    </span>
  )
}

const OPEN_FLOAT = 3000

/* ============================================================
   i18n — CONTENT[lang]. Las claves canónicas (estados, categorías,
   tipos, etc.) siguen en español dentro de la data; aquí sólo se
   traduce el texto visible.
   ============================================================ */
interface TypeContent { label: string; attrs: Record<string, { label: string; opts?: Record<string, string> }> }
interface Content {
  locale: string
  months: string[]
  cat: Record<string, string>
  st: Record<string, string>
  seg: Record<string, string>
  rel: Record<string, string>
  mov: Record<string, string>
  navLabels: Record<'inicio' | 'pedidos' | 'productos' | 'inventario' | 'clientes' | 'pagos' | 'descuentos' | 'caja' | 'analiticas' | 'ajustes', string>
  crumbs: Record<'inicio' | 'pedidos' | 'productos' | 'formEdit' | 'formNew' | 'inventario' | 'clientes' | 'pagos' | 'descuentos' | 'caja' | 'ajustes', string>
  types: Record<string, TypeContent>
  axisVals: Record<string, string>
  axisLabel: Record<string, string>
  variantsWord: string
  selectPh: string
  searchPh: string; noResults: string
  groupProducts: string; groupOrders: string; groupClients: string
  viewStore: string; owner: string
  ranges: { d7: string; d30: string; m3: string; m12: string }
  recentPrefix: string; recentSuffix: string
  themeLight: string; themeDark: string
  notifTitle: string; markAllRead: string; viewAllActivity: string
  notifs: { title: string; text: string; time: string }[]
  greeting: string; perfPre: string
  kpiLabels: string[]
  salesTotal: string; thisPeriod: string; prev: string
  funnelTitle: string
  funnel: { label: string; rate: string }[]
  channelTitle: string; channels: string[]
  donutLabel: string; bestSellers: string; viewAll: string; recentOrdersTitle: string
  searchByTitle: string; filterAll: string; addProduct: string
  thProducto: string; thEstado: string; thInventario: string; thCategoria: string; thPrecio: string
  edit: string; outOfStock: string; inStock: string; noResultsDot: string
  formTitleEdit: string; formTitleNew: string
  typeOfProduct: string; typeHint: string
  fTitle: string; fTitlePh: string; fDesc: string; fDescPh: string
  media: string; mediaHint: string; mainPhoto: string; addSlot: string
  pricing: string; fPrice: string; comparePrice: string; costPerItem: string; marginLbl: string; profitLbl: string
  specs: string; specsHint: string
  invWord: string; skuCode: string; qtyAvailable: string
  variantHint: string; thVariante: string; thStock: string
  statusWord: string; organization: string; storeCategory: string; autoByType: string; vendorWord: string; vendorPh: string
  saveEdit: string; saveNew: string; discard: string
  invStats: string[]
  thSku: string; thCommitted: string; thAvailable: string; thAdjust: string
  lowStock: string; available: string
  orderFilters: string[]
  thPedido: string; thCliente: string; thArticulos: string; thTotal: string; thPago: string; thEnvio: string; thHora: string
  orderWord: string; todayAt: string; shipTracking: string; itemsHdr: string
  subtotal: string; shippingWord: string; vat: string; totalWord: string; free: string
  shipAddress: string; markShipped: string; refundWord: string
  clientStats: string[]
  searchClient: string
  thCorreo: string; thSegmento: string; thGastado: string; thUltCompra: string
  payStats: { label: string; note: string }[]
  thTransaccion: string; thMonto: string; thFecha: string
  thCodigo: string; thTipo: string; thValor: string; thUsos: string; thVence: string
  discounts: { type: string; value: string; uses: string; exp: string }[]
  shiftOpen: string; cashierLine: string; exportCut: string; closeReg: string
  cashCards: string[]
  cashCount: string; cashCountHint: string; totalCounted: string
  reconcile: string; expectedDrawer: string; difference: string; balanced: string; over: string; short: string
  shiftMovements: string; conceptPh: string; recordTitle: string
  netEarnings: string; plToday: string; plHint: string
  pnlRows: string[]
  netProfit: string; netMargin: string
  movInit: MovItem[]
  movAdd: Record<string, string>
  storePrefs: string; storeControls: string
  setDefs: { label: string; desc: string }[]
  toastTitle: string; toastUpdated: string; toastCreated: string; toastAmount: string; toastMov: string; toastExport: string; toastCashClosed: string; toastShipped: string; toastRefunded: string
  csv: { title: string; date: string; register: string; denom: string; units: string; subtotal: string; openFloat: string; cashIn: string; withdrawals: string; expected: string; counted: string; difference: string; movements: string; type: string; concept: string; time: string; amount: string }
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    locale: 'es-MX',
    months: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    cat: { Abrigos: 'Abrigos', Calzado: 'Calzado', Prendas: 'Prendas', Accesorios: 'Accesorios' },
    st: { Activo: 'Activo', Borrador: 'Borrador', Programado: 'Programado', Expirado: 'Expirado', Pagado: 'Pagado', Pendiente: 'Pendiente', Reembolsado: 'Reembolsado', Completado: 'Completado', Preparando: 'Preparando', Enviado: 'Enviado', Entregado: 'Entregado', 'Sin cumplir': 'Sin cumplir', Devuelto: 'Devuelto', Confirmado: 'Confirmado' },
    seg: { VIP: 'VIP', Recurrente: 'Recurrente', Nuevo: 'Nuevo' },
    rel: { Hoy: 'Hoy', Ayer: 'Ayer', 'Hace 2 d': 'Hace 2 d', 'Hace 3 d': 'Hace 3 d', 'Hace 4 d': 'Hace 4 d', 'Hace 5 d': 'Hace 5 d', 'Hace 1 sem': 'Hace 1 sem', 'Hace 2 sem': 'Hace 2 sem', 'Hace 3 sem': 'Hace 3 sem' },
    mov: { Ingreso: 'Ingreso', Retiro: 'Retiro', Gasto: 'Gasto', Apertura: 'Apertura' },
    navLabels: { inicio: 'Inicio', pedidos: 'Pedidos', productos: 'Productos', inventario: 'Inventario', clientes: 'Clientes', pagos: 'Pagos', descuentos: 'Descuentos', caja: 'Caja', analiticas: 'Analíticas', ajustes: 'Ajustes' },
    crumbs: { inicio: 'Inicio', pedidos: 'Pedidos', productos: 'Productos', formEdit: 'Productos › Editar', formNew: 'Productos › Nuevo', inventario: 'Inventario', clientes: 'Clientes', pagos: 'Pagos', descuentos: 'Descuentos', caja: 'Caja · Arqueo', ajustes: 'Ajustes' },
    types: {
      Calzado: { label: 'Tenis / Calzado', attrs: { material: { label: 'Material' }, sole: { label: 'Suela' }, gender: { label: 'Género' }, drop: { label: 'Drop' } } },
      Cartera: { label: 'Cartera / Bolso', attrs: { material: { label: 'Material' }, closure: { label: 'Cierre' }, slots: { label: 'Ranuras de tarjeta' }, strap: { label: 'Correa' } } },
      Reloj: { label: 'Reloj', attrs: { movement: { label: 'Movimiento' }, case: { label: 'Material de caja' }, diameter: { label: 'Diámetro' }, wr: { label: 'Resistencia al agua' } } },
      Ropa: { label: 'Ropa', attrs: { material: { label: 'Material' }, fit: { label: 'Corte' }, gender: { label: 'Género' }, season: { label: 'Temporada' } } },
      Abrigo: { label: 'Abrigo', attrs: { material: { label: 'Material' }, lining: { label: 'Forro' }, gender: { label: 'Género' }, season: { label: 'Temporada' } } },
      Gafas: { label: 'Gafas', attrs: { frame: { label: 'Montura' }, lens: { label: 'Lente' }, uv: { label: 'Protección' } } },
      Cinturón: { label: 'Cinturón', attrs: { material: { label: 'Material' }, buckle: { label: 'Hebilla' }, width: { label: 'Ancho' } } },
      Joyería: { label: 'Joyería', attrs: { metal: { label: 'Metal' }, stone: { label: 'Piedra' }, weight: { label: 'Peso' } } },
      Accesorio: { label: 'Otro accesorio', attrs: { material: { label: 'Material' } } },
    },
    axisVals: {},
    axisLabel: { shoe: 'Tallas disponibles', apparel: 'Tallas disponibles', color: 'Colores disponibles', unica: 'Variante' },
    variantsWord: 'Variantes',
    selectPh: 'Selecciona…',
    searchPh: 'Buscar productos, pedidos…', noResults: 'Sin resultados',
    groupProducts: 'Productos', groupOrders: 'Pedidos', groupClients: 'Clientes',
    viewStore: 'Ver tienda', owner: 'Propietario',
    ranges: { d7: '7 días', d30: '30 días', m3: '3 meses', m12: '12 meses' },
    recentPrefix: '', recentSuffix: ' recientes',
    themeLight: 'Claro', themeDark: 'Oscuro',
    notifTitle: 'Notificaciones', markAllRead: 'Marcar todo leído', viewAllActivity: 'Ver toda la actividad',
    notifs: [
      { title: 'Nuevo pedido', text: '#VS-4821 · Marina Ovalle · $1,290', time: 'Hace 3 min' },
      { title: 'Stock bajo', text: 'Sneaker Aero Knit · 3 uds.', time: 'Hace 22 min' },
      { title: 'Reembolso', text: 'Nadia Ferrand · $780', time: 'Hace 1 h' },
      { title: 'Nuevo cliente', text: 'Camille Dumas se registró', time: 'Hace 2 h' },
      { title: 'Cupón', text: 'FLASH40 empieza en 7 días', time: 'Ayer' },
    ],
    greeting: 'Buenos días, Alejandro.', perfPre: 'Aquí está el rendimiento de VESPER',
    kpiLabels: ['Ventas', 'Pedidos', 'Sesiones', 'Conversión', 'Ticket medio'],
    salesTotal: 'Ventas totales', thisPeriod: 'Este periodo', prev: 'Anterior',
    funnelTitle: 'Embudo de conversión',
    funnel: [
      { label: 'Sesiones', rate: '100%' },
      { label: 'Producto visto', rate: '56.3% de sesiones' },
      { label: 'Añadido al carrito', rate: '27.7% de vistas' },
      { label: 'Compra', rate: '31.2% de checkouts' },
    ],
    channelTitle: 'Ventas por canal', channels: ['Tienda online', 'Instagram', 'Marketplace', 'Referidos'],
    donutLabel: 'PEDIDOS', bestSellers: 'Más vendidos', viewAll: 'Ver todo', recentOrdersTitle: 'Pedidos recientes',
    searchByTitle: 'Buscar por título o SKU…', filterAll: 'Todos', addProduct: 'Agregar producto',
    thProducto: 'Producto', thEstado: 'Estado', thInventario: 'Inventario', thCategoria: 'Categoría', thPrecio: 'Precio',
    edit: 'Editar', outOfStock: 'Agotado', inStock: 'en stock', noResultsDot: 'Sin resultados.',
    formTitleEdit: 'Editar producto', formTitleNew: 'Agregar producto',
    typeOfProduct: 'Tipo de producto', typeHint: 'Elige qué es. Cada tipo ajusta el SKU, las variantes y sus especificaciones.',
    fTitle: 'Título', fTitlePh: 'Camiseta de manga corta', fDesc: 'Descripción', fDescPh: 'Materiales, corte, cuidado, procedencia…',
    media: 'Contenido multimedia', mediaHint: 'Arrastra imágenes a cada espacio para reemplazarlas.', mainPhoto: 'Foto principal', addSlot: '+ Añadir',
    pricing: 'Precios', fPrice: 'Precio', comparePrice: 'Precio comparado', costPerItem: 'Costo por artículo', marginLbl: 'Margen: ', profitLbl: 'Beneficio: ',
    specs: 'Especificaciones', specsHint: 'Atributos propios de este tipo. Aparecen en la ficha de la tienda.',
    invWord: 'Inventario', skuCode: 'SKU (código)', qtyAvailable: 'Cantidad disponible',
    variantHint: 'Cada opción genera una variante con su propio stock.', thVariante: 'Variante', thStock: 'Stock',
    statusWord: 'Estado', organization: 'Organización', storeCategory: 'Categoría en tienda', autoByType: 'auto según tipo', vendorWord: 'Proveedor', vendorPh: 'VESPER Atelier',
    saveEdit: 'Guardar', saveNew: 'Crear producto', discard: 'Descartar',
    invStats: ['Unidades en stock', 'Valor a costo', 'Valor a venta', 'Margen potencial', 'Stock bajo / agotados'],
    thSku: 'SKU', thCommitted: 'Comprometido', thAvailable: 'Disponible', thAdjust: 'Ajustar',
    lowStock: 'Stock bajo', available: 'Disponible',
    orderFilters: ['Todos', 'Sin pagar', 'Sin cumplir', 'Reembolsados'],
    thPedido: 'Pedido', thCliente: 'Cliente', thArticulos: 'Artículos', thTotal: 'Total', thPago: 'Pago', thEnvio: 'Envío', thHora: 'Hora',
    orderWord: 'Pedido', todayAt: 'Hoy · ', shipTracking: 'Seguimiento del envío', itemsHdr: 'Artículos',
    subtotal: 'Subtotal', shippingWord: 'Envío', vat: 'IVA (16%)', totalWord: 'Total', free: 'Gratis',
    shipAddress: 'Dirección de envío', markShipped: 'Marcar como enviado', refundWord: 'Reembolsar',
    clientStats: ['Clientes totales', 'Nuevos (30d)', 'Tasa de retorno', 'LTV medio'],
    searchClient: 'Buscar cliente…',
    thCorreo: 'Correo', thSegmento: 'Segmento', thGastado: 'Gastado', thUltCompra: 'Últ. compra',
    payStats: [
      { label: 'Cobrado hoy', note: '42 transacciones' },
      { label: 'Pendiente', note: '3 en proceso' },
      { label: 'Reembolsado', note: '1 devolución' },
      { label: 'Neto (tras comisión)', note: '−2.7% procesador' },
    ],
    thTransaccion: 'Transacción', thMonto: 'Monto', thFecha: 'Fecha',
    thCodigo: 'Código', thTipo: 'Tipo', thValor: 'Valor', thUsos: 'Usos', thVence: 'Vence',
    discounts: [
      { type: 'Porcentaje en toda la tienda', value: '−10%', uses: '342 usos', exp: '31 dic 2026' },
      { type: 'Envío gratis', value: 'Envío $0', uses: '1,204 usos', exp: 'Sin límite' },
      { type: 'Primer pedido', value: '−15%', uses: '89 usos', exp: '30 sep 2026' },
      { type: 'Calzado seleccionado', value: '−40%', uses: '56 usos', exp: 'Empieza 10 jul' },
      { type: 'Porcentaje', value: '−25%', uses: '610 usos', exp: 'Venció 21 jun' },
    ],
    shiftOpen: 'Turno abierto · Caja 01', cashierLine: 'Cajero: A. Vega · Apertura 09:00 · Corte pendiente', exportCut: 'Exportar corte', closeReg: 'Cerrar caja',
    cashCards: ['Fondo de apertura', 'Ingresos efectivo', 'Ventas tarjeta', 'Retiros / gastos', 'Esperado en caja'],
    cashCount: 'Conteo de efectivo', cashCountHint: 'Introduce las unidades contadas de cada denominación.', totalCounted: 'Total contado',
    reconcile: 'Arqueo', expectedDrawer: 'Esperado en caja', difference: 'Diferencia', balanced: 'Caja cuadrada ✓', over: 'Sobrante', short: 'Faltante',
    shiftMovements: 'Movimientos del turno', conceptPh: 'Concepto (opcional)', recordTitle: 'Registrar',
    netEarnings: 'Ganancias netas del turno', plToday: 'Estado de resultados · hoy', plHint: 'Del ingreso bruto se descuentan costo de mercancía, comisiones, reembolsos y gastos.',
    pnlRows: ['Ingresos brutos', 'Costo de productos (CMV)', 'Comisiones de tarjeta', 'Reembolsos', 'Gastos operativos'],
    netProfit: 'Ganancia neta', netMargin: 'Margen neto',
    movInit: [
      { type: 'Apertura', label: 'Fondo de apertura', time: '09:00', amount: 3000 },
      { type: 'Ingreso', label: 'Venta efectivo #VS-4821', time: '09:02', amount: 1290 },
      { type: 'Retiro', label: 'Retiro a bóveda', time: '08:30', amount: -1200 },
      { type: 'Ingreso', label: 'Venta efectivo #VS-4816', time: '07:44', amount: 390 },
      { type: 'Gasto', label: 'Gasto: mensajería', time: '07:10', amount: -360 },
    ],
    movAdd: { Ingreso: 'Ingreso de efectivo', Retiro: 'Retiro de caja', Gasto: 'Gasto' },
    storePrefs: 'Preferencias de la tienda', storeControls: 'Controles operativos de VESPER.',
    setDefs: [
      { label: 'Control de inventario', desc: 'Descontar stock automáticamente en cada venta.' },
      { label: 'Alertas de stock bajo', desc: 'Avísame cuando un producto baje de 5 unidades.' },
      { label: 'Precios con impuesto incluido', desc: 'Mostrar IVA dentro del precio en la tienda.' },
      { label: 'Compra como invitado', desc: 'Permitir pagar sin crear una cuenta.' },
    ],
    toastTitle: 'Ponle un título al producto', toastUpdated: 'Producto actualizado', toastCreated: 'Producto creado', toastAmount: 'Indica un importe', toastMov: 'Movimiento registrado', toastExport: 'Corte de caja exportado (CSV)', toastCashClosed: 'Corte de caja registrado', toastShipped: 'Pedido marcado como enviado', toastRefunded: 'Reembolso emitido',
    csv: { title: 'VESPER — Corte de caja', date: 'Fecha', register: 'Caja', denom: 'Denominación', units: 'Unidades', subtotal: 'Subtotal', openFloat: 'Fondo de apertura', cashIn: 'Ingresos efectivo', withdrawals: 'Retiros/gastos', expected: 'Esperado en caja', counted: 'Total contado', difference: 'Diferencia', movements: 'Movimientos', type: 'Tipo', concept: 'Concepto', time: 'Hora', amount: 'Importe' },
  },
  en: {
    locale: 'en-US',
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    cat: { Abrigos: 'Coats', Calzado: 'Footwear', Prendas: 'Apparel', Accesorios: 'Accessories' },
    st: { Activo: 'Active', Borrador: 'Draft', Programado: 'Scheduled', Expirado: 'Expired', Pagado: 'Paid', Pendiente: 'Pending', Reembolsado: 'Refunded', Completado: 'Completed', Preparando: 'Preparing', Enviado: 'Shipped', Entregado: 'Delivered', 'Sin cumplir': 'Unfulfilled', Devuelto: 'Returned', Confirmado: 'Confirmed' },
    seg: { VIP: 'VIP', Recurrente: 'Returning', Nuevo: 'New' },
    rel: { Hoy: 'Today', Ayer: 'Yesterday', 'Hace 2 d': '2 d ago', 'Hace 3 d': '3 d ago', 'Hace 4 d': '4 d ago', 'Hace 5 d': '5 d ago', 'Hace 1 sem': '1 wk ago', 'Hace 2 sem': '2 wk ago', 'Hace 3 sem': '3 wk ago' },
    mov: { Ingreso: 'Cash in', Retiro: 'Withdrawal', Gasto: 'Expense', Apertura: 'Opening' },
    navLabels: { inicio: 'Home', pedidos: 'Orders', productos: 'Products', inventario: 'Inventory', clientes: 'Customers', pagos: 'Payments', descuentos: 'Discounts', caja: 'Register', analiticas: 'Analytics', ajustes: 'Settings' },
    crumbs: { inicio: 'Home', pedidos: 'Orders', productos: 'Products', formEdit: 'Products › Edit', formNew: 'Products › New', inventario: 'Inventory', clientes: 'Customers', pagos: 'Payments', descuentos: 'Discounts', caja: 'Register · Reconciliation', ajustes: 'Settings' },
    types: {
      Calzado: { label: 'Sneakers / Footwear', attrs: { material: { label: 'Material', opts: { Piel: 'Leather', Ante: 'Suede', Malla: 'Mesh', Knit: 'Knit', 'Sintético': 'Synthetic' } }, sole: { label: 'Sole', opts: { Goma: 'Gum', Caucho: 'Rubber', EVA: 'EVA', Cuero: 'Leather' } }, gender: { label: 'Gender', opts: { Hombre: 'Men', Mujer: 'Women', Unisex: 'Unisex' } }, drop: { label: 'Drop' } } },
      Cartera: { label: 'Wallet / Bag', attrs: { material: { label: 'Material', opts: { Piel: 'Leather', 'Piel grano': 'Grain leather', Ante: 'Suede', Lona: 'Canvas', 'Sintético': 'Synthetic' } }, closure: { label: 'Closure', opts: { Cremallera: 'Zip', Solapa: 'Flap', Broche: 'Clasp', 'Imán': 'Magnetic' } }, slots: { label: 'Card slots' }, strap: { label: 'Strap', opts: { 'Sin correa': 'No strap', Fija: 'Fixed', Desmontable: 'Detachable' } } } },
      Reloj: { label: 'Watch', attrs: { movement: { label: 'Movement', opts: { 'Automático': 'Automatic', Cuarzo: 'Quartz', Solar: 'Solar', Cuerda: 'Manual' } }, case: { label: 'Case material', opts: { Acero: 'Steel', Titanio: 'Titanium', Oro: 'Gold', 'Cerámica': 'Ceramic' } }, diameter: { label: 'Diameter' }, wr: { label: 'Water resistance' } } },
      Ropa: { label: 'Clothing', attrs: { material: { label: 'Material', opts: { 'Algodón': 'Cotton', Lana: 'Wool', Lino: 'Linen', Merino: 'Merino', Cachemir: 'Cashmere', Denim: 'Denim' } }, fit: { label: 'Fit', opts: { Slim: 'Slim', Regular: 'Regular', Oversize: 'Oversize', Recto: 'Straight' } }, gender: { label: 'Gender', opts: { Hombre: 'Men', Mujer: 'Women', Unisex: 'Unisex' } }, season: { label: 'Season', opts: { 'Primavera/Verano': 'Spring/Summer', 'Otoño/Invierno': 'Fall/Winter', 'Todo el año': 'Year-round' } } } },
      Abrigo: { label: 'Coat', attrs: { material: { label: 'Material', opts: { Lana: 'Wool', Cachemir: 'Cashmere', 'Plumón': 'Down', Gabardina: 'Gabardine', Piel: 'Leather' } }, lining: { label: 'Lining', opts: { 'Sí': 'Yes', No: 'No', Desmontable: 'Detachable' } }, gender: { label: 'Gender', opts: { Hombre: 'Men', Mujer: 'Women', Unisex: 'Unisex' } }, season: { label: 'Season', opts: { 'Otoño/Invierno': 'Fall/Winter', Entretiempo: 'Mid-season' } } } },
      Gafas: { label: 'Eyewear', attrs: { frame: { label: 'Frame', opts: { Acetato: 'Acetate', Metal: 'Metal', TR90: 'TR90' } }, lens: { label: 'Lens', opts: { Solar: 'Sun', Graduable: 'Prescription', 'Filtro azul': 'Blue light', Espejo: 'Mirrored' } }, uv: { label: 'Protection', opts: { Polarizada: 'Polarized' } } } },
      Cinturón: { label: 'Belt', attrs: { material: { label: 'Material', opts: { Piel: 'Leather', 'Piel grano': 'Grain leather', Trenzado: 'Braided', Lona: 'Canvas' } }, buckle: { label: 'Buckle', opts: { Metal: 'Metal', 'Automática': 'Automatic', 'Doble anilla': 'Double ring' } }, width: { label: 'Width' } } },
      Joyería: { label: 'Jewelry', attrs: { metal: { label: 'Metal', opts: { 'Oro 18k': '18k gold', 'Plata 925': '925 silver', Acero: 'Steel', 'Oro rosa': 'Rose gold' } }, stone: { label: 'Stone', opts: { Ninguna: 'None', Diamante: 'Diamond', Zafiro: 'Sapphire', Perla: 'Pearl', Circonita: 'Zirconia' } }, weight: { label: 'Weight' } } },
      Accesorio: { label: 'Other accessory', attrs: { material: { label: 'Material', opts: { 'Algodón': 'Cotton', Lana: 'Wool', Piel: 'Leather', 'Sintético': 'Synthetic' } } } },
    },
    axisVals: { Negro: 'Black', 'Marrón': 'Brown', Cognac: 'Cognac', Marfil: 'Ivory', Azul: 'Blue', 'Verde oliva': 'Olive', 'Única': 'One size' },
    axisLabel: { shoe: 'Available sizes', apparel: 'Available sizes', color: 'Available colors', unica: 'Variant' },
    variantsWord: 'Variants',
    selectPh: 'Select…',
    searchPh: 'Search products, orders…', noResults: 'No results',
    groupProducts: 'Products', groupOrders: 'Orders', groupClients: 'Customers',
    viewStore: 'View store', owner: 'Owner',
    ranges: { d7: '7 days', d30: '30 days', m3: '3 months', m12: '12 months' },
    recentPrefix: 'Last ', recentSuffix: '',
    themeLight: 'Light', themeDark: 'Dark',
    notifTitle: 'Notifications', markAllRead: 'Mark all read', viewAllActivity: 'View all activity',
    notifs: [
      { title: 'New order', text: '#VS-4821 · Marina Ovalle · $1,290', time: '3 min ago' },
      { title: 'Low stock', text: 'Sneaker Aero Knit · 3 units', time: '22 min ago' },
      { title: 'Refund', text: 'Nadia Ferrand · $780', time: '1 h ago' },
      { title: 'New customer', text: 'Camille Dumas signed up', time: '2 h ago' },
      { title: 'Coupon', text: 'FLASH40 starts in 7 days', time: 'Yesterday' },
    ],
    greeting: 'Good morning, Alejandro.', perfPre: "Here's how VESPER is performing",
    kpiLabels: ['Sales', 'Orders', 'Sessions', 'Conversion', 'Avg. order value'],
    salesTotal: 'Total sales', thisPeriod: 'This period', prev: 'Previous',
    funnelTitle: 'Conversion funnel',
    funnel: [
      { label: 'Sessions', rate: '100%' },
      { label: 'Product viewed', rate: '56.3% of sessions' },
      { label: 'Added to cart', rate: '27.7% of views' },
      { label: 'Purchase', rate: '31.2% of checkouts' },
    ],
    channelTitle: 'Sales by channel', channels: ['Online store', 'Instagram', 'Marketplace', 'Referrals'],
    donutLabel: 'ORDERS', bestSellers: 'Best sellers', viewAll: 'View all', recentOrdersTitle: 'Recent orders',
    searchByTitle: 'Search by title or SKU…', filterAll: 'All', addProduct: 'Add product',
    thProducto: 'Product', thEstado: 'Status', thInventario: 'Inventory', thCategoria: 'Category', thPrecio: 'Price',
    edit: 'Edit', outOfStock: 'Out of stock', inStock: 'in stock', noResultsDot: 'No results.',
    formTitleEdit: 'Edit product', formTitleNew: 'Add product',
    typeOfProduct: 'Product type', typeHint: 'Choose what it is. Each type adjusts the SKU, variants and its specs.',
    fTitle: 'Title', fTitlePh: 'Short-sleeve tee', fDesc: 'Description', fDescPh: 'Materials, fit, care, origin…',
    media: 'Media', mediaHint: 'Drag images onto each slot to replace them.', mainPhoto: 'Main photo', addSlot: '+ Add',
    pricing: 'Pricing', fPrice: 'Price', comparePrice: 'Compare-at price', costPerItem: 'Cost per item', marginLbl: 'Margin: ', profitLbl: 'Profit: ',
    specs: 'Specs', specsHint: 'Attributes specific to this type. They appear on the store page.',
    invWord: 'Inventory', skuCode: 'SKU (code)', qtyAvailable: 'Quantity available',
    variantHint: 'Each option creates a variant with its own stock.', thVariante: 'Variant', thStock: 'Stock',
    statusWord: 'Status', organization: 'Organization', storeCategory: 'Store category', autoByType: 'auto by type', vendorWord: 'Vendor', vendorPh: 'VESPER Atelier',
    saveEdit: 'Save', saveNew: 'Create product', discard: 'Discard',
    invStats: ['Units in stock', 'Value at cost', 'Retail value', 'Potential margin', 'Low stock / out'],
    thSku: 'SKU', thCommitted: 'Committed', thAvailable: 'Available', thAdjust: 'Adjust',
    lowStock: 'Low stock', available: 'Available',
    orderFilters: ['All', 'Unpaid', 'Unfulfilled', 'Refunded'],
    thPedido: 'Order', thCliente: 'Customer', thArticulos: 'Items', thTotal: 'Total', thPago: 'Payment', thEnvio: 'Shipping', thHora: 'Time',
    orderWord: 'Order', todayAt: 'Today · ', shipTracking: 'Shipment tracking', itemsHdr: 'Items',
    subtotal: 'Subtotal', shippingWord: 'Shipping', vat: 'VAT (16%)', totalWord: 'Total', free: 'Free',
    shipAddress: 'Shipping address', markShipped: 'Mark as shipped', refundWord: 'Refund',
    clientStats: ['Total customers', 'New (30d)', 'Return rate', 'Avg. LTV'],
    searchClient: 'Search customer…',
    thCorreo: 'Email', thSegmento: 'Segment', thGastado: 'Spent', thUltCompra: 'Last order',
    payStats: [
      { label: 'Collected today', note: '42 transactions' },
      { label: 'Pending', note: '3 in process' },
      { label: 'Refunded', note: '1 refund' },
      { label: 'Net (after fees)', note: '−2.7% processor' },
    ],
    thTransaccion: 'Transaction', thMonto: 'Amount', thFecha: 'Date',
    thCodigo: 'Code', thTipo: 'Type', thValor: 'Value', thUsos: 'Uses', thVence: 'Expires',
    discounts: [
      { type: 'Store-wide percentage', value: '−10%', uses: '342 uses', exp: 'Dec 31, 2026' },
      { type: 'Free shipping', value: '$0 shipping', uses: '1,204 uses', exp: 'No limit' },
      { type: 'First order', value: '−15%', uses: '89 uses', exp: 'Sep 30, 2026' },
      { type: 'Selected footwear', value: '−40%', uses: '56 uses', exp: 'Starts Jul 10' },
      { type: 'Percentage', value: '−25%', uses: '610 uses', exp: 'Expired Jun 21' },
    ],
    shiftOpen: 'Shift open · Register 01', cashierLine: 'Cashier: A. Vega · Opened 09:00 · Close pending', exportCut: 'Export report', closeReg: 'Close register',
    cashCards: ['Opening float', 'Cash in', 'Card sales', 'Withdrawals / expenses', 'Expected in drawer'],
    cashCount: 'Cash count', cashCountHint: 'Enter the counted units of each denomination.', totalCounted: 'Total counted',
    reconcile: 'Reconciliation', expectedDrawer: 'Expected in drawer', difference: 'Difference', balanced: 'Drawer balanced ✓', over: 'Over', short: 'Short',
    shiftMovements: 'Shift movements', conceptPh: 'Concept (optional)', recordTitle: 'Record',
    netEarnings: 'Net earnings for the shift', plToday: 'Income statement · today', plHint: 'Cost of goods, fees, refunds and expenses are deducted from gross revenue.',
    pnlRows: ['Gross revenue', 'Cost of goods (COGS)', 'Card fees', 'Refunds', 'Operating expenses'],
    netProfit: 'Net profit', netMargin: 'Net margin',
    movInit: [
      { type: 'Apertura', label: 'Opening float', time: '09:00', amount: 3000 },
      { type: 'Ingreso', label: 'Cash sale #VS-4821', time: '09:02', amount: 1290 },
      { type: 'Retiro', label: 'Withdrawal to safe', time: '08:30', amount: -1200 },
      { type: 'Ingreso', label: 'Cash sale #VS-4816', time: '07:44', amount: 390 },
      { type: 'Gasto', label: 'Expense: courier', time: '07:10', amount: -360 },
    ],
    movAdd: { Ingreso: 'Cash deposit', Retiro: 'Cash withdrawal', Gasto: 'Expense' },
    storePrefs: 'Store preferences', storeControls: "VESPER's operational controls.",
    setDefs: [
      { label: 'Inventory tracking', desc: 'Automatically deduct stock on every sale.' },
      { label: 'Low-stock alerts', desc: 'Notify me when a product drops below 5 units.' },
      { label: 'Tax-inclusive prices', desc: 'Show VAT within the price in the store.' },
      { label: 'Guest checkout', desc: 'Allow checkout without creating an account.' },
    ],
    toastTitle: 'Give the product a title', toastUpdated: 'Product updated', toastCreated: 'Product created', toastAmount: 'Enter an amount', toastMov: 'Movement recorded', toastExport: 'Cash report exported (CSV)', toastCashClosed: 'Cash report recorded', toastShipped: 'Order marked as shipped', toastRefunded: 'Refund issued',
    csv: { title: 'VESPER — Cash report', date: 'Date', register: 'Register', denom: 'Denomination', units: 'Units', subtotal: 'Subtotal', openFloat: 'Opening float', cashIn: 'Cash in', withdrawals: 'Withdrawals/expenses', expected: 'Expected in drawer', counted: 'Total counted', difference: 'Difference', movements: 'Movements', type: 'Type', concept: 'Concept', time: 'Time', amount: 'Amount' },
  },
}

export default function VesperDashboardClient({ lang }: { lang: DemoLang }) {
  const tr = CONTENT[lang]
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nav, setNavState] = useState('Inicio')
  const [navOpen, setNavOpen] = useState(false)
  const [range, setRange] = useState('30d')
  const [toast, setToast] = useState<string | null>(null)
  const [hoverIdx, setHoverIdx] = useState(-1)
  const [gQuery, setGQuery] = useState('')
  const [pQuery, setPQuery] = useState('')
  const [pCat, setPCat] = useState('all')
  const [cQuery, setCQuery] = useState('')
  const [orderFilter, setOrderFilter] = useState('all')
  const [pgProducts, setPgProducts] = useState(1)
  const [pgClients, setPgClients] = useState(1)
  const [pgOrders, setPgOrders] = useState(1)
  const [pgPayments, setPgPayments] = useState(1)
  const [pgInventory, setPgInventory] = useState(1)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifRead, setNotifRead] = useState<Record<number, number>>({})
  const [openOrder, setOpenOrder] = useState<OrderRow | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [settings, setSettings] = useState({ inventory: true, notify: true, tax: false, guest: true })
  const [counts, setCounts] = useState<Record<number, string>>({})
  const [movForm, setMovForm] = useState({ type: 'Ingreso', concept: '', amount: '' })
  const [movList, setMovList] = useState<MovItem[]>(() => tr.movInit.map((m) => ({ ...m })))
  const [products, setProducts] = useState<Product[]>(() => INITIAL_PRODUCTS.concat(MORE_PRODUCTS))

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])
  const flash = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  const setNav = (n: string) => { setNavState(n); setPQuery(''); setHoverIdx(-1); setNotifOpen(false) }
  const toggleNotif = () => setNotifOpen((v) => !v)
  const closeNotif = () => setNotifOpen(false)
  const markAllRead = () => setNotifRead({ 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 })
  const readNotif = (i: number) => setNotifRead((s) => ({ ...s, [i]: 1 }))

  const nextSku = (prefix: string) => {
    const n = products.filter((p) => (p.sku || '').includes('-' + prefix + '-')).length + 1
    return 'VS-' + prefix + '-' + String(n).padStart(2, '0')
  }
  const openNew = () => {
    const t = typeOf('Ropa')
    setNavState('Form'); setPQuery(''); setHoverIdx(-1); setNotifOpen(false)
    setDraft({ id: null, type: 'Ropa', name: '', cat: t.cat, price: '', compare: '', cost: '', stock: '', sku: nextSku(t.sku), status: 'Activo', sizes: [], desc: '', img: '', vendor: 'VESPER Atelier', variants: {}, attrs: {} })
  }
  const openEdit = (p: Product) => {
    const type = p.type || CAT_TO_TYPE[p.cat] || 'Ropa'
    const t = typeOf(type)
    setNavState('Form'); setPQuery(''); setHoverIdx(-1); setNotifOpen(false)
    setDraft({ id: p.id, type, name: p.name, cat: t.cat, price: String(p.price), compare: p.compare ? String(p.compare) : '', cost: p.cost ? String(p.cost) : '', stock: String(p.stock), sku: p.sku, status: p.status, sizes: [...(p.sizes || [])], desc: p.desc || '', img: img(p.img), vendor: p.vendor || 'VESPER Atelier', variants: {}, attrs: { ...(p.attrs || {}) } })
  }
  const setTypeDraft = (key: string) => {
    const t = typeOf(key)
    setDraft((d) => {
      if (!d) return d
      const skuAuto = !d.sku || d.sku.startsWith('VS-')
      return { ...d, type: key, cat: t.cat, sizes: [], attrs: {}, sku: skuAuto ? nextSku(t.sku) : d.sku }
    })
  }
  const patchAttr = (k: string, v: string) => setDraft((d) => (d ? { ...d, attrs: { ...d.attrs, [k]: v } } : d))
  const backToProducts = () => setNavState('Productos')
  const patchDraft = (k: keyof Draft, v: string | string[]) => setDraft((d) => (d ? { ...d, [k]: v } : d))
  const numInput = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) => patchDraft(k, e.target.value.replace(/[^0-9]/g, ''))
  const toggleSize = (sz: string) => setDraft((d) => {
    if (!d) return d
    const has = d.sizes.includes(sz)
    return { ...d, sizes: has ? d.sizes.filter((x) => x !== sz) : [...d.sizes, sz] }
  })
  const setVariantStock = (sz: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.replace(/[^0-9]/g, '')
    setDraft((d) => (d ? { ...d, variants: { ...d.variants, [sz]: q } } : d))
  }
  const saveDraft = () => {
    const d = draft
    if (!d) return
    if (!d.name.trim()) { flash(tr.toastTitle); return }
    const t = typeOf(d.type), cat = t.cat
    const price = parseInt(d.price || '0', 10), stock = parseInt(d.stock || '0', 10), compare = parseInt(d.compare || '0', 10), cost = parseInt(d.cost || '0', 10)
    setProducts((prev) => {
      if (d.id) return prev.map((p) => (p.id === d.id ? { ...p, name: d.name, type: d.type, cat, price, compare, cost, stock, sku: d.sku || p.sku, status: d.status, sizes: d.sizes, vendor: d.vendor, attrs: d.attrs } : p))
      const np: Product = { id: 'p' + Date.now(), name: d.name, type: d.type, sku: d.sku || nextSku(t.sku), cat, price, compare, cost, stock, status: d.status, img: 'photo-1441984904996-e0b6ba687e04', sizes: d.sizes, committed: 0, vendor: d.vendor, attrs: d.attrs }
      return [np, ...prev]
    })
    setNavState('Productos')
    flash(d.id ? tr.toastUpdated : tr.toastCreated)
  }
  const adjustStock = (id: string, delta: number) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)))
  const onCount = (v: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.replace(/[^0-9]/g, '')
    setCounts((s) => ({ ...s, [v]: q }))
  }
  const patchMov = (k: 'type' | 'concept' | 'amount', v: string) => setMovForm((s) => ({ ...s, [k]: v }))
  const addMov = () => {
    const m = movForm, amt = parseInt(m.amount || '0', 10)
    if (!amt) { flash(tr.toastAmount); return }
    const signed = m.type === 'Ingreso' ? amt : -Math.abs(amt)
    const now = new Date(), time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
    const label = (m.concept || '').trim() || tr.movAdd[m.type] || tr.movAdd.Gasto
    setMovList((s) => [{ type: m.type, label, time, amount: signed }, ...s])
    setMovForm({ type: 'Ingreso', concept: '', amount: '' })
    flash(tr.toastMov)
  }
  const toggleSetting = (k: keyof typeof settings) => setSettings((s) => ({ ...s, [k]: !s[k] }))
  const exportCaja = () => {
    const counted = DENOM_DEFS.reduce((s, dn) => s + dn.v * (parseInt(counts[dn.v] || '0', 10)), 0)
    const cashIn = movList.filter((m) => m.type === 'Ingreso').reduce((s, m) => s + m.amount, 0)
    const cashOut = movList.filter((m) => m.type === 'Retiro' || m.type === 'Gasto').reduce((s, m) => s + Math.abs(m.amount), 0)
    const expected = OPEN_FLOAT + cashIn - cashOut, diff = counted - expected
    const cv = tr.csv
    const rows: (string | number)[][] = [[cv.title], [cv.date, new Date().toLocaleString(tr.locale)], [cv.register, '01 · A. Vega'], [], [cv.denom, cv.units, cv.subtotal]]
    DENOM_DEFS.forEach((dn) => { const n = parseInt(counts[dn.v] || '0', 10); rows.push(['$' + dn.v, n, dn.v * n]) })
    rows.push([], [cv.openFloat, OPEN_FLOAT], [cv.cashIn, cashIn], [cv.withdrawals, -cashOut], [cv.expected, expected], [cv.counted, counted], [cv.difference, diff], [], [cv.movements], [cv.type, cv.concept, cv.time, cv.amount])
    movList.forEach((m) => rows.push([tr.mov[m.type] || m.type, m.label, m.time, m.amount]))
    const csv = rows.map((r) => r.map((c) => { const s = String(c == null ? '' : c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s }).join(',')).join('\n')
    try {
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob), a = document.createElement('a')
      a.href = url; a.download = 'corte-caja-vesper.csv'; document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch { /* noop */ }
    flash(tr.toastExport)
  }
  const openOrderDetail = (o: OrderRow) => { setOpenOrder(o); setNotifOpen(false) }
  const closeOrderDetail = () => setOpenOrder(null)
  const fulfillOrder = () => { setOpenOrder((o) => (o ? { ...o, ship: 'Enviado', pay: o.pay === 'Pendiente' ? 'Pagado' : o.pay } : o)); flash(tr.toastShipped) }
  const refundOrderD = () => { setOpenOrder((o) => (o ? { ...o, pay: 'Reembolsado', ship: 'Devuelto' } : o)); flash(tr.toastRefunded) }

  /* ============ derived values (renderVals) ============ */
  const chip = (a: boolean) => ({ bg: a ? '#171717' : 'transparent', color: a ? '#fff' : 'var(--muted)' })

  const unfulfilled = 7
  const lowStockN = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const navDefs = [
    { id: 'Inicio', label: tr.navLabels.inicio, icon: 'home', key: 'Inicio' }, { id: 'Pedidos', label: tr.navLabels.pedidos, icon: 'bag', key: 'Pedidos', badge: String(unfulfilled), bt: 'un' }, { id: 'Productos', label: tr.navLabels.productos, icon: 'tag', key: 'Productos' }, { id: 'Inventario', label: tr.navLabels.inventario, icon: 'layers', key: 'Inventario', badge: String(lowStockN), bt: 'warn' }, { id: 'Clientes', label: tr.navLabels.clientes, icon: 'users', key: 'Clientes' }, { id: 'Pagos', label: tr.navLabels.pagos, icon: 'card', key: 'Pagos' }, { id: 'Descuentos', label: tr.navLabels.descuentos, icon: 'percent', key: 'Descuentos' }, { id: 'Caja', label: tr.navLabels.caja, icon: 'wallet', key: 'Caja' }, { id: 'Analíticas', label: tr.navLabels.analiticas, icon: 'chart', key: 'Inicio' }, { id: 'Ajustes', label: tr.navLabels.ajustes, icon: 'sliders', key: 'Ajustes' },
  ] as { id: string; label: string; icon: string; key: string; badge?: string; bt?: string }[]
  const activeKey = nav === 'Form' ? 'Productos' : nav
  const navItems = navDefs.filter((n, i, arr) => arr.findIndex((x) => x.id === n.id) === i).map((n) => {
    const a = activeKey === n.key && n.id !== 'Analíticas'
    return { label: n.label, iconEl: ic(n.icon), onClick: () => setNav(n.key), badge: n.badge || null, weight: a ? '600' : '400', bg: a ? 'rgba(255,255,255,.1)' : 'transparent', color: a ? '#fff' : 'var(--navtext)', badgeBg: n.bt === 'warn' ? 'rgba(199,120,44,.9)' : 'rgba(255,255,255,.16)', badgeColor: '#fff' }
  })

  const notifDefs = [
    { icon: 'bag', ic: '#2e7d55', bg: 'rgba(46,125,85,.12)', title: 'Nuevo pedido', text: '#VS-4821 · Marina Ovalle · $1,290', time: 'Hace 3 min', u: true, go: 'Pedidos' },
    { icon: 'layers', ic: '#c7782c', bg: 'rgba(199,120,44,.14)', title: 'Stock bajo', text: 'Sneaker Aero Knit · 3 uds.', time: 'Hace 22 min', u: true, go: 'Inventario' },
    { icon: 'card', ic: '#c0392b', bg: 'rgba(192,57,43,.12)', title: 'Reembolso', text: 'Nadia Ferrand · $780', time: 'Hace 1 h', u: true, go: 'Pagos' },
    { icon: 'users', ic: '#2f5fd0', bg: 'rgba(47,95,208,.12)', title: 'Nuevo cliente', text: 'Camille Dumas se registró', time: 'Hace 2 h', u: false, go: 'Clientes' },
    { icon: 'percent', ic: '#8a6d1e', bg: 'rgba(199,163,106,.24)', title: 'Cupón', text: 'FLASH40 empieza en 7 días', time: 'Ayer', u: false, go: 'Descuentos' },
  ]
  const notifs = notifDefs.map((nt, i) => {
    const unread = nt.u && !notifRead[i]
    const nc = tr.notifs[i]
    return { title: nc.title, text: nc.text, time: nc.time, unread, icon: ic(nt.icon, 16), iconBg: nt.bg, iconColor: nt.ic, bg: unread ? 'var(--surface2)' : 'transparent', onClick: () => { readNotif(i); setNav(nt.go) } }
  })
  const unreadN = notifs.filter((n) => n.unread).length

  const crumbMap: Record<string, string> = { Inicio: tr.crumbs.inicio, Pedidos: tr.crumbs.pedidos, Productos: tr.crumbs.productos, Form: draft && draft.id ? tr.crumbs.formEdit : tr.crumbs.formNew, Inventario: tr.crumbs.inventario, Clientes: tr.crumbs.clientes, Pagos: tr.crumbs.pagos, Descuentos: tr.crumbs.descuentos, Caja: tr.crumbs.caja, Ajustes: tr.crumbs.ajustes }
  const rangeDefs = [{ label: tr.ranges.d7, v: '7d' }, { label: tr.ranges.d30, v: '30d' }, { label: tr.ranges.m3, v: '3m' }, { label: tr.ranges.m12, v: '12m' }]
  const ranges = rangeDefs.map((r) => { const a = range === r.v; return { label: r.label, onClick: () => setRange(r.v), bg: a ? '#171717' : 'transparent', color: a ? '#fff' : 'var(--muted)' } })
  const rangeLabel = tr.recentPrefix + (rangeDefs.find((r) => r.v === range) || { label: '' }).label + tr.recentSuffix

  /* INICIO */
  const kdefs = [
    { label: tr.kpiLabels[0], v: '$284,920', delta: '18.4%', up: true, s: [38, 42, 40, 48, 46, 55, 62, 58, 66, 72] },
    { label: tr.kpiLabels[1], v: '1,284', delta: '9.1%', up: true, s: [52, 55, 54, 58, 61, 60, 66, 68, 70, 74] },
    { label: tr.kpiLabels[2], v: '26,410', delta: '12.7%', up: true, s: [40, 44, 52, 48, 58, 54, 62, 66, 63, 72] },
    { label: tr.kpiLabels[3], v: '4.86%', delta: '0.3%', up: false, s: [62, 60, 63, 59, 61, 58, 60, 57, 59, 56] },
    { label: tr.kpiLabels[4], v: '$222', delta: '4.6%', up: true, s: [44, 46, 45, 50, 52, 51, 55, 54, 58, 60] },
  ]
  const kpis = kdefs.map((k) => ({ label: k.label, display: k.v, delta: k.delta, deltaIcon: k.up ? '▲' : '▼', deltaColor: k.up ? '#2e7d55' : '#c0392b', sparkLine: spark(k.s, false), sparkArea: spark(k.s, true), sparkColor: k.up ? '#2e7d55' : '#c0392b', sparkFill: k.up ? 'rgba(46,125,85,.1)' : 'rgba(192,57,43,.1)' }))

  const areaPath = buildPath(CUR_SERIES, true), linePath = buildPath(CUR_SERIES, false), prevPath = buildPath(PREV_SERIES, false)
  const chartTotal = fmt(CUR_SERIES.reduce((s, v) => s + v, 0) * 1000)
  const cMx = Math.max(...CUR_SERIES, ...PREV_SERIES), cMn = Math.min(...PREV_SERIES) * 0.82
  const yLabels = [0, 1, 2, 3, 4].map((i) => { const frac = i / 4, val = cMx - (cMx - cMn) * frac; return { top: frac * 100 + '%', label: fmtK(Math.round(val) * 1000) } })
  const xLabels = tr.months
  const hoverCols = MONTH_LABELS.map((_, i) => ({ onEnter: () => setHoverIdx(i), onLeave: () => setHoverIdx(-1) }))
  const hOn = hoverIdx >= 0
  const hpt = hOn ? pointAt(hoverIdx) : { x: 0, y: 0 }
  const tipLeft = 'calc(44px + ' + hpt.x + '% * (100% - 52px) / 100)'
  const tipTop = hpt.y + '%'
  const tipLabel = hOn ? tr.months[hoverIdx] + ' 2026' : ''
  const tipVal = hOn ? fmt(CUR_SERIES[hoverIdx] * 1000) : ''

  const funnelDefs = [
    { label: tr.funnel[0].label, value: '26,410', w: 100, color: '#171717', rate: tr.funnel[0].rate },
    { label: tr.funnel[1].label, value: '14,880', w: 56, color: '#3a3a3a', rate: tr.funnel[1].rate },
    { label: tr.funnel[2].label, value: '4,120', w: 28, color: '#6b6b6b', rate: tr.funnel[2].rate },
    { label: tr.funnel[3].label, value: '1,284', w: 11, color: '#c7a36a', rate: tr.funnel[3].rate },
  ]
  const funnel = funnelDefs.map((f) => ({ label: f.label, value: f.value, w: f.w + '%', color: f.color, rate: f.rate }))
  const chDefs = [
    { label: tr.channels[0], v: 58, color: '#171717' }, { label: tr.channels[1], v: 22, color: '#6b6b6b' }, { label: tr.channels[2], v: 13, color: '#c7a36a' }, { label: tr.channels[3], v: 7, color: '#c9c6bf' },
  ]
  let acc = 0
  const stops = chDefs.map((c) => { const a = acc * 3.6, b = (acc + c.v) * 3.6; acc += c.v; return c.color + ' ' + a + 'deg ' + b + 'deg' })
  const donut = 'conic-gradient(' + stops.join(',') + ')'
  const channels = chDefs.map((c) => ({ label: c.label, pct: c.v + '%', color: c.color }))
  const tp = [
    { name: 'Sneaker Aero Knit', rev: 89040, units: 212, img: 'photo-1600185365483-26d7a4cc7519' },
    { name: 'Camisa Merino Zero', rev: 33600, units: 140, img: 'photo-1602810318383-e386cc2a3ccf' },
    { name: 'Pantalón Tailored Flow', rev: 30720, units: 96, img: 'photo-1594633312681-425c7b97ccd1' },
    { name: 'Sneaker Runner Carbon', rev: 49280, units: 88, img: 'photo-1542291026-7eec264c27ff' },
  ]
  const maxRev = Math.max(...tp.map((x) => x.rev))
  const topProducts = tp.map((x) => ({ name: x.name, revFmt: fmt(x.rev), imgUrl: img(x.img), barW: ((x.rev / maxRev) * 100).toFixed(0) + '%' }))
  const ro = [
    { id: '#VS-4821', name: 'Marina Ovalle', total: 1290 }, { id: '#VS-4820', name: 'Théo Laurent', total: 840 }, { id: '#VS-4819', name: 'Sofía Klein', total: 560 }, { id: '#VS-4818', name: 'Rafael Ibáñez', total: 1150 }, { id: '#VS-4817', name: 'Nadia Ferrand', total: 780 },
  ]
  const recentOrders = ro.map((o, i) => ({ id: o.id, name: o.name, initials: initialsOf(o.name), avBg: AV_PALETTE[i % AV_PALETTE.length], total: fmt(o.total) }))

  /* PRODUCTOS */
  const catFilterDefs = ['all', 'Abrigos', 'Calzado', 'Prendas', 'Accesorios']
  const catFilters = catFilterDefs.map((c) => { const a = pCat === c; return { label: c === 'all' ? tr.filterAll : (tr.cat[c] ?? c), onClick: () => { setPCat(c); setPgProducts(1) }, ...chip(a) } })
  const stMapP: Record<string, { c: string; bg: string }> = { Activo: { c: '#2e7d55', bg: 'rgba(46,125,85,.1)' }, Borrador: { c: '#6b6b6b', bg: 'rgba(107,107,107,.1)' } }
  const q = pQuery.toLowerCase()
  const filtered = products.filter((x) => (pCat === 'all' || x.cat === pCat) && (x.name.toLowerCase().includes(q) || x.sku.toLowerCase().includes(q)))
  const prodPager = pager(filtered.length, pgProducts, setPgProducts)
  const productRows = sliceList(filtered, pgProducts).map((x, i) => ({
    name: x.name, sku: x.sku, cat: tr.cat[x.cat] ?? x.cat, priceFmt: fmt(x.price), imgUrl: img(x.img), status: tr.st[x.status] ?? x.status, stColor: stMapP[x.status].c, stBg: stMapP[x.status].bg,
    invText: x.stock === 0 ? tr.outOfStock : x.stock + ' ' + tr.inStock, invColor: x.stock === 0 ? '#c0392b' : x.stock <= 5 ? '#c7782c' : 'var(--text2)', onEdit: () => openEdit(x), delay: i * 0.03 + 's',
  }))

  /* FORM */
  const d = draft || ({} as Partial<Draft>)
  const curType = typeOf(d.type || 'Ropa')
  const ctAttrs = tr.types[curType.key]?.attrs || {}
  const typeCards = PRODUCT_TYPES.map((t) => { const a = d.type === t.key; return { label: tr.types[t.key]?.label ?? t.label, iconEl: ic(t.icon, 20), onClick: () => setTypeDraft(t.key), bg: a ? '#171717' : 'var(--surface2)', color: a ? '#fff' : 'var(--text2)', border: a ? '#171717' : 'var(--line)', iconColor: a ? '#c7a36a' : 'var(--muted)' } })
  const typeLabel = tr.types[curType.key]?.label ?? curType.label
  const typeAttrs = curType.attrs.map((f) => ({ label: ctAttrs[f.k]?.label ?? f.label, isSelect: !f.num, isNum: !!f.num, unit: f.unit || '', value: (d.attrs && d.attrs[f.k]) || '', placeholder: f.num ? '0' : tr.selectPh, options: (f.opts || []).map((o) => ({ label: ctAttrs[f.k]?.opts?.[o] ?? o, value: o })), onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => patchAttr(f.k, f.num ? e.target.value.replace(/[^0-9]/g, '') : e.target.value) }))
  const axisSizes = AXIS_PRESETS[curType.axis] || ['Única']
  const variantAxisLabel = tr.axisLabel[curType.axis] || tr.variantsWord
  const draftSizes = axisSizes.map((sz) => { const a = (d.sizes || []).includes(sz); return { label: tr.axisVals[sz] ?? sz, onClick: () => toggleSize(sz), bg: a ? '#171717' : 'var(--surface2)', color: a ? '#fff' : 'var(--text2)', border: a ? '#171717' : 'var(--line)' } })
  const draftStatuses = ['Activo', 'Borrador'].map((st) => { const a = d.status === st; return { label: tr.st[st] ?? st, onClick: () => patchDraft('status', st), bg: a ? '#171717' : 'transparent', color: a ? '#fff' : 'var(--muted)' } })
  const priceN = parseInt(d.price || '0', 10), costN = parseInt(d.cost || '0', 10)
  const marginPct = priceN > 0 ? Math.round((priceN - costN) / priceN * 100) + '%' : '—'
  const profitFmt = priceN > 0 ? fmt(priceN - costN) : '—'
  const variantRows = (d.sizes || []).map((sz) => ({ size: tr.axisVals[sz] ?? sz, price: d.price ? '$' + d.price : '—', stock: d.variants && d.variants[sz] != null ? d.variants[sz] : '', onInput: (e: React.ChangeEvent<HTMLInputElement>) => setVariantStock(sz, e) }))

  /* INVENTARIO */
  const totalUnits = products.reduce((s, x) => s + x.stock, 0)
  const invValue = products.reduce((s, x) => s + x.stock * x.cost, 0)
  const retailValue = products.reduce((s, x) => s + x.stock * x.price, 0)
  const invMargin = retailValue > 0 ? Math.round((retailValue - invValue) / retailValue * 100) : 0
  const outN = products.filter((x) => x.stock === 0).length
  const invStats = [
    { label: tr.invStats[0], value: String(totalUnits), color: 'var(--text)' }, { label: tr.invStats[1], value: fmt(invValue), color: 'var(--text)' }, { label: tr.invStats[2], value: fmt(retailValue), color: '#2e7d55' }, { label: tr.invStats[3], value: invMargin + '%', color: '#8a6d1e' }, { label: tr.invStats[4], value: lowStockN + ' / ' + outN, color: '#c7782c' },
  ]
  const invRows = sliceList(products, pgInventory).map((x, i) => ({
    name: x.name, sku: x.sku, imgUrl: img(x.img), committed: String(x.committed), stock: String(x.stock), availColor: x.stock === 0 ? '#c0392b' : x.stock <= 5 ? '#c7782c' : 'var(--text)',
    tag: x.stock === 0 ? tr.outOfStock : x.stock <= 5 ? tr.lowStock : tr.available, tagColor: x.stock === 0 ? '#c0392b' : x.stock <= 5 ? '#c7782c' : '#2e7d55',
    onMinus: () => adjustStock(x.id, -1), onPlus: () => adjustStock(x.id, 1), delay: i * 0.03 + 's',
  }))
  const invPager = pager(products.length, pgInventory, setPgInventory)

  /* PEDIDOS */
  const od: OrderRow[] = [
    { id: '#VS-4821', name: 'Marina Ovalle', items: 'Abrigo Sculpted Wool ×1', total: 1290, pay: 'Pagado', ship: 'Preparando', time: '09:02' },
    { id: '#VS-4820', name: 'Théo Laurent', items: 'Sneaker Aero Knit ×2', total: 840, pay: 'Pagado', ship: 'Enviado', time: '08:47' },
    { id: '#VS-4819', name: 'Sofía Klein', items: 'Camisa Merino, Pantalón Flow', total: 560, pay: 'Pendiente', ship: 'Sin cumplir', time: '08:31' },
    { id: '#VS-4818', name: 'Rafael Ibáñez', items: 'Reloj Chrono Steel ×1', total: 1150, pay: 'Pagado', ship: 'Entregado', time: '08:12' },
    { id: '#VS-4817', name: 'Nadia Ferrand', items: 'Bolso Structured Tote ×1', total: 780, pay: 'Reembolsado', ship: 'Devuelto', time: '07:58' },
    { id: '#VS-4816', name: 'Liam Whitmore', items: 'Punto Cashmere Fold ×1', total: 390, pay: 'Pagado', ship: 'Preparando', time: '07:44' },
    { id: '#VS-4815', name: 'Camille Dumas', items: 'Sneaker Runner Carbon ×1', total: 560, pay: 'Pagado', ship: 'Enviado', time: '07:21' },
  ]
  const payMap: Record<string, { c: string; bg: string }> = { Pagado: { c: '#2e7d55', bg: 'rgba(46,125,85,.1)' }, Pendiente: { c: '#c7782c', bg: 'rgba(199,120,44,.12)' }, Reembolsado: { c: '#c0392b', bg: 'rgba(192,57,43,.1)' } }
  const shipMap: Record<string, { c: string; bg: string }> = { Preparando: { c: '#c7782c', bg: 'rgba(199,120,44,.12)' }, Enviado: { c: '#2f5fd0', bg: 'rgba(47,95,208,.1)' }, Entregado: { c: '#2e7d55', bg: 'rgba(46,125,85,.1)' }, 'Sin cumplir': { c: '#6b6b6b', bg: 'rgba(107,107,107,.1)' }, Devuelto: { c: '#c0392b', bg: 'rgba(192,57,43,.1)' } }
  const ofDefs = [{ label: tr.orderFilters[0], v: 'all' }, { label: tr.orderFilters[1], v: 'Pendiente' }, { label: tr.orderFilters[2], v: 'Sin cumplir' }, { label: tr.orderFilters[3], v: 'Reembolsado' }]
  const orderFilters = ofDefs.map((f) => { const a = orderFilter === f.v; return { label: f.label, onClick: () => { setOrderFilter(f.v); setPgOrders(1) }, ...chip(a) } })
  const oAll = od.concat(MORE_ORDERS)
  const oFiltered = oAll.filter((o) => orderFilter === 'all' || o.pay === orderFilter || o.ship === orderFilter)
  const ordersPager = pager(oFiltered.length, pgOrders, setPgOrders)
  const ordersFull = sliceList(oFiltered, pgOrders).map((o, i) => ({ id: o.id, name: o.name, initials: initialsOf(o.name), avBg: AV_PALETTE[i % AV_PALETTE.length], items: o.items, total: fmt(o.total), pay: tr.st[o.pay] ?? o.pay, payColor: payMap[o.pay].c, payBg: payMap[o.pay].bg, ship: tr.st[o.ship] ?? o.ship, shipColor: shipMap[o.ship].c, shipBg: shipMap[o.ship].bg, time: o.time, delay: i * 0.03 + 's', onOpen: () => openOrderDetail(o) }))

  /* ORDER DETAIL */
  let orderDetail: null | {
    id: string; name: string; initials: string; avBg: string; email: string; phone: string; address: string
    pay: string; payColor: string; payBg: string; ship: string; shipColor: string; shipBg: string; time: string
    items: { name: string; qty: string; lineFmt: string; img: string }[]
    timeline: { label: string; done: boolean; showLine: boolean; dotBg: string; dotColor: string; lineBg: string; textColor: string; last: boolean; check: string }[]
    subtotalFmt: string; shipFmt: string; taxFmt: string; totalFmt: string; canFulfill: boolean; canRefund: boolean
  } = null
  if (openOrder) {
    const o = openOrder
    const parseItems = (str: string) => str.split(',').map((s) => {
      const m = s.trim().match(/^(.*?)\s*×\s*(\d+)$/)
      const name = m ? m[1] : s.trim(), qty = m ? parseInt(m[2], 10) : 1
      const prod = products.find((p) => p.name === name)
      const price = prod ? prod.price : Math.round(o.total / (m ? parseInt(m[2], 10) : 1))
      return { name, qty: '×' + qty, lineFmt: fmt(price * qty), img: prod ? img(prod.img) : img('photo-1441984904996-e0b6ba687e04') }
    })
    const items = parseItems(o.items)
    const subtotal = items.reduce((s, it) => s + parseInt(it.lineFmt.replace(/[^0-9]/g, ''), 10), 0)
    const shipping = subtotal >= 800 ? 0 : 120, tax = Math.round(subtotal * 0.16)
    const stepsDefs = ['Confirmado', 'Preparando', 'Enviado', 'Entregado']
    const shipIndex = ({ 'Sin cumplir': 0, Preparando: 1, Enviado: 2, Entregado: 3, Devuelto: 2 } as Record<string, number>)[o.ship] ?? 1
    const timeline = stepsDefs.map((st, idx) => ({ label: tr.st[st] ?? st, done: idx <= shipIndex, showLine: idx > 0, dotBg: idx <= shipIndex ? '#2e7d55' : 'var(--line2)', dotColor: idx <= shipIndex ? '#fff' : 'var(--muted2)', lineBg: idx <= shipIndex ? '#2e7d55' : 'var(--line2)', textColor: idx <= shipIndex ? 'var(--text)' : 'var(--muted2)', last: idx === stepsDefs.length - 1, check: idx <= shipIndex ? '✓' : String(idx + 1) }))
    const addrNo = 100 + (parseInt(o.id.replace(/\D/g, '').slice(-3), 10) * 1 || 42)
    orderDetail = {
      id: o.id, name: o.name, initials: initialsOf(o.name), avBg: AV_PALETTE[0],
      email: _cleanEmail(o.name) + '@correo.com', phone: '+52 55 ' + String(1000 + (addrNo % 9000)).slice(0, 4) + ' ' + String(2000 + (addrNo % 7000)).slice(0, 4),
      address: 'Calle Reforma ' + addrNo + ', Col. Juárez, 06600 CDMX, México',
      pay: tr.st[o.pay] ?? o.pay, payColor: payMap[o.pay].c, payBg: payMap[o.pay].bg, ship: tr.st[o.ship] ?? o.ship, shipColor: shipMap[o.ship].c, shipBg: shipMap[o.ship].bg, time: o.time,
      items, timeline, subtotalFmt: fmt(subtotal), shipFmt: shipping === 0 ? tr.free : fmt(shipping), taxFmt: fmt(tax), totalFmt: fmt(subtotal + shipping + tax),
      canFulfill: o.ship !== 'Entregado' && o.ship !== 'Enviado' && o.pay !== 'Reembolsado', canRefund: o.pay !== 'Reembolsado',
    }
  }

  /* CLIENTES */
  const cd: ClientRow[] = [
    { name: 'Marina Ovalle', email: 'marina.ovalle@correo.com', seg: 'VIP', orders: 14, spent: 8940, last: 'Hoy' }, { name: 'Théo Laurent', email: 'theo.laurent@mail.fr', seg: 'Recurrente', orders: 7, spent: 3120, last: 'Hoy' }, { name: 'Sofía Klein', email: 'sofia.klein@post.de', seg: 'Recurrente', orders: 5, spent: 2240, last: 'Ayer' }, { name: 'Rafael Ibáñez', email: 'rafa.ibanez@correo.es', seg: 'VIP', orders: 11, spent: 6780, last: 'Ayer' }, { name: 'Nadia Ferrand', email: 'nadia.f@courriel.fr', seg: 'Nuevo', orders: 1, spent: 780, last: 'Hace 2 d' }, { name: 'Liam Whitmore', email: 'liam.w@inbox.uk', seg: 'Recurrente', orders: 6, spent: 2960, last: 'Hace 3 d' }, { name: 'Camille Dumas', email: 'camille.dumas@mail.fr', seg: 'Nuevo', orders: 2, spent: 1120, last: 'Hace 4 d' }, { name: 'Alex Cliente', email: 'alex@correo.com', seg: 'Recurrente', orders: 4, spent: 1980, last: 'Hace 5 d' },
  ]
  const segMap: Record<string, { c: string; bg: string }> = { VIP: { c: '#8a6d1e', bg: 'rgba(199,163,106,.2)' }, Recurrente: { c: '#2f5fd0', bg: 'rgba(47,95,208,.1)' }, Nuevo: { c: '#2e7d55', bg: 'rgba(46,125,85,.1)' } }
  const cAll = cd.concat(MORE_CLIENTS)
  const cq = cQuery.toLowerCase()
  const cFiltered = cAll.filter((c) => c.name.toLowerCase().includes(cq) || c.email.toLowerCase().includes(cq))
  const clientsPager = pager(cFiltered.length, pgClients, setPgClients)
  const clientRows = sliceList(cFiltered, pgClients).map((c, i) => ({ name: c.name, email: c.email, initials: initialsOf(c.name), avBg: AV_PALETTE[i % AV_PALETTE.length], segment: tr.seg[c.seg] ?? c.seg, segColor: segMap[c.seg].c, segBg: segMap[c.seg].bg, orders: String(c.orders), spent: fmt(c.spent), last: tr.rel[c.last] ?? c.last, delay: i * 0.03 + 's' }))
  const clientStats = [{ label: tr.clientStats[0], value: '1,248' }, { label: tr.clientStats[1], value: '184' }, { label: tr.clientStats[2], value: '38%' }, { label: tr.clientStats[3], value: fmt(cd.reduce((s, c) => s + c.spent, 0) / cd.length) }]

  /* PAGOS */
  const payStats = [{ label: tr.payStats[0].label, value: '$28,492', color: 'var(--text)', note: tr.payStats[0].note }, { label: tr.payStats[1].label, value: '$2,340', color: '#c7782c', note: tr.payStats[1].note }, { label: tr.payStats[2].label, value: '$780', color: '#c0392b', note: tr.payStats[2].note }, { label: tr.payStats[3].label, value: '$27,712', color: '#2e7d55', note: tr.payStats[3].note }]
  const pd: PaymentRow[] = [
    { tx: 'txn_9K2Lv', name: 'Marina Ovalle', brand: 'VISA', bc: '#1a4fd6', last4: '•• 4242', amt: 1290, st: 'Completado', date: '09:02' }, { tx: 'txn_8H7pQ', name: 'Théo Laurent', brand: 'MC', bc: '#eb6f2d', last4: '•• 5518', amt: 840, st: 'Completado', date: '08:47' }, { tx: 'txn_7F3nB', name: 'Sofía Klein', brand: 'AMEX', bc: '#2e7fc4', last4: '•• 1007', amt: 560, st: 'Completado', date: '08:31' }, { tx: 'txn_6D9wR', name: 'Rafael Ibáñez', brand: 'VISA', bc: '#1a4fd6', last4: '•• 9931', amt: 1150, st: 'Completado', date: '08:12' }, { tx: 'txn_5C1kT', name: 'Nadia Ferrand', brand: 'PAYPAL', bc: '#2b6ca3', last4: 'nadia@…', amt: 780, st: 'Reembolsado', date: '07:58' }, { tx: 'txn_4B8vY', name: 'Liam Whitmore', brand: 'MC', bc: '#eb6f2d', last4: '•• 3390', amt: 390, st: 'Completado', date: '07:44' }, { tx: 'txn_3A5xU', name: 'Camille Dumas', brand: 'VISA', bc: '#1a4fd6', last4: '•• 7745', amt: 560, st: 'Pendiente', date: '07:21' },
  ]
  const stMapPay: Record<string, { c: string; bg: string }> = { Completado: { c: '#2e7d55', bg: 'rgba(46,125,85,.1)' }, Pendiente: { c: '#c7782c', bg: 'rgba(199,120,44,.12)' }, Reembolsado: { c: '#c0392b', bg: 'rgba(192,57,43,.1)' } }
  const pAll = pd.concat(MORE_PAYMENTS)
  const paymentsPager = pager(pAll.length, pgPayments, setPgPayments)
  const payments = sliceList(pAll, pgPayments).map((x, i) => ({ txid: x.tx, name: x.name, amount: fmt(x.amt), status: tr.st[x.st] ?? x.st, stColor: stMapPay[x.st].c, stBg: stMapPay[x.st].bg, date: x.date, delay: i * 0.03 + 's' }))

  /* DESCUENTOS */
  const dd = [
    { code: 'VESPER10', type: 'Porcentaje en toda la tienda', value: '−10%', uses: '342 usos', st: 'Activo', exp: '31 dic 2026' }, { code: 'ENVIOGRATIS', type: 'Envío gratis', value: 'Envío $0', uses: '1,204 usos', st: 'Activo', exp: 'Sin límite' }, { code: 'BIENVENIDA15', type: 'Primer pedido', value: '−15%', uses: '89 usos', st: 'Activo', exp: '30 sep 2026' }, { code: 'FLASH40', type: 'Calzado seleccionado', value: '−40%', uses: '56 usos', st: 'Programado', exp: 'Empieza 10 jul' }, { code: 'VERANO25', type: 'Porcentaje', value: '−25%', uses: '610 usos', st: 'Expirado', exp: 'Venció 21 jun' },
  ]
  const stMapD: Record<string, { c: string; bg: string }> = { Activo: { c: '#2e7d55', bg: 'rgba(46,125,85,.1)' }, Programado: { c: '#2f5fd0', bg: 'rgba(47,95,208,.1)' }, Expirado: { c: '#6b6b6b', bg: 'rgba(107,107,107,.1)' } }
  const discounts = dd.map((x, i) => ({ code: x.code, type: tr.discounts[i].type, value: tr.discounts[i].value, uses: tr.discounts[i].uses, status: tr.st[x.st] ?? x.st, stColor: stMapD[x.st].c, stBg: stMapD[x.st].bg, expires: tr.discounts[i].exp, delay: i * 0.03 + 's' }))

  /* CAJA */
  const denoms = DENOM_DEFS.map((dn) => { const qty = counts[dn.v] || '', n = parseInt(qty || '0', 10); return { label: fmtMx(dn.v), qty, onInput: (e: React.ChangeEvent<HTMLInputElement>) => onCount(dn.v, e), sub: fmtMx(dn.v * n), labelColor: dn.v >= 50 ? 'var(--text)' : 'var(--muted)' } })
  const counted = DENOM_DEFS.reduce((s, dn) => s + dn.v * (parseInt(counts[dn.v] || '0', 10)), 0)
  const cashIn = movList.filter((m) => m.type === 'Ingreso').reduce((s, m) => s + m.amount, 0)
  const cashOut = movList.filter((m) => m.type === 'Retiro' || m.type === 'Gasto').reduce((s, m) => s + Math.abs(m.amount), 0)
  const expectedCash = OPEN_FLOAT + cashIn - cashOut
  const diff = counted - expectedCash
  const diffColor = diff === 0 ? '#2e7d55' : diff > 0 ? '#2f5fd0' : '#c0392b'
  const cardSales = 28492
  const cashCards = [{ label: tr.cashCards[0], value: fmtMx(OPEN_FLOAT), color: 'var(--text)' }, { label: tr.cashCards[1], value: fmtMx(cashIn), color: '#2e7d55' }, { label: tr.cashCards[2], value: fmtMx(cardSales), color: 'var(--muted)' }, { label: tr.cashCards[3], value: '−' + fmtMx(cashOut), color: '#c0392b' }, { label: tr.cashCards[4], value: fmtMx(expectedCash), color: '#8a6d1e' }]
  const movMeta: Record<string, { icon: string; c: string; bg: string }> = { Ingreso: { icon: '↑', c: '#2e7d55', bg: 'rgba(46,125,85,.1)' }, Apertura: { icon: '↑', c: '#2e7d55', bg: 'rgba(46,125,85,.1)' }, Retiro: { icon: '↓', c: '#c0392b', bg: 'rgba(192,57,43,.1)' }, Gasto: { icon: '↓', c: '#c0392b', bg: 'rgba(192,57,43,.1)' } }
  const movements = movList.map((m) => { const mm = movMeta[m.type] || movMeta.Ingreso; return { icon: mm.icon, label: m.label, time: m.time, amount: (m.amount >= 0 ? '+' : '−') + fmtMx(Math.abs(m.amount)), amtColor: mm.c, iconBg: mm.bg, iconColor: mm.c } })
  const movTypes = ['Ingreso', 'Retiro', 'Gasto'].map((t) => { const a = movForm.type === t; return { label: tr.mov[t] ?? t, onClick: () => patchMov('type', t), bg: a ? '#171717' : 'var(--surface2)', color: a ? '#fff' : 'var(--muted)' } })

  /* P&L */
  const grossSales = cashIn + cardSales
  const cogs = Math.round(grossSales * 0.37)
  const fees = Math.round(cardSales * 0.027)
  const refunds = 780
  const expenses = movList.filter((m) => m.type === 'Gasto').reduce((s, m) => s + Math.abs(m.amount), 0)
  const netProfit = grossSales - cogs - fees - refunds - expenses
  const netMargin = grossSales > 0 ? Math.round(netProfit / grossSales * 100) : 0
  const pnlRows = [
    { label: tr.pnlRows[0], value: '+' + fmtMx(grossSales), color: 'var(--text)', strong: true },
    { label: tr.pnlRows[1], value: '−' + fmtMx(cogs), color: '#c0392b', strong: false },
    { label: tr.pnlRows[2], value: '−' + fmtMx(fees), color: '#c0392b', strong: false },
    { label: tr.pnlRows[3], value: '−' + fmtMx(refunds), color: '#c0392b', strong: false },
    { label: tr.pnlRows[4], value: '−' + fmtMx(expenses), color: '#c0392b', strong: false },
  ]

  /* AJUSTES */
  const setDefs = [{ k: 'inventory', label: 'Control de inventario', desc: 'Descontar stock automáticamente en cada venta.' }, { k: 'notify', label: 'Alertas de stock bajo', desc: 'Avísame cuando un producto baje de 5 unidades.' }, { k: 'tax', label: 'Precios con impuesto incluido', desc: 'Mostrar IVA dentro del precio en la tienda.' }, { k: 'guest', label: 'Compra como invitado', desc: 'Permitir pagar sin crear una cuenta.' }] as { k: keyof typeof settings; label: string; desc: string }[]
  const settingsList = setDefs.map((s, i) => { const on = settings[s.k]; return { label: tr.setDefs[i].label, desc: tr.setDefs[i].desc, onToggle: () => toggleSetting(s.k), trackBg: on ? '#171717' : 'var(--line2)', knobLeft: on ? '22px' : '3px' } })

  /* GLOBAL SEARCH */
  const gq = (gQuery || '').toLowerCase().trim()
  const globalOpen = gq.length > 0
  const globalGroups: { label: string; items: { icon: ReactNode; title: string; sub: string; onClick: () => void }[] }[] = []
  if (globalOpen) {
    const prodHits = products.filter((p) => p.name.toLowerCase().includes(gq) || (p.sku || '').toLowerCase().includes(gq)).slice(0, 4).map((p) => ({ icon: ic('tag', 15), title: p.name, sub: p.sku + ' · ' + fmt(p.price), onClick: () => { setGQuery(''); openEdit(p) } }))
    const ordHits = oAll.filter((o) => o.id.toLowerCase().includes(gq) || o.name.toLowerCase().includes(gq)).slice(0, 4).map((o) => ({ icon: ic('bag', 15), title: o.id + ' · ' + o.name, sub: o.items, onClick: () => { setGQuery(''); setNavState('Pedidos'); openOrderDetail(o) } }))
    const cliHits = cAll.filter((c) => c.name.toLowerCase().includes(gq) || c.email.toLowerCase().includes(gq)).slice(0, 4).map((c) => ({ icon: ic('users', 15), title: c.name, sub: c.email, onClick: () => { setGQuery(''); setNavState('Clientes'); setCQuery(c.name); setPgClients(1) } }))
    if (prodHits.length) globalGroups.push({ label: tr.groupProducts, items: prodHits })
    if (ordHits.length) globalGroups.push({ label: tr.groupOrders, items: ordHits })
    if (cliHits.length) globalGroups.push({ label: tr.groupClients, items: cliHits })
  }
  const globalEmpty = globalOpen && globalGroups.length === 0

  const crumb = crumbMap[nav] || tr.crumbs.inicio
  const showRange = nav === 'Inicio'
  const tLightBg = theme === 'light' ? 'var(--surface)' : 'transparent', tLightColor = theme === 'light' ? 'var(--text)' : 'var(--muted)'
  const tDarkBg = theme === 'dark' ? 'var(--surface)' : 'transparent', tDarkColor = theme === 'dark' ? 'var(--text)' : 'var(--muted)'
  const formTitle = d.id ? d.name || tr.formTitleEdit : tr.formTitleNew
  const saveLabel = d.id ? tr.saveEdit : tr.saveNew
  const draftStatusPill = (d.status === 'Activo' ? '● ' : '○ ') + (tr.st[d.status || 'Borrador'] ?? d.status)
  const draftCat = d.cat || curType.cat
  const draftCatLabel = tr.cat[draftCat] ?? draftCat

  return (
    <div data-theme={theme} className="vesper-root dshell" style={{ display: 'grid', gridTemplateColumns: '236px 1fr', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', transition: 'background .35s', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Bodoni+Moda:wght@500;600&display=swap" />
      <style>{`
        .vesper-root, .vesper-root *{box-sizing:border-box}
        .vesper-root[data-theme="light"]{--bg:#f5f3ef;--surface:#ffffff;--surface2:#faf9f7;--surface3:#f4f2ee;--line:#eceae5;--line2:#dedbd4;--text:#171717;--text2:#3a3a3a;--muted:#6b6b6b;--muted2:#9a978f;--nav:#1a1a1c;--navtext:#c7c5c0;--navmut:#87857f}
        .vesper-root[data-theme="dark"]{--bg:#0e0f13;--surface:#181a20;--surface2:#141519;--surface3:#20232b;--line:#2b2e37;--line2:#383c46;--text:#ece9e2;--text2:#c9c6bf;--muted:#a29e96;--muted2:#7e7b74;--nav:#111216;--navtext:#c9c6bf;--navmut:#7e7b74}
        .vesper-root ::selection{background:#171717;color:#fff}
        .vesper-root ::-webkit-scrollbar{width:10px;height:10px}
        .vesper-root ::-webkit-scrollbar-track{background:transparent}
        .vesper-root ::-webkit-scrollbar-thumb{background:var(--line2);border-radius:10px}
        .vesper-root input,.vesper-root textarea,.vesper-root select{font-family:inherit;color:var(--text)}
        .vesper-root input::placeholder,.vesper-root textarea::placeholder{color:var(--muted2)}
        .vesper-root input:focus,.vesper-root textarea:focus{outline:none;border-color:var(--text) !important}
        .hv-s2:hover{background:var(--surface2)}
        .hv-s3:hover{background:var(--surface3)}
        .hv-op:hover{opacity:.88}
        .hv-bt:hover{border-color:var(--text)}
        .hv-nav:hover{background:rgba(255,255,255,.06)}
        .hv-store:hover{color:#fff;border-color:rgba(255,255,255,.2)}
        .hv-refund:hover{background:rgba(192,57,43,.06)}
        .hv-l2:hover{border-color:var(--line2)}
        .hv-mark:hover{color:var(--text)}
        @keyframes viewIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes rowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes drawLine{from{stroke-dashoffset:1200}to{stroke-dashoffset:0}}
        @keyframes riseArea{from{opacity:0;transform:scaleY(.6)}to{opacity:1;transform:scaleY(1)}}
        @keyframes growW{from{width:0}to{width:var(--w)}}
        @keyframes toastIn{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
        @keyframes drawerIn{from{transform:translateX(40px);opacity:.4}to{transform:none;opacity:1}}
      `}</style>

      {/* ============ SIDEBAR ============ */}
      {navOpen && <div className="dshell-backdrop" onClick={() => setNavOpen(false)} />}
      <aside className={`dshell-nav${navOpen ? ' is-open' : ''}`} style={{ background: 'var(--nav)', color: 'var(--navtext)', padding: '20px 14px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 20px' }}>
          <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, letterSpacing: '.32em', paddingLeft: '.32em', color: '#fff' }}>VESPER</span>
          <span style={{ fontSize: 9, letterSpacing: '.14em', color: '#0d0d0f', background: '#c7a36a', padding: '2px 7px', borderRadius: 5, fontWeight: 600, marginLeft: 'auto' }}>ADMIN</span>
        </div>
        <div style={{ position: 'relative', margin: '0 4px 16px' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--navmut)', display: 'flex' }}>{ic('search', 15)}</span>
          <input value={gQuery} onChange={(e) => setGQuery(e.target.value)} placeholder={tr.searchPh} style={{ width: '100%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 9, padding: '9px 12px 9px 32px', color: '#fff', fontSize: 13 }} />
          {globalOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, boxShadow: '0 24px 60px -18px rgba(0,0,0,.55)', zIndex: 60, overflow: 'hidden', maxHeight: 420, overflowY: 'auto', animation: 'viewIn .18s ease both' }}>
              {globalGroups.map((g, gi) => (
                <div key={gi}>
                  <div style={{ padding: '9px 14px 5px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted2)' }}>{g.label}</div>
                  {g.items.map((r, ri) => (
                    <div key={ri} onClick={r.onClick} className="hv-s2" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 14px', cursor: 'pointer', color: 'var(--text)' }}>
                      <span style={{ color: 'var(--muted)', display: 'flex', flexShrink: 0 }}>{r.icon}</span>
                      <div style={{ minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div><div style={{ fontSize: 11, color: 'var(--muted2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</div></div>
                    </div>
                  ))}
                </div>
              ))}
              {globalEmpty && <div style={{ padding: '20px 14px', textAlign: 'center', fontSize: 12.5, color: 'var(--muted2)' }}>{tr.noResults}</div>}
            </div>
          )}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {navItems.map((n, i) => (
            <div key={i} onClick={() => { n.onClick(); setNavOpen(false) }} className="hv-nav" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 8, cursor: 'pointer', fontSize: 13.5, fontWeight: n.weight as CSSProperties['fontWeight'], background: n.bg, color: n.color, transition: 'background .18s' }}>
              <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.92 }}>{n.iconEl}</span>{n.label}
              {n.badge && <span style={{ marginLeft: 'auto', fontSize: 10.5, background: n.badgeBg, color: n.badgeColor, padding: '1px 7px', borderRadius: 10, fontWeight: 600 }}>{n.badge}</span>}
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14 }}>
          <a href="#" className="hv-store" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 8, textDecoration: 'none', color: 'var(--navmut)', fontSize: 13, border: '1px solid rgba(255,255,255,.09)' }}><span>↗</span>{tr.viewStore}</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, background: 'rgba(255,255,255,.05)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#c7a36a,#8a6d3b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#0d0d0f', fontWeight: 700, flexShrink: 0 }}>AV</div>
            <div style={{ lineHeight: 1.3, minWidth: 0 }}><div style={{ fontSize: 12.5, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alejandro Vega</div><div style={{ fontSize: 11, color: 'var(--navmut)' }}>{tr.owner}</div></div>
          </div>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <main style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TOPBAR */}
        <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--surface)', borderBottom: '1px solid var(--line)', padding: '0 30px', height: 62, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="dshell-hamb" onClick={() => setNavOpen(true)} aria-label="Menu" aria-expanded={navOpen} style={{ width: 38, height: 38, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg></button>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{crumb}</div></div>
          <div style={{ flex: 1 }} />
          {showRange && (
            <div style={{ display: 'flex', background: 'var(--surface3)', border: '1px solid var(--line)', borderRadius: 9, overflow: 'hidden' }}>
              {ranges.map((r, i) => (
                <button key={i} onClick={r.onClick} style={{ background: r.bg, color: r.color, border: 'none', padding: '7px 13px', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, transition: 'all .18s' }}>{r.label}</button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', background: 'var(--surface3)', border: '1px solid var(--line)', borderRadius: 10, padding: 3, gap: 3 }}>
            <button onClick={() => setTheme('light')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: tLightBg, color: tLightColor, padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, transition: 'all .18s' }}>{ic('sun', 15)}{tr.themeLight}</button>
            <button onClick={() => setTheme('dark')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: tDarkBg, color: tDarkColor, padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, transition: 'all .18s' }}>{ic('moon', 15)}{tr.themeDark}</button>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={toggleNotif} title={tr.notifTitle} className="hv-s3" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer' }}>
              {ic('bell', 17)}
              {!!unreadN && <span style={{ position: 'absolute', top: 4, right: 5, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: '#c0392b', color: '#fff', fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--surface)' }}>{unreadN}</span>}
            </button>
            {notifOpen && (
              <>
                <div onClick={closeNotif} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <div style={{ position: 'absolute', top: 48, right: 0, width: 352, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 15, boxShadow: '0 24px 60px -18px rgba(0,0,0,.4)', zIndex: 50, overflow: 'hidden', animation: 'viewIn .2s ease both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 18px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{tr.notifTitle}</span>{!!unreadN && <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff', background: '#c0392b', padding: '1px 7px', borderRadius: 9 }}>{unreadN}</span>}</div>
                    <span onClick={markAllRead} className="hv-mark" style={{ fontSize: 11.5, color: 'var(--muted)', cursor: 'pointer', fontWeight: 500 }}>{tr.markAllRead}</span>
                  </div>
                  <div style={{ maxHeight: 370, overflowY: 'auto' }}>
                    {notifs.map((nt, i) => (
                      <div key={i} onClick={nt.onClick} className="hv-s3" style={{ display: 'flex', gap: 12, padding: '13px 18px', borderBottom: '1px solid var(--line)', cursor: 'pointer', background: nt.bg, transition: 'background .15s' }}>
                        <span style={{ width: 36, height: 36, borderRadius: 10, background: nt.iconBg, color: nt.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{nt.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, lineHeight: 1.45 }}><span style={{ fontWeight: 600 }}>{nt.title}</span> · {nt.text}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 3 }}>{nt.time}</div>
                        </div>
                        {nt.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2f5fd0', flexShrink: 0, marginTop: 6 }} />}
                      </div>
                    ))}
                  </div>
                  <div onClick={() => setNav('Pedidos')} className="hv-s2" style={{ padding: 13, textAlign: 'center', fontSize: 12.5, color: 'var(--text)', cursor: 'pointer', fontWeight: 500, borderTop: '1px solid var(--line)' }}>{tr.viewAllActivity}</div>
                </div>
              </>
            )}
          </div>
        </header>

        <div style={{ padding: '26px 30px 60px', flex: 1 }}>
          {/* ==================== INICIO ==================== */}
          {nav === 'Inicio' && (
            <div key="v-home" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div style={{ marginBottom: 22 }}>
                <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 32, margin: 0, fontWeight: 500 }}>{tr.greeting}</h1>
                <p style={{ margin: '5px 0 0', color: 'var(--muted)', fontSize: 14 }}>{tr.perfPre} · {rangeLabel}.</p>
              </div>

              {/* KPI strip */}
              <div className="dcards-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden', marginBottom: 20 }}>
                {kpis.map((k, i) => (
                  <div key={i} style={{ padding: '18px 20px', borderRight: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 9 }}>{k.label}</div>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 26, lineHeight: 1, marginBottom: 9 }}>{k.display}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: k.deltaColor, whiteSpace: 'nowrap' }}><span>{k.deltaIcon}</span>{k.delta}<span style={{ color: 'var(--muted2)', fontWeight: 400 }}>vs</span></div>
                      <svg viewBox="0 0 100 26" preserveAspectRatio="none" style={{ width: 56, height: 22, overflow: 'visible', flexShrink: 0 }}><path d={k.sparkArea} fill={k.sparkFill} /><path d={k.sparkLine} fill="none" stroke={k.sparkColor} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + funnel */}
              <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 18, marginBottom: 18 }}>
                <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{tr.salesTotal}</div>
                      <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 30, lineHeight: 1 }}>{chartTotal}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 16, height: 3, borderRadius: 3, background: '#171717' }} />{tr.thisPeriod}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 16, height: 3, borderRadius: 3, background: 'var(--line2)' }} />{tr.prev}</span>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 230 }}>
                    {yLabels.map((y, i) => (
                      <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: y.top, height: 0, borderTop: '1px solid var(--line)', pointerEvents: 'none' }}><span style={{ position: 'absolute', left: 0, top: -8, fontSize: 10.5, color: 'var(--muted2)', background: 'var(--surface)', paddingRight: 6 }}>{y.label}</span></div>
                    ))}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 44, right: 8, top: 4, bottom: 22, width: 'calc(100% - 52px)', height: 'calc(100% - 26px)', overflow: 'visible' }}>
                      <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#171717" stopOpacity="0.16" /><stop offset="1" stopColor="#171717" stopOpacity="0" /></linearGradient></defs>
                      <path d={prevPath} fill="none" stroke="var(--line2)" strokeWidth={1.4} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" style={{ opacity: 0.9 }} />
                      <path d={areaPath} fill="url(#areaFill)" style={{ transformOrigin: 'bottom', animation: 'riseArea .8s ease both' }} />
                      <path d={linePath} fill="none" stroke="#171717" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" strokeDasharray="1200" style={{ animation: 'drawLine 1.3s ease both' }} />
                      {hOn && (
                        <>
                          <line x1={hpt.x} y1={0} x2={hpt.x} y2={100} stroke="var(--muted2)" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                          <circle cx={hpt.x} cy={hpt.y} r={4} fill="#171717" vectorEffect="non-scaling-stroke" />
                          <circle cx={hpt.x} cy={hpt.y} r={8} fill="#171717" fillOpacity="0.12" vectorEffect="non-scaling-stroke" />
                        </>
                      )}
                    </svg>
                    <div style={{ position: 'absolute', left: 44, right: 8, top: 4, bottom: 22, display: 'flex' }}>
                      {hoverCols.map((h, i) => (
                        <div key={i} onMouseEnter={h.onEnter} onMouseLeave={h.onLeave} style={{ flex: 1, height: '100%', cursor: 'crosshair' }} />
                      ))}
                    </div>
                    <div style={{ position: 'absolute', left: 44, right: 8, bottom: 0, display: 'flex', justifyContent: 'space-between' }}>
                      {xLabels.map((x, i) => (
                        <span key={i} style={{ fontSize: 10.5, color: 'var(--muted2)' }}>{x}</span>
                      ))}
                    </div>
                    {hOn && (
                      <div style={{ position: 'absolute', left: tipLeft, top: tipTop, transform: 'translate(-50%,-115%)', background: '#171717', color: '#fff', padding: '8px 12px', borderRadius: 9, fontSize: 12, whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 8px 22px -8px rgba(0,0,0,.5)', zIndex: 3 }}><div style={{ fontSize: 10.5, opacity: 0.65, marginBottom: 2 }}>{tipLabel}</div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{tipVal}</div></div>
                    )}
                  </div>
                </div>

                {/* FUNNEL */}
                <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{tr.funnelTitle}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {funnel.map((f, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}><span style={{ fontSize: 13 }}>{f.label}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{f.value}</span></div>
                        <div style={{ height: 9, borderRadius: 6, background: 'var(--surface3)', overflow: 'hidden' }}><div style={{ height: '100%', width: f.w, background: f.color, borderRadius: 6 }} /></div>
                        <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 5 }}>{f.rate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* bottom row */}
              <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>{tr.channelTitle}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{ position: 'relative', width: 112, height: 112, flexShrink: 0 }}>
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: donut }} />
                      <div style={{ position: 'absolute', inset: 17, borderRadius: '50%', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20 }}>1,284</span><span style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--muted2)' }}>{tr.donutLabel}</span></div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
                      {channels.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c.color }} /><span style={{ flex: 1, color: 'var(--text2)' }}>{c.label}</span><span style={{ fontWeight: 600 }}>{c.pct}</span></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}><span style={{ fontSize: 13, color: 'var(--muted)' }}>{tr.bestSellers}</span><span onClick={() => setNav('Productos')} style={{ fontSize: 12, color: 'var(--text)', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>{tr.viewAll}</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {topProducts.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 44, borderRadius: 7, overflow: 'hidden', flexShrink: 0, background: 'var(--surface3)' }}><div style={{ width: '100%', height: '100%', background: `url(${p.imgUrl}) center/cover` }} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 5 }}>{p.name}</div><div style={{ height: 4, borderRadius: 4, background: 'var(--surface3)', overflow: 'hidden' }}><div style={{ height: '100%', width: p.barW, background: '#171717', borderRadius: 4 }} /></div></div>
                        <span style={{ fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}>{p.revFmt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}><span style={{ fontSize: 13, color: 'var(--muted)' }}>{tr.recentOrdersTitle}</span><span onClick={() => setNav('Pedidos')} style={{ fontSize: 12, color: 'var(--text)', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>{tr.viewAll}</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentOrders.map((o, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: o.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{o.initials}</span>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}</div><div style={{ fontSize: 11, color: 'var(--muted2)' }}>{o.id}</div></div>
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{o.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ==================== PRODUCTOS ==================== */}
          {nav === 'Productos' && (
            <div key="v-products" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted2)' }}>⌕</span>
                  <input value={pQuery} onChange={(e) => { setPQuery(e.target.value); setPgProducts(1) }} placeholder={tr.searchByTitle} style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 14px 11px 36px', fontSize: 13.5 }} />
                </div>
                <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                  {catFilters.map((c, i) => (
                    <button key={i} onClick={c.onClick} style={{ background: c.bg, color: c.color, border: 'none', padding: '10px 14px', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, transition: 'all .18s' }}>{c.label}</button>
                  ))}
                </div>
                <button onClick={openNew} className="hv-op" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#171717', color: '#fff', border: 'none', padding: '11px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}><span style={{ fontSize: 15 }}>＋</span>{tr.addProduct}</button>
              </div>
              <div className="dtable-wrap" style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '52px 1.7fr 110px 1fr 1fr 90px 70px', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--muted2)', fontWeight: 600 }}>
                  <span /><span>{tr.thProducto}</span><span>{tr.thEstado}</span><span>{tr.thInventario}</span><span>{tr.thCategoria}</span><span>{tr.thPrecio}</span><span />
                </div>
                {productRows.map((p, i) => (
                  <div key={i} className="hv-s2" style={{ display: 'grid', gridTemplateColumns: '52px 1.7fr 110px 1fr 1fr 90px 70px', gap: 14, padding: '12px 22px', borderBottom: '1px solid var(--line)', alignItems: 'center', animation: 'rowIn .35s both', animationDelay: p.delay }}>
                    <div style={{ width: 40, height: 46, borderRadius: 7, overflow: 'hidden', background: 'var(--surface3)' }}><div style={{ width: '100%', height: '100%', background: `url(${p.imgUrl}) center/cover` }} /></div>
                    <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div><div style={{ fontSize: 11.5, color: 'var(--muted2)' }}>{p.sku}</div></div>
                    <span><Pill text={p.status} color={p.stColor} bg={p.stBg} /></span>
                    <span style={{ fontSize: 12.5, color: p.invColor }}>{p.invText}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{p.cat}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.priceFmt}</span>
                    <button onClick={p.onEdit} className="hv-bt" style={{ background: 'var(--surface2)', border: '1px solid var(--line)', color: 'var(--text)', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>{tr.edit}</button>
                  </div>
                ))}
                {productRows.length === 0 && <div style={{ padding: 44, textAlign: 'center', color: 'var(--muted2)', fontSize: 14 }}>{tr.noResultsDot}</div>}
                <PagerBar p={prodPager} />
              </div>
            </div>
          )}

          {/* ==================== PRODUCT FORM ==================== */}
          {nav === 'Form' && (
            <div key="v-form" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both', maxWidth: 960, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <button onClick={backToProducts} className="hv-s3" style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontSize: 16 }}>←</button>
                <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 26, margin: 0, fontWeight: 500, flex: 1 }}>{formTitle}</h1>
                <span style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{draftStatusPill}</span>
              </div>

              <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, alignItems: 'start' }}>
                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{tr.typeOfProduct}</div>
                    <p style={{ margin: '0 0 15px', fontSize: 12, color: 'var(--muted2)' }}>{tr.typeHint}</p>
                    <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      {typeCards.map((t, i) => (
                        <button key={i} onClick={t.onClick} className="hv-l2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '15px 8px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.bg, color: t.color, cursor: 'pointer', transition: 'all .18s' }}>
                          <span style={{ color: t.iconColor, display: 'flex' }}>{t.iconEl}</span>
                          <span style={{ fontSize: 12, fontWeight: 500, textAlign: 'center', lineHeight: 1.25 }}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}><span style={{ fontSize: 12.5, fontWeight: 600 }}>{tr.fTitle}</span><input value={d.name || ''} onChange={(e) => patchDraft('name', e.target.value)} placeholder={tr.fTitlePh} style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 14px', fontSize: 14 }} /></label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12.5, fontWeight: 600 }}>{tr.fDesc}</span><textarea value={d.desc || ''} onChange={(e) => patchDraft('desc', e.target.value)} rows={4} placeholder={tr.fDescPh} style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, resize: 'vertical', lineHeight: 1.55 }} /></label>
                  </div>

                  {/* Media */}
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 5 }}>{tr.media}</div>
                    <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--muted2)' }}>{tr.mediaHint}</p>
                    <div className="dcol-3" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 12 }}>
                      <div style={{ width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', background: d.img ? `var(--surface3) url(${d.img}) center/cover` : 'var(--surface2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted2)', fontSize: 12.5 }}>{d.img ? '' : tr.mainPhoto}</div>
                      <div style={{ width: '100%', height: 180, borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted2)', fontSize: 12.5 }}>{tr.addSlot}</div>
                      <div style={{ width: '100%', height: 180, borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted2)', fontSize: 12.5 }}>{tr.addSlot}</div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 16 }}>{tr.pricing}</div>
                    <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{tr.fPrice}</span><div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '0 12px' }}><span style={{ color: 'var(--muted2)', fontSize: 14 }}>$</span><input value={d.price || ''} onChange={numInput('price')} inputMode="numeric" placeholder="0.00" style={{ border: 'none', background: 'transparent', padding: '11px 6px', fontSize: 14, width: '100%' }} /></div></label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{tr.comparePrice}</span><div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '0 12px' }}><span style={{ color: 'var(--muted2)', fontSize: 14 }}>$</span><input value={d.compare || ''} onChange={numInput('compare')} inputMode="numeric" placeholder="0.00" style={{ border: 'none', background: 'transparent', padding: '11px 6px', fontSize: 14, width: '100%' }} /></div></label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{tr.costPerItem}</span><div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '0 12px' }}><span style={{ color: 'var(--muted2)', fontSize: 14 }}>$</span><input value={d.cost || ''} onChange={numInput('cost')} inputMode="numeric" placeholder="0.00" style={{ border: 'none', background: 'transparent', padding: '11px 6px', fontSize: 14, width: '100%' }} /></div></label>
                    </div>
                    <div style={{ display: 'flex', gap: 26, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 12.5 }}><span style={{ color: 'var(--muted)' }}>{tr.marginLbl}</span><span style={{ fontWeight: 600 }}>{marginPct}</span></div>
                      <div style={{ fontSize: 12.5 }}><span style={{ color: 'var(--muted)' }}>{tr.profitLbl}</span><span style={{ fontWeight: 600 }}>{profitFmt}</span></div>
                    </div>
                  </div>

                  {/* Type-specific specs */}
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{tr.specs}</div><span style={{ fontSize: 11, fontWeight: 600, color: '#8a6d1e', background: 'rgba(199,163,106,.2)', padding: '2px 9px', borderRadius: 7 }}>{typeLabel}</span></div>
                    <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--muted2)' }}>{tr.specsHint}</p>
                    <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {typeAttrs.map((f, i) => (
                        <label key={i} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{f.label}</span>
                          {f.isSelect && (
                            <select value={f.value} onChange={f.onChange} style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 12px', fontSize: 13.5, cursor: 'pointer' }}>
                              <option value="">{f.placeholder}</option>
                              {f.options.map((o, oi) => (<option key={oi} value={o.value}>{o.label}</option>))}
                            </select>
                          )}
                          {f.isNum && (
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '0 12px' }}><input value={f.value} onChange={f.onChange} inputMode="numeric" placeholder="0" style={{ border: 'none', background: 'transparent', padding: '11px 4px', fontSize: 13.5, width: '100%' }} /><span style={{ color: 'var(--muted2)', fontSize: 12.5 }}>{f.unit}</span></div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Inventory */}
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 16 }}>{tr.invWord}</div>
                    <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{tr.skuCode}</span><input value={d.sku || ''} onChange={(e) => patchDraft('sku', e.target.value)} placeholder="VS-000" style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 14px', fontSize: 13.5 }} /></label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{tr.qtyAvailable}</span><input value={d.stock || ''} onChange={numInput('stock')} inputMode="numeric" placeholder="0" style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 14px', fontSize: 13.5 }} /></label>
                    </div>
                  </div>

                  {/* Variants */}
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 5 }}>{variantAxisLabel}</div>
                    <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--muted2)' }}>{tr.variantHint}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {draftSizes.map((s, i) => (
                        <button key={i} onClick={s.onClick} style={{ minWidth: 44, background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .18s' }}>{s.label}</button>
                      ))}
                    </div>
                    {variantRows.length > 0 && (
                      <div className="dtable-wrap" style={{ border: '1px solid var(--line)', borderRadius: 11, overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px', gap: 12, padding: '10px 16px', background: 'var(--surface2)', borderBottom: '1px solid var(--line)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.03em', color: 'var(--muted2)', fontWeight: 600 }}><span>{tr.thVariante}</span><span>{tr.fPrice}</span><span>{tr.thStock}</span></div>
                        {variantRows.map((v, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{v.size}</span>
                            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{v.price}</span>
                            <input value={v.stock} onChange={v.onInput} inputMode="numeric" style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 8, padding: '7px 10px', fontSize: 13, width: 100 }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 80 }}>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '20px 22px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{tr.statusWord}</div>
                    <div style={{ display: 'flex', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                      {draftStatuses.map((st, i) => (
                        <button key={i} onClick={st.onClick} style={{ flex: 1, background: st.bg, color: st.color, border: 'none', padding: 9, cursor: 'pointer', fontSize: 12.5, fontWeight: 500 }}>{st.label}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '20px 22px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{tr.organization}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{tr.storeCategory}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '9px 12px', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 9 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8a6d1e' }} /><span style={{ fontSize: 12.5, fontWeight: 500 }}>{draftCatLabel}</span><span style={{ fontSize: 11, color: 'var(--muted2)', marginLeft: 'auto' }}>{tr.autoByType}</span></div>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12, color: 'var(--muted)' }}>{tr.vendorWord}</span><input value={d.vendor || ''} onChange={(e) => patchDraft('vendor', e.target.value)} placeholder={tr.vendorPh} style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px', fontSize: 13 }} /></label>
                  </div>
                  <button onClick={saveDraft} className="hv-op" style={{ background: '#171717', color: '#fff', border: 'none', padding: 14, borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{saveLabel}</button>
                  <button onClick={backToProducts} className="hv-s3" style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text2)', padding: 12, borderRadius: 11, cursor: 'pointer', fontSize: 13.5 }}>{tr.discard}</button>
                </div>
              </div>
            </div>
          )}
          {/* ==================== INVENTARIO ==================== */}
          {nav === 'Inventario' && (
            <div key="v-inv" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div className="dcards-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 20 }}>
                {invStats.map((s, i) => (
                  <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 13, background: 'var(--surface)', padding: '18px 20px' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 9 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 25, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="dtable-wrap" style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '52px 1.8fr 1fr 110px 130px 120px', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--muted2)', fontWeight: 600 }}>
                  <span /><span>{tr.thProducto}</span><span>{tr.thSku}</span><span>{tr.thCommitted}</span><span>{tr.thAvailable}</span><span>{tr.thAdjust}</span>
                </div>
                {invRows.map((r, i) => (
                  <div key={i} className="hv-s2" style={{ display: 'grid', gridTemplateColumns: '52px 1.8fr 1fr 110px 130px 120px', gap: 14, padding: '11px 22px', borderBottom: '1px solid var(--line)', alignItems: 'center', animation: 'rowIn .35s both', animationDelay: r.delay }}>
                    <div style={{ width: 38, height: 44, borderRadius: 7, overflow: 'hidden', background: 'var(--surface3)' }}><div style={{ width: '100%', height: '100%', background: `url(${r.imgUrl}) center/cover` }} /></div>
                    <div style={{ minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div><div style={{ fontSize: 11.5, color: r.tagColor }}>{r.tag}</div></div>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{r.sku}</span>
                    <span style={{ fontSize: 13 }}>{r.committed}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: r.availColor }}>{r.stock}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', width: 'max-content' }}>
                      <button onClick={r.onMinus} className="hv-s3" style={{ background: 'var(--surface2)', border: 'none', color: 'var(--text)', width: 30, height: 30, cursor: 'pointer', fontSize: 15 }}>−</button>
                      <span style={{ width: 34, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{r.stock}</span>
                      <button onClick={r.onPlus} className="hv-s3" style={{ background: 'var(--surface2)', border: 'none', color: 'var(--text)', width: 30, height: 30, cursor: 'pointer', fontSize: 15 }}>＋</button>
                    </div>
                  </div>
                ))}
                <PagerBar p={invPager} />
              </div>
            </div>
          )}

          {/* ==================== PEDIDOS ==================== */}
          {nav === 'Pedidos' && (
            <div key="v-orders" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', width: 'max-content', marginBottom: 18 }}>
                {orderFilters.map((f, i) => (
                  <button key={i} onClick={f.onClick} style={{ background: f.bg, color: f.color, border: 'none', padding: '10px 16px', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, transition: 'all .18s' }}>{f.label}</button>
                ))}
              </div>
              <div className="dtable-wrap" style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1.3fr 1.4fr 100px 120px 120px 80px', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--muted2)', fontWeight: 600 }}>
                  <span>{tr.thPedido}</span><span>{tr.thCliente}</span><span>{tr.thArticulos}</span><span>{tr.thTotal}</span><span>{tr.thPago}</span><span>{tr.thEnvio}</span><span>{tr.thHora}</span>
                </div>
                {ordersFull.map((o, i) => (
                  <div key={i} onClick={o.onOpen} className="hv-s2" style={{ display: 'grid', gridTemplateColumns: '110px 1.3fr 1.4fr 100px 120px 120px 80px', gap: 14, padding: '13px 22px', borderBottom: '1px solid var(--line)', alignItems: 'center', cursor: 'pointer', animation: 'rowIn .35s both', animationDelay: o.delay }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{o.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}><span style={{ width: 26, height: 26, borderRadius: '50%', background: o.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{o.initials}</span><span style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}</span></div>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.items}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{o.total}</span>
                    <span><Pill text={o.pay} color={o.payColor} bg={o.payBg} /></span>
                    <span><Pill text={o.ship} color={o.shipColor} bg={o.shipBg} dot={false} /></span>
                    <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{o.time}</span>
                  </div>
                ))}
                <PagerBar p={ordersPager} />
              </div>
            </div>
          )}
          {/* ==================== CLIENTES ==================== */}
          {nav === 'Clientes' && (
            <div key="v-clients" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
                {clientStats.map((s, i) => (
                  <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 13, background: 'var(--surface)', padding: '18px 20px' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 9 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 25 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', marginBottom: 16, maxWidth: 320 }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted2)' }}>⌕</span>
                <input value={cQuery} onChange={(e) => { setCQuery(e.target.value); setPgClients(1) }} placeholder={tr.searchClient} style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 14px 11px 36px', fontSize: 13.5 }} />
              </div>
              <div className="dtable-wrap" style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.6fr 120px 90px 110px 110px', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--muted2)', fontWeight: 600 }}>
                  <span>{tr.thCliente}</span><span>{tr.thCorreo}</span><span>{tr.thSegmento}</span><span>{tr.navLabels.pedidos}</span><span>{tr.thGastado}</span><span>{tr.thUltCompra}</span>
                </div>
                {clientRows.map((c, i) => (
                  <div key={i} className="hv-s2" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.6fr 120px 90px 110px 110px', gap: 14, padding: '12px 22px', borderBottom: '1px solid var(--line)', alignItems: 'center', animation: 'rowIn .35s both', animationDelay: c.delay }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}><span style={{ width: 30, height: 30, borderRadius: '50%', background: c.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{c.initials}</span><span style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span></div>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</span>
                    <span><span style={{ display: 'inline-flex', fontSize: 11.5, fontWeight: 500, color: c.segColor, background: c.segBg, padding: '4px 10px', borderRadius: 20 }}>{c.segment}</span></span>
                    <span style={{ fontSize: 13 }}>{c.orders}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.spent}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{c.last}</span>
                  </div>
                ))}
                <PagerBar p={clientsPager} />
              </div>
            </div>
          )}

          {/* ==================== PAGOS ==================== */}
          {nav === 'Pagos' && (
            <div key="v-pay" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
                {payStats.map((s, i) => (
                  <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 13, background: 'var(--surface)', padding: '20px 22px' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 11 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 27, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted2)', marginTop: 7 }}>{s.note}</div>
                  </div>
                ))}
              </div>
              <div className="dtable-wrap" style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1.6fr 130px 130px 110px', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--muted2)', fontWeight: 600 }}>
                  <span>{tr.thTransaccion}</span><span>{tr.thCliente}</span><span>{tr.thMonto}</span><span>{tr.thEstado}</span><span>{tr.thFecha}</span>
                </div>
                {payments.map((p, i) => (
                  <div key={i} className="hv-s2" style={{ display: 'grid', gridTemplateColumns: '130px 1.6fr 130px 130px 110px', gap: 14, padding: '13px 22px', borderBottom: '1px solid var(--line)', alignItems: 'center', animation: 'rowIn .35s both', animationDelay: p.delay }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{p.txid}</span>
                    <span style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.amount}</span>
                    <span><Pill text={p.status} color={p.stColor} bg={p.stBg} /></span>
                    <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{p.date}</span>
                  </div>
                ))}
                <PagerBar p={paymentsPager} />
              </div>
            </div>
          )}

          {/* ==================== DESCUENTOS ==================== */}
          {nav === 'Descuentos' && (
            <div key="v-disc" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div className="dtable-wrap" style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 100px 120px 110px', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--muted2)', fontWeight: 600 }}>
                  <span>{tr.thCodigo}</span><span>{tr.thTipo}</span><span>{tr.thValor}</span><span>{tr.thUsos}</span><span>{tr.thEstado}</span><span>{tr.thVence}</span>
                </div>
                {discounts.map((dc, i) => (
                  <div key={i} className="hv-s2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 100px 120px 110px', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--line)', alignItems: 'center', animation: 'rowIn .35s both', animationDelay: dc.delay }}>
                    <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans'", letterSpacing: '.04em', background: 'var(--surface3)', padding: '5px 11px', borderRadius: 7, width: 'max-content' }}>{dc.code}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{dc.type}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{dc.value}</span>
                    <span style={{ fontSize: 12.5 }}>{dc.uses}</span>
                    <span><Pill text={dc.status} color={dc.stColor} bg={dc.stBg} /></span>
                    <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{dc.expires}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ==================== CAJA ==================== */}
          {nav === 'Caja' && (
            <div key="v-caja" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, padding: '15px 20px', border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#2e7d55', animation: 'pulseDot 1.6s infinite' }} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{tr.shiftOpen}</div><div style={{ fontSize: 12, color: 'var(--muted2)' }}>{tr.cashierLine}</div></div>
                <button onClick={exportCaja} className="hv-s3" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--line)', padding: '10px 15px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}><span style={{ fontSize: 14 }}>↓</span>{tr.exportCut}</button>
                <button onClick={() => flash(tr.toastCashClosed)} className="hv-op" style={{ background: '#171717', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{tr.closeReg}</button>
              </div>
              <div className="dcards-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 18 }}>
                {cashCards.map((c, i) => (
                  <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 13, background: 'var(--surface)', padding: '16px 18px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8 }}>{c.label}</div>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 21, color: c.color }}>{c.value}</div>
                  </div>
                ))}
              </div>
              <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 18 }}>
                <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 5 }}>{tr.cashCount}</div>
                  <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--muted2)' }}>{tr.cashCountHint}</p>
                  <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 22px' }}>
                    {denoms.map((dn, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
                        <span style={{ fontSize: 13, width: 54, color: dn.labelColor, fontWeight: 500 }}>{dn.label}</span>
                        <span style={{ color: 'var(--muted2)' }}>×</span>
                        <input value={dn.qty} onChange={dn.onInput} inputMode="numeric" style={{ width: 54, background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 7, padding: '6px 8px', fontSize: 13, textAlign: 'center' }} />
                        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--muted)' }}>{dn.sub}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                    <span style={{ fontSize: 14, color: 'var(--muted)' }}>{tr.totalCounted}</span>
                    <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 24 }}>{fmtMx(counted)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ border: `1px solid ${diff === 0 ? 'rgba(46,125,85,.35)' : 'var(--line)'}`, borderRadius: 14, background: diff === 0 ? 'rgba(46,125,85,.06)' : 'var(--surface)', padding: '22px 24px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 15 }}>{tr.reconcile}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>{tr.expectedDrawer}</span><span>{fmtMx(expectedCash)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>{tr.totalCounted}</span><span>{fmtMx(counted)}</span></div>
                      <div style={{ height: 1, background: 'var(--line)', margin: '3px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontWeight: 600 }}>{tr.difference}</span><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, color: diffColor }}>{(diff >= 0 ? '+' : '−') + fmtMx(Math.abs(diff))}</span></div>
                      <div style={{ fontSize: 11.5, color: diffColor, textAlign: 'right', fontWeight: 500 }}>{diff === 0 ? tr.balanced : diff > 0 ? tr.over : tr.short}</div>
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px', flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>{tr.shiftMovements}</div>
                    <div style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 11, padding: '13px 14px', marginBottom: 14 }}>
                      <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 9, overflow: 'hidden', marginBottom: 10 }}>
                        {movTypes.map((t, i) => (
                          <button key={i} onClick={t.onClick} style={{ flex: 1, background: t.bg, color: t.color, border: 'none', padding: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>{t.label}</button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={movForm.concept} onChange={(e) => patchMov('concept', e.target.value)} placeholder={tr.conceptPh} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: '9px 11px', fontSize: 12.5, minWidth: 0 }} />
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: '0 10px', width: 100 }}><span style={{ color: 'var(--muted2)', fontSize: 12.5 }}>$</span><input value={movForm.amount} onChange={(e) => patchMov('amount', e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="0" style={{ border: 'none', background: 'transparent', padding: '9px 4px', fontSize: 12.5, width: '100%', minWidth: 0 }} /></div>
                        <button onClick={addMov} title={tr.recordTitle} className="hv-op" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#171717', color: '#fff', border: 'none', width: 38, borderRadius: 8, cursor: 'pointer', flexShrink: 0 }}>{ic('plus', 15)}</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {movements.map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
                          <span style={{ width: 26, height: 26, borderRadius: 7, background: m.iconBg, color: m.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{m.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5 }}>{m.label}</div><div style={{ fontSize: 10.5, color: 'var(--muted2)' }}>{m.time}</div></div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: m.amtColor }}>{m.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* P&L */}
              <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '22px 24px', marginTop: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}><span style={{ color: '#2e7d55', display: 'flex' }}>{ic('trend', 16)}</span><div style={{ fontSize: 13.5, fontWeight: 600 }}>{tr.netEarnings}</div><span style={{ fontSize: 11, color: 'var(--muted2)', marginLeft: 'auto' }}>{tr.plToday}</span></div>
                <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--muted2)' }}>{tr.plHint}</p>
                <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pnlRows.map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{r.label}</span>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: r.color }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'linear-gradient(135deg,rgba(46,125,85,.1),rgba(199,163,106,.08))', border: '1px solid rgba(46,125,85,.25)', borderRadius: 13, padding: '22px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{tr.netProfit}</div>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 34, color: '#2e7d55', lineHeight: 1 }}>{fmtMx(netProfit)}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: '#2e7d55', background: 'rgba(46,125,85,.12)', padding: '5px 12px', borderRadius: 20 }}>{tr.netMargin} {netMargin}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== AJUSTES ==================== */}
          {nav === 'Ajustes' && (
            <div key="v-set" style={{ animation: 'viewIn .45s cubic-bezier(.2,.7,.2,1) both', maxWidth: 640 }}>
              <div style={{ border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)', padding: '24px 26px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{tr.storePrefs}</div>
                <p style={{ margin: '0 0 8px', fontSize: 12.5, color: 'var(--muted2)' }}>{tr.storeControls}</p>
                {settingsList.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid var(--line)' }}>
                    <div><div style={{ fontSize: 13.5 }}>{s.label}</div><div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 3 }}>{s.desc}</div></div>
                    <div onClick={s.onToggle} style={{ width: 44, height: 25, borderRadius: 20, background: s.trackBg, position: 'relative', cursor: 'pointer', transition: 'background .25s', flexShrink: 0 }}><span style={{ position: 'absolute', top: 3, left: s.knobLeft, width: 19, height: 19, borderRadius: '50%', background: '#fff', transition: 'left .25s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ORDER DETAIL */}
        {orderDetail && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', justifyContent: 'flex-end' }}>
            <div onClick={closeOrderDetail} style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.45)', backdropFilter: 'blur(3px)' }} />
            <div style={{ position: 'relative', width: 'min(560px,96vw)', height: '100%', background: 'var(--surface)', borderLeft: '1px solid var(--line)', boxShadow: '-30px 0 60px -20px rgba(0,0,0,.4)', overflowY: 'auto', animation: 'drawerIn .35s cubic-bezier(.2,.7,.2,1) both' }}>
              <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', borderBottom: '1px solid var(--line)', padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 2 }}>
                <div style={{ flex: 1 }}><div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22 }}>{tr.orderWord} {orderDetail.id}</div><div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 2 }}>{tr.todayAt}{orderDetail.time}</div></div>
                <Pill text={orderDetail.pay} color={orderDetail.payColor} bg={orderDetail.payBg} />
                <Pill text={orderDetail.ship} color={orderDetail.shipColor} bg={orderDetail.shipBg} dot={false} />
                <button onClick={closeOrderDetail} className="hv-s3" style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
              <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 16, border: '1px solid var(--line)', borderRadius: 13, background: 'var(--surface2)' }}>
                  <span style={{ width: 44, height: 44, borderRadius: '50%', background: orderDetail.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{orderDetail.initials}</span>
                  <div style={{ minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 600 }}>{orderDetail.name}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{orderDetail.email} · {orderDetail.phone}</div></div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 16 }}>{tr.shipTracking}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {orderDetail.timeline.map((t, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {t.showLine && <span style={{ position: 'absolute', top: 13, left: '-50%', width: '100%', height: 2, background: t.lineBg }} />}
                        <span style={{ position: 'relative', zIndex: 1, width: 26, height: 26, borderRadius: '50%', background: t.dotBg, color: t.dotColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{t.check}</span>
                        <span style={{ fontSize: 11.5, color: t.textColor, marginTop: 8, textAlign: 'center' }}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ border: '1px solid var(--line)', borderRadius: 13, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: 'var(--surface2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted2)' }}>{tr.itemsHdr}</div>
                  {orderDetail.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
                      <div style={{ width: 42, height: 50, borderRadius: 8, overflow: 'hidden', background: 'var(--surface3)', flexShrink: 0 }}><div style={{ width: '100%', height: '100%', background: `url(${it.img}) center/cover` }} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div><div style={{ fontSize: 12, color: 'var(--muted2)' }}>{it.qty}</div></div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{it.lineFmt}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>{tr.subtotal}</span><span>{orderDetail.subtotalFmt}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>{tr.shippingWord}</span><span>{orderDetail.shipFmt}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>{tr.vat}</span><span>{orderDetail.taxFmt}</span></div>
                  <div style={{ height: 1, background: 'var(--line)', margin: '3px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontWeight: 600 }}>{tr.totalWord}</span><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22 }}>{orderDetail.totalFmt}</span></div>
                </div>
                <div style={{ border: '1px solid var(--line)', borderRadius: 13, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted2)', marginBottom: 8 }}>{tr.shipAddress}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55 }}>{orderDetail.address}</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {orderDetail.canFulfill && <button onClick={fulfillOrder} className="hv-op" style={{ flex: 1, background: '#171717', color: '#fff', border: 'none', padding: 13, borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{tr.markShipped}</button>}
                  {orderDetail.canRefund && <button onClick={refundOrderD} className="hv-refund" style={{ flex: 1, background: 'transparent', border: '1px solid var(--line2)', color: '#c0392b', padding: 13, borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{tr.refundWord}</button>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div style={{ position: 'fixed', bottom: 26, left: '50%', background: '#171717', color: '#fff', padding: '12px 22px', borderRadius: 11, fontSize: 13.5, zIndex: 60, boxShadow: '0 16px 44px -12px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', gap: 10, animation: 'toastIn .3s ease both' }}><span style={{ color: '#8fd0a8' }}>✓</span>{toast}</div>
        )}
      </main>
    </div>
  )
}
