import Script from 'next/script'

// GA4 loader. Renders nothing unless NEXT_PUBLIC_GA_ID is set (e.g. "G-XXXXXXX").
// lazyOnload, no afterInteractive: gtag son ~162 kB sin comprimir y con afterInteractive
// compite con la hidratación por el hilo principal justo en la ventana del LCP en móvil.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  if (!gaId) return null

  return (
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
  )
}
