'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiMail, FiPhone, FiFileText, FiFolder } from 'react-icons/fi';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section className="contact" id="contact">
            <div className="container">
                <div className="contact__inner">
                    <motion.p
                        className="section-label"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t.contact.section}
                    </motion.p>

                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.07 }}
                    >
                        {t.contact.title}
                    </motion.h2>

                    <motion.p
                        className="contact__subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.14 }}
                    >
                        {t.contact.subtitle}
                    </motion.p>

                    {/* Row 1: Email + Phone */}
                    <motion.div
                        className="contact__links"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ marginBottom: '16px' }}
                    >
                        <a href="mailto:jeonhs9110@gmail.com" className="btn btn-primary">
                            <FiMail size={18} />
                            {t.contact.email}
                        </a>
                        <a href="tel:+821040920628" className="btn btn-outline">
                            <FiPhone size={18} />
                            {t.contact.phone}
                        </a>
                    </motion.div>

                    {/* Row 2: Resume Downloads */}
                    <motion.div
                        className="contact__links"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.28 }}
                        style={{ marginBottom: '12px' }}
                    >
                        <a href="/Hyunsik_Jeon_Resume_KR.pdf" download className="btn btn-outline">
                            <FiFileText size={18} />
                            {t.contact.cv_ko}
                        </a>
                        <a href="/Hyunsik_Jeon_Resume_EN.pdf" download className="btn btn-outline">
                            <FiFileText size={18} />
                            {t.contact.cv_en}
                        </a>
                    </motion.div>

                    {/* Row 3: Portfolio Downloads */}
                    <motion.div
                        className="contact__links"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                    >
                        <a href="/Hyunsik_Jeon_Portfolio_KR.pdf" download className="btn btn-outline">
                            <FiFolder size={18} />
                            {t.contact.portfolio_ko}
                        </a>
                        <a href="/Hyunsik_Jeon_Portfolio_EN.pdf" download className="btn btn-outline">
                            <FiFolder size={18} />
                            {t.contact.portfolio_en}
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
