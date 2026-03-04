'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const { t, lang, toggleLang } = useLanguage();

    const router = useRouter();
    const pathname = usePathname();

    const scrollTo = (id) => {
        if (pathname !== '/') {
            // If we are not on the homepage, push to the homepage with the hash
            router.push(`/#${id}`);
        } else {
            // If we are already on the homepage, just scroll smoothly
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar">
            <a
                href="#hero"
                className="navbar__logo"
                onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
            >
                Hyunsik Jeon
            </a>

            <ul className="navbar__links">
                {['about', 'experience', 'skills', 'projects', 'contact'].map((key) => (
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
                <button className="lang-toggle" onClick={toggleLang}>
                    {lang === 'ko' ? 'EN' : '한국어'}
                </button>
            </div>
        </nav>
    );
}
