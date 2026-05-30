'use client';

import { motion } from 'framer-motion';

export default function Terminal() {
  return (
    <section className="terminal" id="terminal">
      <div className="terminal__rule" />

      <div className="terminal__inner">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="terminal__eyebrow mono"
        >
          <span className="terminal__cursor" aria-hidden="true" />
          <span>▸ seoul / kr–en / shipping in production</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="terminal__h1"
        >
          Translator between <span className="terminal__h1-accent">capital</span> and{' '}
          <span className="terminal__h1-accent">code</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="terminal__h2"
        >
          Six years routing Korea–Middle East capital and sovereign-allocator logic; now architecting
          agentic systems shipped at 24/7 uptime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="terminal__chips"
        >
          <span className="chip mono chip--live">
            <span className="chip__dot" aria-hidden="true" />
            AIIM live · 5,300+ creators · 14 languages · 24/7
          </span>
          <span className="chip mono">
            <span className="chip__dot" aria-hidden="true" />
            IBM × RedHat AX Academy · Top Award 2025.08–2026.02
          </span>
          <span className="chip mono">
            <span className="chip__dot" aria-hidden="true" />
            KR / EN native
          </span>
        </motion.div>

        <motion.a
          href="#architecture"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="terminal__cta mono"
          aria-label="View architecture"
        >
          <span className="terminal__cta-caret">{'>'}</span>
          <span>open /architecture</span>
        </motion.a>
      </div>

      <div className="terminal__scroll-cue mono">01 → 02</div>
    </section>
  );
}
