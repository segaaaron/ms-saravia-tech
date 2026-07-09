// Resolución de país por IP (SOLO server). Usa country.is: gratis, HTTPS, sin API key,
// uso comercial permitido, 0 RAM/datos en la app. Con timeout y fallback silencioso.
// Prioridad en la página: header del proxy (Cloudflare/nginx) → si no, este lookup por IP.

const PRIVATE_IP =
  /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|fe80:|fc|fd)/i

/** Extrae la IP del cliente de los headers típicos de un reverse proxy (nginx). */
export function clientIpFromHeaders(get: (k: string) => string | null): string {
  const xff = get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return (get('x-real-ip') || '').trim()
}

/** País (ISO-2) desde una IP pública vía country.is. '' si es privada/local o falla. */
export async function countryFromIp(ip: string): Promise<string> {
  if (!ip || PRIVATE_IP.test(ip)) return ''
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 1200)
    const res = await fetch(`https://api.country.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
      // Cachea el resultado por IP 1h → visitantes repetidos no re-consultan el API.
      next: { revalidate: 3600 },
    })
    clearTimeout(timer)
    if (!res.ok) return ''
    const data = (await res.json()) as { country?: unknown }
    return typeof data.country === 'string' ? data.country : ''
  } catch {
    return ''
  }
}
