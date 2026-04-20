'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { projects } from '@/lib/projects';
import { FiArrowRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function Projects() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [showAll, setShowAll] = useState(false);

    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);
    const visible = showAll ? projects : featured;

    const seeMoreLabel = lang === 'ko' ? '더 많은 프로젝트 보기' : 'See more projects';
    const seeLessLabel = lang === 'ko' ? '접기' : 'Show less';

    return (
        <section className="projects" id="projects">
            <div className="container">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    {t.projects.section}
                </motion.p>

                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                >
                    {t.projects.title}
                </motion.h2>

                <div className="projects__list">
                    {visible.map((proj, i) => (
                        <motion.div
                            key={proj.id}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp}
                            style={{ position: 'relative' }}
                        >
                            <div
                                onClick={() => router.push(`/projects/${proj.slug}`)}
                                className="project-card project-card--clickable"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <span className="project-card__num">0{proj.id}</span>

                                <div className="project-card__main">
                                    <h3 className="project-card__title">
                                        {lang === 'ko' ? proj.titleKo : proj.titleEn}
                                    </h3>
                                    <p className="project-card__desc">
                                        {lang === 'ko' ? proj.descKo : proj.descEn}
                                    </p>
                                    <div className="project-card__tags">
                                        {proj.tags.map((tag) => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="project-card__links">
                                    <span className="project-card__arrow">
                                        <FiArrowRight size={18} />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {others.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}
                    >
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setShowAll((v) => !v)}
                        >
                            {showAll ? (
                                <>
                                    <FiChevronUp size={18} />
                                    {seeLessLabel}
                                </>
                            ) : (
                                <>
                                    <FiChevronDown size={18} />
                                    {seeMoreLabel}
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
