'use client'
import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// Data: Susunan Kabinet SMOCCE 2025
const MEMBERS = [
  { id: 'ketua', role: 'Ketua', name: 'Azzahra Anisa Putri', class: 'XI-A', emoji: '👑', tier: 0 },
  { id: 'wakil', role: 'Wakil Ketua', name: 'Galang Aryo Wibowo', class: 'XI-G', emoji: '🤝', tier: 1 },
  { id: 'bendahara', role: 'Bendahara', name: 'Bagas Tirta Admaja', class: 'XI-G', emoji: '💰', tier: 2 },
  { id: 'sekretaris', role: 'Sekretaris', name: 'Poppy Angelita', class: 'XI-F', emoji: '📝', tier: 2 },
  { id: 'pro1', role: 'PRO I', name: 'Lintang Purnamasari', class: 'XI-G', emoji: '🌐', tier: 3 },
  { id: 'pro2', role: 'PRO II', name: 'Farik Akshanul Hafiz', class: 'XI-G', emoji: '📣', tier: 3 },
]

const TIER_Y = [0, -1.2, -2.4, -3.6]
const BLUE_BG = '#0a1030'
const GOLD = '#f1c40f'
const GOLD_SOFT = '#ffd166'

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

function CameraRig({ focusedId }) {
  const { camera } = useThree()
  const target = focusedId ? positions[focusedId] : new THREE.Vector3(0, -1.2, 0)
  useFrame(() => {
    const to = new THREE.Vector3(target.x, target.y, 4.6)
    camera.position.lerp(to, 0.08)
    camera.lookAt(target)
  })
  return null
}

function GoldenLink({ a, b }) {
  const va = positions[a]
  const vb = positions[b]
  const dir = new THREE.Vector3().subVectors(vb, va)
  const len = dir.length()
  const mid = new THREE.Vector3().addVectors(va, vb).multiplyScalar(0.5)
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  return (
    <group>
      <mesh position={mid} quaternion={quat} scale={[1, len, 1]}>
        <cylinderGeometry args={[0.015, 0.015, 1, 16]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.45} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={va}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={GOLD_SOFT} emissive={GOLD_SOFT} emissiveIntensity={0.8} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={vb}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={GOLD_SOFT} emissive={GOLD_SOFT} emissiveIntensity={0.8} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Node({ member, selected, onHover, onClick }) {
  const ref = useRef()
  const base = positions[member.id]
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y = t * 0.2
      ref.current.position.y = base.y + Math.sin(t + base.x) * 0.06
    }
  })
  return (
    <mesh
      ref={ref}
      position={[base.x, base.y, base.z]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(member) }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null) }}
      onClick={(e) => { e.stopPropagation(); onClick(member.id) }}
    >
      <sphereGeometry args={[0.25, 48, 48]} />
      <meshStandardMaterial
        color={selected ? '#fff8e1' : '#faf6d3'}
        emissive={selected ? '#ffd166' : '#eab308'}
        emissiveIntensity={selected ? 1.2 : 0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function Scene({ focusedId, setFocusedId, setHovered }) {
  // Lights
  return (
    <>
      <color attach="background" args={[BLUE_BG]} />
      <ambientLight intensity={0.3} />
      <directionalLight color={GOLD} intensity={1.2} position={[3, 5, 4]} />
      <directionalLight color={GOLD_SOFT} intensity={0.5} position={[-4, -3, -2]} />

      {/* Sparkles for elegant golden particles */}
      <Sparkles count={220} scale={[20, 8, 20]} size={1.2} speed={0.2} color={GOLD_SOFT} opacity={0.6} />

      {/* Links */}
      <GoldenLink a="ketua" b="wakil" />
      <GoldenLink a="wakil" b="bendahara" />
      <GoldenLink a="wakil" b="sekretaris" />
      <GoldenLink a="bendahara" b="pro1" />
      <GoldenLink a="sekretaris" b="pro2" />

      {/* Nodes */}
      {MEMBERS.map((m) => (
        <Node
          key={m.id}
          member={m}
          selected={focusedId === m.id}
          onHover={setHovered}
          onClick={(id) => setFocusedId(id)}
        />
      ))}

      {/* Camera rig to smoothly focus */}
      <CameraRig focusedId={focusedId} />
    </>
  )
}

export default function HierarchyPage() {
  const [hovered, setHovered] = useState(null)
  const [focusedId, setFocusedId] = useState(null)

  return (
    <div className="relative min-h-[calc(100vh-0px)]" style={{ background: BLUE_BG }}>
      {/* Header */}
      <div className="relative z-10 border-b border-yellow-300/10 bg-[#0a1030]/60 px-4 py-4 text-center backdrop-blur-md">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide" style={{ color: '#f7f2d3' }}>
          Hierarki Kepengurusan SMANESI Olympiad Club
        </h1>
        <p className="text-xs md:text-sm" style={{ color: 'rgba(247,242,211,0.7)' }}>
          Susunan Kabinet Periode II Masa Bakti 2024–2025
        </p>
      </div>

      {/* 3D Canvas */}
      <div className="relative h-[75vh] md:h-[78vh]">
        <Canvas
          camera={{ fov: 52, position: [0, -1.2, 5.5] }}
          dpr={[1, 2]}
        >
          <Scene focusedId={focusedId} setFocusedId={setFocusedId} setHovered={setHovered} />
        </Canvas>

        {/* Tooltip overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-xl border border-yellow-300/30 bg-[#0b1438]/90 px-4 py-3 text-center shadow-2xl backdrop-blur-md"
              style={{ color: '#f7f2d3' }}
            >
              <div className="text-xs uppercase tracking-[0.12em] text-yellow-300/80">{hovered.role}</div>
              <div className="mt-1 text-base font-semibold">{hovered.name}</div>
              <div className="text-xs text-yellow-100/70">Kelas: {hovered.class}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative subtle glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,128,0.15), transparent 60%)' }} />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,86,0.12), transparent 60%)' }} />
      </div>

      {/* Legend */}
      <div className="relative z-10 mx-auto max-w-xl px-4 py-4 text-center">
        <p className="text-xs md:text-sm" style={{ color: 'rgba(247,242,211,0.8)' }}>
          Hover untuk melihat detail • Klik untuk fokus pada anggota • Garis emas menandai hubungan struktural
        </p>
      </div>
    </div>
  )
}
