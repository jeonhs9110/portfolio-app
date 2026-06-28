'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * SiloReveal — wraps a section so it "emerges from the silos" of the
 * HLS background as it scrolls into view.
 *
 * On viewport entry (IntersectionObserver, runs ONCE), the wrapper:
 *   1. A thin vertical cyan/green light column grows from height 0 → 100%
 *      behind the section (the simulated "silo birth")
 *   2. Simultaneously, the section's content eases in from scale 0.96,
 *      opacity 0, blur(8px), translateY(40px) → its natural state
 *   3. The light column fades back out, leaving the section in place
 *
 * No animation if the visitor prefers reduced motion. Triggers once
 * per page load — scrolling back up doesn't re-fire.
 */
export default function SiloReveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Respect reduced-motion users — they get the final state immediately.
        const mql = typeof window !== 'undefined'
            ? window.matchMedia('(prefers-reduced-motion: reduce)')
            : null;
        if (mql && mql.matches) {
            setRevealed(true);
            return;
        }

        let cancelled = false;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !cancelled) {
                    // Small delay so the section has time to reach a settled
                    // scroll position before animating — prevents the reveal
                    // from racing the scroll.
                    setTimeout(() => { if (!cancelled) setRevealed(true); }, delay);
                    io.disconnect();
                }
            },
            // Start the reveal slightly before the section's top reaches the
            // viewport so the user sees the silo birth rather than catching
            // the section already in motion.
            { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
        );
        io.observe(node);
        return () => { cancelled = true; io.disconnect(); };
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`silo-reveal${revealed ? ' is-revealed' : ''}${className ? ' ' + className : ''}`}
        >
            <span className="silo-reveal__beam" aria-hidden="true" />
            <div className="silo-reveal__content">{children}</div>
        </div>
    );
}
