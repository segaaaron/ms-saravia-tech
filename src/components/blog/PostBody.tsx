import type { Block } from '@/content/blog'

// Renderiza los bloques del post como HTML semántico real (h2/p/ul) → indexable + accesible.
export default function PostBody({ body }: { body: Block[] }) {
  return (
    <div className="mt-12 space-y-6">
      {body.map((b, i) => {
        if (b.type === 'h2') {
          return (
            <h2 key={i} className="pt-4 text-2xl font-display font-bold tracking-tight text-white">
              {b.text}
            </h2>
          )
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} className="ml-5 list-disc space-y-2 text-[16px] leading-[1.75] text-white/70 marker:text-[#2FF5E0]">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-[16px] leading-[1.8] text-white/70">
            {b.text}
          </p>
        )
      })}
    </div>
  )
}
