'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'

function randomSpherePositions(count = 1500, radius = 20) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  return positions
}

function StarLayer({ count = 1500, radius = 24, color = '#BFDFFF', size = 0.04, rotateSpeed = 0.02 }) {
  const group = useRef()
  const positions = useMemo(() => randomSpherePositions(count, radius), [count, radius])
  const materialRef = useRef()

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * rotateSpeed
      group.current.rotation.x += delta * (rotateSpeed * 0.6)
    }
    if (materialRef.current) {
      // subtle twinkle
      const t = state.clock.getElapsedTime()
      materialRef.current.size = size + Math.sin(t * 2.0) * (size * 0.15)
      materialRef.current.opacity = 0.85 + Math.sin(t * 1.7) * 0.08
    }
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={materialRef} color={color} size={size} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
    </group>
  )
}

function Scene() {
  const rig = useRef()
  const { camera, pointer } = useThree()

  useFrame(() => {
    // mouse parallax on camera
    const tx = pointer.x * 0.6
    const ty = pointer.y * 0.35
    camera.position.x += (tx - camera.position.x) * 0.05
    camera.position.y += (ty - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
    // slight rig sway
    if (rig.current) {
      rig.current.rotation.z += 0.0008
    }
  })

  return (
    <group ref={rig}>
      <color attach="background" args={[ '#070314' ]} />
      <ambientLight intensity={0.2} />
      <StarLayer count={1800} radius={28} color="#CFE8FF" size={0.05} rotateSpeed={0.015} />
      <StarLayer count={1200} radius={18} color="#9AC6FF" size={0.06} rotateSpeed={-0.02} />
      <Sparkles count={250} speed={0.4} size={2.5} scale={[40, 40, 40]} color="#88CCFF" opacity={0.6} />
      <Sparkles count={120} speed={0.25} size={3.5} scale={[30, 30, 30]} color="#FFE6AA" opacity={0.35} />
    </group>
  )
}

export default function GalaxyBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <Scene />
    </Canvas>
  )
}
