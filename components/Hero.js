'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText('jeonhs9110@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="hero" id="hero">
            <div className="hero__inner">
                {/* Text side */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="hero__greeting">{t.hero.greeting}</p>
                    <h1 className="hero__name">{t.hero.name}</h1>
                    <p className="hero__subtitle">{t.hero.subtitle}</p>
                    <p className="hero__desc">{t.hero.description}</p>
                </motion.div>

                {/* Photo side */}
                <motion.div
                    className="hero__photo-wrap"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="hero__photo-glow" />
                    <Image
                        src="/hyunsik-picture.jpg"
                        alt="Hyunsik Jeon"
                        fill
                        className="hero__photo"
                        style={{ objectFit: 'cover', borderRadius: '16px' }}
                        priority
                    />
                </motion.div>
            </div>

            {/* Scroll pill */}
            <div className="hero__scroll">
                <span className="hero__scroll-arrow">↓</span>
                <span>{t.hero.scroll}</span>
            </div>
        </section>
    );
}
