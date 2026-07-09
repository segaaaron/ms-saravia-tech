import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// APIs de navegación conscientes del locale (setean cookie NEXT_LOCALE + arman la URL correcta).
// Usar estas en client components para cambiar de idioma, no `next/navigation` crudo.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
