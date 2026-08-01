'use client'

import { LazyMotion, domAnimation } from 'framer-motion'

// Provider único de framer-motion para TODO el árbol client (site + demos).
// En vez de `motion.*` (que empaqueta el kit completo: drag + layout projection,
// la parte más pesada de la lib) usamos `m.*` + este LazyMotion con SOLO
// `domAnimation` (animations, exit, variants, gestos hover/tap/focus, whileInView).
// Nadie en la app usa drag ni layout/layoutId, y `AnimatePresence mode="popLayout"`
// mide vía PopChild (getComputedStyle/offsetParent), independiente de las features
// de layout — así que domAnimation cubre el 100% del uso actual.
//
// `strict`: si quedara cualquier `motion.*` sin migrar a `m.*`, framer tira error
// en render (lo caza el build al prerenderizar). Es la red de seguridad de la migración.
//
// Import estático de `domAnimation` a propósito: el hero anima above-the-fold, así que
// cargar las features de forma síncrona evita un flash/delay en la animación de entrada
// (LCP). El ahorro viene de NO incluir drag + layout projection, no de diferir esto.
export default function LazyMotionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
