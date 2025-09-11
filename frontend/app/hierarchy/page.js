'use client'
import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

// Data: Susunan Kabinet SMOCCE 2025
const MEMBERS = [
  { id: 'ketua', role: 'Ketua', name: 'Azzahra Anisa Putri', class: 'XI-A', emoji: '👑', tier: 0 },
  { id: 'wakil', role: 'Wakil Ketua', name: 'Galang Aryo Wibowo', class: 'XI-G', emoji: '🤝', tier: 1 },
  { id: 'bendahara', role: 'Bendahara', name: 'Bagas Tirta Admaja', class: 'XI-G', emoji: '💰', tier: 2 },
  { id: 'sekretaris', role: 'Sekretaris', name: 'Poppy Angelita', class: 'XI-F', emoji: '📝', tier: 2 },
  { id: 'pro1', role: 'PRO I', name: 'Lintang Purnamasari', class: 'XI-G', emoji: '🌐', tier: 3 },
  { id: 'pro2', role: 'PRO II', name: 'Farik Akshanul Hafiz', class: 'XI-G', emoji: '📣', tier: 3 },
]

// Medieval palette
const GOLD = '#FFD700'
const GOLD_SOFT = '#ffd166'
const IVORY = '#F8F1E5'
const BURGUNDY = '#800020'
const BLUE_BG = '#0D1B2A'

const TIER_Y = [0, -1.2, -2.4, -3.6]
const positions = (() => {
  const w = 2.2
  return {
    ketua: new THREE.Vector3(0, TIER_Y[0], 0),
    wakil: new THREE.Vector3(0, TIER_Y[1], 0),
    bendahara: new THREE.Vector3(-w, TIER_Y[2], 0),
    sekretaris: new THREE.Vector3(w, TIER_Y[2], 0),
    pro1: new THREE.Vector3(-w * 1.2, TIER_Y[3], 0),
    pro2: new THREE.Vector3(w * 1.2, TIER_Y[3], 0),
  }
})()

function CameraRig({ focusedId, controlsRef }) {
  const { camera } = useThree()
  const defaultTarget = new THREE.Vector3(0, -1.2, 0)
  useFrame(() => {
    const target = focusedId ? positions[focusedId] : defaultTarget
    if (controlsRef.current) controlsRef.current.target.lerp(target, 0.08)
    const currentTarget = controlsRef.current ? controlsRef.current.target : target
    const dir = new THREE.Vector3().subVectors(camera.position, currentTarget).normalize()
    const desiredDist = focusedId ? 3.6 : 5.6
    const desiredPos = new THREE.Vector3().addVectors(currentTarget, dir.multiplyScalar(desiredDist))
    camera.position.lerp(desiredPos, 0.08)
    if (controlsRef.current) controlsRef.current.update()
  })
  return null
}

function GoldenLink({ a, b }) {
  const va = positions[a]
  const vb = positions[b]
  const mid = new THREE.Vector3().addVectors(va, vb).multiplyScalar(0.5)
  const verticalOffset = 0.35
  const sideOffset = vb.x === va.x ? 0 : (vb.x > va.x ? 0.25 : -0.25)
  const control = new THREE.Vector3(mid.x + sideOffset, mid.y + verticalOffset, mid.z)
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(va, control, vb), [va, control, vb])
  return (
    <mesh>
      <tubeGeometry args={[curve, 40, 0.02, 16, false]} />
      <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.5} metalness={0.9} roughness={0.25} />
    </mesh>
  )
}

function buildShieldShape() {
  const w = 0.6, h = 0.8
  const shape = new THREE.Shape()
  shape.moveTo(0, h * 0.5)
  shape.bezierCurveTo(-w * 0.6, h * 0.5, -w, h * 0.2, -w, 0)
  shape.lineTo(-w * 0.6, -h * 0.2)
  shape.bezierCurveTo(-w * 0.3, -h * 0.6, -0.2, -h * 0.9, 0, -h)
  shape.bezierCurveTo(0.2, -h * 0.9, w * 0.3, -h * 0.6, w * 0.6, -h * 0.2)
  shape.lineTo(w, 0)
  shape.bezierCurveTo(w, h * 0.2, w * 0.6, h * 0.5, 0, h * 0.5)
  return shape
}

function Crest({ member, selected, hovered, onHover, onClick }) {
  const base = positions[member.id]
  const group = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.position.y = base.y + Math.sin(t + base.x) * 0.04
    }
  })
  const shape = useMemo(() => buildShieldShape(), [])
  const extrude = useMemo(() => ({ depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 3 }), [])
  const glow = selected || hovered
  return (
    <group
      ref={group}
      position={[base.x, base.y, base.z]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(member.id) }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null) }}
      onClick={(e) => { e.stopPropagation(); onClick(member.id) }}
    >
      {/* Golden rim (slightly larger) */}
      <mesh position={[0, 0, -0.005]}>
        <extrudeGeometry args={[shape, extrude]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={glow ? 0.9 : 0.5} metalness={1} roughness={0.2} />
      </mesh>
      {/* Burgundy face */}
      <mesh>
        <extrudeGeometry args={[shape, extrude]} />
        <meshPhysicalMaterial
          color={BURGUNDY}
          metalness={0.4}
          roughness={0.35}
          clearcoat={0.6}
          clearcoatRoughness={0.35}
          emissive={glow ? BURGUNDY : '#000000'}
          emissiveIntensity={glow ? 0.12 : 0}
        />
      </mesh>
      {/* Inscribed text on crest */}
      <Text position={[0, 0.18, 0.06]} fontSize={0.08} color={IVORY} anchorX="center" anchorY="middle" letterSpacing={0.02}>
        {member.emoji} {member.role}
      </Text>
      <Text position={[0, 0.02, 0.06]} fontSize={0.105} color={IVORY} anchorX="center" anchorY="middle" fontWeight={700}>
        {member.name}
      </Text>
      <Text position={[0, -0.14, 0.06]} fontSize={0.07} color={IVORY} anchorX="center" anchorY="middle">
        Kelas: {member.class}
      </Text>
    </group>
  )
}

function Scene({ focusedId, hoveredId, setFocusedId, setHoveredId, controlsRef }) {
  return (
    <>
      <color attach="background" args={[BLUE_BG]} />
      <ambientLight intensity={0.35} />
      <directionalLight color={GOLD} intensity={1.2} position={[3, 5, 4]} />
      <directionalLight color={GOLD_SOFT} intensity={0.55} position={[-4, -3, -2]} />
      <Sparkles count={240} scale={[20, 8, 20]} size={1.2} speed={0.2} color={GOLD_SOFT} opacity={0.6} />

      {/* Ornamental golden vines */}
      <GoldenLink a="ketua" b="wakil" />
      <GoldenLink a="wakil" b="bendahara" />
      <GoldenLink a="wakil" b="sekretaris" />
      <GoldenLink a="bendahara" b="pro1" />
      <GoldenLink a="sekretaris" b="pro2" />

      {/* Medieval crests */}
    {MEMBERS.map((m) => (
        <Crest
          key={m.id}
          member={m}
          selected={focusedId === m.id}
      hovered={hoveredId === m.id}
          onHover={setHoveredId}
          onClick={setFocusedId}
        />
      ))}

      <CameraRig focusedId={focusedId} controlsRef={controlsRef} />
    </>
  )
}

export default function HierarchyPage() {
  const [hoveredId, setHoveredId] = useState(null)
  const [focusedId, setFocusedId] = useState(null)
  const controlsRef = useRef()

  return (
    <div className="relative min-h-[calc(100vh-0px)]" style={{ background: BLUE_BG }}>
      {/* Header */}
      <div className="relative z-10 border-b border-yellow-300/10 bg-[#0a1030]/60 px-4 py-4 text-center backdrop-blur-md">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide" style={{ color: IVORY }}>
          Hierarki Kepengurusan SMANESI Olympiad Club
        </h1>
        <p className="text-xs md:text-sm" style={{ color: 'rgba(248,241,229,0.7)' }}>
          Susunan Kabinet Periode II Masa Bakti 2024–2025
        </p>
      </div>

      {/* 3D Canvas */}
      <div className="relative h-[75vh] md:h-[78vh]">
        <Canvas camera={{ fov: 52, position: [0, -1.2, 5.8] }} dpr={[1, 2]}>
          <Scene focusedId={focusedId} hoveredId={hoveredId} setFocusedId={setFocusedId} setHoveredId={setHoveredId} controlsRef={controlsRef} />
          <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate zoomSpeed={0.8} rotateSpeed={0.8} panSpeed={0.6} />
        </Canvas>
      </div>

      {/* Decorative medieval glow and faint pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent 0px, transparent 22px, rgba(255,215,0,0.35) 22px, rgba(255,215,0,0.35) 23px), repeating-linear-gradient(-45deg, transparent 0px, transparent 22px, rgba(255,215,0,0.35) 22px, rgba(255,215,0,0.35) 23px)`
        }} />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,128,0.15), transparent 60%)' }} />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,86,0.12), transparent 60%)' }} />
      </div>
    </div>
  )
}
