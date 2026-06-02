'use client'
import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const COLORS = {
  cyan: new THREE.Color('#00E5FF'),
  violet: new THREE.Color('#7C3AED'),
  magenta: new THREE.Color('#FF2BD6'),
}

const COLOR_SEQ = [COLORS.cyan, COLORS.violet, COLORS.magenta]

// Torus knot principal — neon tube iridiscente
function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const colorIdx = useRef(0)
  const colorT = useRef(0)
  const cur = useRef(COLOR_SEQ[0].clone())
  const tgt = useRef(COLOR_SEQ[1].clone())
  const { gl } = useThree()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
      mouse.current.y = -((e.clientY - r.top) / r.height) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [gl])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    const mat = matRef.current
    if (!mesh || !mat) return

    // Auto-rotate + mouse tilt
    mesh.rotation.y += delta * 0.4
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, mouse.current.y * 0.3, delta * 2)
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, mouse.current.x * 0.2, delta * 2)

    // Color cycle
    colorT.current += delta * 0.3
    if (colorT.current >= 1) {
      colorT.current = 0
      colorIdx.current = (colorIdx.current + 1) % COLOR_SEQ.length
      cur.current.copy(COLOR_SEQ[colorIdx.current])
      tgt.current.copy(COLOR_SEQ[(colorIdx.current + 1) % COLOR_SEQ.length])
    }
    const blended = cur.current.clone().lerp(tgt.current, colorT.current)
    mat.color.set(blended)
    mat.emissive.set(blended)
    mat.emissiveIntensity = 0.6 + Math.sin(Date.now() * 0.002) * 0.2
  })

  return (
    <mesh ref={meshRef}>
      {/* p=2, q=3 → nudo de trébol elegante */}
      <torusKnotGeometry args={[1.1, 0.32, 256, 32, 2, 3]} />
      <meshStandardMaterial
        ref={matRef}
        color="#00E5FF"
        emissive="#00E5FF"
        emissiveIntensity={0.6}
        roughness={0.05}
        metalness={0.95}
        envMapIntensity={1}
      />
    </mesh>
  )
}

// Anillo orbital que gira en eje diferente
function OrbitalRing({ radius, rotSpeed, color, tilt }: {
  radius: number
  rotSpeed: number
  color: string
  tilt: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * rotSpeed
  })
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.012, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        roughness={0}
        metalness={1}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

// Campo de partículas flotantes
function ParticleField() {
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  const ref = useRef<THREE.Points>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08
      ref.current.rotation.x += delta * 0.03
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#00E5FF"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

export default function Orb3D() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div
      className="w-[340px] h-[340px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px] pointer-events-none select-none"
      style={{ background: 'transparent' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ background: 'transparent' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} intensity={3} color="#00E5FF" />
        <pointLight position={[-5, -3, -5]} intensity={2} color="#7C3AED" />
        <pointLight position={[0, -5, 3]} intensity={1.5} color="#FF2BD6" />

        <Float floatIntensity={0.8} rotationIntensity={0.3} speed={2}>
          <TorusKnot />

          {/* Anillos orbitales en distintos ejes */}
          <OrbitalRing radius={1.9} rotSpeed={0.6}  color="#00E5FF" tilt={[Math.PI / 2, 0, 0]} />
          <OrbitalRing radius={2.1} rotSpeed={-0.4} color="#7C3AED" tilt={[Math.PI / 4, Math.PI / 6, 0]} />
          <OrbitalRing radius={2.3} rotSpeed={0.25} color="#FF2BD6" tilt={[Math.PI / 3, Math.PI / 3, Math.PI / 5]} />
        </Float>

        <ParticleField />
      </Canvas>
    </div>
  )
}
