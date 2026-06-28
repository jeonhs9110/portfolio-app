'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const VIDEO_URL =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4';

export default function Hero() {
    const { t } = useLanguage();
    const cards = t.hero.cards;
    const headline = t.hero.headline; // [prefix, underlined, suffix]
    const heroRootRef = useRef(null);

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
                const response = await fetch(VIDEO_URL, { mode: 'cors' });
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
                // fallback path: silent — videoEl element handles playback
            }
        }

        function getScrollBounds() {
            const vh = window.innerHeight;
            return { start: vh * 0.5, end: document.documentElement.scrollHeight - vh };
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

        // Hero fade on scroll
        const heroSection = document.getElementById('hj-hero');
        function updateHeroOpacity() {
            const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.3));
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
        <div ref={heroRootRef} className="hj-hero-root">
            {/* Scroll-reactive video background */}
            <div id="hj-scroll-video-container">
                <canvas id="hj-video-canvas" />
                <video
                    id="hj-video-fallback"
                    muted
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    src={VIDEO_URL}
                />
                <div className="hj-overlay" />
            </div>

            {/* Particles */}
            <canvas id="hj-particles-canvas" />

            {/* Fixed cards */}
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

            {/* Hero section */}
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

            {/* Spacer before cards */}
            <div style={{ height: '150vh' }} />

            {/* Cards trigger zone */}
            <div id="hj-cards-trigger" style={{ height: '200vh' }} />

            {/* Spacer before section 3 */}
            <div style={{ height: '100vh' }} />

            {/* Section 3 — Presenting */}
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

            <style jsx global>{`
                .hj-hero-root {
                    position: relative;
                    color: #fff;
                    background: #010101;
                }

                /* Scroll-reactive video */
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

                /* Particles */
                #hj-particles-canvas {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 3;
                }

                /* Hero */
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
                    color: #9ca3af;
                    margin-bottom: 1rem;
                    letter-spacing: 0.05em;
                }
                #hj-hero h1 {
                    font-size: clamp(1.5rem, 5vw, 3.75rem);
                    font-weight: 600;
                    line-height: 1.15;
                    max-width: 56rem;
                }
                #hj-hero h1 .hj-underlined {
                    position: relative;
                    display: inline-block;
                }
                #hj-hero h1 .hj-underlined .hj-line {
                    position: absolute;
                    bottom: 0.25rem;
                    left: 0;
                    width: 100%;
                    height: 10px;
                    background: #2c5c88;
                    border-radius: 2px;
                }
                #hj-hero h1 .hj-underlined > span:last-child {
                    position: relative;
                }
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
                #hj-hero .hj-cta-btn:hover {
                    background: #3a7aad;
                }
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
                    color: #6b7280;
                    animation: hj-bounce 1s infinite;
                }
                @keyframes hj-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-25%); }
                }

                /* Fixed cards */
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

                /* Section 3 */
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
        </div>
    );
}
