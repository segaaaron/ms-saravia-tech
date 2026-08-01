import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'MS TECH STACK LLC — Premium Software Agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05060A',
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(0,229,255,0.18), transparent 55%), radial-gradient(circle at 80% 90%, rgba(124,77,255,0.18), transparent 55%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 8,
            color: '#00E5FF',
            marginBottom: 24,
            display: 'flex',
          }}
        >
          PREMIUM SOFTWARE AGENCY
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.05,
            display: 'flex',
          }}
        >
          MS TECH STACK LLC
        </div>
        <div
          style={{
            fontSize: 34,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 32,
            display: 'flex',
          }}
        >
          SaaS · Mobile · AI · Consulting
        </div>
      </div>
    ),
    { ...size }
  )
}
