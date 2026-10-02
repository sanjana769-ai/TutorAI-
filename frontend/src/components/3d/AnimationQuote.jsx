import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import quote from "../../assets/quote.jpg";

function QuotePlane() {
  const meshRef = useRef();
  const texture = useTexture(quote);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Very subtle floating effect
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.03;

    // Subtle mouse movement
    meshRef.current.rotation.y = pointer.x * 0.04;
    meshRef.current.rotation.x = -pointer.y * 0.03;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.6, 6]} />

      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function AnimationQuote() {
  return (
    <div className="animation-quote">
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 45,
        }}
        gl={{
          antialias: true,
        }}
      >
        <QuotePlane />
      </Canvas>
    </div>
  );
}