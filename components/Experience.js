'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiDownload } from 'react-icons/fi';

// Goal/Result keywords we expect inside achievement strings. Lines that
// start with one of these get pulled into a labelled block so the eye
// reads ACTION → GOAL → RESULT without parsing prose.
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

/**
 * Parse one achievement string (with embedded <strong> tags) into action
 * text + an optional goal block + an optional result block. Items that
 * don't follow this shape stay as a single span — many of the smaller
 * bullets (interpretation, network maintenance, etc) don't need
 * goal/result framing.
 */
function parseDealItem(html) {
    const lines = html.split('\n');
    const actionLines = [];
    let goal = null;
    let result = null;
    for (const line of lines) {
        const g = matchPrefix(line, GOAL_PREFIXES);
        if (g !== null) { goal = g; continue; }
        const r = matchPrefix(line, RESULT_PREFIXES);
        if (r !== null) { result = r; continue; }
        actionLines.push(line);
    }
    return { action: actionLines.join('\n'), goal, result };
}

function DealItem({ html, lang }) {
    const { action, goal, result } = parseDealItem(html);

    // No goal/result markers — render as the original single span.
    if (!goal && !result) {
        return (
            <span
                style={{ fontSize: '0.85rem', lineHeight: '1.65', whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    const goalLabel = lang === 'ko' ? '목표' : 'Goal';
    const resultLabel = lang === 'ko' ? '결과' : 'Result';

    return (
        <div className="experience__deal">
            <div
                className="experience__deal-action"
                dangerouslySetInnerHTML={{ __html: action }}
            />
            {goal && (
                <div className="experience__deal-block experience__deal-block--goal">
                    <span className="experience__deal-label">{goalLabel}</span>
                    <span
                        className="experience__deal-text"
                        dangerouslySetInnerHTML={{ __html: goal }}
                    />
                </div>
            )}
            {result && (
                <div className="experience__deal-block experience__deal-block--result">
                    <span className="experience__deal-label">{resultLabel}</span>
                    <span
                        className="experience__deal-text"
                        dangerouslySetInnerHTML={{ __html: result }}
                    />
                </div>
            )}
        </div>
    );
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
};

/**
 * Real corporate logo badges per job (index-keyed, language-independent).
 * Logos sourced from each company's official site / Wikimedia Commons
 * and stored locally in /public/logos/. Slides in from one side as the
 * card crosses viewport centre, slides back out as it leaves — driven
 * entirely by --pop on the card, inherited via CSS variable cascading.
 *
 * Sides alternate left/right for visual rhythm.
 *
 * Logo sources:
 *   leeko-white.svg          leeko.com/images/logo/logo-white.svg
 *   hmp.png                  hmplaw.com/image/common/logo2.png
 *   national-assembly.svg    Wikimedia Commons (Emblem of the National
 *                            Assembly of Korea, public domain)
 *   concentrix.svg           Wikimedia Commons (Concentrix logo)
 */
const COMPANY_BADGES = [
    { logo: '/logos/leeko-white.svg',       alt: 'Lee & Ko', tagline: '법무법인 광장', style: 'lee-ko',            side: 'left'  },
    { logo: '/logos/hmp.png',               alt: 'HMP Law',  tagline: '법무법인 충정', style: 'hmp',               side: 'right' },
    { logo: '/logos/national-assembly.svg', alt: '대한민국 국회', tagline: 'NATIONAL ASSEMBLY OF KOREA', style: 'national-assembly', side: 'left'  },
    { logo: '/logos/concentrix.svg',        alt: 'Concentrix', tagline: 'APPLE ECOSYSTEM SUPPORT', style: 'concentrix', side: 'right' },
];

export default function Experience() {
    const { t, lang } = useLanguage();

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

                {/* Experience List — natural vertical scroll. Each card
                    pops visually via ScrollSpotlight's --pop as it crosses
                    viewport centre. */}
                <div className="experience__list">
                    {t.experience.jobs.map((job, i) => {
                        const badge = COMPANY_BADGES[i];
                        return (
                        <motion.div
                            key={i}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp}
                        >
                        <div className="experience__card">
                            {badge && (
                                <div
                                    className={`experience__badge experience__badge--${badge.side} experience__badge--${badge.style}`}
                                    aria-hidden="true"
                                >
                                    <img
                                        src={badge.logo}
                                        alt={badge.alt}
                                        className="experience__badge-logo"
                                        loading="lazy"
                                    />
                                    {badge.tagline && (
                                        <span className="experience__badge-tagline">{badge.tagline}</span>
                                    )}
                                </div>
                            )}
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
                                                <li key={idxx} className="experience__achieved-item" style={{ marginBottom: '14px', alignItems: 'flex-start' }}>
                                                    <span className="experience__dot" style={{ marginTop: '8px' }} />
                                                    <DealItem html={item} lang={lang} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
