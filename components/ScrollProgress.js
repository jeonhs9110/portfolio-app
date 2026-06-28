'use client';

import { useEffect, useState } from 'react';

/**
 * Thin scroll-progress bar pinned to the very top of the viewport.
 * Width grows from 0 → 100% as the visitor moves through the page,
 * gives orientation on a single-page site without competing with the
 * fixed navbar 64px below it.
 */
export default function ScrollProgress() {
    const [pct, setPct] = useState(0);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            raf = 0;
            const doc = document.documentElement;
            const total = Math.max(1, doc.scrollHeight - window.innerHeight);
            setPct(Math.max(0, Math.min(1, window.scrollY / total)));
        };
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: `${pct * 100}%`,
                height: '2px',
                zIndex: 200,
                background: 'linear-gradient(90deg, #93c5fd, #67e8f9 50%, #ffffff)',
                boxShadow: '0 0 12px rgba(147, 197, 253, 0.55)',
                pointerEvents: 'none',
                transition: 'width 80ms linear',
            }}
        />
    );
}
