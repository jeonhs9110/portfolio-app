'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FiMail, FiPhone, FiFileText, FiFolder, FiGithub, FiLinkedin } from 'react-icons/fi';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section className="contact contact--finale" id="contact">
            {/* Layered dark backdrop with a soft aurora pool behind the figure */}
            <div className="contact__bg" aria-hidden="true" />
            <div className="contact__aurora" aria-hidden="true" />

            <div className="container contact__layout">
                {/* Left column — copy + action buttons */}
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

                    {/* Row 1 — primary contacts */}
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

                    {/* Row 2 — resume downloads */}
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

                    {/* Row 3 — portfolio downloads */}
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

                {/* Right column — closing pose, full body anchored to bottom */}
                <motion.div
                    className="contact__figure"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Image
                        src="/jeon_pose_contact.png"
                        alt="Hyunsik Jeon — closing pose"
                        width={720}
                        height={960}
                        priority={false}
                        className="contact__figure-img"
                    />
                </motion.div>
            </div>

            <style jsx>{`
                .contact--finale {
                    position: relative;
                    overflow: hidden;
                    border-top: 0;
                    padding: 7rem 0 0 0;
                    min-height: 100vh;
                    color: #fff;
                    background: #050811;
                    display: flex;
                    flex-direction: column;
                }
                .contact__bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    background:
                        radial-gradient(70% 60% at 75% 100%, rgba(44, 92, 136, 0.45), transparent 65%),
                        radial-gradient(50% 50% at 15% 30%, rgba(30, 58, 138, 0.32), transparent 65%),
                        linear-gradient(180deg, #050811 0%, #070b1a 55%, #04060f 100%);
                    pointer-events: none;
                }
                .contact__aurora {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                    background:
                        radial-gradient(40% 35% at 80% 75%, rgba(58, 122, 173, 0.30), transparent 70%);
                    filter: blur(60px);
                    opacity: 0.9;
                }

                .contact__layout {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 3rem;
                    align-items: end;
                    flex: 1;
                    padding-bottom: 0;
                }
                @media (min-width: 900px) {
                    .contact__layout {
                        grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
                        gap: 4rem;
                    }
                }

                .contact__copy {
                    display: flex;
                    flex-direction: column;
                    gap: 1.125rem;
                    padding-bottom: 4rem;
                }
                @media (min-width: 900px) {
                    .contact__copy { padding-bottom: 5rem; }
                }

                .contact__label {
                    color: #93c5fd;
                    margin-bottom: 0;
                }

                .contact__title {
                    font-size: clamp(2rem, 5.2vw, 3.75rem);
                    font-weight: 600;
                    line-height: 1.08;
                    letter-spacing: -0.02em;
                    color: #fff;
                    text-wrap: balance;
                    margin: 0;
                }

                .contact__subtitle {
                    font-size: 1rem;
                    line-height: 1.65;
                    color: rgba(255, 255, 255, 0.78);
                    max-width: 38rem;
                    margin: 0 0 0.625rem 0;
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
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.16);
                    color: #fff;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                }
                .contact__btn:hover {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(255, 255, 255, 0.32);
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

                .contact__figure {
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    align-self: end;
                    width: 100%;
                    height: 100%;
                    min-height: 480px;
                }
                .contact__figure::before {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 4%;
                    transform: translateX(-50%);
                    width: 70%;
                    height: 60%;
                    background: radial-gradient(closest-side, rgba(58, 122, 173, 0.45), transparent 75%);
                    filter: blur(45px);
                    z-index: 0;
                    pointer-events: none;
                }
                .contact__figure :global(.contact__figure-img) {
                    position: relative;
                    z-index: 1;
                    width: auto !important;
                    height: 100% !important;
                    max-height: 78vh;
                    object-fit: contain;
                    object-position: bottom;
                    /* Hide the seamless-grey backdrop edge that crept into the
                       generated image, blending the figure into the dark page. */
                    -webkit-mask-image: radial-gradient(
                        130% 90% at 50% 60%,
                        black 55%,
                        rgba(0, 0, 0, 0.75) 78%,
                        transparent 100%
                    );
                    mask-image: radial-gradient(
                        130% 90% at 50% 60%,
                        black 55%,
                        rgba(0, 0, 0, 0.75) 78%,
                        transparent 100%
                    );
                    filter: drop-shadow(0 28px 60px rgba(0, 0, 0, 0.6));
                }

                /* Mobile: stack figure under the copy at a comfortable size */
                @media (max-width: 899px) {
                    .contact--finale {
                        padding-top: 5rem;
                    }
                    .contact__copy {
                        padding-bottom: 1rem;
                    }
                    .contact__figure {
                        min-height: 420px;
                    }
                    .contact__figure :global(.contact__figure-img) {
                        max-height: 60vh;
                    }
                }
            `}</style>
        </section>
    );
}
