'use client'
import { useEffect, useRef } from 'react'
import { m, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

export default function Spotlight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 80, damping: 25, restDelta: 0.001 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25, restDelta: 0.001 })

  // Build reactive CSS background string using useMotionTemplate
  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(0,229,255,0.06), transparent 70%)`

  useEffect(() => {
    // Only enable on non-touch/pointer-fine devices
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const parent = containerRef.current?.parentElement
    if (!parent) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    parent.addEventListener('mousemove', handleMouseMove)
    return () => parent.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <m.div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ background, zIndex: 0 }}
    />
  )
}
