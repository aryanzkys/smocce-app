'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef } from 'react'

function NeonSphere({ color = '#00E5FF', position = [0, 0, 0], scale = 1, speed = 0.2 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * speed
    ref.current.rotation.y += delta * (speed * 0.7)
  })
  return (
    <Float speed={1} floatIntensity={0.8} rotationIntensity={0.25}>
      <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  )
}

function NeonRing({ color = '#7C4DFF', position = [0, 0, 0], scale = 1, speed = 0.3 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * speed
  })
  return (
    <Float speed={1} floatIntensity={0.6} rotationIntensity={0.3}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[1.2, 0.03, 32, 128]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.4} roughness={0.1} />
      </mesh>
    </Float>
  )
}

export default function NeonBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={[ '#030712' ]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={1.2} color={'#00E5FF'} />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color={'#7C4DFF'} />
      <gridHelper args={[40, 40, '#1DE9B6', '#0A192F']} position={[0, -2.5, 0]} />
      <NeonSphere color="#00E5FF" position={[-4, 1.2, -2]} scale={1.1} speed={0.25} />
      <NeonSphere color="#1DE9B6" position={[3.2, -0.6, -1.5]} scale={0.9} speed={0.18} />
      <NeonRing color="#7C4DFF" position={[0.2, 2.2, -2]} scale={1.1} speed={0.36} />
      <NeonRing color="#00E5FF" position={[-2.5, -1.8, -1.2]} scale={0.9} speed={0.28} />
    </Canvas>
  )
}
