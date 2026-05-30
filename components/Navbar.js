'use client';

import { useRouter, usePathname } from 'next/navigation';

const LINKS = [
  { id: 'architecture', label: '02 / architecture' },
  { id: 'substrate', label: '03 / substrate' },
  { id: 'endpoint', label: '04 / endpoint' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollTo = (id) => {
    if (pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <a
        href="#terminal"
        className="navbar__logo"
        onClick={(e) => {
          e.preventDefault();
          scrollTo('terminal');
        }}
      >
        hyunsik · jeon
      </a>

      <ul className="navbar__links">
        {LINKS.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(l.id);
              }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="navbar__right">
        <a
          href="https://github.com/jeonhs9110"
          target="_blank"
          rel="noopener noreferrer"
          className="lang-toggle"
        >
          github
        </a>
      </div>
    </nav>
  );
}
