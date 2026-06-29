'use client';

import { useEffect } from 'react';

/**
 * Scroll spotlight — every "card-like" element on the page scales up as
 * it passes through the viewport's vertical center, and scales back
 * down as it moves away. Cards never reach full size simultaneously —
 * the eye always has one item in focus, the rest in the background.
 *
 * Implementation: a single RAF-throttled scroll handler queries every
 * `.spotlight-target` element on the page, measures its distance from
 * viewport-center, and writes a `--spot-scale` CSS variable on each.
 * CSS picks the variable up via `transform: scale(var(--spot-scale))`.
 *
 * Cards that ALSO have a hover transform (project cards translateY on
 * hover) keep theirs because the matching CSS combines scale + translate
 * via composed CSS variables.
 *
 * Disabled entirely for `prefers-reduced-motion: reduce`.
 */
const CARD_SELECTORS = [
    '.experience__card',
    '.project-card',
    '.skills__category',
    '.about__win',
    '.about__feature-card',
    '.about__stat',
];

// Bold keywords get their own treatment — a soft cyan halo whose
// intensity peaks at viewport center. Doesn't scale (would distort
// line-wrapping), only changes the text-shadow.
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
            // Cards: 0.45 * viewport height of distance = fully shrunk.
            const cardMaxDistance = viewportH * 0.45;
            // Keywords: a tighter spotlight zone (0.25 * viewport) so
            // exactly the line you're reading lights up. Sharper focal
            // attention than a 45% zone would give.
            const kwMaxDistance = viewportH * 0.25;

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
                const eased = linear * linear * (3 - 2 * linear);
                // Tighter 11% delta (was 18%) — large project cards and
                // small win tiles now feel like the same amount of pop
                // visually.
                const scale = 0.95 + eased * 0.11;
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
                // --kw-spot is a 0 → 1 intensity that CSS turns into
                // text-shadow blur radius + alpha. Highest when the
                // keyword sits exactly at viewport center.
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

        // The Projects section's "See more" button reveals additional
        // cards. Watch the DOM for childList changes so we re-query.
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
