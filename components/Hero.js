'use client';

import { useEffect } from 'react';

// Local Gemini-Veo turntable clip — 10s, 1280x720, full 360 rotation.
const TURNTABLE_SRC = '/jeon_landing_360.mp4';

/**
 * The hero now is the page background.
 *
 * A fixed full-viewport video container plays the turntable behind every
 * section. Scroll position drives two simultaneous effects on the video:
 *
 *   1. SCRUB — early scroll plays through the rotation, so the figure
 *      spins as the visitor moves down. We seek the underlying <video>
 *      element rather than playing it, so cadence tracks scroll exactly.
 *
 *   2. ZOOM — first 60vh of scroll smoothly zooms the video out from a
 *      tight upper-body framing to the full head-to-toe view, anchored
 *      to the head so the face stays in frame the whole way.
 *
 * A 100vh spacer at the top gives the visitor room to register the
 * figure before the content sections begin overlapping it.
 */
export default function Hero() {
    useEffect(() => {
        const video = document.getElementById('hj-bg-video');
        const stage = document.getElementById('hj-bg-stage');
        if (!video || !stage) return;

        let raf = 0;
        let lastScrubT = -1;
        let videoSeeking = false;
        let cancelled = false;

        const onSeeked = () => { videoSeeking = false; };
        video.addEventListener('seeked', onSeeked);

        function getProgress() {
            const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            return Math.max(0, Math.min(1, window.scrollY / totalScroll));
        }

        function getZoomProgress() {
            // Zoom completes within the first 70% of viewport height of scroll.
            const span = window.innerHeight * 0.7;
            return Math.max(0, Math.min(1, window.scrollY / span));
        }

        function tick() {
            if (cancelled) return;
            const dur = video.duration;
            if (dur && isFinite(dur)) {
                const target = getProgress() * (dur - 0.05);
                if (!videoSeeking && Math.abs(target - lastScrubT) > 0.04) {
                    videoSeeking = true;
                    lastScrubT = target;
                    try { video.currentTime = target; } catch (e) { videoSeeking = false; }
                }
            }
            // Drive the zoom transform via a CSS variable read by .hj-bg-stage.
            // Scale anchors at the TOP of the stage (transform-origin 50% 0%),
            // so the figure's head stays pinned near the top of the viewport
            // while the rest of the body is hidden below, then drifts into view
            // as the user scrolls and zoom relaxes back to 1.
            const z = getZoomProgress();
            const zoom = 1.95 - z * 0.95;  // 1.95 → 1.00 across the first 70vh
            stage.style.setProperty('--zoom', String(zoom));
            raf = requestAnimationFrame(tick);
        }

        const startPlay = () => {
            // We never autoplay — scroll is the playhead. But touching .play()
            // some browsers requires before currentTime sticks reliably.
            video.pause();
            tick();
        };
        if (video.readyState >= 1) startPlay();
        else video.addEventListener('loadedmetadata', startPlay, { once: true });

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            video.removeEventListener('seeked', onSeeked);
        };
    }, []);

    return (
        <>
            {/* Fixed full-viewport video plays behind every section on the page. */}
            <div id="hj-bg-container" aria-hidden="true">
                <div id="hj-bg-stage">
                    <video
                        id="hj-bg-video"
                        src={TURNTABLE_SRC}
                        muted
                        playsInline
                        preload="auto"
                    />
                </div>
                {/* Dim the video just enough to keep section copy readable across the page. */}
                <div id="hj-bg-tint" />
            </div>

            {/* 100vh spacer so the visitor sees the figure before any section overlaps it. */}
            <section id="hero" className="hj-spacer" />

            <style jsx global>{`
                #hj-bg-container {
                    position: fixed;
                    inset: 0;
                    z-index: -10;
                    overflow: hidden;
                    background:
                        radial-gradient(70% 60% at 50% 35%, rgba(44, 92, 136, 0.30), transparent 70%),
                        linear-gradient(180deg, #050811 0%, #04060f 100%);
                }
                #hj-bg-stage {
                    position: absolute;
                    inset: 0;
                    --zoom: 1.95;
                    transform: scale(var(--zoom));
                    transform-origin: 50% 0%;
                    transition: none;
                    will-change: transform;
                }
                #hj-bg-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center center;
                    /* Fade the bottom ~28% of the video to transparent so the
                       turntable disc and the Gemini watermark sparkle dissolve
                       into the page background instead of being visible. */
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black 72%,
                        rgba(0, 0, 0, 0.35) 88%,
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black 72%,
                        rgba(0, 0, 0, 0.35) 88%,
                        transparent 100%
                    );
                }
                #hj-bg-tint {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background:
                        linear-gradient(
                            180deg,
                            rgba(5, 8, 17, 0.30) 0%,
                            rgba(5, 8, 17, 0.55) 100%
                        );
                }

                .hj-spacer {
                    min-height: 100vh;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                    pointer-events: none;
                }
            `}</style>
        </>
    );
}
