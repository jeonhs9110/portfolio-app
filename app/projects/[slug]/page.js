'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import { useLanguage } from '@/context/LanguageContext';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';
import Navbar from '@/components/Navbar';

export default function ProjectDetail() {
    const params = useParams();
    const router = useRouter();
    const { lang, t } = useLanguage();

    const project = projects.find((p) => p.slug === params.slug);

    if (!project) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '16px' }}>404</p>
                    <Link href="/" className="btn btn-outline">← 홈으로</Link>
                </div>
            </div>
        );
    }

    const detail = lang === 'ko' ? project.detailKo : project.detailEn;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '64px', minHeight: '100vh' }}>

                {/* ——— Hero Banner ——— */}
                <div className="project-detail__hero" style={{ background: `${project.color}10`, borderBottom: '1px solid var(--border)', padding: '60px 0 0' }}>
                    <div className="container">
                        {/* Back link */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link
                                href="/#projects"
                                className="btn btn-outline"
                                style={{ fontSize: '0.82rem', marginBottom: '40px', display: 'inline-flex' }}
                            >
                                <FiArrowLeft size={14} />
                                {lang === 'ko' ? '프로젝트 목록' : 'All Projects'}
                            </Link>
                        </motion.div>

                        {/* Title row */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            style={{ marginBottom: '16px' }}
                        >
                            <p style={{ fontSize: '0.75rem', color: project.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>
                                Project 0{project.id}
                            </p>
                            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.1' }}>
                                {lang === 'ko' ? project.titleKo : project.titleEn}
                            </h1>
                        </motion.div>

                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}
                        >
                            {project.tags.map((tag) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </motion.div>

                        {/* Screenshot — only if project.image exists */}
                        {project.image && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.2 }}
                                style={{
                                    position: 'relative', width: '100%', maxWidth: '1000px',
                                    aspectRatio: '16/9', borderRadius: '16px 16px 0 0',
                                    overflow: 'hidden', border: '1px solid var(--border)',
                                    borderBottom: 'none', boxShadow: `0 -20px 80px ${project.color}20`
                                }}
                            >
                                <Image
                                    src={project.image}
                                    alt={lang === 'ko' ? project.titleKo : project.titleEn}
                                    fill
                                    style={{ objectFit: 'contain', backgroundColor: 'var(--bg-surface)' }}
                                    priority
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ——— Content ——— */}
                <div style={{ padding: '80px 0 120px' }}>
                    <div className="container">
                        <div className="project-detail__grid">

                            {/* Left — main content */}
                            <div>
                                {/* Overview */}
                                <motion.section
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    style={{ marginBottom: '32px' }}
                                >
                                    <h2 className="project-detail__section-title">
                                        {lang === 'ko' ? '프로젝트 개요' : 'Overview'}
                                    </h2>
                                    <p className="project-detail__body">{detail.overview}</p>
                                </motion.section>

                                {/* Features */}
                                <motion.section
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    style={{ marginBottom: '32px' }}
                                >
                                    <h2 className="project-detail__section-title">
                                        {lang === 'ko' ? '핵심 기능' : 'Key Features'}
                                    </h2>
                                    <ul className="project-detail__features">
                                        {detail.features.map((f, i) => (
                                            <li key={i} className="project-detail__feature-item">
                                                <span className="project-detail__feature-dot" style={{ background: project.color }} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.section>

                                {/* Tech Stack */}
                                <motion.section
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.15 }}
                                >
                                    <h2 className="project-detail__section-title">
                                        {lang === 'ko' ? '기술 스택' : 'Tech Stack'}
                                    </h2>
                                    <div className="project-detail__tech-card">
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                            {detail.techDetail}
                                        </p>
                                    </div>
                                </motion.section>

                                {/* Screenshot Gallery — only if project.images exists */}
                                {project.images && project.images.length > 0 && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        style={{ marginTop: '40px' }}
                                    >
                                        <h2 className="project-detail__section-title">
                                            {lang === 'ko' ? '스크린샷' : 'Screenshots'}
                                        </h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                                            {project.images.map((src, i) => (
                                                <motion.div
                                                    key={src}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                                    style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
                                                >
                                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '8px 14px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                                        v{7 - i}
                                                    </p>
                                                    <Image
                                                        src={src}
                                                        alt={`${lang === 'ko' ? project.titleKo : project.titleEn} v${7 - i}`}
                                                        width={1200}
                                                        height={700}
                                                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', backgroundColor: 'var(--bg-surface)' }}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>
                                )}
                            </div>

                            {/* Right — sidebar links */}
                            <motion.aside
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="project-detail__sidebar"
                            >
                                {(project.link || project.video || project.github) && (
                                    <div className="project-detail__sidebar-card">
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                                            {lang === 'ko' ? '링크' : 'Links'}
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                                                    <FiExternalLink size={15} />
                                                    {lang === 'ko' ? '라이브 데모' : 'Live Demo'}
                                                </a>
                                            )}
                                            {project.video && (
                                                <a href={project.video} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center', background: '#e11d48', borderColor: '#e11d48' }}>
                                                    {lang === 'ko' ? '기능 시연 영상' : 'Demo Video'}
                                                </a>
                                            )}
                                            {project.github && (
                                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                                                    <FiGithub size={15} />
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Other projects */}
                                <div className="project-detail__sidebar-card" style={{ marginTop: '20px' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                                        {lang === 'ko' ? '다른 프로젝트' : 'Other Projects'}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {projects.filter((p) => p.id !== project.id).map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/projects/${p.slug}`}
                                                className="project-detail__other-item"
                                                style={{
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                    padding: '10px',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <span>{p.emoji}</span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                    {lang === 'ko' ? p.titleKo : p.titleEn}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.aside>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
