import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, Stars, Float } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Floor } from '../content/types'

export interface TowerFloorState {
  floor: Floor
  status: 'locked' | 'open' | 'current' | 'done'
  pct: number
}

const GAP = 1.5
const RADIUS = 2.3

function Platform({ s, index, onSelect, hovered, setHovered }: {
  s: TowerFloorState
  index: number
  onSelect: (id: number) => void
  hovered: number | null
  setHovered: (id: number | null) => void
}) {
  const ring = useRef<THREE.Mesh>(null)
  const y = index * GAP
  const color = new THREE.Color(s.status === 'locked' ? '#334155' : s.floor.color)
  const isHover = hovered === s.floor.id
  const emissive = s.status === 'done' ? 0.9 : s.status === 'current' ? 0.6 : s.status === 'open' ? 0.35 : 0.04

  useFrame(({ clock }) => {
    if (!ring.current) return
    const m = ring.current.material as THREE.MeshStandardMaterial
    const pulse = s.status === 'current' ? 0.5 + Math.sin(clock.elapsedTime * 3) * 0.5 : 1
    m.emissiveIntensity = emissive * (s.status === 'current' ? 0.6 + pulse * 0.8 : 1) + (isHover ? 0.5 : 0)
    ring.current.rotation.z = clock.elapsedTime * 0.15 * (index % 2 ? 1 : -1)
  })

  return (
    <group position={[0, y, 0]}>
      {/* floor slab */}
      <mesh
        rotation={[0, (index * Math.PI) / 8, 0]}
        onClick={(e) => { e.stopPropagation(); if (s.status !== 'locked') onSelect(s.floor.id) }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(s.floor.id); document.body.style.cursor = s.status === 'locked' ? 'not-allowed' : 'pointer' }}
        onPointerOut={() => { setHovered(null); document.body.style.cursor = '' }}
      >
        <cylinderGeometry args={[RADIUS, RADIUS * 1.04, 0.22, 8]} />
        <meshStandardMaterial color={s.status === 'locked' ? '#1e293b' : '#0f172a'} metalness={0.6} roughness={0.35} transparent opacity={0.92} />
      </mesh>
      {/* glowing rim showing progress */}
      <mesh ref={ring} position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS * 0.98, 0.045, 12, 64, Math.PI * 2 * Math.max(0.04, s.status === 'locked' ? 1 : Math.max(s.pct, 0.08))]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissive} toneMapped={false} />
      </mesh>
      {/* label */}
      <FloorLabel s={s} highlight={isHover} />
    </group>
  )
}

const LABEL_ANCHOR = new THREE.Vector2(0, 0.5)

/** Floor label drawn to a canvas texture and shown as a camera-facing sprite. */
function FloorLabel({ s, highlight }: { s: TowerFloorState; highlight: boolean }) {
  const locked = s.status === 'locked'
  const icon = locked ? '🔒' : s.floor.icon
  const text = `${icon}  ${s.floor.id}. ${s.floor.title}`
  const suffix = s.status === 'done' ? '  ✓' : s.status === 'current' ? `  ${Math.round(s.pct * 100)}%` : ''
  const { tex, aspect } = useMemo(() => {
    const k = 2
    const font = `600 ${26 * k}px Inter, "Segoe UI Emoji", system-ui, sans-serif`
    const c = document.createElement('canvas')
    const g = c.getContext('2d')!
    g.font = font
    const textW = g.measureText(text).width
    const w = Math.ceil(textW + g.measureText(suffix).width) + 40 * k
    const h = 52 * k
    c.width = w
    c.height = h
    g.font = font
    g.fillStyle = locked ? 'rgba(15,23,42,0.72)' : 'rgba(15,23,42,0.9)'
    g.beginPath(); g.roundRect(0, 0, w, h, 14 * k); g.fill()
    if (highlight) { g.strokeStyle = '#38bdf8'; g.lineWidth = 3 * k; g.stroke() }
    g.fillStyle = locked ? '#475569' : s.floor.color
    g.fillRect(0, 8 * k, 5 * k, h - 16 * k)
    g.textBaseline = 'middle'
    g.fillStyle = locked ? '#64748b' : '#ffffff'
    g.fillText(text, 18 * k, h / 2 + k)
    if (suffix) {
      g.fillStyle = s.status === 'done' ? '#34d399' : '#fcd34d'
      g.fillText(suffix, 18 * k + textW, h / 2 + k)
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return { tex: t, aspect: w / h }
  }, [locked, text, suffix, s.floor.color, s.status, highlight])
  const height = typeof window !== 'undefined' && window.innerWidth < 700 ? 0.58 : 0.42
  return (
    <sprite position={[RADIUS + 0.4, 0.2, 0]} scale={[height * aspect, height, 1]} center={LABEL_ANCHOR}>
      <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  )
}

function SpiralLadder({ floors }: { floors: number }) {
  const steps = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number }[] = []
    const per = 8
    for (let f = 0; f < floors - 1; f++) {
      for (let i = 0; i < per; i++) {
        const t = (f * per + i) / per
        const angle = t * Math.PI * 0.9
        arr.push({ pos: [Math.cos(angle) * (RADIUS + 0.25), t * GAP + 0.1, Math.sin(angle) * (RADIUS + 0.25)], rot: -angle })
      }
    }
    return arr
  }, [floors])
  return (
    <group>
      {steps.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, s.rot, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.18]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function Avatar({ level }: { level: number }) {
  const ref = useRef<THREE.Group>(null)
  const target = level * GAP + 0.55
  useFrame(({ clock }, dt) => {
    if (!ref.current) return
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target + Math.sin(clock.elapsedTime * 2) * 0.08, 3, dt)
    const a = clock.elapsedTime * 0.4
    ref.current.position.x = Math.cos(a) * (RADIUS * 0.55)
    ref.current.position.z = Math.sin(a) * (RADIUS * 0.55)
  })
  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.26, 1]} />
        <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={1.6} toneMapped={false} flatShading />
      </mesh>
      <pointLight color="#fbbf24" intensity={6} distance={4} />
      <Sparkles count={16} scale={0.9} size={3} speed={0.6} color="#fde68a" />
    </group>
  )
}

export default function Tower3D({ states, currentIndex, onSelect }: {
  states: TowerFloorState[]
  currentIndex: number
  onSelect: (id: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const focusY = currentIndex * GAP
  // Labels sit to the right of the tower, so aim slightly right of center (more on narrow screens).
  const narrow = typeof window !== 'undefined' && window.innerWidth < 700
  const shift = (narrow ? 1.9 : 0.9) / Math.SQRT2
  const dist = narrow ? 1.55 : 1
  const target: [number, number, number] = [shift, focusY + 1.6, -shift]
  const top = (states.length - 1) * GAP

  return (
    <Canvas camera={{ position: [shift + 10 * dist, focusY + 1.6 + 2.9 * dist, -shift + 10 * dist], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={['#060914']} />
      <fog attach="fog" args={['#060914', 14, 30]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 12, 6]} intensity={1.2} />
      <Stars radius={60} depth={30} count={2500} factor={3} fade speed={reduced ? 0 : 0.6} />

      {/* central data spine */}
      <mesh position={[0, top / 2, 0]}>
        <cylinderGeometry args={[0.35, 0.5, top + 1.2, 24]} />
        <meshStandardMaterial color="#1e293b" emissive="#38bdf8" emissiveIntensity={0.15} metalness={0.9} roughness={0.2} />
      </mesh>

      {states.map((s, i) => (
        <Platform key={s.floor.id} s={s} index={i} onSelect={onSelect} hovered={hovered} setHovered={setHovered} />
      ))}
      <SpiralLadder floors={states.length} />
      <Avatar level={currentIndex} />

      {/* crown: certificate trophy on top */}
      <Float speed={reduced ? 0 : 2} floatIntensity={0.6}>
        <mesh position={[0, top + 1.3, 0]}>
          <octahedronGeometry args={[0.45]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={states.every((s) => s.status === 'done') ? 2 : 0.4} metalness={1} roughness={0.15} toneMapped={false} />
        </mesh>
      </Float>
      <Sparkles count={60} scale={[8, top + 4, 8]} position={[0, top / 2, 0]} size={2} speed={0.3} color="#7dd3fc" />

      <OrbitControls
        target={target}
        enablePan={false}
        minDistance={7}
        maxDistance={28}
        maxPolarAngle={Math.PI / 1.9}
        autoRotate={!reduced && hovered === null}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
