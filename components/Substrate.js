'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 03 / Substrate — the diplomatic / macro layer the AI work sits on top of.
 * Sticky rail on the left, long-form narrative on the right.
 */

const PIVOTS = [
  { id: 'foreign-affairs', label: 'foreign-affairs' },
  { id: 'cross-border-deals', label: 'cross-border-deals' },
  { id: 'ai-transition', label: 'ai-transition' },
];

const SWFS = ['ADIA', 'Mubadala', 'PIF', 'QIA', 'GIC', 'Temasek'];

export default function Substrate() {
  const [activePivot, setActivePivot] = useState('foreign-affairs');
  const blockRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActivePivot(visible.target.dataset.pivot);
      },
      { rootMargin: '-30% 0% -50% 0%', threshold: [0.1, 0.4, 0.7] }
    );
    Object.values(blockRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="substrate" id="substrate">
      <div className="container">
        <div className="section-index mono">03 / Substrate</div>

        <div className="substrate__heading">
          <h2 className="substrate__title">
            Macro context is the moat — six years of cross-border deal work feeds the model graph.
          </h2>
        </div>

        <div className="substrate__grid">
          <aside className="substrate__rail mono">
            <div className="substrate__rail-label">narrative arc</div>
            <div className="substrate__rail-arc">
              <span>National Assembly</span>
              <span>Lee &amp; Ko</span>
              <span>HMP Law</span>
              <span>IBM × RedHat</span>
              <span>production systems</span>
            </div>

            <div className="substrate__rail-label" style={{ marginTop: 16 }}>
              pivots
            </div>
            <div className="substrate__pivots">
              {PIVOTS.map((p) => (
                <div
                  key={p.id}
                  className={`substrate__pivot${activePivot === p.id ? ' substrate__pivot--active' : ''}`}
                >
                  {p.label}
                </div>
              ))}
            </div>
          </aside>

          <div className="substrate__body">
            <div
              className="substrate__block"
              data-pivot="foreign-affairs"
              ref={(el) => (blockRefs.current['foreign-affairs'] = el)}
            >
              <h3>// foreign-affairs</h3>
              <p>
                Started in the Office of Rep. Kim Jung-Hoon at the National Assembly in 2019 — Grade-7
                Secretary &amp; Foreign Affairs Liaison. Daily working contact with resident
                ambassadors and senior diplomats of the UAE, Saudi Arabia, Qatar, Kuwait, Oman, and
                Singapore. English speech drafting for international fora; live KR↔EN consecutive
                interpretation in bilateral meetings, mostly on the impact of global events on
                macroeconomic conditions.
              </p>
              <div className="substrate__pullquote mono">
                Six years of daily English speech drafting and live KR↔EN interpretation. Macro
                vocabulary as muscle memory — monetary-policy spillovers, oil-market dynamics,
                sovereign-wealth flows.
              </div>
              <p>
                Direct exposure to the National Policy Committee (정무위원회) agenda — sat in on
                budget &amp; settlement sessions and senior-member coordination meetings covering
                FSC, FSS, and KFTC oversight matters. The macro instinct was built in that room.
              </p>
            </div>

            <div
              className="substrate__block"
              data-pivot="cross-border-deals"
              ref={(el) => (blockRefs.current['cross-border-deals'] = el)}
            >
              <h3>// cross-border-deals</h3>
              <p>
                2020 onward: same office, moved to HMP Law (법무법인 충정), then Lee &amp; Ko (법무법인
                광장) — two of Korea&apos;s top-tier law firms. Built a Korea ↔ Middle East
                capital-introduction practice: continuous SWF research, direct outreach to the desks
                that mattered, bidirectional matching of Korean institutional capital with overseas
                opportunities.
              </p>
              <div className="substrate__chips">
                {SWFS.map((s) => (
                  <span key={s} className="substrate__chip mono">
                    {s}
                  </span>
                ))}
              </div>
              <p>
                Documented outcomes — KOFIA × Top-10 Korean financial institutions × UAE / Singapore
                SWF co-investment LOI (2023, signed). SNU Dental Hospital × Mubadala Health MOU
                (2024, coordinated end-to-end from cold outreach through signed terms). Earlier
                sourced engagements through HMP Law: Iraq LNG pipeline EPC, Nigeria steel-asset
                acquisition, Oman MoD channel through Hyundai Rotem (DAPA-approval stage).
              </p>
              <div className="substrate__pullquote mono">
                The same cross-border capital flows now sit upstream of the retrieval graph in
                production.
              </div>
            </div>

            <div
              className="substrate__block"
              data-pivot="ai-transition"
              ref={(el) => (blockRefs.current['ai-transition'] = el)}
            >
              <h3>// ai-transition</h3>
              <p>
                IBM × RedHat AI Transformation Academy, 2025.08–2026.02 — Top Award (최우수상). Six
                months building agentic pipelines next to the people who build them. Vaccine Daily
                came out of that cohort; the cost-aware HDBSCAN + ko-sroberta + ChromaDB stack and
                the Writer → Critic → Editor multi-agent loop both ship in production today.
              </p>
              <p>
                AIIM followed — end-to-end LangGraph + GraphRAG on GCP Cloud Run + Cloud SQL, 5,300+
                creators across 14 languages, 24/7 live. KOKKOK Garden ships in parallel on Next.js
                16, Supabase / PostgreSQL with RLS, GPT-4o mini. FOBO AI is an 8-stage ML + RL
                pipeline running on a 2-VM GCP setup at ~$26/month.
              </p>
              <div className="substrate__pullquote mono">
                Indexed six years of sovereign-wealth thesis research into a ko-sroberta + ChromaDB
                vector store, then wired it behind a LangGraph agent so deal-architecture questions
                resolve against the same corpus that produced the original LOIs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
