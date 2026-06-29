'use client';

import { useEffect, useState } from 'react';
import { FiMail, FiLinkedin } from 'react-icons/fi';

/**
 * Bottom-right floating contact pill. Visible from when the visitor
 * scrolls past the hero (~50vh in) until they reach the Contact
 * section (which has its own large CTAs). Solves the "buried Contact"
 * problem — a recruiter who likes what they see at any scroll depth
 * can email or message on LinkedIn without scrolling to the bottom
 * of the page.
 *
 * On wide viewports: pill with icon + "Get in touch" label, plus a
 * round LinkedIn icon button next to it. On narrow viewports: just
 * two icon-only buttons.
 *
 * Visibility toggles on scroll position relative to the #contact
 * section, not via IntersectionObserver, so the fade is precisely
 * tied to where the user is rather than the section's top crossing
 * any arbitrary threshold.
 */
export default function FloatingContact() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function compute() {
            const contactSection = document.getElementById('contact');
            const minScroll = window.innerHeight * 0.5;
            const maxScroll = contactSection
                ? contactSection.offsetTop - window.innerHeight * 0.5
                : Number.POSITIVE_INFINITY;
            const y = window.scrollY || window.pageYOffset;
            setVisible(y > minScroll && y < maxScroll);
        }
        compute();
        window.addEventListener('scroll', compute, { passive: true });
        window.addEventListener('resize', compute);
        return () => {
            window.removeEventListener('scroll', compute);
            window.removeEventListener('resize', compute);
        };
    }, []);

    return (
        <div
            className={`floating-contact ${visible ? 'is-visible' : ''}`}
            aria-hidden={!visible}
        >
            <a
                href="mailto:jeonhs9110@gmail.com"
                className="floating-contact__btn floating-contact__btn--primary"
                aria-label="Email Hyunsik"
            >
                <FiMail size={18} />
                <span className="floating-contact__label">Get in touch</span>
            </a>
            <a
                href="https://www.linkedin.com/in/jeonhyunsik"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-contact__btn floating-contact__btn--icon"
                aria-label="LinkedIn"
            >
                <FiLinkedin size={18} />
            </a>
            <style jsx>{`
                .floating-contact {
                    position: fixed;
                    bottom: 1.5rem;
                    right: 1.5rem;
                    display: flex;
                    gap: 0.5rem;
                    z-index: 90;
                    opacity: 0;
                    transform: translateY(16px);
                    transition: opacity 0.32s ease,
                                transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
                    pointer-events: none;
                }
                .floating-contact.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }
                .floating-contact__btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.125rem;
                    border-radius: 9999px;
                    border: 1px solid rgba(255, 255, 255, 0.20);
                    text-decoration: none;
                    color: #fff;
                    font-size: 0.875rem;
                    font-weight: 500;
                    background: rgba(8, 14, 28, 0.72);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    box-shadow: 0 10px 28px -10px rgba(0, 0, 0, 0.7);
                    transition: background 0.2s ease,
                                border-color 0.2s ease,
                                transform 0.2s ease;
                }
                .floating-contact__btn:hover {
                    background: rgba(8, 14, 28, 0.88);
                    border-color: rgba(255, 255, 255, 0.36);
                    transform: translateY(-2px);
                }
                .floating-contact__btn--primary {
                    background: linear-gradient(135deg, #3a7aad, #2c5c88);
                    border-color: transparent;
                }
                .floating-contact__btn--primary:hover {
                    background: linear-gradient(135deg, #4a8abd, #3a6c98);
                    border-color: transparent;
                }
                .floating-contact__btn--icon {
                    padding: 0.75rem;
                    aspect-ratio: 1 / 1;
                }
                @media (max-width: 640px) {
                    .floating-contact {
                        bottom: 1rem;
                        right: 1rem;
                    }
                    .floating-contact__label {
                        display: none;
                    }
                    .floating-contact__btn--primary {
                        padding: 0.75rem;
                        aspect-ratio: 1 / 1;
                    }
                }
            `}</style>
        </div>
    );
}
