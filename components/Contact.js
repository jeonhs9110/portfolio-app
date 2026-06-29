'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FiMail, FiPhone, FiFileText, FiFolder, FiGithub, FiLinkedin } from 'react-icons/fi';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section className="contact contact--finale" id="contact">
            <div className="container contact__inner-finale contact__inner-finale--two-col">
                {/* AI-generated portrait floats on the right alongside the
                    action buttons. Stacks above on mobile so the buttons
                    stay accessible. */}
                <motion.div
                    className="contact__portrait"
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                >
                    <span className="contact__portrait-glow" />
                    <Image
                        src="/hyunsik-upper.png"
                        alt="Hyunsik Jeon"
                        width={520}
                        height={520}
                        className="contact__portrait-img"
                        priority={false}
                    />
                </motion.div>

                <div className="contact__copy">
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

                <motion.p
                    className="contact__open-to"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.18 }}
                >
                    <span className="contact__open-to-dot" aria-hidden="true" />
                    <span dangerouslySetInnerHTML={{ __html: t.contact.openTo }} />
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
            </div>

            <style jsx global>{`
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
                /* Two-column finale: copy + buttons on the left, AI portrait
                   on the right. Stacks on tablet and below. */
                .contact__inner-finale--two-col {
                    max-width: none;
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
                    gap: 3rem;
                    align-items: center;
                }
                .contact__inner-finale--two-col .contact__copy {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1.125rem;
                    min-width: 0;
                }
                .contact__portrait {
                    position: relative;
                    grid-column: 2;
                    grid-row: 1;
                    width: 100%;
                    max-width: 360px;
                    aspect-ratio: 1 / 1;
                    border-radius: 24px;
                    overflow: hidden;
                    isolation: isolate;
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.22),
                        0 32px 64px -16px rgba(0, 0, 0, 0.55),
                        0 0 0 1px rgba(147, 197, 253, 0.08);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    background: rgba(8, 14, 28, 0.25);
                }
                .contact__portrait-glow {
                    position: absolute;
                    inset: -25%;
                    pointer-events: none;
                    z-index: -1;
                    background: radial-gradient(50% 50% at 50% 50%, rgba(147, 197, 253, 0.32), transparent 60%);
                    filter: blur(40px);
                }
                .contact__portrait :global(.contact__portrait-img) {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover;
                    object-position: center top;
                    border-radius: 24px;
                }
                @media (max-width: 900px) {
                    .contact__inner-finale--two-col {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .contact__portrait {
                        grid-column: 1;
                        grid-row: 1;
                        max-width: 200px;
                        justify-self: flex-start;
                    }
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

                /* "Currently open to..." availability strip — small, deliberate,
                   with a pulsing accent dot so it reads as a live signal. */
                .contact__open-to {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.625rem;
                    margin: 0.25rem 0 1.5rem 0;
                    padding: 0.625rem 1rem;
                    border-radius: 9999px;
                    background: rgba(8, 14, 28, 0.55);
                    border: 1px solid rgba(147, 197, 253, 0.32);
                    color: rgba(255, 255, 255, 0.94);
                    font-size: 0.875rem;
                    line-height: 1.35;
                    max-width: 42rem;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
                }
                .contact__open-to-dot {
                    width: 0.5rem;
                    height: 0.5rem;
                    border-radius: 9999px;
                    background: #4ade80;
                    flex-shrink: 0;
                    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
                    animation: contact-pulse 2.2s ease-out infinite;
                }
                @keyframes contact-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
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
