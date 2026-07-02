// Single source of truth for social links.
// Rendered by <Footer /> (icons) AND emitted as Organization `sameAs` by <JsonLd />.
// Entries with href === null are HIDDEN and excluded from sameAs.
// To enable: set a real profile URL (e.g. 'https://www.linkedin.com/company/...').

export type SocialKey = 'email' | 'github' | 'linkedin'

export type Social = { key: SocialKey; label: string; href: string | null }

export const SOCIALS: Social[] = [
  { key: 'email', label: 'Email', href: 'mailto:techstackmssaravia@gmail.com' },
  { key: 'github', label: 'GitHub', href: null },
  { key: 'linkedin', label: 'LinkedIn', href: null },
]

// Only real, public profile URLs (no mailto) — used for Organization sameAs.
export const SAME_AS: string[] = SOCIALS.filter(
  (s): s is Social & { href: string } =>
    s.href !== null && !s.href.startsWith('mailto:'),
).map((s) => s.href)
