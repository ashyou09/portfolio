import { useEffect, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import profile from '../data/profile';
import '../styles/nav.css';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'transformer', label: 'Architecture' },
  { id: 'lab', label: '3D Lab' },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();

  // Threshold crossing only, so this is two state writes per page, not per frame.
  useMotionValueEvent(scrollY, 'change', (value) => {
    setStuck((prev) => (prev === value > 24 ? prev : value > 24));
  });

  useEffect(() => {
    const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav" data-stuck={stuck}>
      <nav className="nav__inner" aria-label="Primary">
        <a className="nav__mark" href="#top" aria-label={`${profile.name}, home`}>
          <img src="/favicon.svg" alt="" width="24" height="24" />
          <b>{profile.name}</b>
          <span>{profile.role}</span>
        </a>

        <ul className="nav__links">
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a className="nav__cta" href="#contact">
          Get in touch
        </a>
      </nav>
    </header>
  );
}
