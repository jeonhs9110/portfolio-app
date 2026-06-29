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

// Horizontal sequence tiles + their container class. We look up
// tiles by SEQUENCE_TILE_SELECTOR (e.g. .about__win), then walk
// up to find the row ancestor matching SEQUENCE_ROW_CLASS so we
// can group tiles by row. This avoids assuming the tile is a
// direct child of the row — they might be wrapped in motion.divs
// from framer-motion.
const SEQUENCE_TILE_SELECTOR = '.about__win';
const SEQUENCE_ROW_CLASS = 'about__wins';

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
        // Map: row container element → ordered tile elements inside it.
        let sequencesByRow = new Map();
        let stackCards = [];
        let kws = [];

        function refresh() {
            sequencesByRow = new Map();
            const tiles = document.querySelectorAll(
                SEQUENCE_TILE_SELECTOR
            );
            for (const tile of tiles) {
                let row = tile.parentElement;
                while (
                    row &&
                    !row.classList.contains(SEQUENCE_ROW_CLASS)
                ) {
                    row = row.parentElement;
                }
                if (!row) continue;
                if (!sequencesByRow.has(row)) {
                    sequencesByRow.set(row, []);
                }
                sequencesByRow.get(row).push(tile);
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
            // For each sequence row, calculate scroll progress and
            // pop each tile in turn to the viewport centre.
            for (const [row, tiles] of sequencesByRow) {
                const N = tiles.length;
                if (N < 1) continue;

                const rowDocTop = getDocumentTop(row);
                const rowDocBottom = rowDocTop + row.offsetHeight;
                const rowCenterDoc = (rowDocTop + rowDocBottom) / 2;

                // Spotlight scroll window: from "row centre at 80% of
                // viewport height" to "row centre at 20% of viewport
                // height". Inside that window, progress runs 0 → 1.
                // Outside, progress is clamped — tiles return to grid.
                const viewportCenterDoc = scrollY + viewportCenterY;
                const offsetFromCenter = viewportCenterDoc - rowCenterDoc;
                const spotlightHalfRange = viewportH * 0.45;
                const progress = Math.max(
                    0,
                    Math.min(
                        1,
                        (offsetFromCenter + spotlightHalfRange) /
                            (spotlightHalfRange * 2)
                    )
                );

                for (let i = 0; i < N; i++) {
                    const tile = tiles[i];
                    // Each tile's peak progress is at (i + 0.5) / N.
                    // Active zone width = 1/N so adjacent tiles cross
                    // over at the boundary between their segments.
                    const peakProgress = (i + 0.5) / N;
                    const segmentHalfWidth = 0.5 / N;
                    const distance = Math.abs(progress - peakProgress);
                    const linear = Math.max(
                        0,
                        1 - distance / segmentHalfWidth
                    );
                    const eased = linear * linear * (3 - 2 * linear);

                    if (eased < 0.01) {
                        tile.style.removeProperty('--zoom-tx');
                        tile.style.removeProperty('--zoom-ty');
                        tile.style.removeProperty('--zoom-scale');
                        tile.style.removeProperty('--zoom-z');
                        continue;
                    }

                    // Tile's UNTRANSFORMED screen-space centre. We use
                    // offsetTop/offsetLeft chain rather than getBoundingClientRect
                    // so previous frame's translate doesn't accumulate.
                    const tileDocTop = getDocumentTop(tile);
                    const tileDocLeft = getDocumentLeft(tile);
                    const tileScreenTop = tileDocTop - scrollY;
                    const tileScreenLeft = tileDocLeft - scrollX;
                    const tileCenterY =
                        tileScreenTop + tile.offsetHeight / 2;
                    const tileCenterX =
                        tileScreenLeft + tile.offsetWidth / 2;

                    const translateX =
                        (viewportCenterX - tileCenterX) * eased;
                    const translateY =
                        (viewportCenterY - tileCenterY) * eased;
                    // Peak scale 1.5 — visibly LARGER than its row
                    // neighbours when at centre.
                    const scale = 1.0 + eased * 0.5;

                    tile.style.setProperty(
                        '--zoom-tx',
                        `${translateX.toFixed(1)}px`
                    );
                    tile.style.setProperty(
                        '--zoom-ty',
                        `${translateY.toFixed(1)}px`
                    );
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
