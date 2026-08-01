import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import next from '@next/eslint-plugin-next'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

// Los plugins se cargan DIRECTO en vez de via `compat.extends('next/core-web-vitals')`.
// Motivo: ese preset arranca con `@rushstack/eslint-patch`, que bajo el layout de symlinks de
// pnpm no reconoce el modulo que lo llama y aborta ESLint entero:
//   "Failed to patch ESLint because the calling module was not recognized"
// El sintoma es traicionero: `eslint` sale con CODIGO 0 y sin imprimir nada, o sea que el lint
// parecia pasar cuando en realidad nunca corria. Fijar eslint a ^8.57.1 en pnpm-workspace.yaml
// no alcanzo. Cargando los plugins a mano el patch nunca se ejecuta y las reglas son las mismas.
// Verificado con un archivo trampa: detecta no-unused-vars, prefer-const y no-explicit-any.
const eslintConfig = [
  ...compat.extends('next/typescript'),
  {
    plugins: { 'react-hooks': reactHooks, react, '@next/next': next },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      // Red de seguridad contra la regresión que costó ~1 día: /demos y el sitio comparten UN
      // solo root layout, así que navegar entre ellos es soft-nav con <Link>. Un <a href="/demos…">
      // fuerza full-reload y el viejo parche `hardNav` ya no existe. Ambos quedan prohibidos para
      // que nadie los reintroduzca por costumbre. Para ir a una demo: <Link href="/demos/…"> (o el
      // Link locale-aware de @/i18n/navigation).
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='hardNav']",
          message:
            'La prop `hardNav` se eliminó: /demos comparte root layout con el sitio, usá <Link> soft-nav normal.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='a'] JSXAttribute[name.name='href'] Literal[value=/^\\/(es\\/)?demos/]",
          message:
            'No uses <a href="/demos…"> (fuerza full-reload). Usá <Link href="/demos/…"> — mismo root layout, soft-nav.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='a'] JSXAttribute[name.name='href'] TemplateElement[value.raw=/^\\/(es\\/)?demos/]",
          message:
            'No uses <a href={`/demos/…`}> (fuerza full-reload). Usá <Link href={`/demos/…`}> — mismo root layout, soft-nav.',
        },
      ],
    },
  },
]

export default eslintConfig
