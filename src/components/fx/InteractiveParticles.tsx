'use client'
import { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseOpacity: number
}

export default function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fondo decorativo. Si el usuario pide menos movimiento → no animar. En táctil el "repel"
    // por mouse no aplica y el bucle O(n²) de conexiones drena batería: menos partículas y sin
    // líneas en pantallas coarse-pointer.
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let animId: number
    let W = window.innerWidth
    let H = window.innerHeight
    const mouse = { x: -9999, y: -9999 }
    const PARTICLE_COUNT = coarse ? 46 : 140
    const REPEL_RADIUS = 130
    const CONNECT_RADIUS = 120
    const REPEL_STRENGTH = 3.5
    const drawConnections = !coarse

    canvas.width = W
    canvas.height = H

    // Create particles
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1.5 + Math.random() * 1,
      baseOpacity: 0.2 + Math.random() * 0.3,
    }))

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }

    // El Navbar avisa cuando abre/cierra el drawer móvil. Mientras está abierto el canvas
    // queda tapado igual, así que seguir repintándolo a pantalla completa solo le roba
    // frames a la animación del panel.
    // También con la pestaña de fondo: el rAF se ralentiza pero no se detiene, y el canvas
    // seguía calculando y repintando 46 partículas para nadie.
    let menuOpen = false
    let paused = false
    const sync = () => {
      const next = menuOpen || document.visibilityState !== 'visible'
      if (next === paused) return
      paused = next
      if (paused) cancelAnimationFrame(animId)
      else animId = requestAnimationFrame(draw)
    }
    const onMenu = (e: Event) => { menuOpen = (e as CustomEvent<boolean>).detail; sync() }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    window.addEventListener('mss:menu', onMenu)
    document.addEventListener('visibilitychange', sync)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Update + draw particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS
          p.vx += (dx / dist) * force * REPEL_STRENGTH * 0.05
          p.vy += (dy / dist) * force * REPEL_STRENGTH * 0.05
        }

        // Velocity damping
        p.vx *= 0.98
        p.vy *= 0.98

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 2) { p.vx = (p.vx / speed) * 2; p.vy = (p.vy / speed) * 2 }

        // Move
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > W) { p.x = W; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > H) { p.y = H; p.vy *= -1 }

        // Opacity boost near mouse
        const nearMouse = dist < REPEL_RADIUS
        const opacity = nearMouse
          ? Math.min(1, p.baseOpacity + (1 - dist / REPEL_RADIUS) * 0.6)
          : p.baseOpacity

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = nearMouse
          ? `rgba(0,229,255,${opacity})`
          : `rgba(0,229,255,${opacity})`
        ctx.fill()

        // Draw connections (omitido en móvil: O(n²) por frame no vale la batería)
        if (drawConnections) {
          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const q = particles[j]
            const ex = p.x - q.x
            const ey = p.y - q.y
            const edist = Math.sqrt(ex * ex + ey * ey)
            if (edist < CONNECT_RADIUS) {
              const lineOpacity = (1 - edist / CONNECT_RADIUS) * 0.25
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `rgba(0,229,255,${lineOpacity})`
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mss:menu', onMenu)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -5 }}
    />
  )
}
