'use client';

import { useEffect } from 'react';

// Two decoupled layers:
//   - BG (motionsight): autoplays + loops on its own clock, never tied to scroll
//   - FIGURE (alpha-channel side-by-side mp4): scroll scrubs its currentTime,
//     and a canvas masks the figure on top of the bg every animation frame
const BG_SRC = '/motionsight_bg.mp4';
const FIGURE_SRC = '/jeon_figure_sbs.mp4';

// Source frame size for one half of the side-by-side mp4
const SBS_HALF_W = 1280;
const SBS_HALF_H = 720;

/**
 * Page background = a motionsight video (always playing on its own) +
 * a figure layer (scroll-scrubbed and masked via canvas compositing).
 *
 * Why side-by-side + canvas instead of an alpha-channel WebM:
 *   libvpx-vp9 on Windows ffmpeg builds doesn't reliably encode yuva420p
 *   (we tested — it silently strips alpha). The bulletproof cross-browser
 *   alternative is a 2x-wide h264 mp4 (RGB on the left, alpha as grayscale
 *   on the right) plus a canvas that composites them at runtime using
 *   destination-in.
 *
 * Scroll position drives the figure layer twice:
 *   1. SCRUB — seeks figure.currentTime so the figure rotates as we scroll.
 *   2. ZOOM — the first 70vh of scroll eases a 1.95x → 1.0x scale anchored
 *      to the top of the canvas, opening on a tight upper-body framing
 *      and easing out to head-to-toe.
 *
 * The bg has no transform — it stays full-bleed independent of the zoom.
 */
export default function Hero() {
    useEffect(() => {
        const bgEl = document.getElementById('hj-bg-motion');
        const figureEl = document.getElementById('hj-figure-video');
        const stage = document.getElementById('hj-figure-stage');
        const canvas = document.getElementById('hj-figure-canvas');
        if (!bgEl || !figureEl || !stage || !canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        const buf = document.createElement('canvas');
        let bufCtx = buf.getContext('2d', { alpha: true });

        let raf = 0;
        let lastScrubT = -1;
        let videoSeeking = false;
        let cancelled = false;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            // Display canvas matches the viewport size at DPR
            const cw = Math.round(window.innerWidth * dpr);
            const ch = Math.round(window.innerHeight * dpr);
            if (canvas.width !== cw || canvas.height !== ch) {
                canvas.width = cw;
                canvas.height = ch;
                buf.width = cw;
                buf.height = ch;
            }
        }
        resize();
        window.addEventListener('resize', resize);

        const onSeeked = () => { videoSeeking = false; };
        figureEl.addEventListener('seeked', onSeeked);

        function getProgress() {
            const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            return Math.max(0, Math.min(1, window.scrollY / totalScroll));
        }
        function getZoomProgress() {
            const span = window.innerHeight * 0.7;
            return Math.max(0, Math.min(1, window.scrollY / span));
        }

        function computeFit(videoHalfW, videoHalfH) {
            // object-fit: contain — preserve aspect ratio of one half of the SBS source
            // inside the display canvas
            const cw = canvas.width, ch = canvas.height;
            const srcA = videoHalfW / videoHalfH;
            const dstA = cw / ch;
            let dw, dh;
            if (srcA > dstA) {
                // source wider than canvas — fit by width
                dw = cw;
                dh = cw / srcA;
            } else {
                dh = ch;
                dw = ch * srcA;
            }
            return { dx: (cw - dw) / 2, dy: (ch - dh) / 2, dw, dh };
        }

        function renderFigure() {
            if (figureEl.readyState < 2) return;
            const { dx, dy, dw, dh } = computeFit(SBS_HALF_W, SBS_HALF_H);

            // Step 1 — draw the alpha mask half (right side of SBS) into the buffer
            bufCtx.globalCompositeOperation = 'source-over';
            bufCtx.clearRect(0, 0, buf.width, buf.height);
            bufCtx.drawImage(
                figureEl,
                SBS_HALF_W, 0, SBS_HALF_W, SBS_HALF_H,   // source rect: right half
                dx, dy, dw, dh                            // destination rect
            );
            // Convert the buffer's R channel (grayscale luminance) into the alpha channel,
            // because destination-in only honours alpha. After this pass the buffer holds
            // a fully-opaque RGB image with alpha varying by figure luminance.
            const img = bufCtx.getImageData(0, 0, buf.width, buf.height);
            const data = img.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i + 3] = data[i];   // alpha = R (grayscale)
            }
            bufCtx.putImageData(img, 0, 0);

            // Step 2 — draw the RGB half (left side of SBS) onto the display canvas
            ctx.globalCompositeOperation = 'copy';
            ctx.drawImage(
                figureEl,
                0, 0, SBS_HALF_W, SBS_HALF_H,
                dx, dy, dw, dh
            );

            // Step 3 — mask via destination-in using the buffer canvas (which now has alpha)
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(buf, 0, 0);
        }

        function tick() {
            if (cancelled) return;
            const dur = figureEl.duration;
            if (dur && isFinite(dur)) {
                const target = getProgress() * (dur - 0.05);
                if (!videoSeeking && Math.abs(target - lastScrubT) > 0.04) {
                    videoSeeking = true;
                    lastScrubT = target;
                    try { figureEl.currentTime = target; } catch (e) { videoSeeking = false; }
                }
            }
            renderFigure();
            const z = getZoomProgress();
            const zoom = 1.95 - z * 0.95;
            stage.style.setProperty('--zoom', String(zoom));
            raf = requestAnimationFrame(tick);
        }

        const startFigure = () => {
            figureEl.pause();
            tick();
        };
        if (figureEl.readyState >= 1) startFigure();
        else figureEl.addEventListener('loadedmetadata', startFigure, { once: true });

        const startBg = () => {
            const p = bgEl.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        };
        if (bgEl.readyState >= 2) startBg();
        else bgEl.addEventListener('loadeddata', startBg, { once: true });

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            figureEl.removeEventListener('seeked', onSeeked);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <>
            <div id="hj-bg-container" aria-hidden="true">
                {/* Background motionsight video — autoplays, loops, ignores scroll */}
                <video
                    id="hj-bg-motion"
                    src={BG_SRC}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="hj-bg-motion"
                />
                {/* Figure source — hidden, fed to canvas, scroll-scrubbed */}
                <video
                    id="hj-figure-video"
                    src={FIGURE_SRC}
                    muted
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    className="hj-figure-source"
                />
                {/* Figure canvas — masked figure rendered here, gets the zoom transform */}
                <div id="hj-figure-stage">
                    <canvas id="hj-figure-canvas" />
                </div>
                {/* Thin dim layer between bg+figure and the page content */}
                <div id="hj-bg-tint" />
            </div>

            <section id="hero" className="hj-spacer" />

            <style jsx global>{`
                #hj-bg-container {
                    position: fixed;
                    inset: 0;
                    z-index: -10;
                    overflow: hidden;
                    background: #04060f;
                }

                .hj-bg-motion {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center center;
                }

                .hj-figure-source {
                    position: absolute;
                    left: -99999px;
                    top: -99999px;
                    width: 1px;
                    height: 1px;
                    opacity: 0;
                    pointer-events: none;
                }

                #hj-figure-stage {
                    position: absolute;
                    inset: 0;
                    --zoom: 1.95;
                    transform: scale(var(--zoom));
                    transform-origin: 50% 0%;
                    will-change: transform;
                }
                #hj-figure-canvas {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    /* Same bottom-fade as before so any tiny stray turntable disc
                       still attached to the figure dissolves into the bg. */
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black 78%,
                        rgba(0, 0, 0, 0.4) 92%,
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        black 0%,
                        black 78%,
                        rgba(0, 0, 0, 0.4) 92%,
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
                            rgba(5, 8, 17, 0.20) 0%,
                            rgba(5, 8, 17, 0.50) 100%
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
