'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
    const { t, lang, toggleLang } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Lock body scroll when the mobile sheet is open.
    useEffect(() => {
        if (mobileOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [mobileOpen]);

    const scrollTo = (id) => {
        setMobileOpen(false);
        if (pathname !== '/') {
            router.push(`/#${id}`);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navKeys = ['about', 'experience', 'projects', 'skills', 'contact'];

    return (
        <>
            <nav className="navbar">
                <a
                    href="#hero"
                    className="navbar__logo"
                    onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
                >
                    Hyunsik Jeon
                </a>

                <ul className="navbar__links">
                    {navKeys.map((key) => (
                        <li key={key}>
                            <a
                                href={`#${key}`}
                                onClick={(e) => { e.preventDefault(); scrollTo(key); }}
                            >
                                {t.nav[key]}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="navbar__right">
                    <button
                        className="lang-toggle"
                        onClick={toggleLang}
                        aria-label={lang === 'ko' ? 'Switch language to English' : '한국어로 언어 변경'}
                    >
                        {lang === 'ko' ? 'EN' : '한국어'}
                    </button>
                    <button
                        className="navbar__hamburger"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile sheet — full-viewport dark glass overlay */}
            <div
                className={`navbar__sheet${mobileOpen ? ' is-open' : ''}`}
                aria-hidden={!mobileOpen}
            >
                <ul className="navbar__sheet-links">
                    {navKeys.map((key) => (
                        <li key={key}>
                            <a
                                href={`#${key}`}
                                onClick={(e) => { e.preventDefault(); scrollTo(key); }}
                            >
                                {t.nav[key]}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="navbar__sheet-footer">
                    <span>{lang === 'ko' ? '언어' : 'Language'}</span>
                    <button
                        className="lang-toggle"
                        onClick={() => { toggleLang(); }}
                        aria-label={lang === 'ko' ? 'Switch language to English' : '한국어로 언어 변경'}
                    >
                        {lang === 'ko' ? 'English' : '한국어'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .navbar__hamburger {
                    display: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 9999px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    color: #fff;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease, border-color 0.2s ease;
                    margin-left: 0.5rem;
                }
                .navbar__hamburger:hover {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(255, 255, 255, 0.35);
                }
                @media (max-width: 900px) {
                    .navbar__hamburger {
                        display: inline-flex;
                    }
                }

                .navbar__sheet {
                    position: fixed;
                    inset: 0;
                    z-index: 99;
                    background: rgba(4, 6, 15, 0.78);
                    backdrop-filter: blur(28px) saturate(140%);
                    -webkit-backdrop-filter: blur(28px) saturate(140%);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 6rem 1.75rem 2.5rem;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.25s ease;
                }
                .navbar__sheet.is-open {
                    opacity: 1;
                    pointer-events: auto;
                }

                .navbar__sheet-links {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .navbar__sheet-links a {
                    display: block;
                    font-size: 1.875rem;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    color: #fff;
                    text-decoration: none;
                    padding: 0.5rem 0;
                    transition: color 0.2s ease;
                }
                .navbar__sheet-links a:hover {
                    color: #93c5fd;
                }

                .navbar__sheet-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.12);
                    padding-top: 1.25rem;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.8125rem;
                }
            `}</style>
        </>
    );
}
