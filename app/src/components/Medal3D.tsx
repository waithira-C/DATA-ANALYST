import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function faceTexture(icon: string, color: string, locked: boolean) {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(256, 200, 40, 256, 256, 256)
  grad.addColorStop(0, locked ? '#475569' : '#ffffff')
  grad.addColorStop(0.35, locked ? '#334155' : color)
  grad.addColorStop(1, locked ? '#1e293b' : '#1f2937')
  g.fillStyle = grad
  g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill()
  g.strokeStyle = '#ffffff55'; g.lineWidth = 14
  g.beginPath(); g.arc(256, 256, 220, 0, Math.PI * 2); g.stroke()
  g.font = '230px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'
  g.textAlign = 'center'; g.textBaseline = 'middle'
  g.globalAlpha = locked ? 0.35 : 1
  g.fillText(locked ? '🔒' : icon, 256, 270)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Coin({ icon, color, locked }: { icon: string; color: string; locked: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const tex = useMemo(() => faceTexture(icon, color, locked), [icon, color, locked])
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * (locked ? 0.3 : 1.1) })
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.16, 64]} />
        <meshStandardMaterial color={locked ? '#475569' : color} metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.081]}>
        <circleGeometry args={[1.12, 64]} />
        <meshStandardMaterial map={tex} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.081]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[1.12, 64]} />
        <meshStandardMaterial map={tex} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <torusGeometry args={[0.18, 0.05, 12, 32]} />
        <meshStandardMaterial color={locked ? '#475569' : color} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function Medal3D({ icon, color, locked }: { icon: string; color: string; locked: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <pointLight position={[-3, -2, 3]} intensity={20} color="#7dd3fc" />
      <pointLight position={[3, 2, 2]} intensity={15} color="#fde68a" />
      <Float speed={2} floatIntensity={0.5} rotationIntensity={0.2}>
        <Coin icon={icon} color={color} locked={locked} />
      </Float>
      {!locked && <Sparkles count={40} scale={3.5} size={3} speed={0.5} color={color} />}
    </Canvas>
  )
}
