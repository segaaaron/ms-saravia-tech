'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import { useMemo, useRef, Suspense } from 'react'
import * as THREE from 'three'

/* Doble hélice de ADN — rungs tipo barra (esfera·cilindro·esfera) apilados. */
function Helix() {
  const group = useRef<THREE.Group>(null)
  const STEPS = 13
  const RADIUS = 1.1
  const SPACING = 0.44
  const TWIST = 0.5

  const rungs = useMemo(() => {
    const list: {
      mid: [number, number, number]
      capA: [number, number, number]
      capB: [number, number, number]
      rot: number
      len: number
      color: string
      emissive: string
    }[] = []
    for (let i = 0; i < STEPS; i++) {
      const angle = i * TWIST
      const y = i * SPACING - ((STEPS - 1) * SPACING) / 2
      const x1 = Math.cos(angle) * RADIUS
      const z1 = Math.sin(angle) * RADIUS
      const x2 = Math.cos(angle + Math.PI) * RADIUS
      const z2 = Math.sin(angle + Math.PI) * RADIUS
      const teal = i % 2 === 0
      list.push({
        mid: [(x1 + x2) / 2, y, (z1 + z2) / 2],
        capA: [x1, y, z1],
        capB: [x2, y, z2],
        rot: -angle,
        len: RADIUS * 2,
        color: teal ? '#14c3b0' : '#3a8dff',
        emissive: teal ? '#0e8f83' : '#1f5fd0',
      })
    }
    return list
  }, [])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.28
  })

  return (
    <group ref={group}>
      {rungs.map((r, i) => (
        <group key={`rung${i}`}>
          {/* barra */}
          <mesh position={r.mid} rotation={[0, r.rot, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, r.len, 16]} />
            <meshStandardMaterial
              color={r.color}
              emissive={r.emissive}
              emissiveIntensity={0.35}
              roughness={0.3}
              metalness={0.15}
            />
          </mesh>
          {/* esferas en las puntas (forman las dos hebras) */}
          {[r.capA, r.capB].map((p, k) => (
            <mesh key={k} position={p}>
              <sphereGeometry args={[0.2, 28, 28]} />
              <meshStandardMaterial
                color={r.color}
                emissive={r.emissive}
                emissiveIntensity={0.5}
                roughness={0.22}
                metalness={0.25}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default function ConsultorioScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 38 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#eaffff" />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#19c6b6" />
        <pointLight position={[4, 3, -2]} intensity={20} color="#3a8dff" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <Helix />
        </Float>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
