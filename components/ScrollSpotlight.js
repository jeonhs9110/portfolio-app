'use client';

import { useEffect } from 'react';

/**
 * Three scroll-driven effects, all driven by a single RAF loop.
 *
 *   1. WINS ZOOM-TO-CENTRE — for any row of "sequence" tiles (the
 *      About key-wins row, with 4 tiles side by side), the row owns
 *      a long virtual scroll range. As the visitor scrolls through
 *      that range, exactly one tile at a time literally translates
 *      to the centre of the viewport AND scales up. Continuing to
 *      scroll returns that tile to its grid position while the
 *      next tile flies in.
 *
 *      Implementation: progress runs 0 → 1 as the row's centre
 *      crosses through a region around the viewport centre. Each
 *      tile peaks at progress = (i + 0.5) / N. The translation
 *      and scale are blended via a smoothstep so adjacent tiles
 *      hand off cleanly.
 *
 *   2. CARD IN-PLACE SCALE — for vertical-stack cards (Experience
 *      jobs, project cards, skills categories, About stats, etc),
 *      each card scales to 1.15 when its centre is within 15% of
 *      the viewport centre and returns to 1 as it leaves. Because
 *      these stacks are vertical, only one card's centre can be at
 *      the viewport centre at any time, which gives the same
 *      "one at a time" feel as the wins zoom but without the
 *      horizontal translation.
 *
 *   3. KEYWORD GLOW — every <strong class="kw"> picks up a cyan
 *      halo when its centre sits inside a 5% zone around viewport
 *      centre. Just the line being read lights up.
 *
 * Disabled entirely for prefers-reduced-motion: reduce.
 */

// Horizontal sequence — the tall scroll-jacking SPOTLIGHT container
// that wraps a pinned row of tiles. Progress is driven by how far
// the container has scrolled INTO the viewport; the row inside is
// kept at viewport centre via sticky positioning, so scroll position
// and tile spotlight are decoupled from the rest of the page flow.
const SPOTLIGHT_CONTAINER_SELECTOR = '.about__wins-spotlight';
const SPOTLIGHT_TILE_SELECTOR = '.about__win';

// Vertical-stack cards that get in-place scale (no translate).
const STACK_CARD_SELECTORS = [
    '.experience__card',
    '.project-card',
    '.skills__category',
    '.about__feature-card',
    '.about__stat',
];

const KW_SELECTOR = '.kw';

// Walk offsetParent chain to get the true layout (untransformed)
// document position of an element. Critical for the zoom-to-centre
// translate calculation — using getBoundingClientRect would feed
// the previous frame's translate back into the next frame and the
// tile would drift.
function getDocumentTop(el) {
    let top = 0;
    let cur = el;
    while (cur) {
        top += cur.offsetTop;
        cur = cur.offsetParent;
    }
    return top;
}
function getDocumentLeft(el) {
    let left = 0;
    let cur = el;
    while (cur) {
        left += cur.offsetLeft;
        cur = cur.offsetParent;
    }
    return left;
}

export default function ScrollSpotlight() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mql.matches) return;

        let raf = 0;
        let cancelled = false;
        // Map: spotlight container element → ordered tile elements inside it.
        let spotlightsByContainer = new Map();
        let stackCards = [];
        let kws = [];

        function refresh() {
            spotlightsByContainer = new Map();
            const containers = document.querySelectorAll(
                SPOTLIGHT_CONTAINER_SELECTOR
            );
            for (const container of containers) {
                const tiles = Array.from(
                    container.querySelectorAll(SPOTLIGHT_TILE_SELECTOR)
                );
                if (tiles.length > 0) {
                    spotlightsByContainer.set(container, tiles);
                }
            }
            stackCards = STACK_CARD_SELECTORS.flatMap((sel) =>
                Array.from(document.querySelectorAll(sel))
            );
            kws = Array.from(document.querySelectorAll(KW_SELECTOR));
        }

        function update() {
            raf = 0;
            const viewportH = window.innerHeight;
            const viewportW = window.innerWidth;
            const viewportCenterY = viewportH / 2;
            const viewportCenterX = viewportW / 2;
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;

            // ── 1. WINS ZOOM-TO-CENTRE SEQUENCES ────────────────────
            // Progress comes from how far the spotlight container has
            // scrolled INTO the viewport. The row inside is pinned at
            // viewport centre via sticky positioning, so each tile gets
            // a full viewport's worth of scroll time at centre stage.
            for (const [container, tiles] of spotlightsByContainer) {
                const N = tiles.length;
                if (N < 1) continue;

                const containerRect = container.getBoundingClientRect();
                const containerHeight = container.offsetHeight;
                const scrollableDistance = containerHeight - viewportH;
                // progress = 0 when container TOP hits viewport top
                //          = 1 when container BOTTOM hits viewport bottom
                // Outside [0, 1] the sticky child is no longer pinned
                // and tiles return to their grid layout.
                const progress = Math.max(
                    0,
                    Math.min(1, -containerRect.top / scrollableDistance)
                );

                // currentIndex runs 0 → N-1 continuously. Tile i peaks
                // when currentIndex === i; adjacent tiles cross-fade at
                // half-integer values. Carousel-style: at any progress,
                // exactly one tile (or two mid-handoff) is highlighted.
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

                    // Untransformed visual centre = current rect centre
                    // minus the translate we applied last frame. Stable
                    // across frames even with sticky pinning (rect
                    // reflects sticky offset; subtracting our translate
                    // removes the only thing we wrote).
                    const rect = tile.getBoundingClientRect();
                    const currentTx =
                        parseFloat(
                            tile.style.getPropertyValue('--zoom-tx')
                        ) || 0;
                    const tileVisualCenterX =
                        (rect.left + rect.right) / 2 - currentTx;

                    const translateX =
                        (viewportCenterX - tileVisualCenterX) * eased;
                    // translateY = 0 — row is pinned at viewport centre
                    // already, no vertical movement needed.
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

            // ── 2. VERTICAL CARD IN-PLACE SCALE ─────────────────────
            const cardMaxDistance = viewportH * 0.15;
            for (const el of stackCards) {
                const rect = el.getBoundingClientRect();
                if (
                    rect.bottom < -100 ||
                    rect.top > viewportH + 100
                ) {
                    if (el.style.getPropertyValue('--spot-scale')) {
                        el.style.removeProperty('--spot-scale');
                    }
                    continue;
                }
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(itemCenter - viewportCenterY);
                const linear = Math.max(
                    0,
                    1 - distance / cardMaxDistance
                );
                const eased =
                    linear < 0.5
                        ? 4 * linear * linear * linear
                        : 1 - Math.pow(-2 * linear + 2, 3) / 2;
                const scale = 1.0 + eased * 0.15;
                el.style.setProperty('--spot-scale', scale.toFixed(3));
            }

            // ── 3. KEYWORD GLOW ─────────────────────────────────────
            const kwMaxDistance = viewportH * 0.05;
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
