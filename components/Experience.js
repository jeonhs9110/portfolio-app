'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiArrowUpRight } from 'react-icons/fi';


/**
 * Single experience card with:
 *   - 3D perspective tilt driven by pointer position
 *   - Ambient radial spotlight following the pointer inside the card
 *   - Framer-motion layoutId + View-Transitions handoff into
 *     /experience/[slug] on click.
 */
function ExperienceCard({ job, index, lang }) {
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);

    // Raw pointer position (0..1 inside the card)
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    // Springy versions for buttery motion
    const spx = useSpring(px, { stiffness: 180, damping: 22, mass: 0.6 });
    const spy = useSpring(py, { stiffness: 180, damping: 22, mass: 0.6 });
    // Tilt output ranges (subtle — over-rotating reads as cheap)
    const rotY = useTransform(spx, [0, 1], [7, -7]);
    const rotX = useTransform(spy, [0, 1], [-6, 6]);
    // Highlight anchor as CSS variables — updates the radial gradient
    const glowX = useTransform(spx, (v) => `${v * 100}%`);
    const glowY = useTransform(spy, (v) => `${v * 100}%`);

    const handleMove = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
    };
    const handleLeave = () => {
        setHovered(false);
        px.set(0.5);
        py.set(0.5);
    };

    const readMore = lang === 'ko' ? '자세히 보기' : 'Read more';

    return (
        <motion.div
            className="experience__card-wrapper"
            initial={{ opacity: 0, y: 90, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-150px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                href={`/experience/${job.slug}`}
                className="experience__link"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleLeave}
                onMouseMove={handleMove}
            >
                <motion.article
                    ref={ref}
                    className="experience__card-v2"
                    style={{
                        rotateX: rotX,
                        rotateY: rotY,
                        '--glow-x': glowX,
                        '--glow-y': glowY,
                        transformStyle: 'preserve-3d',
                    }}
                    animate={{ scale: hovered ? 1.015 : 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                >
                    {/* Ambient pointer-following glow (mix-blend layer) */}
                    <div className="experience__card-glow" aria-hidden="true" />

                    {/* Fixed grain overlay for cinematic texture */}
                    <div className="experience__card-grain" aria-hidden="true" />

                    <div className="experience__card-inner">
                        <header className="experience__card-head">
                            <div>
                                <p className="experience__period-v2">{job.period}</p>
                                <h3 className="experience__role-v2">{job.role}</h3>
                                <p className="experience__company-v2">{job.company}</p>
                            </div>
                            <span className="experience__index" aria-hidden="true">
                                0{index + 1}
                            </span>
                        </header>

                        <p
                            className="experience__headline"
                            dangerouslySetInnerHTML={{ __html: job.headline || job.desc }}
                        />

                        <footer className="experience__card-foot">
                            <span className="experience__cta">
                                {readMore}
                                <FiArrowUpRight />
                            </span>
                        </footer>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    );
}


/**
 * Section-level spotlight: a radial gradient that follows the cursor
 * across the entire experience section. Rendered as a fixed layer with
 * mix-blend-mode so it lights up whatever is behind it without needing
 * to know about the cards' colours.
 */
function SectionSpotlight({ containerRef }) {
    const x = useMotionValue(-9999);
    const y = useMotionValue(-9999);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handle = (e) => {
            const rect = el.getBoundingClientRect();
            x.set(e.clientX - rect.left);
            y.set(e.clientY - rect.top);
        };
        const handleLeave = () => {
            x.set(-9999);
            y.set(-9999);
        };
        el.addEventListener('pointermove', handle);
        el.addEventListener('pointerleave', handleLeave);
        return () => {
            el.removeEventListener('pointermove', handle);
            el.removeEventListener('pointerleave', handleLeave);
        };
    }, [containerRef, x, y]);

    return (
        <motion.div
            className="experience__spotlight"
            style={{
                background: useTransform(
                    [x, y],
                    ([vx, vy]) =>
                        `radial-gradient(600px circle at ${vx}px ${vy}px, rgba(139,92,246,0.14), transparent 60%)`
                ),
            }}
            aria-hidden="true"
        />
    );
}


export default function Experience() {
    const { t, lang } = useLanguage();
    const sectionRef = useRef(null);

    return (
        <section className="experience experience--v2" id="experience" ref={sectionRef}>
            {/* Section-wide cursor-following spotlight */}
            <SectionSpotlight containerRef={sectionRef} />

            <div className="container">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    {t.experience.section}
                </motion.p>

                {/* Clip-path text reveal on the title */}
                <motion.h2
                    className="section-title experience__title-v2"
                    initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                    whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                    {t.experience.title}
                </motion.h2>

                {/* Each card wrapped in a sticky-scroll frame — same pattern
                    as the Projects section. Frame is 110vh, stage inside is
                    sticky top:0 100vh flex-centered, so the card pins at
                    viewport centre for ~one viewport of scroll, then unpins
                    as the next card takes over. Mobile falls back to normal
                    flow via the media query on .experience__card-frame. */}
                <div className="experience__grid-v2">
                    {t.experience.jobs.map((job, i) => (
                        <div key={job.slug || i} className="experience__card-frame">
                            <div className="experience__card-stage">
                                <ExperienceCard job={job} index={i} lang={lang} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
