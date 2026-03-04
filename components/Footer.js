'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="footer">
            <p>{t.footer.copy}</p>
        </footer>
    );
}
