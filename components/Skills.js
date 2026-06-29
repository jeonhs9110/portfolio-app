'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Skills() {
    const { t } = useLanguage();

    return (
        <section className="skills" id="skills">
            <div className="container">
                <motion.p
                    className="section-label"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeUp}
                >
                    {t.skills.section}
                </motion.p>

                <motion.h2
                    className="section-title"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeUp}
                >
                    {t.skills.title}
                </motion.h2>

                {/* 2x2 grid of skill categories. Each tile pops visually
                    via ScrollSpotlight's --pop as it crosses viewport centre. */}
                <motion.div
                    className="skills__grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {t.skills.categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: (j) => ({
                                    opacity: 1, y: 0,
                                    transition: { duration: 0.5, delay: j * 0.08, ease: [0.22, 1, 0.36, 1] },
                                }),
                            }}
                        >
                        <div className="skills__category">
                            <p className="skills__cat-name">{cat.name}</p>
                            <div className="skills__items">
                                {cat.items.map((item) => (
                                    <span key={item} className="skills__item">{item}</span>
                                ))}
                            </div>
                        </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
