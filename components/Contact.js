'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiMail, FiPhone, FiFileText, FiFolder, FiGithub, FiLinkedin } from 'react-icons/fi';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section className="contact contact--finale" id="contact">
            <div className="container contact__inner-finale">
                <motion.p
                    className="section-label contact__label"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {t.contact.section}
                </motion.p>

                <motion.h2
                    className="contact__title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.07 }}
                >
                    {t.contact.title}
                </motion.h2>

                <motion.p
                    className="contact__subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.14 }}
                >
                    {t.contact.subtitle}
                </motion.p>

                <motion.div
                    className="contact__row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.22 }}
                >
                    <a href="mailto:jeonhs9110@gmail.com" className="contact__btn contact__btn--primary">
                        <FiMail size={16} />
                        {t.contact.email}
                    </a>
                    <a href="tel:+821040920628" className="contact__btn">
                        <FiPhone size={16} />
                        {t.contact.phone}
                    </a>
                    <a href="https://github.com/jeonhs9110" target="_blank" rel="noopener noreferrer" className="contact__btn">
                        <FiGithub size={16} />
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/jeonhyunsik" target="_blank" rel="noopener noreferrer" className="contact__btn">
                        <FiLinkedin size={16} />
                        LinkedIn
                    </a>
                </motion.div>

                <motion.div
                    className="contact__row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <a href="/Hyunsik_Jeon_Resume_KR.pdf" download className="contact__btn">
                        <FiFileText size={16} />
                        {t.contact.cv_ko}
                    </a>
                    <a href="/Hyunsik_Jeon_Resume_EN.pdf" download className="contact__btn">
                        <FiFileText size={16} />
                        {t.contact.cv_en}
                    </a>
                </motion.div>

                <motion.div
                    className="contact__row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.38 }}
                >
                    <a href="/Hyunsik_Jeon_Portfolio_KR.pdf" download className="contact__btn">
                        <FiFolder size={16} />
                        {t.contact.portfolio_ko}
                    </a>
                    <a href="/Hyunsik_Jeon_Portfolio_EN.pdf" download className="contact__btn">
                        <FiFolder size={16} />
                        {t.contact.portfolio_en}
                    </a>
                </motion.div>
            </div>

            <style jsx>{`
                .contact--finale {
                    position: relative;
                    overflow: hidden;
                    border-top: 0;
                    padding: 7rem 0 8rem 0;
                    color: #fff;
                    background: transparent;
                }
                .contact__inner-finale {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1.125rem;
                    max-width: 760px;
                }
                .contact__label { color: #93c5fd; margin-bottom: 0; }
                .contact__title {
                    font-size: clamp(2rem, 5.2vw, 3.75rem);
                    font-weight: 600;
                    line-height: 1.08;
                    letter-spacing: -0.02em;
                    color: #fff;
                    text-wrap: balance;
                    margin: 0;
                    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
                }
                .contact__subtitle {
                    font-size: 1rem;
                    line-height: 1.65;
                    color: rgba(255, 255, 255, 0.88);
                    max-width: 38rem;
                    margin: 0 0 0.625rem 0;
                    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
                }
                @media (min-width: 768px) {
                    .contact__subtitle { font-size: 1.0625rem; }
                }
                .contact__row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.625rem;
                }
                .contact__btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.125rem;
                    border-radius: 9999px;
                    background: rgba(8, 14, 28, 0.55);
                    border: 1px solid rgba(255, 255, 255, 0.20);
                    color: #fff;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .contact__btn:hover {
                    background: rgba(8, 14, 28, 0.75);
                    border-color: rgba(255, 255, 255, 0.35);
                    transform: translateY(-1px);
                }
                .contact__btn--primary {
                    background: linear-gradient(135deg, #3a7aad, #2c5c88);
                    border-color: transparent;
                    box-shadow: 0 6px 20px -6px rgba(58, 122, 173, 0.5);
                }
                .contact__btn--primary:hover {
                    background: linear-gradient(135deg, #4a8abd, #3a6c98);
                    border-color: transparent;
                }
            `}</style>
        </section>
    );
}
