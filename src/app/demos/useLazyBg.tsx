'use client'
import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createElement } from 'react'

// Carga diferida para fondos CSS (`background: url(...)`).
//
// El problema: un <img> tiene loading="lazy" y el navegador no lo baja hasta acercarse al
// viewport. Un `background-image` NO — en cuanto el elemento tiene layout, la petición sale,
// esté donde esté en la página. Medido en aura: 15 imágenes arrancaban todas a los 469 ms y
// saturaban la conexión, así que la propia imagen del LCP —de 10 kB— tardaba 3.6 s en pintarse.
// En brasa el hero de 93 kB tardaba 3.2 s (debería ser 0.5 s) porque las 5 fotos del carrusel
// competían, y el carrusel enseña una sola a la vez.
//
// La solución: no poner la URL en el DOM hasta que el elemento se acerca al viewport. Así el
// contenido del pliegue —el que decide el LCP— se lleva el ancho de banda entero.
//
// `rootMargin` generoso (600px) para que la imagen esté lista antes de que se vea: difiere sin
// que aparezca un hueco al scrollear.
//
// El nodo se guarda en ESTADO vía ref callback, no en un useRef. Motivo: asignar `ref.current` no
// dispara efectos. Con useRef, si el elemento observado se desmonta y vuelve a montar (en brasa el
// carrusel vive dentro de `{view === 'inicio' && ...}`), el efecto no re-corre: el observer sigue
// mirando el nodo viejo —ya desprendido, que nunca intersecta— y el nuevo no se observa nunca.
// Reproducido: entrar a brasa, ir a Carta sin bajar hasta el carrusel, volver a Inicio y bajar →
// los 5 slides quedaban como cajas de color plano, sin foto, para el resto de la sesión.
// Con estado, montar el nodo nuevo re-dispara el efecto y se observa al nodo correcto.
export function useLazyBg<T extends HTMLElement = HTMLDivElement>(rootMargin = '600px') {
  const [node, setNode] = useState<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!node || visible) return
    // Sin IntersectionObserver (o si algo falla) se muestra todo: nunca ocultar contenido.
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setVisible(true); io.disconnect() } },
      { rootMargin }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [node, visible, rootMargin])

  return [setNode, visible] as const
}

// Div cuyo `background-image` solo se setea al acercarse al viewport. Para usar dentro de .map(),
// donde no se puede llamar al hook por item. El resto de estilos (gradientes, color de base) se
// pasan por `style` y se pintan siempre, así no aparece un hueco vacío mientras carga.
// `src` acepta varias capas (se unen con coma, como en CSS): útil para una foto con otra debajo
// como fallback.
export function LazyBg({
  src,
  style,
  className,
  children,
}: {
  src: string | string[]
  style?: CSSProperties
  className?: string
  children?: ReactNode
}) {
  const [setNode, visible] = useLazyBg<HTMLDivElement>()
  const layers = (Array.isArray(src) ? src : [src]).filter(Boolean)
  return createElement(
    'div',
    {
      ref: setNode,
      className,
      style: {
        ...style,
        backgroundImage: visible ? layers.map((u) => `url("${u}")`).join(', ') : undefined,
      },
    },
    children
  )
}
