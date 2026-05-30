'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects } from '@/lib/projects';

/**
 * 02 / Architecture — bento grid of shipped systems
 * Anchor tile = AIIM (2x2). Remaining featured projects fill the grid.
 */

const TILES = [
  {
    index: '02.1',
    slug: 'aiim',
    title: 'AIIM',
    thesis:
      'Production agentic LLM platform. Brand brief → ranked creator shortlist with reasoning, end to end.',
    metrics: [
      { k: '5,300+', v: 'creators' },
      { k: '14', v: 'languages' },
      { k: '24/7', v: 'uptime' },
    ],
    badge: 'live',
    span: 'anchor',
  },
  {
    index: '02.2',
    slug: 'vaccine-daily',
    title: 'Vaccine Daily',
    thesis:
      'Multi-agent news pipeline. HDBSCAN pre-clustering compresses LLM API spend. Writer → Critic → Editor loop kills hallucinations.',
    metrics: [
      { k: 'Top Award', v: 'IBM × RedHat' },
      { k: 'ChromaDB', v: '+ ko-sroberta' },
    ],
  },
  {
    index: '02.3',
    slug: 'football-ai',
    title: 'FOBO AI',
    thesis:
      '8-stage ML + RL pipeline. Transformer + GAT → Dixon-Coles → XGB/LGB ensemble → PPO decides when to act.',
    metrics: [
      { k: '~90%', v: 'ensemble' },
      { k: '~95%', v: 'with PPO' },
      { k: '13', v: 'leagues' },
    ],
  },
  {
    index: '02.4',
    slug: 'kokkok-garden',
    title: 'KOKKOK Garden',
    thesis:
      'Multi-region K-Beauty storefront. 6-entity Supabase schema with RLS; GPT-4o mini for 5-language translation + GL consultation.',
    metrics: [
      { k: 'Next.js 16', v: '· Vercel' },
      { k: '6 entities', v: '· RLS' },
    ],
    span: 'span2',
  },
  {
    index: '02.5',
    slug: 'iamx6',
    title: 'IAMX6',
    thesis:
      'Naver blog SEO automation. Electron + Puppeteer + LLM comments, 3-layer code hardening, single 67MB portable .exe.',
    metrics: [
      { k: 'Electron', v: '+ Puppeteer' },
      { k: 'bytenode', v: '+ Fuses' },
    ],
  },
  {
    index: '02.6',
    title: 'KOFIA × Top-10 KR FI × UAE/SG SWF',
    thesis:
      'Co-investment LOI closed. Six years of sovereign-wealth thesis research, then matched to the right desks.',
    metrics: [
      { k: 'LOI', v: 'signed' },
      { k: '2023', v: '· capital intro' },
    ],
    badge: 'deal',
  },
  {
    index: '02.7',
    title: 'SNU Dental × Mubadala Health',
    thesis:
      'Cross-border MOU coordinated end-to-end. Khalifa residents → SNU; SNU senior faculty → UAE rotation.',
    metrics: [
      { k: 'MOU', v: '2024' },
      { k: 'cold outreach', v: '→ signed' },
    ],
    badge: 'deal',
  },
  {
    index: '02.8',
    title: 'IBM × RedHat AX Academy',
    thesis:
      'Six months building agentic pipelines next to the people who build them at IBM and RedHat. Top Award (최우수상).',
    metrics: [
      { k: '2025.08', v: '– 2026.02' },
      { k: 'top award', v: '· cohort' },
    ],
  },
];

const MotionLink = motion.create(Link);

export default function Architecture() {
  return (
    <section className="architecture" id="architecture">
      <div className="container">
        <div className="section-index mono">02 / Architecture</div>

        <div className="architecture__heading">
          <h2 className="architecture__title">
            Shipped systems and load-bearing deals — each one in production.
          </h2>
          <p className="architecture__sub mono">
            Bento of the systems and the cross-border deals they sit on top of. Tap a system tile to
            open its architecture page.
          </p>
        </div>

        <div className="bento">
          {TILES.map((t, i) => {
            const className = `bento__card${t.span === 'anchor' ? ' bento__card--anchor' : ''}${
              t.span === 'span2' ? ' bento__card--span2' : ''
            }`;

            const inner = (
              <>
                {t.badge && (
                  <span className="bento__badge mono">
                    {t.badge === 'live' && <span className="chip__dot" aria-hidden="true" />}
                    {t.badge}
                  </span>
                )}
                <span className="bento__index mono">{t.index}</span>
                <h3 className="bento__title">{t.title}</h3>
                <p className="bento__desc">{t.thesis}</p>
                <div className="bento__metrics">
                  {t.metrics.map((m, idx) => (
                    <span className="bento__metric" key={idx}>
                      <strong>{m.k}</strong> {m.v}
                    </span>
                  ))}
                </div>
              </>
            );

            const sharedMotion = {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: '-50px' },
              transition: { duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
              className,
            };

            if (t.slug) {
              return (
                <MotionLink href={`/projects/${t.slug}`} key={t.index} {...sharedMotion}>
                  {inner}
                </MotionLink>
              );
            }
            return (
              <motion.div key={t.index} {...sharedMotion}>
                {inner}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
