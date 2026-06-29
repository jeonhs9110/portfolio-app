'use client';

import { useEffect } from 'react';

/**
 * Two scroll-driven effects, both proximity-driven, both driven by a
 * single RAF loop. No scroll-jacking, no sticky pinning — natural
 * scroll, unified motion vocabulary across every card type.
 *
 *   1. CARD POP — every "boxy" component picks up --pop (0 → 1) as
 *      its centre approaches viewport centre. At peak (--pop = 1)
 *      the card's bg goes near-opaque, it scales 1.03x, and a soft
 *      cyan halo lights it. At rest the card is semi-transparent so
 *      the silo bg reads through.
 *
 *      Same selector list across About wins, Skills categories,
 *      Experience jobs, Project cards. Same visual treatment.
 *      Visitor's eye sees: "this is the focus right now, not those."
 *
 *   2. KEYWORD GLOW — every <strong class="kw"> picks up --kw-spot
 *      (0 → 1) as it enters the reading band (12% of viewport around
 *      centre). At peak the keyword scales 8% and glows cyan, so the
 *      bolded words light up the instant the visitor's eye reaches
 *      them.
 *
 * Disabled entirely for prefers-reduced-motion: reduce.
 */

const POP_CARD_SELECTORS = [
    '.about__win',
    '.skills__category',
    '.experience__card',
    '.project-card',
];

const KW_SELECTOR = '.kw';

export default function ScrollSpotlight() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mql.matches) return;

        let raf = 0;
        let cancelled = false;
        let popCards = [];
        let kws = [];

        function refresh() {
            popCards = POP_CARD_SELECTORS.flatMap((sel) =>
                Array.from(document.querySelectorAll(sel))
            );
            kws = Array.from(document.querySelectorAll(KW_SELECTOR));
        }

        function update() {
            raf = 0;
            const viewportH = window.innerHeight;
            const viewportCenterY = viewportH / 2;

            // 25% zone — comfortable ramp, peak holds for ~half a viewport
            // of scroll as the card crosses the focal band. Tight enough
            // that adjacent cards in a vertical stack hand off cleanly
            // (only one card's centre can be at viewport centre at any
            // time geometrically).
            const popMaxDistance = viewportH * 0.25;
            for (const card of popCards) {
                const rect = card.getBoundingClientRect();
                if (
                    rect.bottom < -100 ||
                    rect.top > viewportH + 100
                ) {
                    if (card.style.getPropertyValue('--pop')) {
                        card.style.removeProperty('--pop');
                    }
                    continue;
                }
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(cardCenter - viewportCenterY);
                const linear = Math.max(
                    0,
                    1 - distance / popMaxDistance
                );
                const eased = linear * linear * (3 - 2 * linear);
                card.style.setProperty('--pop', eased.toFixed(3));
            }

            // Keywords: tighter 12% reading band — only the line being
            // read peaks; surrounding lines stay at their persistent
            // emphasis.
            const kwMaxDistance = viewportH * 0.12;
            for (const el of kws) {
                const rect = el.getBoundingClientRect();
                if (
                    rect.bottom < -50 ||
                    rect.top > viewportH + 50
                ) {
                    if (el.style.getPropertyValue('--kw-spot')) {
                        el.style.removeProperty('--kw-spot');
                    }
                    continue;
                }
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(itemCenter - viewportCenterY);
                const linear = Math.max(
                    0,
                    1 - distance / kwMaxDistance
                );
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
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

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
