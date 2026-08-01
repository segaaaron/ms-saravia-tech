import { postsByDate } from '@/content/blog'
import { localizedUrl, siteUrl } from '@/lib/seo'

// Feed RSS del blog (inglés = mercado primario). Route handler fuera de [locale];
// el matcher del middleware ya excluye rutas con punto (rss.xml).
export const dynamic = 'force-static'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET(): Response {
  const posts = postsByDate()
  const items = posts
    .map((p) => {
      const url = localizedUrl('en', `/blog/${p.slug}`)
      return `    <item>
      <title>${escapeXml(p.en.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(p.en.excerpt)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MS Tech Stack — Blog</title>
    <link>${localizedUrl('en', '/blog')}</link>
    <description>Practical engineering notes on building SaaS, AI agents and mobile apps.</description>
    <language>en</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
