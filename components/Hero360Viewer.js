'use client';

import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/jeon_landing_360.mp4';

/**
 * Photoreal 360 turntable viewer.
 *
 * A single Gemini-Veo turntable clip (10s, full rotation) is the source of
 * truth — far smoother than the 8-frame cycle it replaces, and identity-
 * consistent because every frame comes from the same generation pass.
 *
 * Behaviour:
 *   - Idle: video plays a slow loop on its own.
 *   - Mouse moves over the viewer: scrubs to that horizontal position
 *     (left edge = 0s, right edge = duration), giving a tactile "spin
 *     the figure" feel.
 *   - Cursor leaves / no movement for 1.2s: resume looping.
 *
 * The bottom 14% is masked with a linear gradient so the turntable disc
 * and the Gemini watermark dissolve into whatever sits behind the card.
 */
export default function Hero360Viewer() {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const idleTimerRef = useRef(0);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const mediaSmall = window.matchMedia('(max-width: 767px)');
        const decide = () => setEnabled(true);
        decide();
        mediaSmall.addEventListener('change', decide);

        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        let scrubbing = false;
        let cancelled = false;

        function resumeLoop() {
            if (cancelled || !video) return;
            scrubbing = false;
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        }

        function scrubTo(clientX) {
            if (!video.duration || !isFinite(video.duration)) return;
            const rect = container.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            if (!scrubbing) {
                scrubbing = true;
                video.pause();
            }
            video.currentTime = x * (video.duration - 0.05);
        }

        function onMove(e) {
            const rect = container.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom) {
                if (idleTimerRef.current) {
                    window.clearTimeout(idleTimerRef.current);
                    idleTimerRef.current = window.setTimeout(resumeLoop, 600);
                }
                return;
            }
            scrubTo(e.clientX);
            if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
            idleTimerRef.current = window.setTimeout(resumeLoop, 1200);
        }

        function onTouch(e) {
            if (e.touches && e.touches[0]) scrubTo(e.touches[0].clientX);
            if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
            idleTimerRef.current = window.setTimeout(resumeLoop, 1500);
        }

        function onLeave() {
            if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
            idleTimerRef.current = window.setTimeout(resumeLoop, 400);
        }

        window.addEventListener('mousemove', onMove, { passive: true });
        container.addEventListener('touchmove', onTouch, { passive: true });
        container.addEventListener('mouseleave', onLeave);

        const startPlay = () => {
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        };
        if (video.readyState >= 2) startPlay();
        else video.addEventListener('loadeddata', startPlay, { once: true });

        return () => {
            cancelled = true;
            window.removeEventListener('mousemove', onMove);
            container.removeEventListener('touchmove', onTouch);
            container.removeEventListener('mouseleave', onLeave);
            if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
            mediaSmall.removeEventListener('change', decide);
        };
    }, []);

    if (!enabled) return null;

    return (
        <div ref={containerRef} className="hero360-shell">
            <video
                ref={videoRef}
                src={VIDEO_SRC}
                muted
                playsInline
                loop
                preload="auto"
                aria-label="Hyunsik Jeon 360 turntable"
                className="hero360-video"
            />
            <div className="hero360-vignette" aria-hidden="true" />
            <div className="hero360-hint" aria-hidden="true">
                <span>SCRUB →</span>
            </div>

            <style jsx>{`
                .hero360-shell {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 0.75rem;
                    isolation: isolate;
                    cursor: ew-resize;
                }
                .hero360-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center center;
                    /* Mask the turntable disc + watermark at the bottom */
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black 78%,
                        rgba(0, 0, 0, 0.35) 92%,
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black 78%,
                        rgba(0, 0, 0, 0.35) 92%,
                        transparent 100%
                    );
                }
                .hero360-vignette {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background:
                        radial-gradient(
                            120% 80% at 50% 40%,
                            transparent 55%,
                            rgba(5, 10, 22, 0.55) 100%
                        );
                }
                .hero360-hint {
                    position: absolute;
                    bottom: 0.625rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.625rem;
                    letter-spacing: 0.22em;
                    color: rgba(255, 255, 255, 0.55);
                    pointer-events: none;
                    text-transform: uppercase;
                    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
                }
            `}</style>
        </div>
    );
}
