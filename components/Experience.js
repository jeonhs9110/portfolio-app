'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiDownload } from 'react-icons/fi';

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function Experience() {
    const { t } = useLanguage();

    return (
        <section className="experience" id="experience">
            <div className="container">
                {/* Section Header */}
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    {t.experience.section}
                </motion.p>

                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                >
                    {t.experience.title}
                </motion.h2>

                {/* Experience List */}
                <div className="experience__list">
                    {t.experience.jobs.map((job, i) => (
                        <motion.div
                            key={i}
                            className="experience__card"
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp}
                        >
                            <div className="experience__card-header">
                                <div>
                                    <h3 className="experience__role">{job.role}</h3>
                                    <p className="experience__company">{job.company}</p>
                                </div>
                                <div className="experience__period" style={{ fontWeight: 'bold' }}>{job.period}</div>
                            </div>
                            <p className="experience__desc">{job.desc}</p>
                            <div className="experience__achievements" style={{ marginTop: '16px' }}>
                                {job.achievements.map((ach, idx) => (
                                    <div key={idx} className="experience__achieved-group" style={{ marginBottom: '12px' }}>
                                        {ach.category && (
                                            <h4 className="experience__achieved-category" style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-color)', fontWeight: 600 }}>
                                                {ach.category}
                                            </h4>
                                        )}
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {ach.items.map((item, idxx) => (
                                                <li key={idxx} className="experience__achieved-item">
                                                    <span className="experience__dot" />
                                                    <span style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
