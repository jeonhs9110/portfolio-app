'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

// Local Gemini-Veo turntable clip. Replaces the previous Cloudfront URL —
// hosted on the same origin so no CORS round-trip, no third-party fragility,
// and we control the asset (8s rotation, 720p, 2.5MB).
const VELDARA_VIDEO_URL = '/jeon_landing_360.mp4';

function Pinwheel() {
    return (
        <svg viewBox="0 0 256 256" fill="currentColor" className="aurai-logo-svg">
            <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
        </svg>
    );
}

function HamburgerIcon({ open }) {
    return open ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}

export default function Hero() {
    const { t } = useLanguage();
    const cards = t.hero.cards;
    const headline = t.hero.headline;
    const aurai = t.aurai;

    const [email, setEmail] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const submitEmail = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent('Reaching out — portfolio');
        const body = encodeURIComponent(email ? `From: ${email}\n\n` : '');
        window.location.href = `mailto:jeonhs9110@gmail.com?subject=${subject}&body=${body}`;
    };

    useEffect(() => {
        const canvas = document.getElementById('hj-video-canvas');
        const videoEl = document.getElementById('hj-video-fallback');
        if (!canvas || !videoEl) return;
        const ctx = canvas.getContext('2d');

        let frames = [];
        let framesReady = false;
        let lastFrameIndex = -1;
        let videoSeeking = false;
        let cancelled = false;

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            const w = Math.round(rect.width * dpr);
            const h = Math.round(rect.height * dpr);
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
            lastFrameIndex = -1;
        }

        async function extractFrames() {
            try {
                const response = await fetch(VELDARA_VIDEO_URL, { mode: 'cors' });
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                const video = document.createElement('video');
                video.muted = true;
                video.playsInline = true;
                video.crossOrigin = 'anonymous';
                video.preload = 'auto';
                video.src = objectUrl;
                await new Promise((resolve, reject) => {
                    video.onloadedmetadata = () => resolve();
                    video.onerror = () => reject();
                    setTimeout(() => reject(), 15000);
                });
                const scale = Math.min(1, 1280 / video.videoWidth);
                const scaledWidth = Math.round(video.videoWidth * scale);
                const scaledHeight = Math.round(video.videoHeight * scale);
                const frameCount = Math.max(30, Math.min(120, Math.round(video.duration * 24)));
                for (let i = 0; i < frameCount; i++) {
                    if (cancelled) break;
                    const time = (i / (frameCount - 1)) * (video.duration - 0.05);
                    video.currentTime = time;
                    await new Promise((resolve, reject) => {
                        const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve(); };
                        video.addEventListener('seeked', onSeeked);
                        setTimeout(() => { video.removeEventListener('seeked', onSeeked); reject(); }, 3000);
                    });
                    const bitmap = await createImageBitmap(video, {
                        resizeWidth: scaledWidth,
                        resizeHeight: scaledHeight,
                    });
                    frames.push(bitmap);
                }
                if (frames.length > 0 && !cancelled) {
                    framesReady = true;
                    canvas.style.visibility = 'visible';
                    videoEl.style.display = 'none';
                }
                URL.revokeObjectURL(objectUrl);
            } catch (e) {
                // silent fallback to direct video seeking
            }
        }

        function getScrollBounds() {
            const vh = window.innerHeight;
            // Veldara scrub starts AFTER the Aurai section (which is 100vh)
            return { start: vh * 1.5, end: document.documentElement.scrollHeight - vh };
        }

        function getProgress() {
            const { start, end } = getScrollBounds();
            const range = end - start;
            if (range <= 0) return 0;
            return Math.max(0, Math.min(1, (window.scrollY - start) / range));
        }

        function drawFrame(frame) {
            const cw = canvas.width;
            const ch = canvas.height;
            const s = Math.max(cw / frame.width, ch / frame.height);
            const dw = frame.width * s;
            const dh = frame.height * s;
            ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
        }

        let videoTickRaf = 0;
        function videoTick() {
            if (cancelled) return;
            const progress = getProgress();
            if (framesReady && frames.length > 0) {
                const idx = Math.round(progress * (frames.length - 1));
                if (idx !== lastFrameIndex) {
                    lastFrameIndex = idx;
                    if (frames[idx]) drawFrame(frames[idx]);
                }
            } else if (videoEl.duration && isFinite(videoEl.duration) && videoEl.readyState >= 1) {
                const target = progress * videoEl.duration;
                if (!videoSeeking && Math.abs(videoEl.currentTime - target) > 0.001) {
                    videoSeeking = true;
                    videoEl.currentTime = target;
                }
            }
            videoTickRaf = requestAnimationFrame(videoTick);
        }

        const onSeeked = () => { videoSeeking = false; };
        const onStalled = () => { videoSeeking = false; };
        const onLoaded = () => { videoEl.currentTime = 0; };
        videoEl.addEventListener('seeked', onSeeked);
        videoEl.addEventListener('stalled', onStalled);
        videoEl.addEventListener('loadeddata', onLoaded);
        canvas.style.visibility = 'hidden';

        resizeCanvas();
        const onResize = () => resizeCanvas();
        window.addEventListener('resize', onResize);
        videoTick();
        extractFrames();

        // Particles
        const pCanvas = document.getElementById('hj-particles-canvas');
        const pCtx = pCanvas.getContext('2d');
        let particles = [];
        function resizeParticles() {
            pCanvas.width = window.innerWidth;
            pCanvas.height = window.innerHeight;
            createParticles();
        }
        function createParticles() {
            particles = [];
            const count = Math.floor((pCanvas.width * pCanvas.height) / 12000);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * pCanvas.width,
                    y: Math.random() * pCanvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.6 + 0.2,
                });
            }
        }
        let particlesRaf = 0;
        function animateParticles() {
            if (cancelled) return;
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = pCanvas.width;
                if (p.x > pCanvas.width) p.x = 0;
                if (p.y < 0) p.y = pCanvas.height;
                if (p.y > pCanvas.height) p.y = 0;
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                pCtx.fill();
            }
            particlesRaf = requestAnimationFrame(animateParticles);
        }
        resizeParticles();
        window.addEventListener('resize', resizeParticles);
        animateParticles();

        // Veldara hero fade (kicks in after the Aurai section is scrolled past)
        const heroSection = document.getElementById('hj-hero');
        function updateHeroOpacity() {
            const vh = window.innerHeight;
            const past = Math.max(0, window.scrollY - vh);
            const fade = Math.max(0, 1 - past / (vh * 0.3));
            if (heroSection) heroSection.style.opacity = fade;
        }
        window.addEventListener('scroll', updateHeroOpacity, { passive: true });

        // Cards reveal on scroll
        const fixedCards = document.getElementById('hj-fixed-cards');
        const cardsGrid = fixedCards?.querySelector('.hj-grid');
        let cardsRaf = 0;
        function tickCards() {
            if (cancelled) return;
            const trigger = document.getElementById('hj-cards-trigger');
            if (!trigger || !fixedCards || !cardsGrid) {
                cardsRaf = requestAnimationFrame(tickCards);
                return;
            }
            const rect = trigger.getBoundingClientRect();
            const triggerTop = rect.top + window.scrollY;
            const triggerHeight = rect.height;
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            const start = triggerTop - vh * 0.5;
            const end = triggerTop + triggerHeight - vh * 0.3;
            const range = end - start;
            let progress = range > 0 ? (scrollY - start) / range : 0;
            progress = Math.max(0, Math.min(1, progress));
            const isActive = scrollY >= start - vh * 0.2 && scrollY <= end + vh * 0.3;
            const fadeIn = Math.min(1, Math.max(0, (scrollY - (start - vh * 0.2)) / (vh * 0.2)));
            const fadeOut = Math.min(1, Math.max(0, (end + vh * 0.3 - scrollY) / (vh * 0.3)));
            const containerOpacity = isActive ? Math.min(fadeIn, fadeOut) : 0;
            fixedCards.style.opacity = containerOpacity;
            fixedCards.style.pointerEvents = containerOpacity > 0.1 ? 'auto' : 'none';
            const isMobile = window.innerWidth < 768;
            const revealPct = progress * 130;
            if (isMobile) {
                cardsGrid.style.maskImage = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 20}%)`;
                cardsGrid.style.webkitMaskImage = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 20}%)`;
            } else {
                cardsGrid.style.maskImage = `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 15}%)`;
                cardsGrid.style.webkitMaskImage = `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 15}%)`;
            }
            cardsRaf = requestAnimationFrame(tickCards);
        }
        tickCards();

        // Section 3 reveal
        const sectionThreeInner = document.getElementById('hj-section-three-inner');
        let observer;
        if (sectionThreeInner) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        sectionThreeInner.classList.add('hj-visible');
                        observer.unobserve(sectionThreeInner);
                    }
                },
                { threshold: 0.15 }
            );
            observer.observe(sectionThreeInner);
        }

        return () => {
            cancelled = true;
            window.removeEventListener('resize', onResize);
            window.removeEventListener('resize', resizeParticles);
            window.removeEventListener('scroll', updateHeroOpacity);
            videoEl.removeEventListener('seeked', onSeeked);
            videoEl.removeEventListener('stalled', onStalled);
            videoEl.removeEventListener('loadeddata', onLoaded);
            cancelAnimationFrame(videoTickRaf);
            cancelAnimationFrame(particlesRaf);
            cancelAnimationFrame(cardsRaf);
            if (observer && sectionThreeInner) observer.unobserve(sectionThreeInner);
            for (const f of frames) {
                try { f.close && f.close(); } catch (e) {}
            }
            frames = [];
        };
    }, []);

    return (
        <>
            {/* ════════════════════ CONDENSED-SITEMAP TOP HERO ════════════════════ */}
            <section className="aurai-hero">
                <div className="aurai-bg-aurora" />
                <div className="aurai-layer">
                    <nav className="aurai-nav">
                        <div className="aurai-nav-pill">
                            <span className="aurai-logo"><Pinwheel /></span>
                            <span className="aurai-brand">{aurai.brand}</span>
                            <button
                                className="aurai-menu-toggle"
                                aria-label="menu"
                                onClick={() => setMenuOpen((v) => !v)}
                            >
                                <HamburgerIcon open={menuOpen} />
                            </button>
                        </div>
                        <button className="aurai-cta-right" onClick={submitEmail}>
                            {aurai.joinButton}
                        </button>
                    </nav>

                    {menuOpen && (
                        <div className="aurai-mobile-menu">
                            {aurai.sitemap.map((s) => (
                                <a key={s.href} href={s.href} onClick={() => setMenuOpen(false)}>
                                    {s.label}
                                </a>
                            ))}
                            <button onClick={submitEmail} className="aurai-mobile-cta">
                                {aurai.joinButton}
                            </button>
                        </div>
                    )}

                    <div className="aurai-spacer" />
                    <div className="aurai-content">
                        <div className="aurai-left">
                            <p className="aurai-role">{aurai.role}</p>
                            <h1 className="aurai-heading">{aurai.heading}</h1>
                            <p className="aurai-subtitle">{aurai.subtitle}</p>

                            <div className="aurai-sitemap">
                                {aurai.sitemap.map((s) => (
                                    <a key={s.href} href={s.href} className="aurai-sitemap-card">
                                        <div className="aurai-sitemap-label">{s.label}</div>
                                        <div className="aurai-sitemap-summary">{s.summary}</div>
                                    </a>
                                ))}
                            </div>

                            <form className="aurai-email-pill" onSubmit={submitEmail}>
                                <input
                                    type="email"
                                    placeholder={aurai.emailPlaceholder}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="aurai-email-input"
                                />
                                <button type="submit" className="aurai-email-submit">
                                    {aurai.emailSubmit}
                                </button>
                            </form>

                            <div className="aurai-pill-row">
                                {aurai.pills.map((p) => (
                                    <span key={p} className="aurai-pill">{p}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════ VELDARA SCROLL-REACTIVE SECTION ════════════════════ */}
            <div className="hj-hero-root">
                <div id="hj-scroll-video-container">
                    <canvas id="hj-video-canvas" />
                    <video
                        id="hj-video-fallback"
                        muted
                        playsInline
                        preload="auto"
                        crossOrigin="anonymous"
                        src={VELDARA_VIDEO_URL}
                    />
                    <div className="hj-overlay" />
                </div>

                <canvas id="hj-particles-canvas" />

                <div id="hj-fixed-cards">
                    <div className="hj-grid">
                        {cards.map((c, i) => (
                            <div key={i} className="hj-card">
                                <h3>{c.title}</h3>
                                <p>{c.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <section id="hj-hero">
                    <div className="hj-gradient-overlay" />
                    <div className="hj-content">
                        <p className="hj-subtitle">{t.hero.identity}</p>
                        <h1>
                            {headline[0]}
                            <span className="hj-underlined">
                                <span className="hj-line" />
                                <span>{headline[1]}</span>
                            </span>
                            {headline[2]}
                        </h1>
                        <div className="hj-ctas">
                            <div className="hj-code-box">
                                <span className="hj-prompt">&gt;</span>
                                <code>linkedin.com/in/jeonhyunsik</code>
                            </div>
                            <a href="#projects" className="hj-cta-btn">
                                {t.hero.ctaButton} <span>→</span>
                            </a>
                        </div>
                    </div>
                    <div className="hj-bounce-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </section>

                <div style={{ height: '150vh' }} />
                <div id="hj-cards-trigger" style={{ height: '200vh' }} />
                <div style={{ height: '100vh' }} />

                <section id="hj-section-three">
                    <div className="hj-inner" id="hj-section-three-inner">
                        <p>{t.hero.presenting}</p>
                        <h2>{t.hero.presentingName}</h2>
                        <div className="hj-portrait">
                            <Image
                                src="/jeon-id-2023.jpg"
                                alt="Hyunsik Jeon"
                                width={240}
                                height={300}
                                priority
                                style={{ objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            <style jsx global>{`
                /* Askan Light font for the brand & headline */
                @import url('https://db.onlinewebfonts.com/c/304a6edcec9f8858eeaafc2ac18243f4?family=Askan+Light');

                .aurai-hero {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    overflow: hidden;
                    background: #050505;
                }

                /* Constellation aurora background — three large radial pools that
                   pulse via the aurai-aurora keyframes for ambient color motion */
                .aurai-bg-aurora {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(60% 50% at 20% 20%, rgba(44, 92, 136, 0.45), transparent 70%),
                        radial-gradient(50% 45% at 80% 30%, rgba(58, 122, 173, 0.35), transparent 70%),
                        radial-gradient(55% 50% at 50% 90%, rgba(30, 58, 138, 0.4), transparent 70%),
                        linear-gradient(140deg, #050811 0%, #0a0e1a 50%, #050505 100%);
                    z-index: 0;
                    animation: aurai-aurora 18s ease-in-out infinite alternate;
                    pointer-events: none;
                }
                @keyframes aurai-aurora {
                    0% {
                        background-position: 0% 0%, 100% 0%, 50% 100%, 0% 0%;
                        filter: hue-rotate(0deg);
                    }
                    100% {
                        background-position: 15% 5%, 85% 10%, 55% 95%, 0% 0%;
                        filter: hue-rotate(20deg);
                    }
                }

                .aurai-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    padding: 1rem 1rem;
                }
                @media (min-width: 640px) {
                    .aurai-layer { padding: 2rem 2.5rem; }
                }
                @media (min-width: 1024px) {
                    .aurai-layer { padding: 2rem 3rem; }
                }

                .aurai-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .aurai-nav-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.625rem 1rem;
                    color: #fff;
                }
                @media (min-width: 640px) {
                    .aurai-nav-pill { padding: 1rem 1.5rem; gap: 0.75rem; }
                }

                .aurai-logo {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.25rem;
                    height: 1.25rem;
                    color: #fff;
                }
                @media (min-width: 640px) {
                    .aurai-logo { width: 1.75rem; height: 1.75rem; }
                }
                .aurai-logo-svg { width: 100%; height: 100%; display: block; }

                .aurai-brand {
                    font-family: 'Askan Light', 'Inter', serif;
                    font-size: 1rem;
                    letter-spacing: 0.05em;
                    color: #fff;
                }
                @media (min-width: 640px) {
                    .aurai-brand { font-size: 1.25rem; }
                }

                .aurai-menu-toggle {
                    background: transparent;
                    border: 0;
                    padding: 0;
                    margin-left: 1rem;
                    color: #fff;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.5rem;
                    height: 1.5rem;
                }
                @media (min-width: 640px) { .aurai-menu-toggle { margin-left: 8rem; } }
                @media (min-width: 768px) { .aurai-menu-toggle { margin-left: 16rem; } }
                @media (min-width: 1024px) { .aurai-menu-toggle { margin-left: 24rem; } }
                .aurai-menu-toggle svg { width: 100%; height: 100%; display: block; }

                .aurai-cta-right {
                    display: none;
                    background: #fff;
                    color: #111827;
                    font-weight: 500;
                    font-size: 0.875rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 9999px;
                    border: 0;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .aurai-cta-right:hover { opacity: 0.9; }
                @media (min-width: 640px) { .aurai-cta-right { display: inline-block; } }

                .aurai-mobile-menu {
                    position: absolute;
                    top: 4.5rem;
                    left: 1rem;
                    right: 1rem;
                    background: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    z-index: 20;
                }
                @media (min-width: 640px) { .aurai-mobile-menu { display: none; } }
                .aurai-mobile-menu a {
                    color: #fff;
                    text-decoration: none;
                    font-size: 0.9375rem;
                    padding: 0.25rem 0;
                }
                .aurai-mobile-cta {
                    margin-top: 0.5rem;
                    width: 100%;
                    background: #fff;
                    color: #111827;
                    border: 0;
                    border-radius: 9999px;
                    padding: 0.75rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                }

                .aurai-spacer { flex: 1; min-height: 1rem; }

                .aurai-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    padding-bottom: 1.5rem;
                    align-items: flex-start;
                }
                @media (min-width: 768px) {
                    .aurai-content {
                        flex-direction: row;
                        align-items: flex-end;
                        flex: 1;
                        margin-top: auto;
                        padding-bottom: 2.5rem;
                        gap: 2.5rem;
                    }
                }
                @media (min-width: 1024px) {
                    .aurai-content { padding-bottom: 3.5rem; gap: 3rem; }
                }

                .aurai-left {
                    display: flex;
                    flex-direction: column;
                    gap: 0.875rem;
                    flex: 1;
                    min-width: 0;
                    max-width: 920px;
                }
                @media (min-width: 768px) {
                    .aurai-left { gap: 1.125rem; }
                }

                .aurai-role {
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 0.75rem;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    margin-bottom: 0.25rem;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
                }

                .aurai-heading {
                    font-family: 'Askan Light', 'Inter', serif;
                    color: #fff;
                    font-size: 1.875rem;
                    line-height: 1.05;
                    letter-spacing: -0.02em;
                    max-width: 700px;
                    font-weight: 400;
                }
                @media (min-width: 640px) { .aurai-heading { font-size: 2.75rem; } }
                @media (min-width: 768px) { .aurai-heading { font-size: 3.25rem; } }
                @media (min-width: 1024px) { .aurai-heading { font-size: 3.75rem; } }

                .aurai-subtitle {
                    color: rgba(255, 255, 255, 0.88);
                    font-size: 0.8125rem;
                    max-width: 560px;
                    line-height: 1.55;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
                }
                @media (min-width: 768px) { .aurai-subtitle { font-size: 0.9375rem; } }

                /* Condensed sitemap grid — 4 cards (About / Experience / Projects / Contact) */
                .aurai-sitemap {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.625rem;
                    margin-top: 0.5rem;
                }
                @media (min-width: 640px) {
                    .aurai-sitemap { grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
                }

                .aurai-sitemap-card {
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                    background: rgba(0, 0, 0, 0.32);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 0.875rem 0.9375rem;
                    color: #fff;
                    text-decoration: none;
                    transition: background 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
                }
                .aurai-sitemap-card:hover {
                    background: rgba(44, 92, 136, 0.32);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                .aurai-sitemap-label {
                    font-size: 0.6875rem;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.78);
                    font-weight: 600;
                }
                @media (min-width: 768px) {
                    .aurai-sitemap-label { font-size: 0.75rem; }
                }
                .aurai-sitemap-summary {
                    color: rgba(255, 255, 255, 0.94);
                    font-size: 0.75rem;
                    line-height: 1.45;
                }
                @media (min-width: 768px) {
                    .aurai-sitemap-summary { font-size: 0.8125rem; }
                }

                .aurai-email-pill {
                    position: relative;
                    background: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 9999px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    max-width: 480px;
                }
                .aurai-email-input {
                    width: 100%;
                    background: transparent;
                    border: 0;
                    outline: none;
                    color: #fff;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    font-family: inherit;
                }
                @media (min-width: 640px) {
                    .aurai-email-input { padding: 1rem 1.5rem; }
                }
                .aurai-email-input::placeholder { color: rgba(255, 255, 255, 0.72); }
                .aurai-email-submit {
                    position: absolute;
                    right: 0.375rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #fff;
                    color: #111827;
                    border: 0;
                    border-radius: 9999px;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                }
                @media (min-width: 640px) {
                    .aurai-email-submit { padding: 0.75rem 1.5rem; font-size: 0.875rem; }
                }

                .aurai-pill {
                    background: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: #fff;
                    font-size: 0.75rem;
                    padding: 0.375rem 0.75rem;
                    border-radius: 9999px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    white-space: nowrap;
                }
                @media (min-width: 640px) {
                    .aurai-pill { font-size: 0.8125rem; padding: 0.4375rem 0.875rem; }
                }

                /* Pill row sits under the email pill in the left column */
                .aurai-pill-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.625rem;
                }

                /* ════════════════════ VELDARA SECTION (unchanged structure) ════════════════════ */
                .hj-hero-root {
                    position: relative;
                    color: #fff;
                    background: #010101;
                }

                #hj-scroll-video-container {
                    position: fixed;
                    inset: 0;
                    z-index: -10;
                    background: #0a0a0a;
                    top: -20%;
                }
                #hj-scroll-video-container canvas,
                #hj-scroll-video-container video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                #hj-scroll-video-container .hj-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.35);
                }

                #hj-particles-canvas {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 3;
                }

                #hj-hero {
                    position: relative;
                    height: 100vh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    z-index: 2;
                }
                #hj-hero .hj-gradient-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent, transparent);
                }
                #hj-hero .hj-content {
                    position: relative;
                    z-index: 10;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    text-align: center;
                    padding: 0 1.5rem 6rem;
                }
                #hj-hero .hj-subtitle {
                    font-size: 0.875rem;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                    letter-spacing: 0.05em;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                }
                #hj-hero h1 {
                    font-size: clamp(1.5rem, 5vw, 3.75rem);
                    font-weight: 600;
                    line-height: 1.15;
                    max-width: 56rem;
                }
                #hj-hero h1 .hj-underlined { position: relative; display: inline-block; }
                #hj-hero h1 .hj-underlined .hj-line {
                    position: absolute;
                    bottom: 0.25rem;
                    left: 0;
                    width: 100%;
                    height: 10px;
                    background: #2c5c88;
                    border-radius: 2px;
                }
                #hj-hero h1 .hj-underlined > span:last-child { position: relative; }
                #hj-hero .hj-ctas {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 2.5rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                #hj-hero .hj-code-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #1a1a1a;
                    border: 1px solid rgba(55, 65, 81, 0.5);
                    border-radius: 0.5rem;
                    padding: 0.875rem 2rem;
                }
                #hj-hero .hj-code-box .hj-prompt {
                    color: #2c5c88;
                    font-family: monospace;
                    font-size: 0.875rem;
                }
                #hj-hero .hj-code-box code {
                    font-size: 0.875rem;
                    color: #e5e7eb;
                    font-family: monospace;
                }
                #hj-hero .hj-cta-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #2c5c88;
                    color: #fff;
                    font-weight: 500;
                    border-radius: 0.5rem;
                    padding: 0.875rem 2rem;
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: background 0.2s;
                }
                #hj-hero .hj-cta-btn:hover { background: #3a7aad; }
                #hj-hero .hj-bounce-arrow {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    justify-content: center;
                    padding-bottom: 2rem;
                }
                #hj-hero .hj-bounce-arrow svg {
                    width: 1.5rem;
                    height: 1.5rem;
                    color: rgba(255, 255, 255, 0.65);
                    animation: hj-bounce 1s infinite;
                }
                @keyframes hj-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-25%); }
                }

                #hj-fixed-cards {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 4;
                    padding: 2rem 2.5rem;
                    opacity: 0;
                    pointer-events: none;
                }
                #hj-fixed-cards .hj-grid {
                    max-width: 72rem;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2.5rem;
                }
                #hj-fixed-cards .hj-card h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 1rem;
                }
                #hj-fixed-cards .hj-card p {
                    color: #d1d5db;
                    font-size: 0.875rem;
                    line-height: 1.6;
                }

                #hj-section-three {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0 2.5rem 8rem;
                    z-index: 2;
                }
                #hj-section-three .hj-inner {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    opacity: 0;
                    transform: translateY(32px);
                    filter: blur(8px);
                    transition: opacity 1s ease-out, transform 1s ease-out, filter 1s ease-out;
                }
                #hj-section-three .hj-inner.hj-visible {
                    opacity: 1;
                    transform: translateY(0);
                    filter: blur(0);
                }
                #hj-section-three .hj-inner p {
                    color: #d1d5db;
                    font-size: 1rem;
                    margin-bottom: 0.75rem;
                }
                #hj-section-three .hj-inner h2 {
                    font-size: clamp(1.875rem, 6vw, 4.5rem);
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }
                #hj-section-three .hj-portrait {
                    margin-top: 0.75rem;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 14px;
                    padding: 6px;
                    background: rgba(255, 255, 255, 0.03);
                }

                @media (max-width: 768px) {
                    #hj-hero .hj-content { padding-bottom: 5rem; }
                    #hj-hero h1 { font-size: 1.6rem; }
                    #hj-hero .hj-ctas { flex-direction: column; }
                    #hj-fixed-cards .hj-grid { grid-template-columns: 1fr; gap: 1.5rem; }
                    #hj-fixed-cards { padding: 1.5rem 1rem; }
                    #hj-section-three { padding-bottom: 5rem; }
                }
            `}</style>
        </>
    );
}
