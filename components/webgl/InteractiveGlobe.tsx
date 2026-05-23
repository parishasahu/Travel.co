'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function InteractiveGlobe() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
      sphereRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#D4AF37" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#1FB4B4" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Sphere ref={sphereRef} args={[1.5, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#050505"
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={0.15}
          speed={1.5}
        />
      </Sphere>
      
      <Environment preset="night" />
    </>
  );
}
