'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'

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
  const cameraRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.current.x = x
      pointer.current.y = -y
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ camera }) => {
    // store camera ref once
    if (!cameraRef.current) cameraRef.current = camera
    const tx = pointer.current.x * 0.6
    const ty = pointer.current.y * 0.35
    camera.position.x += (tx - camera.position.x) * 0.05
    camera.position.y += (ty - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
    if (rig.current) {
      rig.current.rotation.z += 0.0008
    }
  })

  return (
    <group ref={rig}>
      <color attach="background" args={[ '#070314' ]} />
      <ambientLight intensity={0.2} />
  {/* Dense round stars cloud */}
  <StarLayer count={1800} radius={28} color="#CFE8FF" size={0.05} rotateSpeed={0.015} />
  <StarLayer count={1200} radius={18} color="#9AC6FF" size={0.06} rotateSpeed={-0.02} />
  {/* A thin distant stars layer using drei Stars (perfectly circular points) */}
  <Stars radius={50} depth={25} count={1000} factor={2} saturation={0} fade speed={0.4} />
    </group>
  )
}

export default function GalaxyBackground() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <Scene />
    </Canvas>
  )
}
