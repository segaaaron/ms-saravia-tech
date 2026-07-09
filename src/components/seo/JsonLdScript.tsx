// Emisor genérico de JSON-LD para rutas nuevas (Service, CreativeWork, BreadcrumbList…).
// Mismo patrón que components/seo/JsonLd.tsx (script inline serializado en el HTML del server).
export default function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
