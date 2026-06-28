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
const SELECTORS = [
    '.experience__card',
    '.project-card',
    '.skills__category',
    '.about__win',
    '.about__feature-card',
    '.about__stat',
];

export default function ScrollSpotlight() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mql.matches) return;

        let raf = 0;
        let cancelled = false;
        let targets = [];

        function refresh() {
            targets = SELECTORS.flatMap((sel) =>
                Array.from(document.querySelectorAll(sel))
            );
        }

        function update() {
            raf = 0;
            const viewportH = window.innerHeight;
            const viewportCenter = viewportH / 2;
            // "Spotlight zone" — items inside this range from center grow.
            // At ~0.45 * viewport height of distance, scale returns to base.
            const maxDistance = viewportH * 0.45;
            for (const el of targets) {
                const rect = el.getBoundingClientRect();
                // Skip items entirely off-screen — release the CSS var so
                // hover / static state takes back over.
                if (rect.bottom < -100 || rect.top > viewportH + 100) {
                    if (el.style.getPropertyValue('--spot-scale')) {
                        el.style.removeProperty('--spot-scale');
                    }
                    continue;
                }
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(itemCenter - viewportCenter);
                const linear = Math.max(0, 1 - distance / maxDistance);
                // Smoothstep — softens the spotlight peak so items don't
                // snap to max scale.
                const eased = linear * linear * (3 - 2 * linear);
                // Scale range: 0.96 (far) → 1.05 (center). ~9% delta is
                // noticeable without feeling like a video-game zoom.
                const scale = 0.96 + eased * 0.09;
                el.style.setProperty('--spot-scale', scale.toFixed(3));
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
