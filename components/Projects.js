'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { projects } from '@/lib/projects';
import { FiExternalLink, FiGithub, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
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
                    {[...projects].reverse().map((proj, i) => (
                        <motion.div
                            key={proj.id}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp}
                            style={{ position: 'relative' }}
                        >
                            {/* Entire card is a clickable div instead of a Link to avoid nested <a> tags */}
                            <div
                                onClick={() => router.push(`/projects/${proj.slug}`)}
                                className="project-card project-card--clickable"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {/* Number */}
                                <span className="project-card__num">0{proj.id}</span>



                                {/* Main info */}
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

                                {/* Right side: external links + view arrow */}
                                <div className="project-card__links">
                                    {/* "View detail" arrow indicator */}
                                    <span className="project-card__arrow">
                                        <FiArrowRight size={18} />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
