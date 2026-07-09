import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  locale: z.enum(['en', 'es']).optional(),
  // Origen del lead: "contact_form" (default) o "demo_<slug>" / "solution_<slug>" desde
  // las landings. Se muestra en el email de notificación (sin DB — solo referencia).
  source: z.string().max(60).optional(),
})

// Rate-limit in-memory por IP (ventana deslizante). El endpoint es público y dispara
// Resend por request → sin throttle es superficie de spam/abuso de cuota.
// Map por instancia (runtime Node); suficiente para la escala de un form de marketing.
const RATE_LIMIT = 5 // requests
const RATE_WINDOW_MS = 60_000 // por minuto
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  // Poda oportunista para que el Map no crezca sin límite.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k)
  }
  return recent.length > RATE_LIMIT
}

// Escapa HTML para evitar inyección en el email de notificación (los datos
// vienen del usuario y se interpolan en el cuerpo HTML).
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null

    // Throttle antes de tocar Resend. Sin IP identificable → cae en el cubo 'unknown'.
    if (rateLimited(ip ?? 'unknown')) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const data = schema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('Contact form: RESEND_API_KEY not set — email not sent')
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    const to = process.env.CONTACT_TO_EMAIL || 'techstackmssaravia@gmail.com'
    const from =
      process.env.CONTACT_FROM_EMAIL || 'MS SARAVIA TECH STACK <onboarding@resend.dev>'

    const name = escapeHtml(data.name)
    const email = escapeHtml(data.email)
    const company = data.company ? escapeHtml(data.company) : ''
    const message = escapeHtml(data.message)
    const source = data.source ? escapeHtml(data.source) : ''

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `New contact from ${data.name}${data.company ? ` — ${data.company}` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#05060A;color:white;padding:32px;border-radius:12px;border:1px solid rgba(0,229,255,0.2)">
          <h2 style="color:#00E5FF;margin-bottom:24px">New Contact Form Submission</h2>
          <p><strong style="color:#00E5FF">Name:</strong> ${name}</p>
          <p><strong style="color:#00E5FF">Email:</strong> ${email}</p>
          ${company ? `<p><strong style="color:#00E5FF">Company:</strong> ${company}</p>` : ''}
          <div style="margin-top:16px;padding:16px;background:rgba(255,255,255,0.05);border-radius:8px">
            <strong style="color:#00E5FF">Message:</strong>
            <p style="margin-top:8px;white-space:pre-wrap">${message}</p>
          </div>
          <p style="margin-top:24px;color:rgba(255,255,255,0.5);font-size:12px">MS Saravia Tech Stack contact form${source ? ` · source: ${source}` : ''}</p>
        </div>
      `,
    })

    if (error) {
      console.error('Contact form: Resend failed:', error)
      return NextResponse.json({ error: 'Failed to send' }, { status: 502 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 })
    }
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
