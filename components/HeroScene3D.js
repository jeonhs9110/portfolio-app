'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

useGLTF.preload('/hyunsik.glb');

function HyunsikModel({ mouseRef, onLandingRef }) {
    const { scene } = useGLTF('/hyunsik.glb');
    const orientRef = useRef();   // outer: fixes upright orientation
    const spinRef = useRef();     // inner: mouse-driven Y rotation

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                if (child.material) {
                    child.material.roughness = 0.55;
                    child.material.metalness = 0.05;
                    child.material.envMapIntensity = 0.8;
                }
            }
        });
    }, [scene]);

    useFrame((state, delta) => {
        if (!spinRef.current) return;
        const time = state.clock.elapsedTime;

        // Target rotation: idle drift + mouse-driven horizontal lean.
        // When the visitor leaves the landing page, mouseRef is forced to 0
        // (returns to neutral spin).
        const onLanding = onLandingRef.current;
        const targetMouseRot = onLanding ? mouseRef.current * 0.9 : 0; // ~ +/- 50°
        const idleDrift = time * 0.10;
        const desired = idleDrift + targetMouseRot;

        // Smooth easing toward desired rotation
        const current = spinRef.current.rotation.y;
        const next = current + (desired - current) * Math.min(1, delta * 4);
        spinRef.current.rotation.y = next;

        // Subtle breathing
        spinRef.current.position.y = Math.sin(time * 0.9) * 0.018;
    });

    return (
        <Center>
            {/* Outer: rotate -90 around Z so TripoSR's X-axis (height) maps to world Y */}
            <group ref={orientRef} rotation={[0, 0, -Math.PI / 2]}>
                {/* Inner: dynamic Y rotation around the figure's spine */}
                <group ref={spinRef} scale={2.0}>
                    <primitive object={scene} />
                </group>
            </group>
        </Center>
    );
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
    const mouseRef = useRef(0);       // -1 .. +1, horizontal mouse fraction
    const onLandingRef = useRef(true); // true only while scrollY < first viewport
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const mediaSmall = window.matchMedia('(max-width: 767px)');
        const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const decide = () => setEnabled(!mediaSmall.matches && !mediaReduce.matches);
        decide();
        mediaSmall.addEventListener('change', decide);
        mediaReduce.addEventListener('change', decide);

        const onMouse = (e) => {
            // Map cursor X across the whole viewport to -1..+1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current = Math.max(-1, Math.min(1, x));
        };
        const onScroll = () => {
            // Mouse interaction only applies while user is on the landing viewport
            onLandingRef.current = window.scrollY < window.innerHeight * 0.85;
        };
        onScroll();
        window.addEventListener('mousemove', onMouse, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('mousemove', onMouse);
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
                    <HyunsikModel mouseRef={mouseRef} onLandingRef={onLandingRef} />
                    <Environment preset="city" environmentIntensity={0.4} />
                </Suspense>
            </Canvas>
        </div>
    );
}
