'use client'

/* ============================================================================
   SAVERA GT — escena 3D scroll-driven (React Three Fiber + drei).
   Auto procedural (sin .glb externo): carrocería + 2 puertas ala-de-gaviota +
   cubierta de motor + alerón retráctil + 4 ruedas, todo en meshes separados y
   riggeados para ABRIRSE de verdad según el progreso de scroll.

   El progreso (0→1) NO viaja por React state: llega en un ref mutable y se lee
   dentro de useFrame. Así el scroll no dispara re-renders — solo mueve la cámara
   y el rig del auto en el hilo de rAF (que además se congela con la pestaña de
   fondo, y lo pausamos por IntersectionObserver cuando el stage sale de pantalla
   vía la prop `active` → frameloop 'never').
   ============================================================================ */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, RoundedBox, MeshReflectorMaterial } from '@react-three/drei'
import { useEffect, useMemo, useRef, Suspense, type MutableRefObject } from 'react'
import * as THREE from 'three'

const ROSSO = '#cc0a12'
const ROSSO_HOT = '#ff2800'

/* ---- utilidades de interpolación (0 alloc en el hot-path) ------------------- */
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

/* Keyframes de cámara: una toma por fase. Se interpola posición + punto de mira
   con smoothstep entre el par de keyframes que rodea al progreso actual. El auto
   mira a lo largo de +X (frente), ancho en Z, alto en Y; motor V12 al fondo (−X). */
type Key = { p: number; pos: [number, number, number]; look: [number, number, number] }
const CAM: Key[] = [
  { p: 0.0, pos: [5.7, 1.45, 5.5], look: [0.2, 0.55, 0] }, // hero — 3/4 frontal bajo, cinematográfico
  { p: 0.26, pos: [2.5, 1.95, 4.3], look: [0.35, 1.05, 0.1] }, // F1 puertas/cabina, cerca
  { p: 0.52, pos: [-3.7, 2.25, 4.1], look: [-1.35, 0.95, 0] }, // F2 motor, 3/4 trasero alto
  { p: 0.76, pos: [-5.0, 1.05, 4.7], look: [-1.35, 0.72, 0] }, // F3 chasis/aero, rasante trasero
  { p: 1.0, pos: [6.3, 2.4, 6.7], look: [0, 0.6, 0] }, // cierre — plano beauty amplio
]

const _pos = new THREE.Vector3()
const _look = new THREE.Vector3()
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()

function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera } = useThree()
  useFrame((state) => {
    const p = clamp01(progress.current)
    // segmento activo
    let i = 0
    while (i < CAM.length - 2 && p > CAM[i + 1].p) i++
    const a = CAM[i]
    const b = CAM[i + 1]
    const seg = smoothstep(a.p, b.p, p)
    _a.set(...a.pos); _b.set(...b.pos); _pos.copy(_a).lerp(_b, seg)
    _a.set(...a.look); _b.set(...b.look); _look.copy(_a).lerp(_b, seg)
    // deriva idle sutil: da vida al plano sin depender del scroll (barato, rAF ya activo)
    const t = state.clock.elapsedTime
    _pos.x += Math.sin(t * 0.35) * 0.12
    _pos.y += Math.sin(t * 0.5) * 0.06
    camera.position.copy(_pos)
    camera.lookAt(_look)
  })
  return null
}

/* ---- Rueda reutilizable (neumático + llanta multi-radio + disco + caliper) --- */
function Wheel({ position }: { position: [number, number, number] }) {
  const spokes = useMemo(() => Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), [])
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/* neumático */}
      <mesh>
        <cylinderGeometry args={[0.44, 0.44, 0.34, 40]} />
        <meshStandardMaterial color="#0b0b0d" roughness={0.82} metalness={0.05} />
      </mesh>
      {/* aro exterior de la llanta */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.36, 36]} />
        <meshStandardMaterial color="#d7dade" roughness={0.24} metalness={0.9} />
      </mesh>
      {/* radios */}
      {spokes.map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.16, 0.19, Math.sin(a) * 0.16]} rotation={[0, -a, 0]}>
          <boxGeometry args={[0.09, 0.04, 0.3]} />
          <meshStandardMaterial color="#b9bdc4" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}
      {/* disco carbo-cerámico + caliper Rosso (estilo Brembo, ficticio) */}
      <mesh position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.55} metalness={0.6} />
      </mesh>
      <mesh position={[0.16, 0.2, 0.02]}>
        <boxGeometry args={[0.1, 0.16, 0.12]} />
        <meshStandardMaterial color={ROSSO} emissive={ROSSO} emissiveIntensity={0.25} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* tapa central */}
      <mesh position={[0, 0.205, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 20]} />
        <meshStandardMaterial color={ROSSO} roughness={0.35} metalness={0.5} />
      </mesh>
    </group>
  )
}

function Car({ progress }: { progress: MutableRefObject<number> }) {
  const doorL = useRef<THREE.Group>(null)
  const doorR = useRef<THREE.Group>(null)
  const engine = useRef<THREE.Group>(null)
  const wing = useRef<THREE.Group>(null)
  const wingFoil = useRef<THREE.Group>(null)

  // Materiales compartidos (una instancia reusada en varios meshes) → menos objetos
  // en GPU y control explícito de dispose al desmontar (R3F no libera lo que no creó él).
  const mats = useMemo(() => {
    const paint = new THREE.MeshPhysicalMaterial({
      color: ROSSO, metalness: 0.6, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 1.1,
    })
    const paintDark = new THREE.MeshPhysicalMaterial({
      color: '#8f0910', metalness: 0.6, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 1,
    })
    const carbon = new THREE.MeshStandardMaterial({ color: '#141418', metalness: 0.55, roughness: 0.42, envMapIntensity: 0.8 })
    const glass = new THREE.MeshPhysicalMaterial({ color: '#07080d', metalness: 0.9, roughness: 0.06, envMapIntensity: 1.4, clearcoat: 1 })
    const chrome = new THREE.MeshStandardMaterial({ color: '#c9ccd2', metalness: 0.95, roughness: 0.2 })
    const head = new THREE.MeshStandardMaterial({ color: '#dfe9ff', emissive: '#bcd2ff', emissiveIntensity: 1.6, roughness: 0.3 })
    const tail = new THREE.MeshStandardMaterial({ color: ROSSO_HOT, emissive: ROSSO_HOT, emissiveIntensity: 2.2, roughness: 0.4 })
    const engineBlk = new THREE.MeshStandardMaterial({ color: '#1a1a1f', metalness: 0.7, roughness: 0.45 })
    return { paint, paintDark, carbon, glass, chrome, head, tail, engineBlk }
  }, [])

  useEffect(() => () => { Object.values(mats).forEach((m) => m.dispose()) }, [mats])

  useFrame(() => {
    const p = clamp01(progress.current)
    const door = smoothstep(0.14, 0.34, p)   // F1: puertas ala-de-gaviota
    const hood = smoothstep(0.42, 0.6, p)     // F2: cubierta de motor
    const w = smoothstep(0.66, 0.84, p)       // F3: alerón retráctil sube
    if (doorL.current) doorL.current.rotation.x = -door * 1.12
    if (doorR.current) doorR.current.rotation.x = door * 1.12
    if (engine.current) engine.current.rotation.z = hood * 0.85
    if (wing.current) wing.current.position.y = 0.62 + w * 0.6
    if (wingFoil.current) wingFoil.current.rotation.z = -w * 0.22 // gana ángulo de ataque al subir
  })

  return (
    <group position={[0, 0, 0]}>
      {/* ---------- CARROCERÍA ---------- */}
      {/* cuerpo inferior largo y bajo */}
      <RoundedBox args={[4.25, 0.72, 1.82]} radius={0.2} smoothness={4} position={[-0.05, 0.56, 0]} material={mats.paint} castShadow />
      {/* morro en cuña, adelantado y descendente */}
      <RoundedBox args={[1.35, 0.42, 1.64]} radius={0.16} smoothness={4} position={[1.75, 0.44, 0]} material={mats.paint} />
      {/* flancos / pontones que envuelven las ruedas */}
      <RoundedBox args={[3.4, 0.5, 2.06]} radius={0.22} smoothness={4} position={[-0.1, 0.5, 0]} material={mats.paintDark} />
      {/* cabina adelantada — greenhouse de vidrio ahumado */}
      <RoundedBox args={[1.75, 0.62, 1.32]} radius={0.26} smoothness={4} position={[0.35, 1.08, 0]} material={mats.glass} />
      {/* pilar/techo central (línea de bisagra de las alas) */}
      <RoundedBox args={[1.7, 0.16, 0.2]} radius={0.07} smoothness={3} position={[0.35, 1.42, 0]} material={mats.carbon} />
      {/* cola truncada estilo Kamm */}
      <RoundedBox args={[0.9, 0.66, 1.78]} radius={0.18} smoothness={4} position={[-2.0, 0.66, 0]} material={mats.paint} />

      {/* ---------- AERO INFERIOR (fibra de carbono) ---------- */}
      {/* splitter delantero */}
      <mesh position={[2.35, 0.2, 0]} material={mats.carbon}><boxGeometry args={[0.5, 0.08, 1.8]} /></mesh>
      {/* faldones laterales */}
      <mesh position={[0.1, 0.2, 0.92]} material={mats.carbon}><boxGeometry args={[2.6, 0.16, 0.12]} /></mesh>
      <mesh position={[0.1, 0.2, -0.92]} material={mats.carbon}><boxGeometry args={[2.6, 0.16, 0.12]} /></mesh>
      {/* difusor trasero: aletas verticales */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((z) => (
        <mesh key={z} position={[-2.35, 0.22, z]} material={mats.carbon}><boxGeometry args={[0.55, 0.34, 0.05]} /></mesh>
      ))}

      {/* ---------- ÓPTICAS ---------- */}
      <mesh position={[2.42, 0.55, 0.5]} rotation={[0, 0, -0.35]} material={mats.head}><boxGeometry args={[0.06, 0.1, 0.42]} /></mesh>
      <mesh position={[2.42, 0.55, -0.5]} rotation={[0, 0, -0.35]} material={mats.head}><boxGeometry args={[0.06, 0.1, 0.42]} /></mesh>
      {/* franja LED trasera continua */}
      <mesh position={[-2.46, 0.72, 0]} material={mats.tail}><boxGeometry args={[0.05, 0.12, 1.5]} /></mesh>

      {/* ---------- RUEDAS ---------- */}
      <Wheel position={[1.5, 0.44, 0.94]} />
      <Wheel position={[1.5, 0.44, -0.94]} />
      <Wheel position={[-1.55, 0.44, 0.94]} />
      <Wheel position={[-1.55, 0.44, -0.94]} />

      {/* ---------- PUERTAS ALA-DE-GAVIOTA ---------- */}
      {/* La bisagra está en la línea de techo (grupo con origen ahí); la puerta cuelga
          hacia el flanco y el grupo rota sobre X para levantarla. */}
      <group ref={doorL} position={[0.35, 1.4, 0]}>
        <RoundedBox args={[1.55, 0.72, 0.08]} radius={0.1} smoothness={3} position={[0, -0.42, 0.62]} material={mats.paint} />
        <RoundedBox args={[1.4, 0.4, 0.06]} radius={0.08} smoothness={3} position={[0.05, 0.02, 0.62]} material={mats.glass} />
      </group>
      <group ref={doorR} position={[0.35, 1.4, 0]}>
        <RoundedBox args={[1.55, 0.72, 0.08]} radius={0.1} smoothness={3} position={[0, -0.42, -0.62]} material={mats.paint} />
        <RoundedBox args={[1.4, 0.4, 0.06]} radius={0.08} smoothness={3} position={[0.05, 0.02, -0.62]} material={mats.glass} />
      </group>

      {/* ---------- MOTOR V12 + CUBIERTA ---------- */}
      {/* bloque visible bajo la cubierta */}
      <group position={[-1.5, 0.72, 0]}>
        <mesh material={mats.engineBlk}><boxGeometry args={[1.0, 0.34, 1.2]} /></mesh>
        {/* dos bancadas de 6 cilindros (V12) */}
        {[-0.28, 0.28].map((z) => (
          <group key={z} position={[0, 0.2, z]} rotation={[z > 0 ? 0.3 : -0.3, 0, 0]}>
            {[-0.36, -0.14, 0.08, 0.3].map((x) => (
              <mesh key={x} position={[x, 0.05, 0]} material={mats.chrome}><cylinderGeometry args={[0.06, 0.06, 0.22, 16]} /></mesh>
            ))}
          </group>
        ))}
        {/* plenum de admisión Rosso */}
        <mesh position={[0, 0.34, 0]}><boxGeometry args={[0.7, 0.12, 0.4]} /><meshStandardMaterial color={ROSSO} metalness={0.4} roughness={0.35} /></mesh>
      </group>
      {/* cubierta con bisagra en el borde trasero (pivota sobre Z, levanta el frente) */}
      <group ref={engine} position={[-2.05, 0.92, 0]}>
        <RoundedBox args={[1.35, 0.14, 1.5]} radius={0.07} smoothness={3} position={[0.68, 0.06, 0]} material={mats.paint} />
        {/* rejilla de ventilación */}
        <mesh position={[0.68, 0.14, 0]} material={mats.carbon}><boxGeometry args={[0.7, 0.02, 0.9]} /></mesh>
      </group>

      {/* ---------- ALERÓN RETRÁCTIL ---------- */}
      <group ref={wing} position={[-2.15, 0.62, 0]}>
        <mesh position={[0, 0, 0.62]} material={mats.carbon}><boxGeometry args={[0.08, 0.5, 0.06]} /></mesh>
        <mesh position={[0, 0, -0.62]} material={mats.carbon}><boxGeometry args={[0.08, 0.5, 0.06]} /></mesh>
        <group ref={wingFoil} position={[0.02, 0.26, 0]}>
          <RoundedBox args={[0.42, 0.06, 1.62]} radius={0.03} smoothness={2} material={mats.carbon} />
          <mesh position={[-0.18, 0.02, 0]} material={mats.paint}><boxGeometry args={[0.08, 0.05, 1.6]} /></mesh>
        </group>
      </group>
    </group>
  )
}

/* Suelo de estudio: reflectante en desktop (MeshReflectorMaterial, resolución
   contenida), plano estándar en móvil. Da el aterrizaje y el charco de reflejo
   que vende el "estudio de lujo" sin depender de shadow maps en tiempo real. */
function Floor({ hq }: { hq: boolean }) {
  if (!hq) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0c0c0e" roughness={0.7} metalness={0.3} />
      </mesh>
    )
  }
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        resolution={512}
        mirror={0.55}
        blur={[420, 120]}
        mixBlur={9}
        mixStrength={2.2}
        roughness={0.85}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.3}
        color="#0a0a0c"
        metalness={0.55}
      />
    </mesh>
  )
}

export default function SaveraScene({
  progress,
  active = true,
  hq = true,
}: {
  progress: MutableRefObject<number>
  active?: boolean
  hq?: boolean
}) {
  return (
    <Canvas
      camera={{ position: [5.7, 1.45, 5.5], fov: 34 }}
      dpr={[1, hq ? 1.9 : 1.35]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {/* luz de estudio: ambiente tenue + key cálida + rim Rosso trasero para drama */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={2.3} color="#fff2e6" />
        <spotLight position={[-7, 5, -4]} angle={0.6} penumbra={0.8} intensity={90} color={ROSSO_HOT} />
        <pointLight position={[0, 3, 6]} intensity={22} color="#cfe0ff" />
        <Car progress={progress} />
        <Floor hq={hq} />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={12} blur={2.6} far={4} resolution={hq ? 512 : 256} color="#000000" />
        <Environment preset="studio" environmentIntensity={0.55} />
        <CameraRig progress={progress} />
      </Suspense>
    </Canvas>
  )
}
