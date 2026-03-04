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

                        <motion.p
                            className="about__bio"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: 0.1 } } }}
                        >
                            {t.about.bio}
                        </motion.p>

                        <motion.div
                            className="about__stats"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                        >
                            {t.about.stats.map((s) => (
                                <motion.div key={s.label} className="about__stat" variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    {s.image && (
                                        <div style={{ flexShrink: 0, width: '40px', height: '40px', position: 'relative' }}>
                                            <Image src={s.image} alt={s.label} fill style={{ objectFit: 'contain' }} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="about__stat-label">{s.label}</p>
                                        <p className="about__stat-value">{s.value}</p>
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
                                &ldquo;Hard Coding 을 이해하며 Vibe Coding을 활용하여 보다 더 많은 상품을 빠르고 정확하게 잘 전달해 드립니다.&rdquo;
                            </p>
                            <br />
                            <p style={{ fontStyle: 'normal', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                &mdash; 전현식 (Hyunsik Jeon)
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
