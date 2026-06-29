'use client';

import { useEffect } from 'react';

/**
 * Two scroll-driven effects.
 *
 *   CARDS — every "boxy" component scales up as it passes through a
 *   TIGHT zone right at viewport centre, then scales back down as
 *   the user keeps scrolling. The zone is intentionally narrow
 *   (~15% of viewport height) so at any given scroll position
 *   exactly one card is "active" — visitor sees: box 1 pops out,
 *   scroll a bit, box 1 returns to normal AND box 2 pops out,
 *   scroll a bit more, box 2 returns AND box 3 pops out…
 *
 *   KEYWORDS — every <strong class="kw"> picks up a cyan halo when
 *   it sits inside an even tighter zone (~5% of viewport) so the
 *   exact line being read lights up, and previous / next lines
 *   stay quiet.
 *
 * One RAF-throttled scroll handler does both. Disabled entirely for
 * prefers-reduced-motion: reduce.
 */
const CARD_SELECTORS = [
    '.experience__card',
    '.project-card',
    '.skills__category',
    '.about__win',
    '.about__feature-card',
    '.about__stat',
];

const KW_SELECTOR = '.kw';

export default function ScrollSpotlight() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mql.matches) return;

        let raf = 0;
        let cancelled = false;
        let cards = [];
        let kws = [];

        function refresh() {
            cards = CARD_SELECTORS.flatMap((sel) =>
                Array.from(document.querySelectorAll(sel))
            );
            kws = Array.from(document.querySelectorAll(KW_SELECTOR));
        }

        function update() {
            raf = 0;
            const viewportH = window.innerHeight;
            const viewportCenter = viewportH / 2;

            // Cards: 15% viewport zone — wide enough to feel smooth, tight
            // enough that only ~one card at a time is at peak scale.
            const cardMaxDistance = viewportH * 0.15;

            // Keywords: 5% viewport zone — really just the line you're on.
            const kwMaxDistance = viewportH * 0.05;

            for (const el of cards) {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < -100 || rect.top > viewportH + 100) {
                    if (el.style.getPropertyValue('--spot-scale')) {
                        el.style.removeProperty('--spot-scale');
                    }
                    continue;
                }
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(itemCenter - viewportCenter);
                const linear = Math.max(0, 1 - distance / cardMaxDistance);
                // Sharper easing (cubic-style) so the transition between
                // "normal" and "active" reads as deliberate rather than
                // a slow drift.
                const eased = linear < 0.5
                    ? 4 * linear * linear * linear
                    : 1 - Math.pow(-2 * linear + 2, 3) / 2;
                // Scale 1.00 → 1.15 (15% pop at peak — clearly bigger
                // than its neighbours but doesn't overflow containers).
                const scale = 1.0 + eased * 0.15;
                el.style.setProperty('--spot-scale', scale.toFixed(3));
            }

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
                const linear = Math.max(0, 1 - distance / kwMaxDistance);
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
