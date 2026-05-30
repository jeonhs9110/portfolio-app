'use client';

import { useState } from 'react';

const ROWS = [
  { key: 'email', val: 'jeonhs9110@gmail.com', href: 'mailto:jeonhs9110@gmail.com', copy: true },
  { key: 'github', val: 'github.com/jeonhs9110', href: 'https://github.com/jeonhs9110' },
  { key: 'linkedin', val: 'linkedin.com/in/jeonhyunsik', href: 'https://www.linkedin.com/in/jeonhyunsik' },
  { key: 'timezone', val: 'Asia/Seoul (UTC+9)' },
  { key: 'availability', val: 'open to AI architecture / strategic build engagements' },
];

const BUILD_DATE = '2026-05-30';

export default function Endpoint() {
  const [toast, setToast] = useState(null);

  const handleCopy = (e, val) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(val).then(() => {
        setToast(`copied → ${val}`);
        setTimeout(() => setToast(null), 2200);
      });
    }
  };

  return (
    <section className="endpoint" id="endpoint">
      <div className="container">
        <div className="section-index mono">04 / Endpoint</div>

        <div className="endpoint__grid">
          <div className="endpoint__pairs">
            {ROWS.map((r) => {
              const content = (
                <>
                  <span className="endpoint__key">{r.key}</span>
                  <span className="endpoint__val">{r.val}</span>
                </>
              );
              if (r.href) {
                return (
                  <a
                    key={r.key}
                    href={r.href}
                    target={r.href.startsWith('http') ? '_blank' : undefined}
                    rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="endpoint__row"
                    onClick={r.copy ? (e) => handleCopy(e, r.val) : undefined}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <div key={r.key} className="endpoint__row">
                  {content}
                </div>
              );
            })}
          </div>

          <div className="endpoint__thesis">
            <p>
              If the work above maps to a system you&apos;re building — agentic infrastructure,
              cross-border deal architecture, or the layer where the two meet — reach out at the
              email above. Resume and live system links arrive on request.
            </p>
            <p>
              Korean and English at native register; comfortable in both engineering rooms and
              capital-allocator conversations.
            </p>
            <div className="endpoint__sig">— HJ</div>
            <div className="endpoint__hash mono">build · {BUILD_DATE}</div>
          </div>
        </div>

        <div className="endpoint__footer">
          <span>last deploy · {BUILD_DATE}</span>
          <span>portfolio-app · v2 · vercel</span>
        </div>
      </div>

      {toast && (
        <div
          className="mono"
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1000,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--accent-glow)',
            color: 'var(--accent-glow)',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 12,
            letterSpacing: '0.02em',
            boxShadow: '0 0 24px rgba(110, 231, 255, 0.18)',
          }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}
