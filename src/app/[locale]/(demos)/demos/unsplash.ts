// Imágenes de fondo de los demos.
//
// Los demos pintan casi todas sus fotos con `background: url(...)` en CSS, que NO pasa por
// next/image: lo que se ponga acá es literalmente lo que baja el teléfono. Medido en iPhone 13
// con CPU 4x y Slow 4G, en los 6 demos lentos el elemento LCP era siempre un div con background
// y su loadTime coincidía con el LCP — o sea, el LCP era puro tiempo de descarga, no JS
// (TBT: 7-100 ms). Las locales pesaban 1600px / 120-196 kB para una caja de ~390px, y a unsplash
// se le pedían anchos de hasta 1900.
//
// `optimized()` mete la URL por el endpoint del optimizador de Next, que sirve avif/webp según el
// Accept y redimensiona. Vale tanto para /showcase local como para unsplash (único host remoto
// en la whitelist de next.config). Sin assets nuevos: despacho.webp 173 kB -> 48 kB, y la foto
// de 544 kB de roman-ashford -> 62 kB.
//
// Anchos que acepta el optimizador (deviceSizes + imageSizes por defecto de Next).
// OJO: un `w` fuera de esta lista NO se redondea — el endpoint responde 400 y la imagen no se
// pinta. Por eso `optimized` sube al siguiente permitido en vez de pasar el número tal cual:
// así ningún caller puede romper una foto pidiendo un ancho arbitrario (w=1400 y w=900 daban 400).
const ALLOWED_W = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

const snapW = (w: number) => ALLOWED_W.find((a) => a >= w) ?? ALLOWED_W[ALLOWED_W.length - 1]

export function optimized(src: string, w = 828, q = 70) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${snapW(w)}&q=${q}`
}

// Foto de unsplash ya optimizada. `w` es el ancho de PINTADO real, no el del original: pedirle
// a unsplash w=1900 para una caja de 390px baja 544 kB y tira el 96% de los píxeles.
export function uns(id: string, w = 828, q = 70) {
  return optimized(`https://images.unsplash.com/photo-${id}`, w, q)
}

// Asset local de /public ya optimizado (ej: '/showcase/img/despacho.webp').
export function local(path: string, w = 828, q = 70) {
  return optimized(path, w, q)
}
