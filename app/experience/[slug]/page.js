'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '@/components/Navbar';


/**
 * Achievement item — mirrors the DealItem logic from the old Experience.js
 * so goal / result blocks render as structured chips, not prose.
 */
const GOAL_PREFIXES = ['목표:', '목표 :', 'Objective:', 'Objective :', 'Goal:', 'Goal :'];
const RESULT_PREFIXES = ['결과:', '결과 :', 'Outcome:', 'Outcome :', 'Result:', 'Result :'];

function matchPrefix(line, prefixes) {
    for (const p of prefixes) {
        if (line.trimStart().startsWith(p)) {
            return line.trimStart().slice(p.length).trimStart();
        }
    }
    return null;
}

function parseItem(html) {
    const lines = html.split('\n');
    const actionLines = [];
    let goal = null, result = null;
    for (const line of lines) {
        const g = matchPrefix(line, GOAL_PREFIXES);
        if (g !== null) { goal = g; continue; }
        const r = matchPrefix(line, RESULT_PREFIXES);
        if (r !== null) { result = r; continue; }
        actionLines.push(line);
    }
    return { action: actionLines.join('\n'), goal, result };
}

function AchievementItem({ html, lang, index }) {
    const { action, goal, result } = parseItem(html);
    const goalLabel = lang === 'ko' ? '목표' : 'Goal';
    const resultLabel = lang === 'ko' ? '결과' : 'Result';

    return (
        <motion.li
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="exp-detail__item"
        >
            <span className="exp-detail__item-dot" aria-hidden="true" />
            <div className="exp-detail__item-body">
                <div
                    className="exp-detail__item-action"
                    dangerouslySetInnerHTML={{ __html: action }}
                />
                {goal && (
                    <div className="exp-detail__block exp-detail__block--goal">
                        <span className="exp-detail__label">{goalLabel}</span>
                        <span dangerouslySetInnerHTML={{ __html: goal }} />
                    </div>
                )}
                {result && (
                    <div className="exp-detail__block exp-detail__block--result">
                        <span className="exp-detail__label">{resultLabel}</span>
                        <span dangerouslySetInnerHTML={{ __html: result }} />
                    </div>
                )}
            </div>
        </motion.li>
    );
}


export default function ExperienceDetail() {
    const params = useParams();
    const { lang, t } = useLanguage();

    const job = t.experience.jobs.find((j) => j.slug === params.slug);

    if (!job) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '16px' }}>404</p>
                        <Link href="/#experience" className="btn btn-outline">
                            <FiArrowLeft /> {lang === 'ko' ? '홈으로' : 'Back'}
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="exp-detail" style={{ paddingTop: '64px', minHeight: '100vh' }}>

                {/* Ambient background gradient */}
                <div className="exp-detail__ambient" aria-hidden="true" />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>

                    {/* Back link */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            href="/#experience"
                            className="exp-detail__back"
                        >
                            <FiArrowLeft />
                            {lang === 'ko' ? '경력으로 돌아가기' : 'Back to experience'}
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <motion.header
                        className="exp-detail__header"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
                        }}
                    >
                        <motion.p
                            className="exp-detail__period"
                            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                        >
                            {job.period}
                        </motion.p>
                        <motion.h1
                            className="exp-detail__role"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            {job.role}
                        </motion.h1>
                        <motion.p
                            className="exp-detail__company"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            {job.company}
                        </motion.p>
                        <motion.p
                            className="exp-detail__desc"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            {job.desc}
                        </motion.p>
                    </motion.header>

                    {/* Achievement list */}
                    <section className="exp-detail__achievements">
                        {job.achievements.map((ach, i) => (
                            <div key={i} className="exp-detail__group">
                                {ach.category && (
                                    <h3
                                        className="exp-detail__category"
                                        dangerouslySetInnerHTML={{ __html: ach.category }}
                                    />
                                )}
                                <ul className="exp-detail__list">
                                    {ach.items.map((item, idx) => (
                                        <AchievementItem
                                            key={idx}
                                            html={item}
                                            lang={lang}
                                            index={idx}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Footer nav */}
                    <div className="exp-detail__footer">
                        <Link href="/#experience" className="exp-detail__back">
                            <FiArrowLeft />
                            {lang === 'ko' ? '경력으로 돌아가기' : 'Back to experience'}
                        </Link>
                    </div>

                </div>
            </main>
        </>
    );
}
