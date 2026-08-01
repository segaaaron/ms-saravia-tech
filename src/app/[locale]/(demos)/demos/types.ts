// Idioma de las demos. Antes vivía en lang.ts junto a getDemoLang(), que resolvía el idioma
// leyendo ?lang= o la cookie NEXT_LOCALE porque las demos vivían FUERA de [locale]. Ahora las
// demos están dentro de [locale], así que el idioma sale de params.locale (server, confiable) y
// el hack desapareció; solo queda este tipo.
export type DemoLang = 'en' | 'es'
