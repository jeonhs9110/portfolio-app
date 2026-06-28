'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Preload so the model is ready when the canvas mounts
useGLTF.preload('/hyunsik.glb');

function HyunsikModel({ scrollRef }) {
    const { scene } = useGLTF('/hyunsik.glb');
    const groupRef = useRef();

    // Vertex-color materials need lighting reactivity tweaked
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.roughness = 0.55;
                    child.material.metalness = 0.05;
                    child.material.envMapIntensity = 0.7;
                }
            }
        });
    }, [scene]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = scrollRef.current; // 0 .. 1
        const time = state.clock.elapsedTime;

        // Idle: gentle breathing + slow auto-rotation
        groupRef.current.rotation.y = time * 0.12 + t * Math.PI * 0.6;
        groupRef.current.position.y = Math.sin(time * 0.9) * 0.015 - 0.02;
    });

    return (
        <Center bottom>
            <group ref={groupRef} scale={2.2}>
                <primitive object={scene} />
            </group>
        </Center>
    );
}

function ScrollCamera({ scrollRef }) {
    const { camera } = useThree();

    useFrame(() => {
        const t = scrollRef.current; // 0 .. 1 across the first viewport
        // Dolly + slight elevation as visitor scrolls
        const distance = 2.6 + t * 1.8;
        const height = 0.05 + t * 0.6;
        const horizontal = (t - 0.5) * 0.6;

        camera.position.lerp(
            new THREE.Vector3(horizontal, height, distance),
            0.08
        );
        camera.lookAt(0, 0.08 + t * 0.1, 0);
    });

    return null;
}

function SceneLighting() {
    return (
        <>
            {/* Soft ambient for vertex-color readability */}
            <ambientLight intensity={0.55} color="#a8b8d8" />
            {/* Key light from front-upper-left */}
            <directionalLight
                position={[-3, 4, 4]}
                intensity={1.4}
                color="#fffaf0"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            {/* Brand-blue rim light from back-right */}
            <directionalLight
                position={[3.5, 1.5, -2.5]}
                intensity={0.9}
                color="#3a7aad"
            />
            {/* Subtle fill from below to lift the face */}
            <directionalLight position={[0, -1, 2]} intensity={0.25} color="#8aa6c0" />
        </>
    );
}

export default function HeroScene3D() {
    const scrollRef = useRef(0);
    const [opacity, setOpacity] = useState(1);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        // Skip the heavy 3D scene on small viewports / reduced-motion. The
        // existing aurora background + portrait card already handle that case.
        const mediaSmall = window.matchMedia('(max-width: 767px)');
        const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const decide = () => setEnabled(!mediaSmall.matches && !mediaReduce.matches);
        decide();
        mediaSmall.addEventListener('change', decide);
        mediaReduce.addEventListener('change', decide);

        const onScroll = () => {
            const vh = window.innerHeight;
            scrollRef.current = Math.min(1, window.scrollY / (vh * 0.9));
            const fadeStart = vh * 0.7;
            const fadeEnd = vh * 1.4;
            const fade =
                window.scrollY <= fadeStart
                    ? 1
                    : window.scrollY >= fadeEnd
                    ? 0
                    : 1 - (window.scrollY - fadeStart) / (fadeEnd - fadeStart);
            setOpacity(fade);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            mediaSmall.removeEventListener('change', decide);
            mediaReduce.removeEventListener('change', decide);
        };
    }, []);

    if (!enabled) return null;

    return (
        <div
            className="hero-scene-3d"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                opacity,
                transition: 'opacity 0.2s linear',
                pointerEvents: 'none',
            }}
        >
            <Canvas
                shadows
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0.1, 2.8], fov: 32 }}
                dpr={[1, 1.5]}
            >
                <Suspense fallback={null}>
                    <SceneLighting />
                    <HyunsikModel scrollRef={scrollRef} />
                    <ScrollCamera scrollRef={scrollRef} />
                    <Environment preset="city" environmentIntensity={0.4} />
                </Suspense>
            </Canvas>
        </div>
    );
}
