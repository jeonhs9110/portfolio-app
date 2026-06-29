'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
    const { t } = useLanguage();

    return (
        <section className="about" id="about">
            <div className="container">
                <motion.p
                    className="section-label"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeUp}
                >
                    {t.about.section}
                </motion.p>

                {/* Key Wins strip — 4 quantified achievements for the recruiter
                    scan, surfaces the resume's deal + tech proof points above
                    the bio prose.
                    Wrapped in a tall scroll-jacking container: the row pins at
                    viewport centre via sticky positioning, and ScrollSpotlight
                    drives the sequential zoom-to-centre as the visitor scrolls
                    through the container's vertical space. Each tile holds the
                    centre for ~one viewport worth of scroll. */}
                {t.about.wins && (
                    <div className="about__wins-spotlight">
                        <div className="about__wins-sticky">
                            <div className="about__wins">
                                {t.about.wins.map((w, i) => (
                                    <motion.div
                                        key={i}
                                        custom={i}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: '-40px' }}
                                        variants={{
                                            hidden: { opacity: 0, scale: 1.4 },
                                            visible: (j) => ({
                                                opacity: 1, scale: 1,
                                                transition: { duration: 0.6, delay: j * 0.22, ease: [0.22, 1, 0.36, 1] },
                                            }),
                                        }}
                                    >
                                        <div className="about__win">
                                            <div className="about__win-metric">{w.metric}</div>
                                            <div className="about__win-label">{w.label}</div>
                                            <div className="about__win-detail">{w.detail}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* "Where I've worked" wordmark strip — uniform white text on
                    dark, just direct employers (no counterparties / clients,
                    which would imply endorsement). */}
                {t.about.workplaces && (
                    <motion.div
                        className="about__workplaces"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <span className="about__workplaces-label">{t.about.workplacesLabel}</span>
                        <div className="about__workplaces-row">
                            {t.about.workplaces.map((name) => (
                                <span key={name} className="about__workplaces-mark">{name}</span>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="about__grid">
                    {/* Left — text */}
                    <div>
                        <motion.h2
                            className="section-title"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={fadeUp}
                        >
                            {t.about.title}
                        </motion.h2>

                        <motion.div
                            className="about__bio"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }}
                        >
                            {t.about.bio.split('\n\n').map((para, i) => (
                                <p
                                    key={i}
                                    style={{ marginTop: i === 0 ? 0 : '14px' }}
                                    dangerouslySetInnerHTML={{ __html: para }}
                                />
                            ))}
                        </motion.div>

                        <motion.div
                            className="about__stats"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                        >
                            {t.about.stats.map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-40px' }}
                                    variants={{
                                        hidden: { opacity: 0, scale: 1.3 },
                                        visible: (j) => ({
                                            opacity: 1, scale: 1,
                                            transition: { duration: 0.55, delay: j * 0.22, ease: [0.22, 1, 0.36, 1] },
                                        }),
                                    }}
                                >
                                <div className="about__stat" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    {s.images && s.images.length > 1 ? (
                                        <div style={{ flexShrink: 0, width: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                            {s.images.map((src) => (
                                                <div key={src} style={{ position: 'relative', width: '46px', height: '18px' }}>
                                                    <Image src={src} alt={`${s.label} logo`} fill style={{ objectFit: 'contain' }} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : s.image ? (
                                        <div style={{ flexShrink: 0, width: '40px', height: '40px', position: 'relative' }}>
                                            <Image src={s.image} alt={s.label} fill style={{ objectFit: 'contain' }} />
                                        </div>
                                    ) : null}
                                    <div>
                                        <p className="about__stat-label">{s.label}</p>
                                        <p className="about__stat-value">{s.value}</p>
                                    </div>
                                </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — decorative card */}
                    <motion.div
                        className="about__img-side"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 0 24px -20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <Image src="/hyunsik-picture.jpg" alt="Hyunsik Jeon" fill style={{ objectFit: 'contain', backgroundColor: 'var(--bg-surface)' }} />
                        </div>
                        <div className="about__big-number" style={{ position: 'absolute', top: '150px', left: '160px', zIndex: -1 }}>JHS</div>
                        <div className="about__feature-card">
                            <p>
                                &ldquo;{t.about.quote}&rdquo;
                            </p>
                            <br />
                            <p style={{ fontStyle: 'normal', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                &mdash; {t.about.quoteAuthor}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
