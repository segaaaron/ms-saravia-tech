import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('Contact form error: RESEND_API_KEY is not set')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const to = process.env.CONTACT_TO_EMAIL || 'techstackmssaravia@gmail.com'
    const from = process.env.CONTACT_FROM_EMAIL || 'MS SARAVIA TECH STACK <onboarding@resend.dev>'
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `New contact from ${data.name}${data.company ? ` — ${data.company}` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#05060A;color:white;padding:32px;border-radius:12px;border:1px solid rgba(0,229,255,0.2)">
          <h2 style="color:#00E5FF;margin-bottom:24px">New Contact Form Submission</h2>
          <p><strong style="color:#00E5FF">Name:</strong> ${data.name}</p>
          <p><strong style="color:#00E5FF">Email:</strong> ${data.email}</p>
          ${data.company ? `<p><strong style="color:#00E5FF">Company:</strong> ${data.company}</p>` : ''}
          <div style="margin-top:16px;padding:16px;background:rgba(255,255,255,0.05);border-radius:8px">
            <strong style="color:#00E5FF">Message:</strong>
            <p style="margin-top:8px;white-space:pre-wrap">${data.message}</p>
          </div>
          <p style="margin-top:24px;color:rgba(255,255,255,0.5);font-size:12px">Sent from mssaraviatechstack.com contact form</p>
        </div>
      `,
    })

    if (error) {
      console.error('Contact form error: Resend failed to send:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 })
    }
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
