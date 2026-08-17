import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, FileText } from '@phosphor-icons/react';
import BlackHole from '../components/BlackHole';
import DotPortrait from '../components/DotPortrait';
import Magnetic from '../components/Magnetic';
import profile from '../data/profile';
import '../styles/hero.css';

/** True while the viewport is narrow. Drives the framing swap below. */
function useNarrow(query = '(max-width: 900px)') {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [query]);

  return narrow;
}

export default function Hero() {
  const reduce = useReducedMotion();
  const narrow = useNarrow();

  const line = (index) => ({
    initial: reduce ? false : { y: '110%' },
    animate: { y: '0%' },
    transition: { duration: 0.9, delay: 0.1 + index * 0.09, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section className="hero" id="top">
      {/*
       * The hole is pushed off centre so the busy half and the reading half
       * never overlap, and the scrim darkens only the edge the copy sits on —
       * a flat overlay would grey the halo along with it. On a phone there is
       * no room to stand them side by side, so the whole arrangement turns
       * through 90°: copy at the top, hole low and whole.
       */}
      <div className="hero__sky" aria-hidden="true">
        <BlackHole
          focus={narrow ? [0.5, 0.74] : [0.72, 0.46]}
          scrim={narrow ? 'top' : 'left'}
          scrimStrength={0.92}
          distance={24}
          elevation={narrow ? -7 : -5.5}
          fov={narrow ? 58 : 42}
          glow={narrow ? 0.85 : 1}
          /*
           * Cost is steps × pixels, and the hero canvas is the whole viewport.
           * Steps buy the deep images hugging the shadow, which are already
           * faint; resolution buys edges, and the frame average puts most of
           * those back. So both come down, and the retina cap comes down with
           * them — at dpr 3 this was rendering nine times the pixels the
           * screen can show.
           */
          steps={narrow ? 130 : 190}
          resolution={narrow ? 0.5 : 0.58}
          maxDpr={1.25}
        />
      </div>

      <div className="hero__inner shell">
        <div className="hero__body">
          {/* The face, resolved out of a dot grid so it sits in the page's own
              idiom rather than dropping a photograph into it. No caption: the
              nav already carries the name, and the line under it carries the
              role. */}
          <motion.div
            className="hero__sign"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
          >
            <DotPortrait size={228} caption="" />
          </motion.div>

          <motion.p
            className="eyebrow"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {profile.role}
          </motion.p>

          <h1 className="hero__title">
            <span className="hero__line">
              <motion.span {...line(0)}>{profile.headline[0]}</motion.span>
            </span>
            <span className="hero__line">
              <motion.span {...line(1)}>
                <em>{profile.headline[1]}</em>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero__sub"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
          >
            {profile.subtext}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.54 }}
          >
            <Magnetic>
              <a className="btn btn--primary" href="#work">
                View work
                <ArrowDownRight size={17} weight="bold" />
              </a>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a className="btn btn--ghost" href={profile.resume} target="_blank" rel="noreferrer">
                <FileText size={17} />
                Resume
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
