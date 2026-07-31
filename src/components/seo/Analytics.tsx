import Script from 'next/script'

// Analytics loaders: GA4 (opt-in) + Umami (self-hosted, on by default).
//
// GA4: renders nothing unless NEXT_PUBLIC_GA_ID is set (e.g. "G-XXXXXXX").
// lazyOnload, no afterInteractive: gtag son ~162 kB sin comprimir y con afterInteractive
// compite con la hidratación por el hilo principal justo en la ventana del LCP en móvil.
//
// Umami: script self-hosted ~2 kB gzip, sin cookies, privacy-first. El website-id y la
// URL son públicos (viajan en el client), así que van con default hardcodeado y se pueden
// sobreescribir por env. afterInteractive (no lazyOnload como GA4): pesa nada y así no se
// pierden pageviews de rebotes muy rápidos antes del window.load.
const UMAMI_SRC =
  process.env.NEXT_PUBLIC_UMAMI_SRC ||
  'https://analytics.ms-tech-stack.cloud/script.js'
const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ||
  'ebe430c1-1311-466b-9010-6ac585752367'

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
          </Script>
        </>
      )}

      {UMAMI_WEBSITE_ID && (
        <Script
          src={UMAMI_SRC}
          data-website-id={UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
    </>
  )
}
