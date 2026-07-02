import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05060A',
          backgroundImage:
            'radial-gradient(circle at 30% 25%, rgba(0,229,255,0.35), transparent 60%)',
          color: '#00E5FF',
          fontFamily: 'sans-serif',
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        MS
      </div>
    ),
    size,
  )
}
