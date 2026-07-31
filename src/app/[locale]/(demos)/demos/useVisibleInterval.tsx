'use client'
import { useEffect, useRef } from 'react'

// setInterval que solo corre mientras la pestaña se está viendo.
//
// Los demos tienen relojes, polling y carruseles con `setInterval` permanente. Sin esto siguen
// ejecutándose con la pestaña en segundo plano: Chrome los ralentiza (clamp a 1/s, y tras unos
// minutos a ~1/min) pero no los detiene, así que se sigue gastando batería en móvil por trabajo
// que nadie ve.
//
// `runOnResume` NO es un adorno, es una cuestión de corrección. Un reloj o un poll pausados
// vuelven con datos viejos: sin esta opción el usuario ve la hora desactualizada hasta un
// segundo, o el panel muestra estado obsoleto hasta cuatro. Con ella, al volver se ejecuta una
// vez de inmediato y recién después se reanuda el ciclo.
// En cambio un carrusel NO debe usarla: dispararse al volver se ve como un salto.
//
// El disparo inmediato ocurre solo al RE-ANUDAR, nunca en el montaje inicial — los call sites
// que necesitan una carga al arrancar ya la hacen ellos mismos, y si no distinguiéramos ambos
// casos se llamaría dos veces.
export function useVisibleInterval(
  callback: () => void,
  ms: number,
  { runOnResume = false }: { runOnResume?: boolean } = {},
) {
  // El callback vive en una ref para que cambiar su identidad en cada render no reinicie el
  // intervalo (si no, un intervalo de 1s definido inline no llegaría a dispararse nunca).
  const cbRef = useRef(callback)
  cbRef.current = callback

  useEffect(() => {
    if (ms <= 0) return
    let id: ReturnType<typeof setInterval> | null = null
    let everStarted = false

    const stop = () => {
      if (id !== null) { clearInterval(id); id = null }
    }
    const sync = () => {
      if (document.visibilityState !== 'visible') { stop(); return }
      if (id !== null) return
      if (everStarted && runOnResume) cbRef.current()
      everStarted = true
      id = setInterval(() => cbRef.current(), ms)
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    return () => { stop(); document.removeEventListener('visibilitychange', sync) }
  }, [ms, runOnResume])
}
