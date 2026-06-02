'use client'

const GRAD = 'linear-gradient(120deg, #2FF5E0 0%, #4D7CFF 50%, #9B6CFF 100%)'
const CYAN = '#2FF5E0'

export default function NavCircuit({ size = 38 }: { size?: number }) {
  const scale = size / 38
  const px = (n: number) => `${n * scale}px`

  return (
    <span
      style={{
        position: 'relative',
        width: size,
        height: size,
        flex: 'none',
        display: 'inline-block',
        filter: 'drop-shadow(0 0 9px rgba(77,124,255,0.4))',
      }}
    >
      {/* lines */}
      <span style={{ position: 'absolute', left: px(18), top: px(2), width: px(2), height: px(10), background: `linear-gradient(${CYAN}, rgba(47,245,224,0.1))`, zIndex: 1 }} />
      <span style={{ position: 'absolute', left: px(18), bottom: px(2), width: px(2), height: px(10), background: `linear-gradient(rgba(47,245,224,0.1), ${CYAN})`, zIndex: 1 }} />
      <span style={{ position: 'absolute', top: px(18), left: px(2), height: px(2), width: px(10), background: `linear-gradient(90deg, ${CYAN}, rgba(47,245,224,0.1))`, zIndex: 1 }} />
      <span style={{ position: 'absolute', top: px(18), right: px(2), height: px(2), width: px(10), background: `linear-gradient(90deg, rgba(47,245,224,0.1), ${CYAN})`, zIndex: 1 }} />

      {/* pads */}
      <span className="nc-pad" style={{ top: 0, left: px(16.5), animationDelay: '0s' }} />
      <span className="nc-pad" style={{ bottom: 0, left: px(16.5), animationDelay: '.45s' }} />
      <span className="nc-pad" style={{ left: 0, top: px(16.5), animationDelay: '.9s' }} />
      <span className="nc-pad" style={{ right: 0, top: px(16.5), animationDelay: '1.35s' }} />

      {/* chip */}
      <span
        style={{
          position: 'absolute',
          left: px(9),
          top: px(11),
          width: px(20),
          height: px(16),
          borderRadius: px(5),
          background: GRAD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
      >
        <b
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: px(8),
            letterSpacing: '-0.05em',
            color: '#08111C',
          }}
        >
          MS
        </b>
      </span>

      <style jsx>{`
        .nc-pad {
          position: absolute;
          width: ${px(5)};
          height: ${px(5)};
          border-radius: 50%;
          background: ${CYAN};
          box-shadow: 0 0 5px ${CYAN};
          z-index: 1;
          animation: nc-pad 1.8s ease-in-out infinite;
        }
        @keyframes nc-pad {
          0%, 100% { transform: scale(0.7); opacity: 0.65; }
          50%      { transform: scale(1.25); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nc-pad { animation: none; }
        }
      `}</style>
    </span>
  )
}
