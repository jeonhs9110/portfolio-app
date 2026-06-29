'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Two decoupled layers:
//   - BG (Mux HLS stream): autoplays + loops on its own clock, never tied to scroll
//   - FIGURE (alpha-channel side-by-side mp4): scroll scrubs its currentTime,
//     and a canvas masks the figure on top of the bg every animation frame
const BG_HLS_SRC = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
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
    const { t } = useLanguage();

    useEffect(() => {
        const bgEl = document.getElementById('hj-bg-motion');
        const figureEl = document.getElementById('hj-figure-video');
        const stage = document.getElementById('hj-figure-stage');
        const canvas = document.getElementById('hj-figure-canvas');
        if (!bgEl || !figureEl || !stage || !canvas) return;

        // BG layer is a Mux HLS stream — Safari plays HLS natively, every other
        // browser needs hls.js. Lazy-import so it doesn't ship in the initial
        // SSR bundle, and pass enableWorker: false for Vercel edge stability.
        let hls = null;
        if (bgEl.canPlayType('application/vnd.apple.mpegurl')) {
            bgEl.src = BG_HLS_SRC;
        } else {
            import('hls.js').then(({ default: Hls }) => {
                if (!Hls.isSupported()) {
                    // Last-resort fallback: try native src and hope for the best
                    bgEl.src = BG_HLS_SRC;
                    return;
                }
                hls = new Hls({ enableWorker: false });
                hls.loadSource(BG_HLS_SRC);
                hls.attachMedia(bgEl);
            }).catch(() => {
                bgEl.src = BG_HLS_SRC;
            });
        }

        // willReadFrequently: true asks the browser to back this 2D context with
        // a software canvas optimised for getImageData calls (which we do every
        // frame to convert grayscale luminance → alpha for the figure mask).
        // Without it, Chrome logs a perf warning on the console.
        const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
        const buf = document.createElement('canvas');
        let bufCtx = buf.getContext('2d', { alpha: true, willReadFrequently: true });

        let raf = 0;
        let lastScrubT = -1;
        let videoSeeking = false;
        let cancelled = false;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            // Canvas matches the figure stage box (which is shifted down to sit
            // BELOW the slogan), not the whole viewport — so the figure renders
            // at native resolution into that smaller box instead of being
            // upscaled past the source's 720p pixel density.
            const rect = stage.getBoundingClientRect();
            const cw = Math.max(1, Math.round(rect.width * dpr));
            const ch = Math.max(1, Math.round(rect.height * dpr));
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

            // Fade the recruiter-facing identity badge out across the first 60vh
            // of scroll, so it owns the landing view but quietly steps aside as
            // soon as the visitor commits to reading the page.
            const badge = document.getElementById('hj-hero-badge');
            if (badge) {
                const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.6));
                badge.style.opacity = String(fade);
                badge.style.pointerEvents = fade > 0.05 ? 'auto' : 'none';
            }
            // Same fade curve for the top-of-hero slogan
            const slogan = document.getElementById('hj-hero-slogan');
            if (slogan) {
                const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.55));
                slogan.style.opacity = String(fade);
            }

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
            if (hls) {
                try { hls.destroy(); } catch (_) {}
            }
        };
    }, []);

    return (
        <>
            <div id="hj-bg-container" aria-hidden="true">
                {/* Background HLS stream — autoplays, loops, ignores scroll.
                    src is set by hls.js in the effect (or natively on Safari). */}
                <video
                    id="hj-bg-motion"
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

            <section id="hero" className="hj-spacer">
                {/* Big invitational slogan — anchors the top of the landing,
                    fades out as the visitor scrolls past the hero. */}
                <div id="hj-hero-slogan" className="hj-hero-slogan">
                    <h2>
                        {t.hero.slogan.before}
                        <span className="aura-shiny">{t.hero.slogan.highlight}</span>
                        {t.hero.slogan.after}
                    </h2>
                </div>

                {/* Minimal identity badge — who, what, why.
                    Fades out as the visitor scrolls past the hero. */}
                <div id="hj-hero-badge" className="hj-hero-badge">
                    <span className="hj-hero-eyebrow">{t.aurai.role}</span>
                    <h1 className="hj-hero-name">{t.hero.identity}</h1>
                    <p
                        className="hj-hero-elevator"
                        dangerouslySetInnerHTML={{ __html: t.hero.elevator }}
                    />
                    <p className="hj-hero-tag">{t.aurai.pills.join(' · ')}</p>
                    <div className="hj-hero-scroll" aria-hidden="true">
                        <span>scroll</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </div>
                </div>
            </section>

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
                    /* Stage is shifted down so the figure's head sits BELOW
                       the top-of-hero slogan instead of overlapping it. The
                       canvas matches this box at native resolution, which
                       also fixes the upscaling that was killing 720p sharpness
                       under the old 1.95x zoom. */
                    position: absolute;
                    top: clamp(20vh, 27vh, 32vh);
                    left: 0;
                    right: 0;
                    bottom: 0;
                    will-change: transform;
                }
                @media (max-width: 768px) {
                    #hj-figure-stage {
                        top: clamp(22vh, 26vh, 30vh);
                    }
                }
                /* Very narrow phones — pull the figure stage up so the
                   torso clears the badge area below. Also tighten the
                   radial bg-tint so the alpha-mask holes between arms
                   and waist still get hidden at this smaller figure size. */
                @media (max-width: 480px) {
                    #hj-figure-stage {
                        top: clamp(20vh, 24vh, 28vh);
                    }
                    #hj-bg-tint {
                        background:
                            radial-gradient(
                                ellipse 36% 28% at 50% 56%,
                                rgba(2, 6, 14, 0.6) 0%,
                                rgba(2, 6, 14, 0.32) 60%,
                                transparent 100%
                            ),
                            linear-gradient(
                                180deg,
                                rgba(5, 8, 17, 0.20) 0%,
                                rgba(5, 8, 17, 0.55) 100%
                            );
                    }
                }
                #hj-figure-canvas {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    /* drop-shadow softens the alpha-mask edge artifacts (rough
                       ear silhouette, suit shoulder seam) by adding a dark soft
                       halo that blends jagged transitions into the bg. */
                    filter: drop-shadow(0 0 2px rgba(2, 6, 14, 0.85));
                    /* Composite vertical mask:
                         - top-fade  (0–6%)   feathers the head/ears area where
                                              the source alpha clips the ears
                         - solid     (8–78%)  body holds full visibility
                         - bottom-fade (92–100%) hides any tiny turntable disc
                           still attached to the figure base */
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        transparent 0%,
                        rgba(0, 0, 0, 0.45) 4%,
                        black 8%,
                        black 78%,
                        rgba(0, 0, 0, 0.4) 92%,
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        transparent 0%,
                        rgba(0, 0, 0, 0.45) 4%,
                        black 8%,
                        black 78%,
                        rgba(0, 0, 0, 0.4) 92%,
                        transparent 100%
                    );
                }

                #hj-bg-tint {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    /* Two layered tints:
                         1. Radial dark spot centred where the figure's torso
                            sits — hides the alpha-mask's interior pinholes
                            (the gaps between arms and waist where the source
                            removal left smudges of the original background)
                            by darkening that whole zone so the smudges blend in.
                         2. Subtle vertical top-to-bottom dim, unchanged, so
                            text on top of bg reads against a consistent floor. */
                    background:
                        radial-gradient(
                            ellipse 28% 32% at 50% 56%,
                            rgba(2, 6, 14, 0.55) 0%,
                            rgba(2, 6, 14, 0.32) 60%,
                            transparent 100%
                        ),
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

                /* ---------- Top-of-hero invitational slogan ---------- */
                .hj-hero-slogan {
                    position: absolute;
                    top: clamp(4.5rem, 10vh, 7rem);
                    left: 0;
                    right: 0;
                    text-align: center;
                    padding: 0 1.5rem;
                    pointer-events: none;
                    transition: opacity 0.18s linear;
                }
                .hj-hero-slogan h2 {
                    font-size: clamp(1.75rem, 5.5vw, 3.75rem);
                    font-weight: 800;
                    letter-spacing: -0.035em;
                    line-height: 1.02;
                    color: #ffffff;
                    margin: 0 auto;
                    max-width: 24ch;
                    text-shadow: 0 6px 26px rgba(0, 0, 0, 0.6);
                    text-wrap: balance;
                }
                @media (max-width: 640px) {
                    .hj-hero-slogan h2 {
                        font-size: clamp(1.5rem, 7vw, 2.5rem);
                    }
                }

                /* ---------- Recruiter-facing identity badge ---------- */
                .hj-hero-badge {
                    position: absolute;
                    left: 50%;
                    bottom: clamp(2.5rem, 6vh, 5rem);
                    transform: translateX(-50%);
                    text-align: center;
                    width: min(94%, 720px);
                    padding: 1rem 1.25rem;
                    pointer-events: auto;
                    transition: opacity 0.18s linear;
                }
                .hj-hero-eyebrow {
                    display: inline-block;
                    font-size: 0.6875rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.78);
                    margin-bottom: 0.625rem;
                    padding: 0.3125rem 0.75rem;
                    border-radius: 9999px;
                    background: rgba(8, 14, 28, 0.55);
                    border: 1px solid rgba(255, 255, 255, 0.16);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .hj-hero-name {
                    font-size: clamp(1.5rem, 4.5vw, 2.625rem);
                    font-weight: 700;
                    letter-spacing: -0.025em;
                    line-height: 1.05;
                    color: #ffffff;
                    margin: 0;
                    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);
                }
                .hj-hero-elevator {
                    margin: 0.75rem auto 0;
                    max-width: 36rem;
                    font-size: clamp(0.9375rem, 2.2vw, 1.0625rem);
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.92);
                    font-weight: 400;
                    letter-spacing: -0.005em;
                    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
                }
                .hj-hero-tag {
                    margin: 0.625rem 0 0 0;
                    font-size: clamp(0.75rem, 2vw, 0.875rem);
                    color: rgba(255, 255, 255, 0.78);
                    letter-spacing: 0.04em;
                    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
                }
                .hj-hero-scroll {
                    margin-top: 1.5rem;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.625rem;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.55);
                    animation: hj-bounce 1.8s infinite;
                }
                .hj-hero-scroll svg {
                    width: 1rem;
                    height: 1rem;
                }
                @keyframes hj-bounce {
                    0%, 100% { transform: translateY(0); opacity: 0.6; }
                    50% { transform: translateY(4px); opacity: 1; }
                }
                @media (max-width: 640px) {
                    .hj-hero-badge {
                        bottom: clamp(1.5rem, 4vh, 3rem);
                        padding: 0.75rem 1rem;
                    }
                }
            `}</style>
        </>
    );
}
