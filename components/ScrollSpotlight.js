'use client';

import { useEffect } from 'react';

/**
 * Keyword spotlight.
 *
 * Cards stay dormant. ONLY <strong class="kw"> elements get a
 * scroll-driven cyan halo, and the spotlight zone is tight enough
 * (~10% of viewport height around centre) that only the keyword the
 * eye is actually reading lights up. Scroll past it → it dims back
 * down. The next keyword → that one lights up. And so on.
 *
 * One RAF-throttled scroll handler queries every .kw on the page,
 * measures distance to viewport centre, writes a `--kw-spot` (0 → 1)
 * intensity variable. CSS in globals.css turns that variable into
 * text-shadow blur radius + alpha.
 *
 * Disabled entirely for prefers-reduced-motion: reduce.
 */
const KW_SELECTOR = '.kw';

export default function ScrollSpotlight() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mql.matches) return;

        let raf = 0;
        let cancelled = false;
        let kws = [];

        function refresh() {
            kws = Array.from(document.querySelectorAll(KW_SELECTOR));
        }

        function update() {
            raf = 0;
            const viewportH = window.innerHeight;
            const viewportCenter = viewportH / 2;
            // Tight 10% viewport zone around centre. At ~5% above and
            // below, --kw-spot returns to 0. That means typically only
            // the keyword on the line the user is actually reading is
            // lit up; previous and next lines stay quiet.
            const maxDistance = viewportH * 0.10;

            for (const el of kws) {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < -50 || rect.top > viewportH + 50) {
                    if (el.style.getPropertyValue('--kw-spot')) {
                        el.style.removeProperty('--kw-spot');
                    }
                    continue;
                }
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(itemCenter - viewportCenter);
                const linear = Math.max(0, 1 - distance / maxDistance);
                // Smoothstep — gives a soft attack and release as the
                // line slides through the spotlight zone.
                const eased = linear * linear * (3 - 2 * linear);
                el.style.setProperty('--kw-spot', eased.toFixed(3));
            }
        }

        function onScroll() {
            if (raf || cancelled) return;
            raf = requestAnimationFrame(update);
        }

        refresh();
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        // "See more projects" reveals additional .kw — re-query when
        // the DOM changes.
        const observer = new MutationObserver(() => {
            refresh();
            update();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            observer.disconnect();
        };
    }, []);

    return null;
}
