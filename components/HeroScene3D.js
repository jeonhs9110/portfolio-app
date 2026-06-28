'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

useGLTF.preload('/hyunsik.glb');

function HyunsikModel({ scrollRef }) {
    const { scene } = useGLTF('/hyunsik.glb');
    const groupRef = useRef();

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
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
        const t = scrollRef.current; // 0..1
        const time = state.clock.elapsedTime;
        // Idle rotation + scroll-driven extra spin
        groupRef.current.rotation.y = time * 0.18 + t * Math.PI * 0.5;
        groupRef.current.position.y = Math.sin(time * 0.9) * 0.018 - 0.02;
    });

    return (
        <Center>
            <group ref={groupRef} scale={2.0}>
                <primitive object={scene} />
            </group>
        </Center>
    );
}

function ScrollCamera({ scrollRef }) {
    const { camera } = useThree();
    useFrame(() => {
        const t = scrollRef.current;
        const distance = 2.7 + t * 0.6;
        const height = 0.05 + t * 0.15;
        const horizontal = (t - 0.5) * 0.25;
        camera.position.lerp(new THREE.Vector3(horizontal, height, distance), 0.08);
        camera.lookAt(0, 0.05 + t * 0.05, 0);
    });
    return null;
}

function SceneLighting() {
    return (
        <>
            <ambientLight intensity={0.55} color="#a8b8d8" />
            <directionalLight position={[-3, 4, 4]} intensity={1.4} color="#fffaf0" />
            <directionalLight position={[3.5, 1.5, -2.5]} intensity={0.9} color="#3a7aad" />
            <directionalLight position={[0, -1, 2]} intensity={0.25} color="#8aa6c0" />
        </>
    );
}

export default function HeroScene3D() {
    const scrollRef = useRef(0);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const mediaSmall = window.matchMedia('(max-width: 767px)');
        const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const decide = () => setEnabled(!mediaSmall.matches && !mediaReduce.matches);
        decide();
        mediaSmall.addEventListener('change', decide);
        mediaReduce.addEventListener('change', decide);

        const onScroll = () => {
            const vh = window.innerHeight;
            scrollRef.current = Math.min(1, window.scrollY / (vh * 0.9));
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
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0.05, 2.8], fov: 32 }}
                dpr={[1, 1.5]}
                style={{ width: '100%', height: '100%' }}
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
