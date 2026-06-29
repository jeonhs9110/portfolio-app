'use client';

import { useEffect } from 'react';

/**
 * Two scroll-driven effects, both driven by a single RAF loop.
 *
 *   1. SCROLL-JACKED ZOOM-TO-CENTRE — for each tall outer container
 *      that pins a tile group at viewport centre via sticky
 *      positioning, the inner tiles take turns flying to centre as
 *      the visitor scrolls through the container's virtual scroll
 *      range. Currently applied to: About key-wins row (4 tiles),
 *      Skills 2×2 grid (4 categories).
 *
 *   2. KEYWORD GLOW — every <strong class="kw"> picks up a cyan
 *      halo as it enters the visitor's reading band (12% of viewport
 *      around centre). At peak the keyword scales slightly AND has a
 *      bright cyan glow, so the bolded words actually read as the
 *      visitor's eye reaches them — the page's primary
 *      attention-grabbing effect outside the scroll-jacked spotlights.
 *
 * NOTE on what was deliberately REMOVED:
 *   - In-place card scaling on vertical-stack cards (Experience,
 *     Projects, About stats, feature card). It made the page feel
 *     jittery — cards visibly resizing as the visitor scrolled past
 *     contributed to the "too messy" feel without conveying any
 *     information. Cards now stay perfectly still.
 *
 * Disabled entirely for prefers-reduced-motion: reduce.
 */

// Scroll-jacked spotlight groups. Each entry is { container, tile }:
// container is the tall outer that pins via sticky; tile is the
// inner element that takes its turn flying to centre. Progress is
// driven by how far the container has scrolled INTO the viewport.
const SPOTLIGHT_GROUPS = [
    { container: '.about__wins-spotlight', tile: '.about__win' },
    { container: '.skills__spotlight', tile: '.skills__category' },
];

const KW_SELECTOR = '.kw';

export default function ScrollSpotlight() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mql.matches) return;

        let raf = 0;
        let cancelled = false;
        let spotlightsByContainer = new Map();
        let kws = [];

        function refresh() {
            spotlightsByContainer = new Map();
            for (const { container: containerSel, tile: tileSel } of
                SPOTLIGHT_GROUPS) {
                for (const container of document.querySelectorAll(
                    containerSel
                )) {
                    const tiles = Array.from(
                        container.querySelectorAll(tileSel)
                    );
                    if (tiles.length > 0) {
                        spotlightsByContainer.set(container, tiles);
                    }
                }
            }
            kws = Array.from(document.querySelectorAll(KW_SELECTOR));
        }

        function update() {
            raf = 0;
            const viewportH = window.innerHeight;
            const viewportW = window.innerWidth;
            const viewportCenterY = viewportH / 2;
            const viewportCenterX = viewportW / 2;

            // ── 1. SCROLL-JACKED ZOOM-TO-CENTRE ─────────────────────
            for (const [container, tiles] of spotlightsByContainer) {
                const N = tiles.length;
                if (N < 1) continue;

                const containerRect = container.getBoundingClientRect();
                const containerHeight = container.offsetHeight;
                const scrollableDistance = containerHeight - viewportH;
                const progress = Math.max(
                    0,
                    Math.min(1, -containerRect.top / scrollableDistance)
                );
                const currentIndex = progress * (N - 1);

                for (let i = 0; i < N; i++) {
                    const tile = tiles[i];
                    const distance = Math.abs(i - currentIndex);
                    const linear = Math.max(0, 1 - distance);
                    const eased = linear * linear * (3 - 2 * linear);

                    if (eased < 0.01) {
                        tile.style.removeProperty('--zoom-tx');
                        tile.style.removeProperty('--zoom-ty');
                        tile.style.removeProperty('--zoom-scale');
                        tile.style.removeProperty('--zoom-z');
                        continue;
                    }

                    const rect = tile.getBoundingClientRect();
                    const currentTx =
                        parseFloat(
                            tile.style.getPropertyValue('--zoom-tx')
                        ) || 0;
                    const tileVisualCenterX =
                        (rect.left + rect.right) / 2 - currentTx;

                    const translateX =
                        (viewportCenterX - tileVisualCenterX) * eased;
                    const scale = 1.0 + eased * 0.5;

                    tile.style.setProperty(
                        '--zoom-tx',
                        `${translateX.toFixed(1)}px`
                    );
                    tile.style.setProperty('--zoom-ty', '0px');
                    tile.style.setProperty(
                        '--zoom-scale',
                        scale.toFixed(3)
                    );
                    tile.style.setProperty(
                        '--zoom-z',
                        String(Math.round(eased * 100))
                    );
                }
            }

            // ── 2. KEYWORD GLOW ─────────────────────────────────────
            // Wider zone now: 12% of viewport around centre instead
            // of 5%. Keywords in the reading band hold a clear peak,
            // and the dim-on-and-off is less twitchy as the visitor
            // scrolls through dense text.
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
